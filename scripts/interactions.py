"""
Interaction evidence for D3: mobile menu, form validation + success, pinned work
mid-scroll, and extra viewports (768, 1280, 1920).

Usage: tools\\venv-pw\\Scripts\\python.exe studio\\d3\\scripts\\interactions.py [base_url]
"""

from __future__ import annotations

import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4310"
OUT = Path(__file__).resolve().parents[2] / "screens"
OUT.mkdir(parents=True, exist_ok=True)


def shot(page, name: str) -> None:
    page.screenshot(path=str(OUT / f"d3-{name}.png"))


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # --- mobile: menu + form ---
        ctx = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True,
            color_scheme="dark",
        )
        page = ctx.new_page()
        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(1400)

        page.get_by_role("button", name="Открыть меню").click()
        page.wait_for_timeout(700)
        shot(page, "menu-mobile")
        page.keyboard.press("Escape")
        page.wait_for_timeout(400)

        page.locator("#contact").scroll_into_view_if_needed()
        page.wait_for_timeout(1000)
        page.get_by_role("button", name="Отправить заявку").click()
        page.wait_for_timeout(500)
        shot(page, "form-errors-mobile")

        page.locator("#lead-name").fill("Анна")
        page.locator("#lead-contact").fill("anna@company.ru")
        page.locator("#lead-message").fill("Нужен корпоративный сайт с каталогом и CMS к весне.")
        page.get_by_role("button", name="Отправить заявку").click()
        page.wait_for_timeout(1200)
        shot(page, "form-success-mobile")
        ctx.close()

        # --- mobile work section ---
        ctx = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True,
            color_scheme="dark",
        )
        page = ctx.new_page()
        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(1200)
        page.locator("#work").scroll_into_view_if_needed()
        page.wait_for_timeout(1100)
        shot(page, "work-mobile")
        page.locator("#services").scroll_into_view_if_needed()
        page.wait_for_timeout(900)
        shot(page, "services-mobile")
        ctx.close()

        # --- desktop: pinned work mid-scroll ---
        ctx = browser.new_context(viewport={"width": 1440, "height": 900}, color_scheme="dark")
        page = ctx.new_page()
        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(1400)
        work_top = page.evaluate(
            "document.querySelector('#work').getBoundingClientRect().top + window.scrollY"
        )
        page.evaluate(f"window.scrollTo(0, {work_top + 500})")
        page.wait_for_timeout(1200)
        shot(page, "work-pinned-1440")
        ctx.close()

        # --- extra viewports of the hero ---
        for width, height, tag in [
            (1024, 768, "hero-1024"),
            (768, 1024, "tablet-768"),
            (1280, 800, "hero-1280"),
            (1920, 1080, "hero-1920"),
        ]:
            ctx = browser.new_context(viewport={"width": width, "height": height}, color_scheme="dark")
            page = ctx.new_page()
            page.goto(BASE, wait_until="networkidle")
            page.wait_for_timeout(1600)
            shot(page, tag)
            overflow = page.evaluate(
                "document.documentElement.scrollWidth - document.documentElement.clientWidth"
            )
            print(f"{tag}: overflow={overflow}")
            ctx.close()

        browser.close()
    print(f"saved to {OUT}")


if __name__ == "__main__":
    main()
