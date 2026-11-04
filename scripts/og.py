"""
Generate public/og.jpg (1200x630) from the live hero.

Usage: tools\\venv-pw\\Scripts\\python.exe studio\\d3\\scripts\\og.py [base_url]
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4310"
ROOT = Path(__file__).resolve().parents[1]
TMP = ROOT / "public" / "og-raw.png"
OUT = ROOT / "public" / "og.jpg"


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--force-color-profile=srgb"])
        page = browser.new_page(
            viewport={"width": 1200, "height": 630},
            device_scale_factor=1,
            color_scheme="dark",
            reduced_motion="no-preference",
        )
        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(2200)
        page.screenshot(path=str(TMP))
        browser.close()

    im = Image.open(TMP).convert("RGB")
    im = im.resize((1200, 630), Image.LANCZOS)
    im.save(OUT, "JPEG", quality=86, optimize=True, progressive=True)
    TMP.unlink(missing_ok=True)
    print(f"og.jpg written: {OUT} ({OUT.stat().st_size} bytes, {im.size[0]}x{im.size[1]})")


if __name__ == "__main__":
    main()
