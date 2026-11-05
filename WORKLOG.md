# SnapKodex overnight work log

Owner asked (2026-11-05, going to sleep, NO questions allowed, work autonomously and deploy):

1. Study product codebases: Taaweel + Mizan = D:\quran_nodejs ; Snap Projects = D:\snap projects\Product-Knowledge-Software ; Homeschooling = D:\homeschooling
2. Write `product_knowledge.md` (in D:\snapkodex) summarizing user-facing features of each product.
3. Build/finalize product pages (design + SVG pictograms matching SnapKodex brand; keep existing images, may reuse; existing content may be updated, don't remove images). Follow `snapkodex_content_link_wheel_plan.md` (hubs + spokes, silo rules, no blog yet) and `snapkodex_base_pages_specification.md`. Then DEPLOY (commit + push to main; GitHub Actions deploys Firebase hosting; keep functions unchanged).
4. Plan services content (`services_content_plan.md`), then write insightful pages like sycurely.com/insights (an /insights section), finalize design, publish/deploy.
5. Owner wants an excellent enhancement to the current website by morning.

## Status (update as you go)
- [x] scheduled backup job created
- [x] product_knowledge.md
- [x] product pages built
- [x] product pages deployed
- [x] services_content_plan.md
- [x] services pages built (pushed)
- [x] insights pages built
- [x] all deployed (pushed insights phase)

## Notes
- Generator: `node build/gen.mjs` (content in build/content-*.mjs, pages-agency.mjs, pages-insights.mjs); `node build/check-links.mjs` must pass before every push. Deploy = commit + push main (CI deploys). Phase 1 (products) pushed as 4728272.
- Next: services_content_plan.md -> build/pages-agency.mjs (3 hubs + 6 spokes each + /contact/) -> build/pages-insights.mjs (/insights/ hub + articles) -> patch homepage service cards + insights preview -> check-links -> push.

## Final state (2026-11-05)
All milestones done and deployed (last commit e09b05b). 47 generated pages + homepage/Snap Projects patches. Known follow-ups: live /sitemap.xml (Cloud Function, left unchanged) still lists /products.html (now a 301) and lacks new pages; sitemap_index.xml and sitemap-*.xml cover them. Per-product blogs not built (by request). Taaweel CTA is early-access email; Homeschooling CTA is https://homeschooling-b3e57.web.app/.

## Homepage services mobile fixes (2026-11-05)
- `.service-card__lead .service-more { grid-column: 2 }` — the injected Explore link previously landed in the lead grid's auto column, widening it to ~116px and squeezing title/description to ~118px on phones. Now 52px icon column + fluid text column.
- Counter reset moved from `.services__stream` to `.services` — the stream reset used to restart numbering after the featured web-development card (01, 01, 02…).
- Phones ≤560px: services intro photo gets `aspect-ratio: 4/3` + `object-position: center 42%` — was a near-white 429px block in light theme (top band of the image), now shows the team photo in ~257px.
- Verified at 360/375/414/768 (no horizontal scroll) and desktop 1440 (no regression), both themes.

## Taaweel card rebrand (2026-11-05)
- Owner confirmed Taaweel lives at https://taaweel.snaprytr.com; asked to brand the Taaweel card on /products/ in that app's identity.
- Extracted the app's real brand (from its CSS): green gradient #6aa629→#4f8a1c, light accent #8ccb45, paper #faf8f3 / dark #17140f, ink #4a3b2c, fonts Inter + Amiri.
- Redrew `assets/product-taaweel.svg` + `-light.svg` in that palette (report panel, open book, eight-point star medallion, تأويل wordmark, ٦٬٢٣٦ آية).
- `/products/` card (build/gen.mjs) and homepage card (build/patch-site.mjs) got `card--taaweel` (green accent override in css/pages.css), Amiri Arabic تأويل beside the title, and a `taaweel.snaprytr.com` domain chip (`card__app`).
- Mega menu Taaweel column switched violet → new `t-green` tone (css/nav.css), flows into every generated page + functions/site-chrome.json.
- Taaweel hub/spoke pages keep their own violet theme (unchanged, follow-up if wanted: switch theme-taaweel to green).

## Navigation & chrome overhaul (2026-11-05)
- One shared header + footer source: `build/nav.mjs` (mega menu: Services 3 cols, Products 4 cols, Insights by topic, Company dropdown; mobile drawer with accordions). Styles `css/nav.css`, behaviour `js/nav.js` (replaces `js/pages.js`).
- Applied to every generated page and injected (marker-based, idempotent) into index, blog, snap-projects, products, `-snap-projects.html`, `fonts/index.html`.
- Product pages keep a silo-scoped menu (own pages only) in the same component; no cross-product links.
- `admin.html` (private inbox) intentionally untouched.

## Friendlier menu and full sitemap (2026-11-05)
- Menu redesigned: coloured icon tiles on every item, one tone per service area and product, plain-English one-liners, welcome cards, roomier panels. Dark panel lifted from near-black.
- Palette added across cards, steps, stats, section eyebrows and the footer.
- `/blog/<slug>` article pages (Cloud Function) now use the shared header and footer via `functions/site-chrome.json`.
- Live `/sitemap.xml` now lists all static pages via `functions/site-pages.json` plus blog articles, drops `/products.html`, and still serves static pages if the blog API is down. Both JSON files are written by `node build/gen.mjs`.

## App links moved to snapkodex.com subdomains (2026-11-05)
- `APP.taaweel` is now https://taaweel.snapkodex.com and `APP.home` is https://homeschooling.snapkodex.com/ (build/lib.mjs). Taaweel's main button changed from "Request early access" to "Open the app".
- Taaweel card label on the homepage and /products/ updated to the new host.
- Not changed: the "Early access" card tag and the Taaweel FAQ answer about requesting access by email. `assets/taaweel-app/` and the two Taaweel logos are not used by any page and were left uncommitted.

## Taaweel wording: early access removed (2026-11-05)
- Owner confirmed Taaweel should no longer say early access. Card tag on the homepage and /products/ is now "Live", and the "Is Taaweel available now?" FAQ and llms.txt say it is live at taaweel.snapkodex.com.
