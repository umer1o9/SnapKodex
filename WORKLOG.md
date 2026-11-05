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

## Taaweel app screenshots, logo and CTAs (2026-11-05)
- Logged into taaweel.snaprytr.com, captured real app screens (dashboard, run #2 pipeline, report, stage table, qalb concordance, trace corpus/tafsir, ontology graph, numerics, chats, Mizan) into `assets/taaweel-app/` (13 PNGs, ~2MB).
- Brand logo extracted from the app own inline SVG: `assets/taaweel-logo-dark.svg` (cream/light-green) + `-light.svg` (brown/green), swapped via `data-theme-img="taaweel-logo"` (registered in js/theme.js).
- `lib.mjs`: `appGallery()` (hub: logo + Inside-the-app + browser-framed grid) and `appShot()` (per-spoke framed screenshot); each spoke in content-taaweel.mjs carries a `shot`, hub carries `galleryShots`.
- `APP.taaweel` respected: every Taaweel page CTA (header, hero, CTA band, footer) now points at https://taaweel.snapkodex.com ("Open the app"); hub schema gets installUrl.
- Pages regenerated (47), links ok; verified desktop + mobile, dark + light.

## Pictogram treatment for app screens (2026-11-05)
- Replaced the raw Taaweel screenshots with 8 hand-drawn SVG pictogram wireframes (assets/taaweel-app/*.svg, 400x240, dark paper + green accent + cream lines + Arabic touches): dashboard, stages, report, ledger, concordance, audit, ontology, mizan. Old PNGs removed.
- appshot() now renders pictogram panels (img with .svg extension = picto mode, no browser bar, title+caption caption); Homeschooling keeps its real screenshots (extensionless img = .png + frame bar).
- New taaweelHeroArt() for the Taaweel hub hero: the knot logo (CSS-classed, cream/green on dark, brown/green on light) inside the glass tile with an orbit of six capability satellites and a ta wil wordmark.
- Wide pictos capped at 680px; captions use theme-aware text colors.

## Annotated screenshot frames (2026-11-05)
- Abstract pictograms replaced: real app screenshots returned (restored PNGs from 472afce) and are now wrapped in premium SVG frames - browser chrome with traffic lights, URL pill (taaweel.snapkodex.com), ta wil mark, green glow, drop shadows - with annotation chips and elbow connectors pointing at real features ("13 of 13 stages complete", "Every claim carries a citation", ...).
- Generator: build/gen-taaweel-frames.py (annotation targets in original screenshot px; auto wrap, overlap avoidance, side margins). Screenshots embedded as base64 WebP q85 (SVGs via <img> cannot reference external files); 8 self-contained SVGs, 33-133KB each. Source PNGs kept for regeneration.
- Mapping: hub gallery = dashboard, run, report, trace-corpus, ontology-graph, mizan; spokes = run (pipeline), trace-tafsir (evidence), trace-corpus (roots), evidence (audit), ontology-graph, mizan. .appshot--picto CSS: no double frame (SVG carries its own).

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

## In-app screenshot galleries for Homeschooling and Snap Projects (2026-11-05)
- Generalized `appGallery`/`appShot` in `build/lib.mjs` (was hardcoded to Taaweel): now takes a per-product `folder`, `domain` and optional `logoSrc`; falls back to the product's own icon tile when there is no dedicated brand mark. `gen.mjs` passes this from a new `appAssets` field on each product.
- Homeschooling: captured real screens from `localhost` against the Firebase emulator suite (a local-only superadmin test account created via `firebase-admin` against the Auth emulator, matching the pattern already in `tests/e2e/explore-platform.spec.js`; the existing `dev@local.test` family account for the rest) — dashboard, a real AI-generated 6-month curriculum for a seeded test child, the weekly planner, the syllabus builder and Wikido's illustrated "Living Things" scene. Wired into the hub gallery and four spoke pages in `build/content-home.mjs`. Saved to `assets/homeschooling-app/`.
- Snap Projects (`snap-projects.html`, hand-written): no demo/admin account exists for it anywhere, and its backend has no local auth gate, so a fresh sign-up would have hit the real production Firebase project — out of bounds. With the owner's go-ahead, used the already-running local desktop instance signed into the owner's own account instead; the "Recents" chat list was hidden before capturing so no personal chat titles are in the shipped images. Two screens (chat composer, Projects) added as a new "Inside the app" section, styled without the browser-chrome address bar since it's desktop software, not a website. Saved to `assets/snap-projects-app/`.
- Taaweel's own gallery (screens, logo, CTAs) was already shipped in a separate concurrent commit (`472afce`); this pass only generalized the code it depends on, which required no content change on the Taaweel side.
- Snap Projects "Try for free" button no longer hardcodes a specific release (`v1.0.4`, now several versions stale); both platforms now link to `.../releases/latest` on GitHub, which always redirects to whatever was most recently published.

## 2026-11-05 — Taaweel: real screenshots on annotated device stages
- Replaced the small self-contained SVG frames (`assets/taaweel-app/*.svg`, `build/gen-taaweel-frames.py`) with device stages modelled on the owner's reference: tinted feature cards (title left, text and CTA right), the real screenshot in an SVG laptop/monitor/tablet/browser frame, coloured label chips with dashed connectors to rings on the actual feature, 1:1 crops of key details lifted over the device, white icon badges and sparkles.
- Chips are HTML (site fonts, selectable text) positioned in % on a 1200x600 canvas, sized with container units; each chip's edge sits on its connector's anchor, so connectors stay exact. Below 760px chips/wires/crops hide and the same labels show as a pill list under a zoomed device.
- Hub: scroll-snap carousel with prev/next (`js/stage-carousel.js`, loaded only there); works by swipe/scroll without JS. Capability pages: one wide stage each, with an Open the app CTA.
- Hero: the run screen in a laptop with progress and cost crops, Taaweel knot badge and icon badges, replacing the icon orbit.
- Data: `build/content-taaweel-stages.mjs` (notes target source-PNG pixels), crop boxes in `build/taaweel-stage-crops.json`, WebP cut by `python build/gen-taaweel-stages.py` into `assets/taaweel-app/stage/`.
- Checked with Playwright at 1400px (dark and light) and 375px: no horizontal overflow, connectors land on their targets.
- Enlarge: every annotated stage, the hero, and the Homeschooling/Snap Projects screenshot cards open the full-resolution PNG in a dialog (`js/lightbox.js`, loaded site-wide; 1.6KB). Fit-to-screen first; tap/click/Enter toggles 100% so it can be panned or pinch-zoomed on phones; Escape or ✕ closes and returns focus. Tested with Playwright at 1400px and 375px with touch.
- Enlarged view now shows the whole annotated stage (device frame, labels, connectors, crops, badges), not the bare PNG: `js/lightbox.js` clones the stage into the dialog. Desktop opens fitted (⤢ for 1500px, centred); phones open at 820px from the left edge so labels are readable and pan sideways, with ⤢ for a proportional overview. Plain screenshot cards still open their full-size image.
