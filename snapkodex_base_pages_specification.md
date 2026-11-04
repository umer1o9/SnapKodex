# Phase 0 Technical & Content Specification: SnapKodex Base Pages Architecture

**Project:** SnapKodex Multi-Product Foundation (Pre-Blog Rollout)  
**Parent Domain:** `https://snapkodex.com/`  
**Prerequisite For:** Hub-and-Spoke Subfolder Blog Consolidation (`/blog/ai/`, `/products/taaweel/blog/`, `/products/homeschooling/blog/`)  
**Objective:** Architect, write, and deploy the foundational marketing, product, and conversion pages on `snapkodex.com` so that incoming organic traffic and internal links from the upcoming blog silos land on high-converting, schema-validated destination pages.

---

## 1. Current State Audit vs. Required Base Page Inventory

An audit of the live `https://snapkodex.com/` root property shows a single-page brochure architecture where all core sections (**Our Products**, **Our Services**, **Our Techstack**, **Strategic Partners**, **FAQ**, and **Contact**) live on the homepage without dedicated sub-routes for the product silos or core commercial pillars.

Before publishing Pillar-Cluster blog content, the following **Base Page Inventory** must be live and indexed under `sitemap-agency.xml`, `sitemap-taaweel.xml`, and `sitemap-homeschooling.xml`:

| Silo / Tier | Target URL Path | Page Role | Primary Conversion Action (CTA) | Sitemap Assignment |
| :--- | :--- | :--- | :--- | :--- |
| **Root Hub** | `snapkodex.com/` | B2B Agency Homepage & Multi-Product Authority Hub | `#contact` / `/contact/` ("Start a project") | `sitemap-agency.xml` |
| **Agency Services** | `snapkodex.com/services/agentic-ai-development/` | Commercial Money Page for Silo A (Agentic AI & Multi-Agent Orchestration) | Book Architecture Discovery Call | `sitemap-agency.xml` |
| **Agency Services** | `snapkodex.com/services/saas-and-enterprise-development/` | Commercial Money Page for Cloud-Native SaaS, ERP/CRM & Custom Platforms | Request Technical Scope & Estimate | `sitemap-agency.xml` |
| **Agency Services** | `snapkodex.com/services/ai-agents-and-automation/` | Commercial Money Page for Support, Sales, Ecommerce Bots & RPA/Workflows | Request Live Agent Demo | `sitemap-agency.xml` |
| **Products Hub** | `snapkodex.com/products/` | Portfolio Directory (Taaweel, Homeschooling, SnapRytr, Snap Projects) | Route to Product Landing Pages | `sitemap-agency.xml` |
| **Silo B Root** | `snapkodex.com/products/taaweel/` | Taaweel Standalone Marketing & Conversion Page | Launch App (`taaweel.snapkodex.com`) | `sitemap-taaweel.xml` |
| **Silo C Root** | `snapkodex.com/products/homeschooling/` | Homeschooling Platform Standalone Marketing & Conversion Page | Launch App (`homeschooling.snapkodex.com`) | `sitemap-homeschooling.xml` |
| **Trust / Conversion** | `snapkodex.com/contact/` | Dedicated Project Intake & Consultation Booking Page | Submit Project Brief / Schedule Call | `sitemap-agency.xml` |

---

## 2. Global vs. Silo-Scoped Navigation & Layout Rules

To maintain topical isolation for Googlebot while preserving root domain authority (`snapkodex.com`), headers and footers must dynamically adapt based on the URL path prefix:

### 2.1 Root & Core Agency Pages (`/`, `/services/*`, `/products/`, `/contact/`)

- **Header Navigation:** `Services` (Dropdown: Agentic AI, SaaS & Enterprise, AI Automation & Bots) | `Products` (Dropdown: Taaweel, Homeschooling, SnapRytr, Snap Projects) | `Tech Stack` | `Partners` | `AI Engineering Blog` (`/blog/ai/`) | **CTA Button:** `Start a Project` (`/contact/`)
- **Footer Navigation:** Full agency directory, links to all 3 product landing pages (`/products/taaweel/`, `/products/homeschooling/`), strategic partner attributions (FasttechBPO, Sycurely), contact details (`hello@snapkodex.com`, Mon–Fri 9:00–18:00), and legal links.

### 2.2 Product Base Pages (`/products/taaweel/` and `/products/homeschooling/`)

- **Scoped Header Navigation:** Product Logo/Wordmark | `Features` (`#features`) | `How It Works` (`#workflow`) | `Use Cases` (`#use-cases`) | `Blog` (`/products/{product-slug}/blog/`) | `FAQ` (`#faq`) | **Primary CTA Button:** `Open App` (`https://{product-slug}.snapkodex.com`)
- **Scoped Footer Navigation:** Product-specific links, documentation/blog categories, and a single attribution line linking back to the parent entity: *"An AI Product Engineered by [Snap Kodex](https://snapkodex.com/)."*
- **Migration-Ready Variable Rule:** All internal links inside `/products/taaweel/` and `/products/homeschooling/` must use relative paths or `{{TAAWEEL_BASE_URL}}` / `{{HOMESCHOOL_BASE_URL}}` environment tokens so the future 301 spin-off to standalone domains requires zero template rewrites.

---

## 3. Page-by-Page Wireframes, Copy Structure & SEO Specs

### Page 1: Root Homepage (`snapkodex.com/`)

The existing homepage (`Snap Kodex | AI-Native Software House for SaaS, Enterprise & Agentic AI`) already has strong B2B service copy across 9 service disciplines and 20 technology stack items. It requires structural refinement to serve as the parent SEO hub:

- **Meta Title:** `Snap Kodex | AI-Native Software House for SaaS, Enterprise & Agentic AI`
- **Meta Description:** `Snap Kodex builds production-ready multi-agent AI systems, cloud-native SaaS platforms, and enterprise software. Explore our engineering services and proprietary AI products.`
- **Canonical URL:** `https://snapkodex.com/`
- **Required Structural Upgrades on Homepage:**
  1. **Hero Section:** Keep the core positioning (*"Fast. Reliable. Crafted for ambitious teams. A software company that builds products and delivers at scale."*) with dual CTAs routing to `/services/agentic-ai-development/` (or `#services`) and `/products/`.
  2. **Proprietary Products Showcase Block (New Dedicated Section):** Currently, products (SnapRytr, Snap Projects, Taaweel, and Homeschooling) are only mentioned inside an FAQ accordion. Promote a dedicated **Products Portfolio Grid** above the Tech Stack with crawlable `<a>` cards linking directly to:
     - `/products/taaweel/` — *Taaweel: Computational Linguistics & Classical Arabic AI Research Engine*
     - `/products/homeschooling/` — *SnapKodex Homeschooling: Gamified Token-Economy & Off-Screen Logic Platform*
     - SnapRytr (AI Marketing & Business Writing SaaS) & Snap Projects (AI Project Management)
  3. **Core Services Hub (9 Disciplines Consolidated into 3 Pillar Hubs):** Maintain the 9 service cards (`Agentic AI Development`, `SaaS Development`, `Custom Solution Development`, `AI Automation`, `AI Chatbot Development`, `Sales Agent Development`, `Customer Service Agent Development`, `Ecommerce Bot Development`, `Web Development`), and add contextual `"Explore Architecture & Specs →"` links pointing to the 3 dedicated commercial service pages below.
  4. **Tech Stack & Strategic Partners:** Preserve the 20-item technology matrix (Python, TypeScript, React, Next.js, Node.js, Go, Rust, Java, PostgreSQL, MongoDB, Docker, Kubernetes, AWS, GCP, Azure, GraphQL, FastAPI, Vue.js, Terraform) and partner callouts (FasttechBPO for customer operations; Sycurely for WordPress security).
  5. **Engineering Insights Preview:** Add a 3-card feed pulling the latest posts from `/blog/ai/` (starting with the Multi-Agent AI Pillar Page and the Agency $\rightarrow$ Product Bridge case studies).

### Page 2: Core Agency Commercial Service Pages (`snapkodex.com/services/*`)

To give Silo A (`/blog/ai/`) commercial landing pages for upward internal linking (Rule 1 of the Internal Linking Protocol), consolidate the 9 homepage service disciplines into 3 high-intent B2B landing pages:

| Service Page URL | Consolidated Disciplines Covered | Target Keywords | Upward Link Source from `/blog/ai/` |
| :--- | :--- | :--- | :--- |
| `/services/agentic-ai-development/` | Agentic AI Development (Multi-agent orchestration, Tool use & API actions, Planning & reasoning loops, Memory & knowledge graphs) | enterprise agentic ai development, multi-agent orchestration consulting, custom llm tool calling | Pillar Page (`/blog/ai/enterprise-multi-agent-ai-architecture-guide`), Orchestration & Hybrid RAG cluster posts |
| `/services/saas-and-enterprise-development/` | SaaS Development (Multi-tenant, SSO, usage billing), Custom Solution Development (ERP/CRM pipelines, high-load queues), Web Development | cloud-native saas development agency, multi-tenant saas architecture, custom enterprise software | FastAPI vs Node.js cluster post & Firebase local-first bridge case study |
| `/services/ai-agents-and-automation/` | Customer Service Agents (SLA triage, mood routing), Sales Agents, AI Chatbots (grounded RAG), Ecommerce Bots, AI Automation (PDF/email extraction, RPA) | custom ai customer support agent, automated sla triage, enterprise rag chatbot development | AI Customer Support SLA Triage cluster post |

**Standard Section Template for Each Service Page:**
1. **Hero:** Problem-led headline, technical subheadline, architecture diagram, and `"Book a Technical Discovery Call"` CTA.
2. **Architecture Capabilities:** 4 deep-dive blocks expanding the homepage bullet points into concrete technical deliverables (e.g., PostgreSQL + pgvector hybrid RAG, idempotent API tool calling, human-in-the-loop review lanes).
3. **Production Tech Stack:** Filtered subset of the SnapKodex stack relevant to the service (e.g., Python, FastAPI, PostgreSQL, Docker, Kubernetes, GCP/AWS).
4. **Proof & Case Studies:** Links to the relevant engineering bridge articles on `/blog/ai/`.
5. **Service-Specific FAQ & Intake Form:** Embedded contact form routing to `hello@snapkodex.com`.

### Page 3: Products Portfolio Hub (`snapkodex.com/products/`)

Acts as the clean directory index connecting the root domain to every `/products/{slug}/` silo:

- **Meta Title:** `AI Products & Platforms | Snap Kodex Product Studio`
- **Meta Description:** `Explore proprietary AI software built by Snap Kodex, including Taaweel (Classical Arabic & Quranic NLP), our Gamified Homeschooling Platform, and SnapRytr.`
- **Canonical URL:** `https://snapkodex.com/products/`
- **Page Structure:**
  - **Hero:** *"Proprietary Software Engineered by Snap Kodex. Alongside our enterprise client delivery, we build, ship, and scale vertical AI platforms."*
  - **Featured Silo Cards (Primary Equity Passers):**
    1. **Taaweel (`/products/taaweel/`):** Arabic Morphological Analysis, Classical Text Ontology & Computational Linguistics AI.
    2. **Homeschooling Platform (`/products/homeschooling/`):** Self-Driven Curriculum Scheduler, Token Economy & Off-Screen Logic System for Families & Micro-Schools.
  - **Additional Ecosystem Products:** SnapRytr (AI Marketing & Content SaaS) and Snap Projects (AI Project Management).

### Page 4: Taaweel Base Landing Page (`snapkodex.com/products/taaweel/`)

This page is the **Silo B Root** and the primary conversion destination for all articles in `/products/taaweel/blog/` as well as the Agency $\rightarrow$ Taaweel bridge case study (`/blog/ai/how-we-built-custom-nlp-pipeline-for-arabic-linguistics`).

- **Meta Title:** `Taaweel | Classical Arabic Morphology, Sarf, Nahw & Quranic NLP Platform`
- **Meta Description:** `Decode classical Arabic texts with computational linguistics. Explore triliteral root morphology (Sarf), syntactic case endings (Irab), Balagha rhetoric, and ontological search.`
- **Canonical URL:** `https://snapkodex.com/products/taaweel/`
- **App Execution CTA Target:** `https://taaweel.snapkodex.com`
- **Section-by-Section Blueprint:**
  1. **Hero Section:**
     - **Headline:** *Computational Linguistics for Classical Arabic & Quranic Research*
     - **Subheadline:** *Move beyond flat translations. Analyze triliteral root shifts (Sarf), syntactic parsing (Nahw & Irab), rhetorical structures (Balagha), and cross-corpus lexical properties in one workspace.*
     - **Primary CTA:** `Launch Taaweel Web App →` (`https://taaweel.snapkodex.com`)
     - **Secondary CTA:** `Explore Linguistic Research Guides` (`/products/taaweel/blog/`)
  2. **The Problem with Standard AI & Translations:**
     - Contrast generic LLM/machine translation hallucinations against Taaweel's deterministic root-and-pattern ontology and classical tafsir/lexicon grounding (setting up the funnel for `/products/taaweel/blog/why-standard-ai-translators-fail-at-classical-arabic`).
  3. **Core Capabilities Grid (Aligned with Silo B Pillar & Clusters):**
     - **Root-and-Pattern Morphology (*Sarf*):** Trace triliteral and quadriliteral roots across Verb Forms I–X and derived nouns to see how structural patterns shift semantic meaning.
     - **Syntactic & Case Parsing (*Nahw & I'rab*):** Visual dependency graphs showing how grammatical states and case endings alter clause roles and theological/literary precision.
     - **Rhetorical & Semantic Property Profiling (*Balagha*):** Track lexical usage across verses and classical manuscripts—comparing structural vocabulary, ellipsis (*hadhf*), and metaphor without premature flattening.
     - **Ontological & API-Backed Corpus Search:** Programmatic root, lemma, and concept exploration built on verified classical corpora and structured ontologies.
  4. **Target User Personas:**
     - *Quranic Researchers & Educators:* Build evidence-based thematic property profiles across chapters.
     - *Arabic Students:* Transition from rote vocabulary lists to structural *Sarf* and *Nahw* comprehension.
     - *NLP & Computational Linguists:* Inspect structured morphological tagging and ontological relationships.
  5. **Featured Research from the Taaweel Blog:** Dynamic 4-card block linking directly to the Silo B Pillar Page (`/products/taaweel/blog/arabic-morphological-analysis-sarf-nahw-guide`) and supporting cluster articles.
  6. **Taaweel FAQ Section (`FAQPage` Schema):** 4–5 targeted questions covering corpus sources, difference between Taaweel and standard dictionary lookup, and mobile/web access.

### Page 5: Homeschooling Platform Base Landing Page (`snapkodex.com/products/homeschooling/`)

This page is the **Silo C Root** and the primary conversion destination for all articles in `/products/homeschooling/blog/` as well as the Agency $\rightarrow$ Homeschooling bridge case study (`/blog/ai/designing-local-first-realtime-edtech-apps-firebase`).

- **Meta Title:** `SnapKodex Homeschooling | Gamified Curriculum, Token Economy & Family Scheduler`
- **Meta Description:** `Run a self-driven homeschool with structured token economies, multi-child 1-on-1 coaching schedules, daily chore and math tracking, and hands-on off-screen STEM.`
- **Canonical URL:** `https://snapkodex.com/products/homeschooling/`
- **App Execution CTA Target:** `https://homeschooling.snapkodex.com` (aliased/migrated from `homeschooling-b3e57.web.app`)
- **Section-by-Section Blueprint:**
  1. **Hero Section:**
     - **Headline:** *Build a Self-Driven Homeschool With Token Economies & Structured Daily Rhythms*
     - **Subheadline:** *A real-time family workspace designed for intentional parents and micro-schools—combining multi-child time-blocking, intrinsic point-store rewards, and screen-free STEM & logic curricula.*
     - **Primary CTA:** `Start Your Family Workspace →` (`https://homeschooling.snapkodex.com`)
     - **Secondary CTA:** `Read the Homeschool Curriculum Guides` (`/products/homeschooling/blog/`)
  2. **Core Platform Pillars (Aligned with Silo C Pillar & Clusters):**
     - **Token Economy & Reward Store Mechanics:** Replace nagging with transparent point ledgers across daily math, reading, and household chores—redeemable in a customizable family reward store.
     - **Multi-Child 1-on-1 Coaching Schedules:** Synchronized time-blocking that pairs parent-led 1-on-1 instruction for one child with independent, self-guided stations for siblings of different ages.
     - **Off-Screen Logic & Hands-On STEM Tracking:** Structured modules and progress checklists for unplugged algorithmic thinking (ages 5–8), physical science labs, aerodynamics, and microscopy.
     - **Real-Time Family Sync & Invite Flows:** Instant multi-parent and student profile syncing (`family` and `invite` workspace links) so both parents stay aligned on daily progress.
  3. **How a Typical Day Runs (Interactive Timeline Visual):**
     - Morning Sync $\rightarrow$ Block 1 (Child A 1-on-1 Coaching / Child B Independent Logic) $\rightarrow$ Block 2 Swap $\rightarrow$ Hands-On STEM Lab $\rightarrow$ Token Ledger Check-In & Store Redemption.
  4. **Featured Guides from the Homeschooling Blog:** Dynamic 4-card block linking to the Silo C Pillar Page (`/products/homeschooling/blog/gamified-homeschool-curriculum-token-economy-guide`) and supporting cluster posts.
  5. **Homeschooling FAQ Section (`FAQPage` Schema):** Questions addressing multi-age customization, screen-time minimization (parent dashboard vs. off-screen kid execution), and family invite setup.

---

## 4. Technical SEO, Schema & Head Tag Specifications (For Dev/DevOps)

Every base page must ship with complete metadata and JSON-LD structured data before blog deployment.

### 4.1 Required `<head>` Template per Base Page

```html
<title>{{PAGE_META_TITLE}}</title>
<meta name="description" content="{{PAGE_META_DESCRIPTION}}" />
<link rel="canonical" href="https://snapkodex.com{{CANONICAL_PATH}}" />
<meta name="robots" content="index, follow, max-image-preview:large" />

<!-- OpenGraph / Social -->
<meta property="og:type" content="website" />
<meta property="og:title" content="{{PAGE_META_TITLE}}" />
<meta property="og:description" content="{{PAGE_META_DESCRIPTION}}" />
<meta property="og:url" content="https://snapkodex.com{{CANONICAL_PATH}}" />
<meta property="og:site_name" content="{{SILO_SITE_NAME}}" />
```

### 4.2 JSON-LD Structured Data Payloads

1. **Root Homepage (`snapkodex.com/`):** Inject `Organization` + `WebSite` + `FAQPage` schema.
2. **Service Pages (`snapkodex.com/services/*`):** Inject `Service` (linked to `Organization` provider `https://snapkodex.com/#organization`) + `BreadcrumbList` (`SnapKodex > Services > {Service Name}`).
3. **Product Base Pages (`/products/taaweel/` & `/products/homeschooling/`):** Inject `SoftwareApplication` + `BreadcrumbList` + `FAQPage`. Example for `/products/taaweel/`:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "SnapKodex", "item": "https://snapkodex.com/" },
        { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://snapkodex.com/products/" },
        { "@type": "ListItem", "position": 3, "name": "Taaweel", "item": "https://snapkodex.com/products/taaweel/" }
      ]
    },
    {
      "@type": "SoftwareApplication",
      "name": "Taaweel",
      "applicationCategory": "EducationalApplication, ReferenceApplication",
      "operatingSystem": "Web",
      "url": "https://snapkodex.com/products/taaweel/",
      "installUrl": "https://taaweel.snapkodex.com",
      "description": "Computational linguistics and morphological analysis platform for classical Arabic and Quranic research.",
      "creator": {
        "@type": "Organization",
        "name": "Snap Kodex",
        "url": "https://snapkodex.com/"
      }
    }
  ]
}
```

---

## 5. Pre-Blog Rollout Execution Checklist

Complete these steps in sequence before publishing the first Pillar or Cluster blog article:

- [ ] **Step 1: Homepage Products Promotion (`snapkodex.com/`)** — Add the dedicated **Products Portfolio Grid** to the homepage with direct `<a>` links to `/products/`, `/products/taaweel/`, and `/products/homeschooling/`.
- [ ] **Step 2: Deploy `/products/` Hub & Silo Root Landing Pages** — Publish `/products/`, `/products/taaweel/`, and `/products/homeschooling/` using scoped headers/footers and `{{BASE_URL}}` environment tokens.
- [ ] **Step 3: Deploy Core B2B Service Pages (`/services/*`) & `/contact/`** — Stand up the 3 consolidated agency service pages so `/blog/ai/` posts have commercial destinations for upward internal linking.
- [ ] **Step 4: App Subdomain Cutover & `noindex` Guardrails** — Verify `taaweel.snapkodex.com` and `homeschooling.snapkodex.com` (mapped from `homeschooling-b3e57.web.app`) serve the web applications cleanly and return `X-Robots-Tag: noindex` on any non-proxied staging/API routes so all organic search equity consolidates onto `snapkodex.com/products/*`.
- [ ] **Step 5: Generate & Submit Segmented Sitemaps in GSC** — Populate `sitemap-agency.xml`, `sitemap-taaweel.xml`, and `sitemap-homeschooling.xml` with the newly deployed base pages, reference them in `https://snapkodex.com/sitemap_index.xml`, and request indexing in Google Search Console.
