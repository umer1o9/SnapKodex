# SnapKodex Product Knowledge Base

Compiled 2026-11-05 from the actual codebases (not from earlier marketing copy). Use this as the source of truth for product pages. Where the earlier base-pages spec described a product differently (notably Taaweel), **this file wins**.

Sources: `D:\quran_nodejs` (Taaweel 1.0 monorepo, `burhan/` = Taaweel 2.0, `mizan/`), `D:\snap projects\Product-Knowledge-Software` (Snap Projects), `D:\homeschooling` (Homeschooling OS).

Accuracy rules for copy: describe only what the code does; no certifications or claims of religious authority; "assists research, does not issue rulings"; Snap Projects pricing stays as on the existing page.

---

## 1. Taaweel (تأويل), AI research engine for Quranic inquiry

**What it is.** A research platform that turns an open question about the Quran into an auditable, evidence-backed report, instead of a single chatbot answer. Every stage is separate, persisted, resumable and reviewable.

**Two generations in the codebase**

| | Taaweel 1.0 (`apps/web`, `apps/api`, `ajs`) | Taaweel 2.0 (`burhan/`) |
|---|---|---|
| Method | Guided pipeline: Refine → Bot 1 topics and connotations → Bot 2 Arabic synonyms → verse search → shortlist → word relevance → synthesis → Step 6 report and discuss chat | Method-faithful research engine: plan → cartograph → collect → dossier → properties → referent → correspondence → model → adversarial → audit → compose |
| Stack | React/Vite + Fastify + SQLite, optional AJS job queue | Self-contained Node app, own DB, port 3901, read-only corpora |

**User-facing capabilities**

- **Question refinement.** Chat clarifies the question before any compute is spent. Planned: side-by-side Arabic interpretation of the finalized question so users can verify the Arabic pivot of the search.
- **Corpus cartography.** Exhaustive root and string concordance over all 6,236 verses; occurrences clustered into "information systems" (paired, continued, isolated), with distinctive co-text roots per system.
- **Tiered evidence ledger.** Evidence tiers: wording → context → Qur'an-explains-Qur'an → hadith → scholarship. Every claim cites a ledger row; every `[E-n]` in the report resolves to evidence. Per-mufassir positions are triangulated from Tafsir al-Tabari and Ibn Kathir databases (22 positions in the reference run).
- **Lexicon and root studies.** Lane's Lexicon and classical dictionary entries per root; word studies; whole-word matching across tafsir with commentary prose distinguished from Qur'an quotations, headings and editorial notes.
- **Properties, referent trial, correspondence.** Records every property the text gives a term before deciding what it refers to; tries the inherited translation and alternatives against linguistic, contextual, cross-verse, physical and eschatological tests; the verdict is computed in code, not by the model. Comparison with scientific realities is always labelled comparison, never identity.
- **Adversarial audit.** Deterministic hard-case miner plus LLM red team produce an objections ledger; the architecture is audited against 14 usul principles (wording, Qur'an-with-Qur'an, Sunnah, Companions, lugha, siyaq, conditions of ta'wil, creed, restraint on the unseen, multiplicity of scopes, labelling and more). A failed principle revises the element it touches.
- **Epistemic labels.** `mainstream`, `minority_view`, `author_position`, `provisional` carried at schema level.
- **Report.** Answer first, then architecture diagrams (generated deterministically, always valid mermaid), phase-by-phase construction with Arabic passages, scope table, word studies, tafsir, objections with rulings, compliance table, appendices. Exports: Markdown, HTML, DOCX.
- **Ontology explorer (1.0).** Concept graph with human adjudication (approve, reject, remap, merge) and automated QA (no self-loops, cycle checks, subtree constraints, provenance and confidence).
- **Verse explorer, Find Verses, Lexicon page, Exploration mode** (select a word, search across tafsir), **session history, My documents**.
- **Process Agent** runs the whole flow end to end with live NDJSON progress, stop and resume.
- **Admin:** roles, users, sessions, spend caps (default global monthly cap in 2.0), OpenAI vector store and file admin, model routing (OpenAI, DeepSeek, Z.AI GLM, OpenRouter), per-stage model selection.

**Audiences.** Quran researchers and scholars, educators and institutions, students, psychology and medical researchers framing questions, research organizations needing audit trails.

**Honest limits to state on the page.** LLM output is probabilistic and needs expert review; it assists, it does not replace scholarly authority; no external certification claimed.

## 2. Mizan (ميزان), Quranic numerical analysis platform

Separate app in the same family (port 3910). Governing principle: show what was counted, how, what was assumed, and what the result does **not** establish. A numerical pattern is a measurement, not a theological conclusion.

- Immutable corpus snapshot with SHA-256 manifest; read-only import.
- **51 analysis families** registered; 613 legacy catalogue IDs mapped; 33 method IDs implemented across 19 families (counting and frequency, verse lengths, root morphology, positions and intervals, entropy, Zipf, compression, Fibonacci and golden-ratio tests, number theory, abjad totals, seeded Monte Carlo controls). Unimplemented or gated methods are reported as planned or blocked, never silently dropped.
- **Perspectives explorer:** 24 mathematical lenses on any surah or the whole Quran, each an interactive 3D chart (rotate, zoom, camera presets, PNG/SVG/CSV/JSON export, permalinks), with plain-language and KaTeX explanations and a named null model for each. Groups: Shape (terrain, inequality, chronology), Shapes (scoreboard, even-odd circle, shell spiral, double helix, silhouette, verse orbit), Memory and rhythm (autocorrelation, long-range scaling, periodograms, phase space, verse endings), Vocabulary and information (Heaps, Zipf, entropy rate, long-range information, letter Markov chain), Words and surahs (burstiness, keyness, surah space), Numbers (Benford, divisibility heaping).
- **Fatihah workbench** (AN-51): verse, word, letter and abjad tables, repetition, Fibonacci tests, declared pairing hypotheses.
- Permutation controls, multiple-comparison correction (Benjamini-Hochberg), reproducible seeds.

## 3. Homeschooling platform (Dar-al-Hikmah OS), Vue 3 + Firestore + Gemini

**What it is.** A multi-tenant homeschooling operations platform. Each family is an isolated tenant. Parents state a guiding philosophy; AI agents generate a 6-month curriculum and a syllabus of activities; parents plan the week; children run activities in a dedicated player; scoring measures completion, never ranks siblings.

**User-facing capabilities**

- **Family setup.** Family profile with a *main guiding light* (free text: Quran, a tradition, a grandparent, an education system, anything). Guardian profiles (DoB, occupation, mother tongue, education budget, location, likes and dislikes, goals per child or combined). Child profiles (DoB, strengths, weaknesses, comments).
- **Skills.** Parents pick or add skills; a global registry is shared but tracked per child.
- **Curriculum builder.** A goal-based AI agent first interviews the parents about vision and philosophy, then produces a 6-month plan with objectives, content, instruction and assessment, weighted heavily toward the guiding light.
- **Syllabus builder.** Subject by subject, a goal-based agent writes activities from basic to the depth suited to each child, aware of what it has already generated. Long jobs run as background tasks with live progress.
- **Activity types.** Quran reading, Noorani Qaida, story reading, mathematics, computer, AI and robotics, physical activities with real materials, teaching activities. Each type provisions its own features (e.g. reading view with large adjustable text, AI picture, tap-a-word to hear it, Arabic word-by-word or verse-by-verse audio).
- **Parent view vs child view.** Activity player shows parents instructions in their mother-tongue transliteration plus an example walkthrough and scoring; opened logged-out, the same link is the child's view.
- **Weekly activity planner.** Drag and drop activities into day slots per child, group activities for all children, reusable weekly templates, real dated calendar days.
- **Fair scoring.** Completion-based, never sibling-comparative. Co-op modes: shared result, interdependent "Shared Success" (neither child is rewarded if a breakdown or blame-shift occurs), and driving-child scoring (child A is scored on whether child B can answer). Token or point balances ("Rocket Points" in the reference household) via atomic increments.
- **Observations.** Parent notes during activities, bound to the authoring parent.
- **Kids' learning world.** Wikido: picture encyclopedia with tappable hotspots, narration and nested scenes (flagship "Living Things": 6 scenes, 40 discoveries, 3 levels deep). Phonics Playground: drag A-Z blocks, hear sounds, build words, golden speaker reads the row. Explore: live voice conversations with a friendly companion in Exploration or Learning mode, powered by Gemini Live and briefed with the child's progress.
- **AI Guide.** Chat guide for parents; full-system agents with tenant-scoped CRUD, audit trail, previews before destructive batch changes.
- **Family sync and roles.** Invite links, owner/parent/viewer roles, real-time Firestore updates, per-user pages.
- **Platform.** Super admin (enable/disable families, manage users), provider "homeschool service" accounts, subscription admin, LLM config split (platform config vs per-family grounding).
- **Reference household schedule.** Two boys (6 and 7), 8 one-hour blocks 08:30-16:30 Mon-Fri, block 4 is the co-op "Muwajahah" block with the Shared Success lock; parent Ops Hub with payout validators, sprint control, crisis intercom.

**Invariants to state on the page.** Tenant isolation; completion over excellence; AI acts only inside the family's tenant and role; destructive changes previewed.

## 4. Snap Projects, AI workspace for managers (desktop: macOS and Windows)

Existing site copy covers: chat with files, Jira, Confluence, live mockups, diagrams, adaptive responses, history, team management, tasks, notes, web search, image generation, pricing. Keep as is. Additional capabilities found in the codebase (up to release 2.43):

- **Meeting Mode.** A short answer to say aloud at the centre of Focus view, a delivery cue, expandable background, deeper follow-ups with supporting points and dated evidence tiles. Statistics are accepted only when URL, value and date match real search citations.
- **Live Talk** (voice).
- **Commitment ledger with drift detection.** Reads meeting transcripts (Teams `.vtt`, recordings), Slack, Jira, ClickUp; catches verbal commitments that never land anywhere and compares what people say with what the tracker shows.
- **Goals (`/goal`).** A durable objective the assistant keeps pursuing across many turns with checkpoints and a token budget, until it can prove completion.
- **Checks and confirmation gate.** Questions you write once ("does this contract renew automatically?") answered about every document with a probability, pick-one or score; flagged results appear for human review.
- **Skills.** Saved instructions the assistant applies when a request matches; import Claude-style `SKILL.md`.
- **Video generator.** Narrated videos and standalone three.js 3D animations written by the chosen model with a check-and-repair loop; scenes run offline.
- **Accounts and workspaces.** Sign-in, workspace membership, Main computer concept, company settings, Current Status view, `@`-mention scoping, reports library, MCP and agent access, consent and cloud-data deletion.
- **Privacy posture.** Local-first indexing; privacy policy and terms documents exist; installers for macOS and Windows.

## 5. Other portfolio items (existing site)

- **SnapRytr:** AI marketing and business writing SaaS.
- **SLM:** small language model product card on the products page (keep as is).

## 6. Brand and design notes (from the live site)

Dark default with light theme toggle (`sk-theme`). Tokens: cyan `#35d4ea`, purple `#ab54ec`, mint `#46d69a`, coral `#ff9966`, violet `#b38bff`, sky `#5ac8fa`, amber `#ffc857`; ink `#0b0d12`; Space Grotesk (display) and IBM Plex Sans (body); Material Symbols Rounded; pill buttons with the cyan-to-purple gradient; glass cards with 18-24px radius; ambient blurred orbs and grid. Product accents on the site: SnapRytr coral, Snap Projects mint, Taaweel violet, Homeschooling cyan.
