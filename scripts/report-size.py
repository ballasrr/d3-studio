"""
First-load asset report for the D3 site.

Next.js 16 removed the JS size columns from `npm run build`, so this script reads
the served HTML (dev or prod server), collects every JS/CSS asset it references
and reports raw + gzip bytes.

    npm run start -- -p 4310
    python studio/d3/scripts/report-size.py http://127.0.0.1:4310
"""

from __future__ import annotations

import gzip
import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse

WEB_ROOT = Path(__file__).resolve().parents[1]
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4310"
ROUTES = ["/"]

ASSET_RE = re.compile(r'(?:src|href)="(/_next/static/(?:chunks|css)/[^"]+\.(?:js|css))"')


def fetch(url: str) -> bytes:
    with urllib.request.urlopen(url, timeout=20) as resp:
        return resp.read()


def gzip_size(data: bytes) -> int:
    return len(gzip.compress(data, compresslevel=9))


def main() -> int:
    print(f"{'route':<10}{'JS files':>9}{'JS raw':>10}{'JS gzip':>10}{'CSS raw':>10}{'CSS gzip':>10}")
    for route in ROUTES:
        url = urljoin(BASE, route)
        try:
            html = fetch(url)
        except Exception as exc:  # noqa: BLE001
            print(f"! cannot fetch {url}: {exc}", file=sys.stderr)
            return 1
        assets = sorted(set(ASSET_RE.findall(html.decode("utf-8", errors="ignore"))))
        js = [a for a in assets if a.endswith(".js")]
        css = [a for a in assets if a.endswith(".css")]

        def total(files: list[str]) -> tuple[int, int]:
            raw = gz = 0
            for asset in files:
                try:
                    body = fetch(urljoin(BASE, asset))
                except Exception:  # noqa: BLE001
                    continue
                raw += len(body)
                gz += gzip_size(body)
            return raw, gz

        js_raw, js_gz = total(js)
        css_raw, css_gz = total(css)
        print(
            f"{route:<10}{len(js):>9}{js_raw / 1024:>9.1f}K{js_gz / 1024:>9.1f}K"
            f"{css_raw / 1024:>9.1f}K{css_gz / 1024:>9.1f}K"
        )
        print("\n  files:")
        rows = []
        for asset in assets:
            try:
                body = fetch(urljoin(BASE, asset))
            except Exception:  # noqa: BLE001
                continue
            rows.append((len(body), asset))
        for size, asset in sorted(rows, reverse=True):
            print(f"  {size / 1024:8.1f}K raw {gzip_size(fetch(urljoin(BASE, asset))) / 1024:7.1f}K gz  {asset}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
