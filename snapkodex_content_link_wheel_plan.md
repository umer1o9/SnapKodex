# SnapKodex Content Expansion & Internal Link Wheel Plan (v2, no blog yet)

Companion to `snapkodex_base_pages_specification.md` (the 8 base pages) and the future blog handoff (hub-and-spoke subfolder silos, spin-off SOP).

**Scope of this phase:** build the hubs and spoke pages only. No blog. The structure is designed so the blog drops in later with no rework (section 6).

**"Link wheel" here means an internal ring on snapkodex.com only.** No external link networks or reciprocal swaps; those violate Google's link-spam policies.

---

## 1. Model

Three **silos**, kept topically isolated:

| Silo | Root | Wheels |
|---|---|---|
| Agency | `/services/` | A: Agentic AI, B: SaaS & Enterprise, C: AI Agents & Automation |
| Taaweel | `/products/taaweel/` | D |
| Homeschooling | `/products/homeschooling/` | E |

Each **wheel** = 1 hub (center) + 6 spokes (rim):

- Hub links to all 6 spokes; every spoke links back to the hub.
- **Rim ring:** spoke N links to N+1 and N-1; spoke 6 links to spoke 1.
- Spokes carry the content depth, because there is no blog to do it yet. Target 900-1,500 words each, with a diagram or table, FAQ and CTA.

## 2. Wheels and Spokes

### A: Agentic AI (hub `/services/agentic-ai-development/`)

| Spoke | Target keyword |
|---|---|
| `/services/agentic-ai-development/multi-agent-orchestration/` | multi-agent orchestration consulting |
| `.../tool-calling-and-api-actions/` | custom llm tool calling |
| `.../hybrid-rag-pgvector/` | enterprise hybrid RAG development |
| `.../agent-memory-knowledge-graphs/` | AI agent memory architecture |
| `.../human-in-the-loop-workflows/` | human-in-the-loop AI agents |
| `.../agent-evaluation-and-observability/` | LLM agent evaluation & monitoring |

### B: SaaS & Enterprise (hub `/services/saas-and-enterprise-development/`)

| Spoke | Target keyword |
|---|---|
| `.../multi-tenant-saas-architecture/` | multi-tenant saas architecture |
| `.../sso-and-identity/` | enterprise SSO SAML OIDC implementation |
| `.../usage-based-billing/` | usage based billing saas development |
| `.../erp-crm-development/` | custom ERP / CRM development |
| `.../high-load-queues-and-pipelines/` | high-load queue architecture |
| `.../web-application-development/` | custom web application development agency |

### C: AI Agents & Automation (hub `/services/ai-agents-and-automation/`)

| Spoke | Target keyword |
|---|---|
| `.../customer-support-agents/` | custom ai customer support agent |
| `.../sales-agents/` | ai sales agent development |
| `.../rag-chatbots/` | enterprise rag chatbot development |
| `.../ecommerce-bots/` | ecommerce chatbot development |
| `.../document-extraction-automation/` | pdf & email data extraction automation |
| `.../rpa-and-workflow-automation/` | ai workflow automation agency |

### D: Taaweel (hub `/products/taaweel/`)

| Spoke | Topic |
|---|---|
| `.../features/sarf-morphology/` | Triliteral roots, Verb Forms I-X |
| `.../features/nahw-irab/` | Syntax and case-ending parsing |
| `.../features/balagha-rhetoric/` | Rhetoric and semantic profiling |
| `.../features/corpus-search/` | Ontological and API-backed search |
| `.../use-cases/researchers-and-educators/` | Quranic researcher and educator persona |
| `.../use-cases/students-and-nlp/` | Arabic student and NLP practitioner personas |

### E: Homeschooling (hub `/products/homeschooling/`)

| Spoke | Topic |
|---|---|
| `.../features/token-economy/` | Point ledger and reward store |
| `.../features/multi-child-scheduling/` | 1-on-1 coaching blocks |
| `.../features/off-screen-stem/` | Unplugged logic and science labs |
| `.../features/family-sync/` | Multi-parent invite and real-time sync |
| `.../a-typical-day/` | Daily timeline walkthrough |
| `.../for-micro-schools/` | Micro-school and co-op use case |

### Supporting pages (not wheels)

`/products/` (directory; links to all product hubs), `/contact/`. SnapRytr and Snap Projects get listing cards on `/products/` now (existing `snap-projects.html` moves to `/products/snap-projects/` with a 301). Full wheels for them are a later phase.

**Total: 5 hubs + 30 spokes + `/products/` + `/contact/` = 37 new pages** (plus the upgraded homepage).

## 3. Linking Rules

Aligned with the handoff's silo rules and the spin-off SOP.

1. **Strict silo isolation.** Taaweel never links to Homeschooling (or the reverse). Product pages also do not link into `/services/`. Their only outbound link to the parent is the single footer attribution ("An AI Product Engineered by Snap Kodex") per the base spec.
2. **Equity flows down, one way.** Homepage, `/products/` and the service hubs link down into product hubs. Product pages do not link back up, which is also what makes a later spin-off clean.
3. **Within the agency silo,** bridge links between wheels are allowed only where topics overlap: A to C (agents and automation) and A to B (SaaS platforms that embed agents). Maximum 2 per spoke. Every agency spoke also links to `/contact/`.
4. **Within a product silo,** each spoke links to its hub, the next and previous spoke, and the app CTA (`https://{product}.snapkodex.com`).
5. **Anchor text mix:** about 50% descriptive partial-match, 25% exact-match, 15% branded, 10% generic. Never repeat one exact anchor for every link to a page.
6. **Budget:** at most about 100 links per page including nav; 5-12 contextual body links.
7. **Depth:** every page is within 3 clicks of the homepage; no orphan pages; every URL is in its silo's sitemap.
8. **Link hygiene for migration:** all product-silo internal links are relative or use `{{TAAWEEL_BASE_URL}}` / `{{HOMESCHOOL_BASE_URL}}` tokens. Agency pages link to products via a single `PRODUCT_URLS` map, so a later move to `taaweel.com` is a one-line change.

## 4. Spoke Template

1. Breadcrumb with `BreadcrumbList` JSON-LD (`SnapKodex > Products > Taaweel > Sarf Morphology`).
2. H1 with the target keyword, a problem-led intro, a CTA.
3. Technical depth: diagram, deliverables, stack (services) or feature walkthrough (products).
4. "In this wheel" block: Previous / Next / Hub.
5. FAQ with `FAQPage` schema (3-5 questions).
6. CTA band.
7. **Related reading slot (empty for now)**, see section 6.

Schema: `Service` for service pages, `SoftwareApplication` for product pages, always with `BreadcrumbList`.

## 5. Build Approach and Phasing

The site is static HTML on Firebase Hosting, so hand-written pages would drift. Plan: one `content/wheels.json` that defines every wheel, hub, spoke, prev/next ring and bridge. A small Node script renders pages from a template plus per-page content files, and also regenerates the sitemaps and breadcrumb JSON-LD. It runs in the existing GitHub Actions deploy.

1. Wheels D and E, `/products/`, `/contact/`, and the homepage products grid.
2. Wheels A, B and C.
3. Segmented sitemaps (`sitemap-agency.xml`, `sitemap-taaweel.xml`, `sitemap-homeschooling.xml` plus index) and Search Console submission. The current `sitemap.xml` is function-generated and will need adapting.
4. Later: SnapRytr and Snap Projects wheels.

## 6. Blog-Ready Design (so the blog is plug-in later)

- **Reserved URLs:** `/blog/ai/`, `/products/taaweel/blog/`, `/products/homeschooling/blog/`. Nothing else uses these paths. Currently `/blog` is the AutoBlog Studio listing; the per-silo paths will need function or routing work when the blog starts.
- **Related reading slot:** each hub and spoke template includes a component fed by `wheels.json`'s `posts` list. It renders nothing while the list is empty. Adding posts later fills the slot with no template changes.
- **Planned posts map onto spokes,** so each future cluster post has an obvious upward link target:

| Future post (from handoff) | Links up to spoke | Hub |
|---|---|---|
| supervisor vs hierarchical orchestration | multi-agent-orchestration | A |
| hybrid RAG + knowledge graphs on PostgreSQL | hybrid-rag-pgvector | A |
| AI customer support agents, SLA triage | customer-support-agents | C |
| FastAPI vs Node.js for agentic backends | multi-agent-orchestration / high-load-queues | A / B |
| triliteral roots and semantic shifts | sarf-morphology | D |
| I'rab case endings breakdown | nahw-irab | D |
| balagha patterns | balagha-rhetoric | D |
| why standard AI translators fail at classical Arabic | corpus-search | D |
| programming logic without screens | off-screen-stem | E |
| token reward system for chores and math | token-economy | E |
| 1-on-1 schedule for two kids of different ages | multi-child-scheduling | E |
| hands-on STEM home lab on a budget | off-screen-stem | E |

- **Pillar posts** (multi-agent guide, Sarf/Nahw guide, token-economy guide) will link up to their hub. The two agency bridge case studies will link down to `/products/taaweel/` and `/products/homeschooling/`, matching the handoff's Rule 2.
- Nav already has the `Blog` entries reserved in the spec but hidden until the blog exists.

## 7. Decisions Needed

1. **URL style.** Folders with `index.html` (`/services/x/`), plus 301s for the old `.html` URLs? Recommended.
2. **Copy.** I draft all copy, you review. Taaweel (Arabic linguistics) and Homeschooling copy needs your subject-matter check.
3. **Spoke depth.** 30 spokes at 900-1,500 words is substantial. Alternative: ship the product wheels fully first and the service spokes as shorter pages, then deepen.
