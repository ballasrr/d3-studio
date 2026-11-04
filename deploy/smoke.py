"""
Smoke-test a deployed (static export) D3 build.

Usage:
  tools\\venv-pw\\Scripts\\python.exe studio\\d3\\deploy\\smoke.py https://shah-hookah-bar.ru/d3/
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

URL = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4312/d3/").rstrip("/") + "/"
OUT = Path(__file__).resolve().parent


def main() -> None:
    errors: list[str] = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(
            viewport={"width": 1440, "height": 900},
            color_scheme="dark",
            reduced_motion="no-preference",
        )
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        bad: list[str] = []
        page.on(
            "response",
            lambda r: bad.append(f"{r.status} {r.url}") if r.status >= 400 else None,
        )
        resp = page.goto(URL, wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(2200)
        page.screenshot(path=str(OUT / "smoke-desktop.png"))

        data = page.evaluate(
            """() => ({
                title: document.title,
                h1: document.querySelector('h1')?.innerText?.replace(/\\n/g, ' '),
                canvas: !!document.querySelector('canvas'),
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
                cssLoaded: !!document.querySelector('link[rel="stylesheet"]'),
                cta: !!([...document.querySelectorAll('a,button')].find(el => /Обсудить проект/.test(el.textContent || ''))),
                og: document.querySelector('meta[property="og:image"]')?.content,
                canonical: document.querySelector('link[rel="canonical"]')?.href,
                icon: document.querySelector('link[rel="icon"]')?.href,
                img404: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src),
            })"""
        )
        page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
        page.wait_for_timeout(1200)
        page.screenshot(path=str(OUT / "smoke-desktop-bottom.png"))
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / "smoke-desktop-full.png"), full_page=True)
        browser.close()

    result = {
        "url": URL,
        "status": resp.status if resp else None,
        **data,
        "badRequests": bad[:10],
        "consoleErrors": errors[:10],
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
