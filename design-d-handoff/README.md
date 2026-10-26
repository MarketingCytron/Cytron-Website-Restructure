# my.cytron.io revamp: Design D (for IT)

This repository holds the **approved design for the my.cytron.io revamp: Design D**.
It keeps the current site's page structure and content, section by section, in an updated look:
the Cytron letterhead palette, the Roboto font, cleaner cards and spacing, and orange call-to-action buttons.

These are static HTML mockups for IT to build from. They are **not** the live site. Every page is marked
`noindex, nofollow` and shows a small "internal mockup" badge.

- **Live mockup:** https://marketingcytron.github.io/Cytron-Website-Restructure/
- **Current site vs Design D, side by side:** https://marketingcytron.github.io/Cytron-Website-Restructure/compare.html
- **Full design spec:** see the *Design D handoff* document shared by Marketing. It covers sections, tokens, components, behaviour and open items.

## Pages

| File | Page | Replaces on the live site |
|---|---|---|
| `index.html` | Store homepage | https://my.cytron.io/ |
| `education.html` | Education | https://my.cytron.io/education |
| `industry.html` | Industry & Enterprise | https://my.cytron.io/raspberry-pi-for-industry |
| `product.html` | Product page template (example: Maker ESP32 Bundle) | https://my.cytron.io/p-maker-esp32-bundle |

## Files

| File | Used by | What it holds |
|---|---|---|
| `site.css` | all pages | Base styles: tokens (`:root`), Roboto `@font-face`, header, mega-menu, footer, buttons, cards, chooser dialog. Shared with an earlier design, so it contains some rules Design D does not use. |
| `design-d.css` | all pages | Design D layer on top of `site.css`: sections, carousels, banners, logo rows, and the orange CTA rule (`--cta`). |
| `pdp.css` | `product.html` | Product page: gallery, bundle picker, quantity, tabs, specs, reviews, side lists. |
| `site.js` | all pages | Hero slider, mobile menu and dropdowns, audience chooser and "switch anytime" bar. |
| `design-d.js` | all pages | Carousels (arrows and progress bar), Industry hero video pause/play, chooser "Continue as Guest". |
| `pdp.js` | `product.html` | Gallery with video, bundle picker (price, code, stock, out-of-stock state), quantity, Read More, See More, "added" toast. |
| `fonts/` | all pages | Roboto Regular 400, Medium 500 and Bold 600–900, as Latin-subset WOFF2 (about 9 KB each). |
| `compare.html`, `compare/` | — | The side-by-side review page and its screenshots of the current site (taken 12 Oct 2026). Not part of the build. |
| `archive/` | — | Earlier design options that were not chosen (Design C, Design E). Reference only. |

There is no build step. Open the folder with any static web server, for example `python3 -m http.server`, and visit `http://localhost:8000/`.

## Design tokens (from `site.css` and `design-d.css`)

| Token | Value | Use |
|---|---|---|
| `--brand` | `#00A4DB` | Cytron blue (letterhead): bars, lines, dots, icons |
| `--primary` / `--brand-ink` | `#007DAA` | Links, secondary buttons, prices (white text 4.8:1) |
| `--primary-hover` | `#00698F` | Hover for blue buttons and links |
| `--cta` | `#E8590C` | **Orange call-to-action buttons** (Shop Now, Order Now, Get Quote Now, Learn More, Book Your Slot Now, Submit, Add to Cart) |
| `--cta-hover` | `#C2410C` | Hover for orange buttons |
| `--ink` | `#3C3C3B` | Headings |
| `--text` | `#4A4A49` | Body text |
| `--muted` | `#6D6D6C` | Secondary text |
| `--line` | `#E4E7E9` | Borders and dividers |
| `--soft` | `#F7FBFD` | Light section background |
| `--tint` | `#DFF4FA` | Light blue tint |
| `--font` | `'Roboto', 'Segoe UI', system-ui, sans-serif` | All text |
| `--wrap` | `1240px` | Content width (with 24px side padding) |
| `--r` | `8px` | Card radius. Buttons use 4px |

**Button rule:** one orange primary action per block (`.btn--primary`); secondary actions use the blue outline button (`.btn--outline`). An out-of-stock Add to Cart turns grey and is disabled.

**Breakpoints:** 1280, 1100, 900 and 600px (header detail also at 1320, 1240 and 1160px). Below 1100px the header switches to the burger menu.

## Notes for the build

- **Images** are loaded from the live image cache (`static.cytron.io/image/cache/...-WxH.png`), which serves any requested size. Most product photos have white backgrounds and sit on white or `--soft` cards.
- **Content** is the current site's content, copied from the live site in October 2026. Prices, stock and reviews must come from the store system, not from these files.
- **Nothing is wired up:** Add to Cart shows a "mockup only" toast, forms do not submit, and search goes to the live search page.
- **`?compare`** on any page hides the mockup badge and the chooser. It is only for `compare.html`.
- **Cache-busting:** CSS and JS links carry `?v=` plus the first 8 hex characters of the file's SHA-1.
- **Accessibility:** white text on the orange `#E8590C` is about 3.6:1, below the WCAG AA 4.5:1 level for 15px text. If AA is required, set `--cta` to `#CF4A0B` (4.5:1).
