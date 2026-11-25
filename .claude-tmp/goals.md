# Design H: what each page must achieve (set by the user, 11 Nov 2026)

Use this to judge every future change to these two pages.

## Homepage (design-h.html): shopping
- People come to the homepage to shop.
- Sections should help them find and buy products quickly: banners, categories, product tabs, brands and so on.
- Solution and story content on the homepage is only a short bridge to the Industry page.
- Since 12 Nov, guests (Store mode) also see this homepage.

## Industry page (design-h-industry.html): nurturing new customers
- Purpose: nurture new customers with **solutions**.
- Cover **all** Cytron solutions (LoRaWAN / Milesight, AI vision, agriculture, building, energy, networking, POC kits, custom boards), not only IRIV. IRIV has its own landing page (design-h-iriv.html).
- **Main call to action: Meet & Greet** (book a meeting with our engineers).
  - Live link: my.cytron.io/ind-meetNgreet (used on the live Industry landing page and the header Services menu, 25 Nov). The older my.cytron.io/ind-meetNGreet-general2 also still works; both are titled "Industry Meet And Greet".
  - Mockup page: design-h-meet-engineers.html
- The page must answer the customer's question: **"Why should I trust you?"**
- No prices or buy prompts on this page (set earlier, 11 Nov).

## Changes since 11 Nov
- **Hero (12 Nov, user):** each slide has one "Explore" button; Meet & Greet was removed from the hero. Meet & Greet is still the main CTA in the page body: the mid-page strip, Find Your Way, the trust section, the workshops, the FAQ and the closing band.
- **Numbers strip (12 Nov, user: "put it back like before"):** back to the original 5 figures:
  - 500+ field deployments
  - 20+ years hardware R&D
  - Raspberry Pi Design Partner
  - 10-Yr production longevity
  - 100% Penang in-house SMT

  The user stands behind these figures. The verifiable-only version from 11 Nov (since 2004, 4 stores, 12-month warranty, 1-to-1) was replaced.
- **Customer logos:** the 16 logos appear after the numbers strip ("Trusted by Industry Leaders"). This is now the only place they appear.
- **"Why Industry Trusts Cytron":** 6 points (RPi Design Partner, since 2004, made in Penang, local support and stock, trusted brands, backed after you buy).
- **Buyer FAQ (12 Nov):** 7 questions before the closing band.
- **White-label:** stays on the Industry page (user's choice).

## Live site check: where Meet & Greet appears (25 Nov 2026)
The live site now runs the Design H layouts:
- Industry homepage = my.cytron.io/ in Industry mode.
- **Current Industry landing page = my.cytron.io/industry** (title "Cytron Industry"), built from design-h-industry.html. (/raspberry-pi-for-industry is the older Raspberry Pi for Industry page.)

**Industry homepage:** Meet & Greet appears in ONE place only: the header Services menu, "Meet Our Engineers – Book a session to talk through your project" → /ind-meetNgreet. Nothing in the page body. The "Local Support" card's "more" goes to /contact.

**Industry landing page (/industry):** 9 links in the page body + the header menu, all → /ind-meetNgreet:
1. Header Services menu: "Meet Our Engineers".
2. Mid-page strip after "See How Each Solution Works on Real Sites": "Book a Meet & Greet".
3. Find Your Way to Work with Cytron, System Integrators card: "Talk to Our Team".
4. Find Your Way, Factories card: "Book a Meet & Greet".
5. White-label closing band: "Start a Custom Project".
6. Workshops & Training intro: "Plan training for your team".
7. Why Industry Trusts Cytron intro: "Book a Meet & Greet".
8. FAQ intro: "Book a Meet & Greet" (with the WhatsApp line).
9. FAQ answer "How do I start a project with Cytron?": "Book a Meet & Greet".
10. Closing band "Meet Our Engineers, One to One": "Book a Meet & Greet".
- Not in the hero (each slide has one Explore button, per the 12 Nov decision). The EMS card in Find Your Way goes to Custom Design & Manufacturing (/agile-manufacturing).
- The live /industry page still has the Success Stories section that was removed from the mockup on 17 Nov.

**Older Raspberry Pi for Industry page (/raspberry-pi-for-industry):** Services menu link → /ind-meetNgreet, plus a "Meet & Greet Session" block (after Explore Industrial Products, before Articles) whose text link and "BOOK YOUR SLOT NOW" banner go to the external form cytron.activehosted.com/f/64. Its copy still says "Chat directly with our expert designers".

Also found: live What We Offer typos "HDRC Claimable Training" (HRDC) and "Industry 4.0 and and edge Ai workshops". Live Services menu has a workshop page: /cytron-workshop.

## Meet & Greet placement decision (25 Nov 2026, user approved)
Meet & Greet stays only where the visitor is still deciding; other visitors get a next step that fits them. Applied to design-h-industry.html (commit 300b346):
- Kept as Meet & Greet (5): header Services menu; mid-page strip after Solutions in Action ("Not sure which solution fits your site?"); Find Your Way Factories card; FAQ answer "How do I start a project with Cytron?"; closing band "Meet Our Engineers, One to One".
- Changed (5):
  - Find Your Way, System Integrators card: "Talk to Our Team" -> **Request a Quote** (my.cytron.io/contact).
  - White-label closing band: "Start a Custom Project" -> Custom Design & Manufacturing page (live /agile-manufacturing; mockup design-h-custom-design.html).
  - Workshops & Training: "Plan training for your team" -> my.cytron.io/cytron-workshop.
  - Why Industry Trusts Cytron intro: Meet & Greet button replaced by an outlined **See Success Stories** button.
  - FAQ intro: Meet & Greet button replaced by an outlined **Contact Us** button (WhatsApp line kept).
- The live /industry page still has all 10 Meet & Greet links; the web team needs to copy these changes.

## Still open
- No customer story yet for LoRaWAN, AI Vision or Networking.
- Real square headshots for the reviewers.
- Smart City demo: decide later.
- Still to confirm: certifications (ISO etc.), if any.