"""
D3 site QA capture — evidence for the handoff.

Runs Chromium against an already-running server (default http://127.0.0.1:4310),
takes section screenshots at exact viewports, and checks:
  - HTTP 200
  - no horizontal overflow
  - primary CTA inside the first 390x664 viewport
  - no console errors (except HMR noise)
  - reduced-motion keeps all content visible

Usage:
  tools\\venv-pw\\Scripts\\python.exe studio\\d3\\scripts\\capture.py [base_url]
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4310"
OUT = Path(__file__).resolve().parents[2] / "screens"
OUT.mkdir(parents=True, exist_ok=True)

CONSOLE_IGNORE = re.compile(r"(hmr|websocket|favicon|Failed to load resource)", re.I)


def scroll_through(page, step: int = 600, pause: int = 90) -> None:
    height = page.evaluate("document.documentElement.scrollHeight")
    y = 0
    while y < height:
        page.evaluate(f"window.scrollTo(0, {y})")
        page.wait_for_timeout(pause)
        y += step
    page.evaluate(f"window.scrollTo(0, {height})")
    page.wait_for_timeout(400)
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(500)


def collect_errors(page, errors: list[str]) -> None:
    for msg in errors:
        if not CONSOLE_IGNORE.search(msg):
            print(f"  ! console error: {msg[:220]}")


def audit_desktop(browser, report: dict) -> None:
    ctx = browser.new_context(
        viewport={"width": 1440, "height": 900},
        device_scale_factor=1,
        color_scheme="dark",
        reduced_motion="no-preference",
    )
    page = ctx.new_page()
    errors: list[str] = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    resp = page.goto(BASE, wait_until="networkidle")
    page.wait_for_timeout(1600)
    report["desktop"] = {
        "status": resp.status if resp else None,
        "scrollWidth": page.evaluate("document.documentElement.scrollWidth"),
        "clientWidth": page.evaluate("document.documentElement.clientWidth"),
        "heroTitle": page.evaluate("document.querySelector('h1')?.innerText?.replace(/\\n/g,' ')"),
        "webgl": page.evaluate("!!document.querySelector('canvas')"),
    }
    page.screenshot(path=str(OUT / "d3-hero-1440.png"))

    scroll_through(page)

    sections = page.evaluate(
        """() => [...document.querySelectorAll('section[id], footer')].map(s => ({
            id: s.id || 'footer',
            top: Math.round(s.getBoundingClientRect().top + window.scrollY),
        }))"""
    )
    for sec in sections:
        if sec["id"] == "hero":
            continue
        page.evaluate(f"window.scrollTo(0, {sec['top']} + 8)")
        page.wait_for_timeout(750)
        page.screenshot(path=str(OUT / f"d3-{sec['id']}-1440.png"))

    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(500)
    page.screenshot(path=str(OUT / "d3-full-1440.png"), full_page=True)
    report["desktop"]["sections"] = [s["id"] for s in sections]
    collect_errors(page, errors)
    report["desktop"]["consoleErrors"] = len(errors)
    ctx.close()


def audit_mobile(browser, report: dict, width: int, height: int, tag: str, full: bool) -> None:
    ctx = browser.new_context(
        viewport={"width": width, "height": height},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        color_scheme="dark",
        reduced_motion="no-preference",
    )
    page = ctx.new_page()
    errors: list[str] = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    resp = page.goto(BASE, wait_until="networkidle")
    page.wait_for_timeout(1600)
    cta = page.evaluate(
        """() => {
            const btn = [...document.querySelectorAll('a,button')].find(el =>
                /Обсудить проект/.test(el.textContent || '') &&
                el.getBoundingClientRect().width > 0);
            if (!btn) return null;
            const r = btn.getBoundingClientRect();
            return { top: Math.round(r.top), bottom: Math.round(r.bottom), visible: r.top >= 0 && r.bottom <= window.innerHeight };
        }"""
    )
    info = {
        "status": resp.status if resp else None,
        "scrollWidth": page.evaluate("document.documentElement.scrollWidth"),
        "clientWidth": page.evaluate("document.documentElement.clientWidth"),
        "cta": cta,
        "webgl": page.evaluate("!!document.querySelector('canvas')"),
        "consoleErrors": 0,
    }
    page.screenshot(path=str(OUT / f"d3-hero-{tag}.png"))
    if full:
        scroll_through(page)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT / f"d3-full-{tag}.png"), full_page=True)
    collect_errors(page, errors)
    info["consoleErrors"] = len(errors)
    report[tag] = info
    ctx.close()


def audit_reduced_motion(browser, report: dict) -> None:
    ctx = browser.new_context(
        viewport={"width": 1440, "height": 900},
        reduced_motion="reduce",
        color_scheme="dark",
    )
    page = ctx.new_page()
    page.goto(BASE, wait_until="networkidle")
    page.wait_for_timeout(1500)
    h1 = page.evaluate(
        """() => {
            const el = document.querySelector('#hero-title span span');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return { height: Math.round(r.height), width: Math.round(r.width), opacity: cs.opacity, transform: cs.transform };
        }"""
    )
    page.screenshot(path=str(OUT / "d3-hero-reduced-motion.png"))
    report["reducedMotion"] = {"h1Line": h1, "canvas": page.evaluate("!!document.querySelector('canvas')")}
    ctx.close()


def main() -> None:
    report: dict = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--force-color-profile=srgb"])
        audit_desktop(browser, report)
        audit_mobile(browser, report, 390, 844, "mobile-390x844", full=True)
        audit_mobile(browser, report, 390, 664, "mobile-390x664", full=False)
        audit_reduced_motion(browser, report)
        browser.close()

    report_path = OUT / "d3-qa-report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    print(f"\nSaved screenshots to {OUT}")


if __name__ == "__main__":
    main()
