# Dar-al-Hikmah OS — Feature Summary

A multi-tenant homeschooling operations platform. Each **family** is an isolated tenant with its own children, curriculum, schedule, and content library. Parents set a guiding philosophy; AI agents turn it into a 6-month curriculum, a syllabus of activities, and day-to-day scheduling — while parents retain full control via a drag-drop planner and an activity player used by both parent and child.

Stack: Vue 3 + Vite + Pinia + Vue Router (frontend) · Firebase (Firestore + Cloud Functions gen 2, Hosting, Storage) · Vertex AI / Gemini + OpenAI (LLM & TTS providers).

---

## 1. Accounts & tenancy
- Email/password + Google auth, role-gated route guards (`owner` / `parent` / `viewer`).
- Onboarding wizard creates a family tenant on first signup.
- Strict per-family data isolation enforced by Firestore Security Rules and re-verified in every Cloud Function.
- "Access disabled" screen for families a super admin has disabled.

## 2. Family & member profiles
- Family profile: name, **main guiding light** (free-text educational philosophy), combined-vs-individual goal mode.
- Guardian profiles: DoB, occupation, mother tongue, education budget, income, location, city facilities, likes/dislikes, goals.
- Child profiles: DoB, strengths, weaknesses, comments.
- Skills: pick from a global skill registry or add new ones (mirrored globally), bound and tracked per child.

## 3. AI curriculum & syllabus generation
- **Curriculum agent** — guided chat interview builds a 6-month plan (Objectives / Content / Instruction / Assessment) weighted by the family's guiding light, with per-subject macro goals and grading standards.
- **Syllabus agent (master/slave)** — a master plan fans out one Cloud Tasks worker per subject; each worker generates a complexity-graded activity series (basic → deep), aware of what's already been generated. Live progress board via Firestore-streamed job docs.
- **Content-planning agent** — decides per-activity "material meta": repeatable/frequency, complexity, and individual-vs-shared targeting, consumed by the scheduler and differentiation engine.
- **Anti-repetition** — a usage ledger + prompt guardrails stop the same passages/content being regenerated repeatedly.
- **Per-child performance grounding** — scores + observations are summarized and injected into every generation/agent call so content adapts to each child's history.

## 4. Activity differentiation
- Read-only audit (`auditActivityDifferentiation`) flags "clubbed" activities that should be split per child vs. genuinely shared/co-op ones.
- `differentiateActivities` generates per-child content variants (`contentByChild`), with level inferred from each child's strengths/weaknesses/scores.
- Differentiation is generalized across every activity type (not just a single pilot type), driven authoritatively by the content plan's `targetingMode` when present.
- Child share-links and the scheduler both resolve to the correct per-child variant automatically.

## 5. Weekly planning
- Drag-and-drop **Activity Planner**: activity pool grouped by subject/complexity, search + type/child filters, drop into day/time slots from a chosen date forward.
- Supports both per-child and group (all-children) slot assignment; reusable weekly schedule templates.
- **Auto-schedule agent** — "✨ Schedule via agent" fills the week automatically using guardian availability windows, repeats repeatable activities the right number of times per week, and places separate blocks per child for individually-paced work.

## 6. Activity Player
- **Parent view** — instructions (with mother-tongue transliteration/native text), example walkthrough, scoring (including co-op / shared-success / "driving child" rules), observation notes tied to the logged-in parent, and a floating AI **Guide** chat.
- **Child view** — an unauthenticated, link-scoped player (large fonts, tap-a-word audio, zoomable text, AI-generated images) opened via a per-activity, per-child share link that expires and auto-scopes content to that child.
- Per-activity-type renderers: Quran, Noorani Qaida, story reading, dialogue/conversation, mathematics, computer, AI/robotics, physical, teaching.
- Scoring is always completion-based — never a comparison between siblings.

## 7. Quran & Noorani Qaida content library
- Full-Quran import into a shared, superadmin-managed `quran` collection (read by any signed-in user).
- Full Noorani Qaida corpus (449 items / 12 lessons covering letters, joined letters, harakat, tanween, madd, jazm, tashdeed, etc.) with a deterministic spell-out engine.
- Activities link to this shared library (`materialRef`) instead of embedding a one-time snapshot, so as the platform records real audio over time, existing activities silently upgrade to the curated recording — no regeneration needed.
- Word-by-word English/Urdu glosses ("Show meaning" toggle) and an Indo-Pak (Nastaliq/Scheherazade) Arabic font.

## 8. Text-to-speech
- Server-side TTS via Gemini and OpenAI, cached in Cloud Storage (`tts-cache/{hash}.wav`) so repeat playback is free.
- Pure-Arabic "jor-tor" (joining) spell-out cues so every provider/model reads the full word correctly.
- Per-line/section audio for parent tips, tap-a-word audio in the child player, chat-bubble dialogue voices with a per-speaker voice palette.
- Browser speech-synthesis fallback if the server TTS call fails, scoped to that single tap (no blacklisting).
- Self-pacing background worker voices the Qaida corpus within free-tier rate limits, auto-resuming across days without manual restarts.

## 9. AI agent runtime
- Shared tool layer over Firestore (query/get/create/update/delete/batch), tenant-scoped and audited, with preview-before-apply for destructive/batch operations.
- Agent DB index (`_agent_index`) gives every agent a cheap, always-fresh map of where data lives, avoiding blind scans.
- ReAct-style iterative query planning plus a server-side context store (chunked fetch + `readContext` paging) for handling large result sets without stuffing everything into a prompt.
- Configurable per-agent LLM provider/model (Gemini or OpenAI) with an allowlist controlling which agents expose the provider toggle to admins.
- **Guide agent** — read-only chat that helps a user understand and navigate their own family's data, available both generally and embedded in the Activity Player.

## 10. Super Admin (platform)
- Enable/disable families, manage family users, recursively delete a family and all its data.
- Platform-wide LLM configuration editor (superadmin-only), plus a model catalog with preview/test-all-models tooling.
- **Cost metering** — per-call cost events rolled up by family and platform-wide, with a Costs dashboard.
- **Quota management** — daily request-per-day budgets per model, family/platform allocation, and a Usage dashboard (daily TTS counters, alerts, 14-day trend, job status, monthly cost rollup).
- Knowledge brief and skill-mapping tools that keep children↔skills↔activities links consistent and summarize activity history.
- Content backfill / stop / regenerate controls (per-type or full) for syllabus and library content generation jobs.

## 11. Testing & ops
- Unit tests (pure logic), Firestore Security Rules tests (cross-tenant isolation, role gating), functions/emulator integration tests, and Playwright E2E covering auth, planning, and the dual parent/child player views.
- Seeded demo-data generator for a realistic test family baseline.
