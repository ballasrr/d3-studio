"""
WCAG contrast + small-type audit on the live page.

Usage: tools\\venv-pw\\Scripts\\python.exe studio\\d3\\scripts\\contrast.py [base_url]
"""

from __future__ import annotations

import json
import sys

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4310"

JS = r"""
() => {
  const parse = (value) => {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255];
  };
  const lum = ([r, g, b]) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const contrast = (fg, bg) => {
    const a = lum(fg), b = lum(bg);
    const hi = Math.max(a, b), lo = Math.min(a, b);
    return (hi + 0.05) / (lo + 0.05);
  };
  // composite every ancestor background (with alpha) down to the page background
  const bgOf = (el) => {
    const layers = [];
    let node = el;
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      const c = parse(cs.backgroundColor);
      if (c[3] > 0) layers.push(c);
      node = node.parentElement;
    }
    let bg = parse(getComputedStyle(document.body).backgroundColor);
    for (let i = layers.length - 1; i >= 0; i--) {
      const [r, g, b, a] = layers[i];
      bg = [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a), 1];
    }
    return bg;
  };
  const samples = [];
  const add = (label, selector) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const cs = getComputedStyle(el);
    samples.push({
      label,
      selector,
      size: parseFloat(cs.fontSize),
      weight: cs.fontWeight,
      fg: cs.color,
      contrast: +contrast(parse(cs.color), bgOf(el)).toFixed(2),
    });
  };
  add('hero eyebrow', '#hero p.type-eyebrow');
  add('hero lead', '#hero .type-lead');
  add('hero stat label', '#hero .text-faint');
  add('nav link', 'header nav a');
  add('footer legal', 'footer .type-label');
  add('faq answer', '#faq p');
  add('pricing feature', '#pricing li');
  add('form label', '#contact label');
  add('form input text', '#contact input');
  add('form placeholder-ish', '#contact input::placeholder');
  const tiny = [...document.querySelectorAll('p,span,a,li,label,button')]
    .filter((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return r.width > 0 && parseFloat(cs.fontSize) < 12;
    })
    .slice(0, 8)
    .map((el) => ({ text: (el.textContent || '').trim().slice(0, 40), size: getComputedStyle(el).fontSize }));
  return { samples, tiny };
}
"""


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900}, color_scheme="dark")
        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(1200)
        page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
        page.wait_for_timeout(800)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(500)
        result = page.evaluate(JS)
        browser.close()
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
