# Cytron Website Restructure — Homepage concept (Design 3)

A static mockup of a proposed new homepage for [my.cytron.io](https://my.cytron.io/), prepared by Cytron Marketing for review by the IT team.

**Live preview:** https://marketingcytron.github.io/Cytron-Website-Restructure/

- Single self-contained file: `index.html` (HTML, CSS and JavaScript inline).
- Product photos, logos and links load from Cytron's live site (`static.cytron.io`, `my.cytron.io`).
- Prices, stock and tutorials are a snapshot from 6 Oct 2026.
- The contact and newsletter forms are for demonstration only and send nothing.
- Marked `noindex` so search engines don't list it.

## Design tokens
All colours, fonts and spacing are CSS variables at the top of the `<style>` block in `index.html`:

| Token | Value | Use |
|---|---|---|
| `--brand` | `#2BB0E3` | Cytron blue: accents, light text on dark backgrounds |
| `--brand-ink` | `#0A8FC7` | Large blue text on white |
| `--primary` | `#077DB6` | Buttons and links (white text passes 4.5:1 contrast) |
| `--orange` | `#FF7302` | Cytron orange: small accents |
| `--navy` | `#0B2A3C` | Dark "About" band |
| Font | Manrope | Google Fonts |
