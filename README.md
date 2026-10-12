# Cytron Website Restructure: Homepage concept (Design C)

A static mockup of a proposed new homepage for [my.cytron.io](https://my.cytron.io/), prepared by Cytron Marketing for review by the IT team.

**Live preview:** https://marketingcytron.github.io/Cytron-Website-Restructure/

**Compare with the current site:** https://marketingcytron.github.io/Cytron-Website-Restructure/compare.html

## Pages

| File | Page | Who it is for |
|---|---|---|
| `index.html` | General homepage + welcome chooser | First-time visitors and guests |
| `education.html` | Education homepage | Students, teachers, makers |
| `industry.html` | Industry / Enterprise homepage | Engineers, business owners, professionals |
| `site.css` | Shared styles and design tokens | |
| `site.js` | Shared behaviour (menus, slider, tabs, chooser) | |
| `fonts/` | Roboto web fonts (woff2) | |
| `design-d.html` | Design D: Store homepage | Same sections as the live site, Design C look |
| `design-d-education.html` | Design D: Education | |
| `design-d-industry.html` | Design D: Industry | |
| `design-d.css`, `design-d.js` | Design D extras (carousels, promo tiles, video hero) | Loaded after `site.css` / `site.js` |
| `product.html` | Design C: product page (Maker ESP32 Bundle) | New product page layout |
| `design-d-product.html` | Design D: product page (Maker ESP32 Bundle) | Same sections as the live product page, Design C look |
| `pdp.css`, `pdp.js` | Product page styles and behaviour (gallery, bundle picker, quantity, Read More) | Shared by both product pages |
| `compare.html` | Side-by-side: current my.cytron.io vs the new design | Marketing and IT reviewers |
| `compare/` | Full-page screenshots of the current my.cytron.io pages (desktop and mobile), used by `compare.html`. The product page screenshots are WebP images wrapped in `.svg` files | |

## How the chooser works

1. On a first visit to `index.html`, a popup asks "What type of project are you working on?" with **Education**, **Industry / Enterprise** and **Continue as Guest**.
2. The choice is remembered in the browser (`localStorage`, key `cytron_audience`: `edu`, `ind` or `guest`).
3. A returning visitor who chose Education or Industry is sent straight to that homepage.
4. A bar at the top of every page ("You're browsing: Store / Education / Industry & Enterprise") lets visitors switch at any time.
5. Like the live site, a personalisation icon sits next to search: a factory on the Industry page, a graduation cap on Education and a shop on the Store page. Its tooltip reads "Industry Content Personalized" (or Education), and clicking it reopens the popup. After a choice the popup shows "Great! Loading your personalized content…", and the tooltip appears briefly on arrival.
6. For review: add `?welcome` to the URL to force the popup, or `?stay` to stop the redirect.

On the live OpenCart site the same choice could be stored in the customer session or account instead of the browser.

## Design D

Design D keeps the **original my.cytron.io page structure**, section by section and in the same order, but uses the Design C look (letterhead blue, Roboto, light cards).

- Store (`design-d.html`): slider (7 slides, as on the live site), 4 promo tiles, Top Learning Education Kits, Latest Tutorial, Weekly Best Sellers, Maker's Selection, Our Training Partner, Our Top Brands, We do offer, footer.
- Education (`design-d-education.html`): Welcome Makers banner, Top Learning Education Kits, Which STEM Kits Are Best for Beginners?, Which Platform Is Best for Your STEM Project?, Tutorials / Videos / Resource Hubs, Competitions & Programs, Community, footer.
- Industry (`design-d-industry.html`): IR4.0 video, trust badges, Raspberry Pi for Industry, Why Raspberry Pi, Meet IRIV, Why IRIV, IRIV Product Family, Industry Feedback, Use Cases & Success Stories, Explore Industrial Products, Meet & Greet, Articles, Design and Customization Service, Keep Me Updated, footer.
- The header keeps the live site's Store / Industry / Education tabs, menus and search box. The footer keeps its Support / About / Resources / Follow Us columns.
- Banners with text baked into the image were redrawn as text plus product photo, so the words stay sharp and searchable.

## Product page (Maker ESP32 Bundle)

Both designs use the live [Maker ESP32 Bundle](https://my.cytron.io/p-maker-esp32-bundle) page: same photos, video, prices, bundles, description, features, specification, packing list, resources, tutorials and reviews (snapshot of 12 Oct 2026).

- Design C (`product.html`): new layout. Gallery and buy box side by side, bundles shown as picture cards (price, code, stock and photo update when one is picked), warranty and delivery promises under the button, then a sticky section menu (Overview, Features, Specifications, What's in the box, Resources, Tutorials, Reviews). The packing list is one card per bundle, with "Choose this bundle". A buy bar stays at the bottom of the screen once the buy box scrolls away.
- Design D (`design-d-product.html`): the live page's structure. Gallery with video first, grey info panel (Brands / Code / Warranty, price range, Cashback, bundle chips, Availability, Add to Cart, Explore More, Accessories), then Description, Features and Packing List with Read More, Resources, Related Tutorials carousel, You May Also Need (See More), Reviews and Tags, with Recently Viewed, New Arrivals and Stock Clearance on the right.
- The cart, wishlist and share buttons only show a "Mockup only" message.

## Side-by-side comparison

`compare.html` shows the current my.cytron.io page on the left and a new design (Design C or Design D) on the right, for the Store homepage, Education, Industry & Enterprise and the Maker ESP32 Bundle product page, on desktop or mobile.

- The left side is a full-page screenshot captured on 12 Oct 2026. The live site sends `X-Frame-Options: sameorigin`, so it can't be shown live inside another page.
- The right side is the live mockup, loaded with `?compare` (no chooser popup, no redirect, no mockup badge).
- "Sync scroll" keeps both sides at the same relative position.
- Use the "Design C / Design D" switch to choose which new design appears on the right.
- Links such as `compare.html?page=edu&design=d&device=mobile` or `compare.html?page=product&design=c` open a specific view.
- Product page screenshot: the YouTube cover can't be captured, so it shows the product photo with a play button, and "Recently Viewed" shows only the product itself.

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
