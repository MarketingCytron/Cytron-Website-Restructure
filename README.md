# Cytron Website Restructure: Homepage concept (Design 3)

A static mockup of a proposed new homepage for [my.cytron.io](https://my.cytron.io/), prepared by Cytron Marketing for review by the IT team.

**Live preview:** https://marketingcytron.github.io/Cytron-Website-Restructure/

## Pages

| File | Page | Who it is for |
|---|---|---|
| `index.html` | General homepage + welcome chooser | First-time visitors and guests |
| `education.html` | Education homepage | Students, teachers, makers |
| `industry.html` | Industry / Enterprise homepage | Engineers, business owners, professionals |
| `site.css` | Shared styles and design tokens | |
| `site.js` | Shared behaviour (menus, slider, tabs, chooser) | |
| `fonts/` | Roboto web fonts (woff2) | |

## How the chooser works

1. On a first visit to `index.html`, a popup asks "What type of project are you working on?" with **Education**, **Industry / Enterprise** and **Continue as Guest**.
2. The choice is remembered in the browser (`localStorage`, key `cytron_audience`: `edu`, `ind` or `guest`).
3. A returning visitor who chose Education or Industry is sent straight to that homepage.
4. A bar at the top of every page ("You're browsing: Store / Education / Industry & Enterprise") lets visitors switch at any time.
5. Like the live site, a personalisation icon sits next to search: a factory on the Industry page, a graduation cap on Education and a shop on the Store page. Its tooltip reads "Industry Content Personalized" (or Education), and clicking it reopens the popup. After a choice the popup shows "Great! Loading your personalized content…", and the tooltip appears briefly on arrival.
6. For review: add `?welcome` to the URL to force the popup, or `?stay` to stop the redirect.

On the live OpenCart site the same choice could be stored in the customer session or account instead of the browser.

## Notes

- Product photos, logos and links load from Cytron's live site (`static.cytron.io`, `my.cytron.io`).
- Prices, stock, tutorials and articles are a snapshot from 6-7 Oct 2026.
- The contact and newsletter forms are for demonstration only and send nothing.
- Marked `noindex` so search engines don't list it.

## Design tokens (letterhead palette)

All colours and fonts are CSS variables at the top of `site.css`:

| Token | Value | Use |
|---|---|---|
| `--brand` | `#00A4DB` | Cytron blue from the letterhead: bars, lines, dots, icons (not for text) |
| `--primary` | `#007DAA` | Buttons and links (white text passes 4.5:1 contrast) |
| `--primary-hover` | `#00698F` | Hover state |
| `--tint` | `#DFF4FA` | Light blue panels |
| `--ink` / `--text` / `--muted` | `#3C3C3B` / `#4A4A49` / `#6D6D6C` | Headings / body / secondary text |
| `--line` / `--soft` | `#E4E7E9` / `#F7FBFD` | Borders / section backgrounds |
| Font | Roboto (Regular 400, Medium 500, Bold 700) | Self-hosted in `fonts/` as woff2, converted from Cytron's Roboto pack (Latin subset) |
