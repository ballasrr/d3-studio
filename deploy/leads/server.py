#!/usr/bin/env python3
"""D3 lead intake: stores form submissions in SQLite and serves a private admin list.

Endpoints (proxied by nginx under /d3/):
  POST /lead            JSON {name, company, contact, budget, message, page}
  GET  /health          {"ok": true}
  GET  /leads?key=...   HTML table of submissions
  GET  /leads.csv?key=... CSV export

Env:
  D3_LEADS_DB         SQLite path (default /var/www/d3-leads/leads.sqlite3)
  D3_LEADS_KEY_FILE   file with admin key (default /var/www/d3-leads/key.txt)
  D3_LEADS_PORT       port, default 8124 (bound to 127.0.0.1)
  D3_TG_TOKEN, D3_TG_CHAT   optional Telegram notification
"""

from __future__ import annotations

import csv
import html
import io
import json
import os
import sqlite3
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DB_PATH = os.environ.get("D3_LEADS_DB", "/var/www/d3-leads/leads.sqlite3")
KEY_FILE = os.environ.get("D3_LEADS_KEY_FILE", "/var/www/d3-leads/key.txt")
PORT = int(os.environ.get("D3_LEADS_PORT", "8124"))
TG_TOKEN = os.environ.get("D3_TG_TOKEN", "")
TG_CHAT = os.environ.get("D3_TG_CHAT", "")
MAX_BODY = 32 * 1024
RATE_WINDOW = 600
RATE_LIMIT = 6

_hits: dict[str, list[float]] = {}


def admin_key() -> str:
    try:
        with open(KEY_FILE, encoding="utf-8") as fh:
            return fh.read().strip()
    except OSError:
        return os.environ.get("D3_LEADS_KEY", "")


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            name TEXT NOT NULL,
            company TEXT,
            contact TEXT NOT NULL,
            budget TEXT,
            message TEXT NOT NULL,
            page TEXT,
            ip TEXT
        )
        """
    )
    return conn


def clean(value: object, limit: int) -> str:
    text = str(value or "").replace("\r", " ").strip()
    return text[:limit]


def rate_ok(ip: str) -> bool:
    now = time.time()
    recent = [t for t in _hits.get(ip, []) if now - t < RATE_WINDOW]
    if len(recent) >= RATE_LIMIT:
        _hits[ip] = recent
        return False
    recent.append(now)
    _hits[ip] = recent
    return True


def notify_telegram(lead: dict[str, str]) -> None:
    if not TG_TOKEN or not TG_CHAT:
        return
    text = (
        "Новая заявка D3\n"
        f"Имя: {lead['name']}\n"
        f"Компания: {lead['company'] or '—'}\n"
        f"Контакт: {lead['contact']}\n"
        f"Бюджет: {lead['budget'] or '—'}\n"
        f"Задача: {lead['message']}\n"
        f"Страница: {lead['page'] or '—'}"
    )
    payload = urllib.parse.urlencode({"chat_id": TG_CHAT, "text": text}).encode()
    try:
        urllib.request.urlopen(
            f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            data=payload,
            timeout=8,
        ).read()
    except Exception:
        pass


class Handler(BaseHTTPRequestHandler):
    server_version = "d3-leads/1.0"

    def log_message(self, fmt: str, *args: object) -> None:
        return

    def _send(self, status: int, body: bytes, ctype: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _json(self, status: int, data: dict) -> None:
        self._send(status, json.dumps(data, ensure_ascii=False).encode(), "application/json; charset=utf-8")

    def _authorized(self) -> bool:
        key = admin_key()
        if not key:
            return False
        query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        return query.get("key", [""])[0] == key

    def do_GET(self) -> None:
        path = urllib.parse.urlparse(self.path).path
        if path == "/health":
            self._json(200, {"ok": True})
            return
        if path in ("/leads", "/leads.csv"):
            if not self._authorized():
                self._send(403, b"forbidden", "text/plain; charset=utf-8")
                return
            with db() as conn:
                rows = conn.execute("SELECT * FROM leads ORDER BY id DESC LIMIT 500").fetchall()
            if path.endswith(".csv"):
                buf = io.StringIO()
                writer = csv.writer(buf)
                writer.writerow(["created_at", "name", "company", "contact", "budget", "message", "page", "ip"])
                for row in rows:
                    writer.writerow([row[k] for k in row.keys() if k != "id"])
                data = ("\ufeff" + buf.getvalue()).encode("utf-8")
                self._send(200, data, "text/csv; charset=utf-8")
            else:
                self._send(200, render_admin(rows, admin_key()).encode("utf-8"), "text/html; charset=utf-8")
            return
        self._send(404, b"not found", "text/plain; charset=utf-8")

    def do_POST(self) -> None:
        if urllib.parse.urlparse(self.path).path != "/lead":
            self._send(404, b"not found", "text/plain; charset=utf-8")
            return
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length <= 0 or length > MAX_BODY:
            self._json(413, {"ok": False, "error": "bad_size"})
            return
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._json(400, {"ok": False, "error": "bad_json"})
            return

        ip = self.headers.get("X-Real-IP") or self.client_address[0]
        if not rate_ok(ip):
            self._json(429, {"ok": False, "error": "rate_limit"})
            return

        lead = {
            "name": clean(payload.get("name"), 120),
            "company": clean(payload.get("company"), 160),
            "contact": clean(payload.get("contact"), 200),
            "budget": clean(payload.get("budget"), 80),
            "message": clean(payload.get("message"), 3000),
            "page": clean(payload.get("page"), 300),
        }
        if not lead["name"] or not lead["contact"] or not lead["message"]:
            self._json(400, {"ok": False, "error": "missing_fields"})
            return

        created = datetime.now(timezone.utc).isoformat(timespec="seconds")
        with db() as conn:
            conn.execute(
                "INSERT INTO leads (created_at, name, company, contact, budget, message, page, ip) VALUES (?,?,?,?,?,?,?,?)",
                (
                    created,
                    lead["name"],
                    lead["company"],
                    lead["contact"],
                    lead["budget"],
                    lead["message"],
                    lead["page"],
                    ip,
                ),
            )
        notify_telegram(lead)
        self._json(200, {"ok": True})


def render_admin(rows: list[sqlite3.Row], key: str) -> str:
    esc = html.escape
    body_rows = []
    for row in rows:
        body_rows.append(
            "<tr>"
            f"<td>{esc(row['created_at'][:16].replace('T', ' '))}</td>"
            f"<td>{esc(row['name'])}</td>"
            f"<td>{esc(row['company'] or '—')}</td>"
            f"<td>{esc(row['contact'])}</td>"
            f"<td>{esc(row['budget'] or '—')}</td>"
            f"<td class='task'>{esc(row['message'])}</td>"
            f"<td>{esc((row['page'] or '').split('?')[0])}</td>"
            "</tr>"
        )
    empty = "<tr><td colspan='7' class='empty'>Заявок пока нет</td></tr>"
    return f"""<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>D3 — заявки</title>
<style>
  :root {{ color-scheme: dark; }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; background: #0b0d0b; color: #e9ece6; font: 15px/1.5 ui-sans-serif, system-ui, sans-serif; }}
  header {{ display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;
            padding: 20px clamp(16px, 4vw, 40px); border-bottom: 1px solid #232722; }}
  h1 {{ margin: 0; font-size: 20px; letter-spacing: -0.02em; }}
  .muted {{ color: #8c9389; font-size: 13px; }}
  .btn {{ color: #b6f34a; text-decoration: none; border: 1px solid #3a4136; border-radius: 999px; padding: 8px 14px; }}
  main {{ padding: 20px clamp(16px, 4vw, 40px) 60px; overflow-x: auto; }}
  table {{ width: 100%; border-collapse: collapse; min-width: 900px; }}
  th, td {{ text-align: left; vertical-align: top; padding: 12px 14px; border-bottom: 1px solid #1d211c; }}
  th {{ position: sticky; top: 0; background: #11150f; color: #8c9389; font-size: 11px;
        text-transform: uppercase; letter-spacing: .12em; }}
  td {{ font-size: 14px; }}
  td.task {{ max-width: 460px; white-space: pre-wrap; }}
  td.empty {{ text-align: center; color: #8c9389; padding: 40px; }}
  tr:hover td {{ background: #10140f; }}
  @media (max-width: 640px) {{ table {{ min-width: 0; }} th:nth-child(3), td:nth-child(3),
    th:nth-child(6), td:nth-child(6), th:nth-child(7), td:nth-child(7) {{ display: none; }} }}
</style></head>
<body>
<header>
  <div><h1>D3 — заявки</h1><div class="muted">Всего: {len(rows)} · обновляется при загрузке</div></div>
  <a class="btn" href="leads.csv?key={esc(key)}">Скачать CSV</a>
</header>
<main>
<table>
  <thead><tr><th>Дата (UTC)</th><th>Имя</th><th>Компания</th><th>Контакт</th><th>Бюджет</th><th>Задача</th><th>Страница</th></tr></thead>
  <tbody>{''.join(body_rows) if body_rows else empty}</tbody>
</table>
</main></body></html>"""


def main() -> None:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with db() as conn:
        conn.execute("SELECT 1")
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    server.serve_forever()


if __name__ == "__main__":
    main()
