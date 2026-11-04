// Insights articles. Authored by "Snap Kodex Engineering". No invented statistics, clients or benchmarks.
const A = "/services/agentic-ai-development";
const SA = "/services/saas-and-enterprise-development";
const AU = "/services/ai-agents-and-automation";
const DATE = "2026-11-05";

export const articles = [
  {
    slug: "supervisor-vs-hierarchical-agent-orchestration",
    title: "Supervisor vs hierarchical agent orchestration: how to choose",
    dek: "Three orchestration patterns, what each costs you, and a simple rule for picking the smallest one that works.",
    cat: "Agentic AI", wheel: "agentic", icon: "network", date: DATE, read: 7,
    takeaways: [
      "Start with one agent and good tools; add agents only when roles, permissions or context size demand it.",
      "A supervisor suits a handful of specialists; a hierarchy suits large tasks that decompose in layers.",
      "Typed shared state and step budgets matter more than the pattern you pick.",
    ],
    body: `
<p>Multi-agent systems are popular because splitting a big prompt into specialists feels like good engineering. It can be. It can also multiply cost, latency and failure modes. The pattern you choose should follow the shape of the work.</p>
<h2>The three patterns</h2>
<h3>1. Sequential handoff</h3>
<p>Agent A finishes and passes its result to agent B. It is easy to reason about and trace, and it fits pipelines such as extract, validate, draft. Its weakness is rigidity: if step three needs something from step one, the chain has to carry it.</p>
<h3>2. Supervisor and specialists</h3>
<p>One agent receives the request, decides which specialist to call, reads the result and decides what happens next. Specialists have narrow prompts and tools. This works well for a handful of distinct capabilities, such as a billing specialist, a technical specialist and a returns specialist behind one support entry point.</p>
<h3>3. Hierarchy</h3>
<p>Supervisors manage supervisors. A top-level planner splits a large goal into workstreams, each run by its own supervisor with specialists beneath it. It scales to big tasks like research reports or multi-system migrations, at the price of more tokens, more latency and more places to fail.</p>
<h2>A rule for choosing</h2>
<p>Pick the smallest topology that meets the quality bar on your evaluation set. In practice that usually means:</p>
<ul>
<li><strong>Single agent with tools</strong> when the task fits in one context and one set of permissions.</li>
<li><strong>Sequential handoff</strong> when the work is a fixed pipeline.</li>
<li><strong>Supervisor</strong> when requests vary and you have distinct capabilities to route among.</li>
<li><strong>Hierarchy</strong> only when a supervisor's context overflows or the work splits into genuinely independent workstreams.</li>
</ul>
<h2>What matters more than the pattern</h2>
<p><strong>Typed shared state.</strong> Agents that pass free text lose detail at every handoff. Agents that read and write a typed state object, with fields such as customer, order, plan and open questions, stay consistent and are easy to log.</p>
<p><strong>Budgets.</strong> Every run needs limits on steps, tokens and wall-clock time. Without them a supervisor can bounce a request between specialists indefinitely.</p>
<p><strong>Traces.</strong> Record every message, tool call and routing decision. When a run goes wrong you should be able to replay it and see which decision was the first bad one.</p>
<p><strong>Deterministic routing where possible.</strong> If a rule can decide, such as the ticket's product field, use the rule. Reserve the model for decisions that need judgement.</p>
<h2>A common failure</h2>
<p>A team splits one agent into six specialists because the original prompt was long. Quality drops, because routing errors now compound, and cost rises because every request pays for a supervisor call. The better fix was usually to shorten the prompt, add retrieval for reference material and give the single agent clearer tools.</p>
<h2>Where to go next</h2>
<p>If you are planning an agent system, our <a href="${A}/multi-agent-orchestration/">multi-agent orchestration</a> page describes how we design and test these architectures, and the <a href="${A}/">agentic AI development</a> overview covers the rest of the stack.</p>`,
    cta: ["Book a technical discovery call", "contact"],
  },
  {
    slug: "hybrid-rag-on-postgresql-pgvector",
    title: "Hybrid RAG on PostgreSQL: vectors, keywords and filters together",
    dek: "Why vector search alone fails on real enterprise data, and how to combine pgvector, full-text search and metadata in one database.",
    cat: "Agentic AI", wheel: "agentic", icon: "search", date: DATE, read: 8,
    takeaways: [
      "Most hallucination in enterprise assistants is a retrieval failure, so measure retrieval separately from generation.",
      "Combine vector similarity, keyword search and structured filters, then re-rank.",
      "Enforce permissions at retrieval time, not only in the prompt.",
    ],
    body: `
<p>Retrieval-augmented generation looks simple in a demo: embed documents, find the nearest vectors, pass them to the model. On real enterprise data it breaks in predictable ways. Hybrid retrieval is how you fix most of them.</p>
<h2>Where vector search alone fails</h2>
<ul>
<li><strong>Exact terms.</strong> Part numbers, error codes, people's names and acronyms embed poorly. A query for "ERR-4021" may return text about errors in general.</li>
<li><strong>Freshness and scope.</strong> The nearest vector may be from last year's policy, or from a department the user may not see.</li>
<li><strong>Negation and constraints.</strong> "Contracts expiring this quarter" is a filter, not a similarity question.</li>
</ul>
<h2>The hybrid recipe</h2>
<h3>1. Ingest with metadata</h3>
<p>Parse documents, split them into chunks that respect structure (headings, tables, clauses), and store each chunk with metadata: source, date, owner, access group, document type. Metadata is what makes filters possible later.</p>
<h3>2. Retrieve three ways</h3>
<p>Run a vector similarity query, a keyword query using PostgreSQL full-text search, and apply structured filters to both. In PostgreSQL this can live in one database: a pgvector column for embeddings, a tsvector column for text, and ordinary columns for metadata.</p>
<h3>3. Merge and re-rank</h3>
<p>Combine the candidate lists, for example with reciprocal rank fusion, then optionally re-rank the top results with a cross-encoder or a model call. Pass a small set of the best passages to the generator.</p>
<h3>4. Answer with sources</h3>
<p>Ask the model to answer only from the passages and to cite them. If nothing relevant was retrieved, the correct behaviour is to say so.</p>
<h2>Permissions belong in retrieval</h2>
<p>Telling the model "do not reveal confidential documents" is not access control. Filter by the user's access groups in the retrieval query itself, so restricted chunks never reach the prompt.</p>
<h2>Adding a graph when relationships matter</h2>
<p>Some questions follow links: who owns this service, which contracts depend on this supplier. A lightweight graph in the same database, with entities and relationship tables, lets the system traverse instead of hoping the right chunks sit next to each other in vector space.</p>
<h2>Measure retrieval on its own</h2>
<p>Build a set of real questions with the passages that should answer them. Track recall at k and precision of the retrieved set before you look at the final answer. If retrieval is wrong, no prompt will rescue it.</p>
<h2>Do you need a separate vector database?</h2>
<p>Often not. PostgreSQL with pgvector handles many workloads and keeps data, permissions and metadata together, which simplifies operations. A dedicated vector store becomes attractive at very large scale or tight latency targets. Decide from measurements on your data, not from fashion.</p>
<p>We cover the engineering details on our <a href="${A}/hybrid-rag-pgvector/">hybrid RAG</a> page, and the finished systems usually sit behind a <a href="${AU}/rag-chatbots/">grounded chatbot</a> or an agent.</p>`,
    cta: ["Talk to an engineer about retrieval", "contact"],
  },
  {
    slug: "human-in-the-loop-review-lanes-for-ai-agents",
    title: "Designing human-in-the-loop review lanes for AI agents",
    dek: "Autonomy is a dial, not a switch. How to decide what an agent may do alone, what needs a person, and how to build review that is fast.",
    cat: "Agentic AI", wheel: "agentic", icon: "users", date: DATE, read: 6,
    takeaways: [
      "Define explicit triggers for human review: confidence, value, novelty and irreversibility.",
      "Review should be a one-screen decision with sources, not a second investigation.",
      "Track review rate and override rate; both should fall as trust is earned.",
    ],
    body: `
<p>The question for most business agents is not "automate or not". It is which decisions the agent makes alone, which it proposes for approval, and which it never touches. A well-designed review lane makes the second category fast and safe.</p>
<h2>Four triggers worth defining</h2>
<ol>
<li><strong>Low confidence.</strong> The model's own signal, or a separate classifier, says it is unsure.</li>
<li><strong>High value.</strong> Refunds above an amount, contracts above a size, discounts above a limit.</li>
<li><strong>Novelty.</strong> A first-time customer, an unseen request type, or data that fails validation.</li>
<li><strong>Irreversibility.</strong> Deleting data, sending external communications, moving money.</li>
</ol>
<p>Write these as rules in code, not as instructions in a prompt. A rule can be tested and audited; a prompt can be talked around.</p>
<h2>Make the review a single screen</h2>
<p>A reviewer should see the request, the agent's proposed action, the sources it used and the reasoning, then choose approve, edit or reject. If reviewers have to reopen five systems to understand the case, review becomes slower than doing the work and people will rubber-stamp or avoid it.</p>
<h2>Close the loop</h2>
<p>Every decision is information. Approvals show where the agent is reliable; edits show how it is wrong; rejections show what to forbid. Store them with the case, feed them into your evaluation set, and use them to adjust thresholds.</p>
<h2>Queues need service levels</h2>
<p>A review queue that silently ages is a hidden outage. Track queue age, assign owners, define what happens when no reviewer is available and decide in advance whether the default is to wait, to escalate or to fall back to the manual process.</p>
<h2>Two numbers to watch</h2>
<ul>
<li><strong>Review rate:</strong> the share of cases sent to a person. It should fall as the system improves.</li>
<li><strong>Override rate:</strong> the share of reviewed cases where the person changed the agent's proposal. A rising override rate is an early warning of drift.</li>
</ul>
<p>See how we apply this on the <a href="${A}/human-in-the-loop-workflows/">human-in-the-loop workflows</a> page, or in <a href="${AU}/customer-support-agents/">customer support agents</a> where review lanes appear first.</p>`,
    cta: ["Plan your review lanes with us", "contact"],
  },
  {
    slug: "idempotent-tool-calling-for-ai-agents",
    title: "Idempotent tool calling: letting agents act without duplicating work",
    dek: "Models retry, repeat and misread. Here is how to make state-changing tool calls safe when they do.",
    cat: "Agentic AI", wheel: "agentic", icon: "code", date: DATE, read: 6,
    takeaways: [
      "Treat every tool as an API with strict schemas, validation and least-privilege credentials.",
      "Give state-changing tools idempotency keys so a repeated call is harmless.",
      "Start with read-only tools and add writes one at a time.",
    ],
    body: `
<p>When an agent can call tools, mistakes stop being words and start being actions: a second order, a duplicate email, a deleted record. The defence is ordinary software engineering applied carefully to the tool layer.</p>
<h2>Why duplicates happen</h2>
<p>An agent may call the same tool twice because the first call timed out and it did not see a result, because the model lost track of its own history, or because a framework retried a failed step. Network failures and user retries add more paths to the same outcome.</p>
<h2>Idempotency keys</h2>
<p>An idempotent operation produces the same result however many times it is applied. For a state-changing tool such as "create order" or "send invoice", accept a client-generated idempotency key. The server records the key with the result; a repeat call with the same key returns the stored result instead of acting again. Derive the key from the task and the step, not from a random value created inside the model call.</p>
<h2>Schema-first tools</h2>
<ul>
<li>Define inputs and outputs with strict types and enumerations, and reject anything else before executing.</li>
<li>Keep tools narrow: "refund_order(order_id, amount, reason)" rather than "run_sql".</li>
<li>Return structured errors that tell the model what to fix, such as "amount exceeds order total".</li>
</ul>
<h2>Least privilege</h2>
<p>An agent should act with the permissions of the user it serves and the task it is doing, not with a broad service account. Scope credentials per tool, log which identity made each call and make high-impact tools require approval.</p>
<h2>Confirmation for the irreversible</h2>
<p>For actions that cannot be undone, such as external messages or deletions, require explicit confirmation from the user or a reviewer. The agent drafts; a person approves.</p>
<h2>Test tools without a model</h2>
<p>Because tools are ordinary code, test them like code: unit tests for validation, tests for repeated calls with the same key, and tests for permission failures. Then test the model's tool selection separately on a set of representative requests.</p>
<h2>Read first, write later</h2>
<p>Many agents deliver most of their value with read-only access: finding, summarising and drafting. Add write tools deliberately, one at a time, with monitoring, once the read-only version has earned trust.</p>
<p>Details of our approach are on the <a href="${A}/tool-calling-and-api-actions/">tool calling and API actions</a> page.</p>`,
    cta: ["Discuss your agent's tool design", "contact"],
  },
  {
    slug: "multi-tenant-saas-pool-bridge-silo",
    title: "Multi-tenant SaaS: pool, bridge or silo?",
    dek: "The tenancy model shapes cost, isolation and operations for years. A practical guide to choosing it and to proving isolation works.",
    cat: "SaaS architecture", wheel: "saas", icon: "users", date: DATE, read: 8,
    takeaways: [
      "Pooled tenancy is cheapest and demands database-level isolation; siloed is simpler to isolate and costlier to run.",
      "Choose from data sensitivity, customer size and budget, not from habit.",
      "Write tests that deliberately try to read another tenant's data and run them on every build.",
    ],
    body: `
<p>If you build software that many customers use, you will choose a tenancy model whether you intend to or not. Making the choice on purpose is cheaper than discovering it during a security review.</p>
<h2>The three models</h2>
<h3>Pool</h3>
<p>All tenants share the same tables, separated by a tenant identifier on every row. It is the cheapest to run and the easiest to onboard, because a new tenant is a new row rather than new infrastructure. The risk is that one missing filter leaks data between customers, and that a heavy tenant can slow the others.</p>
<h3>Silo</h3>
<p>Each tenant gets its own database, or its own full stack. Isolation is simple to explain and to audit, and tenant-specific backup, residency and customisation are easy. The cost is operational: many databases to migrate, monitor and pay for.</p>
<h3>Bridge</h3>
<p>A mix. Small tenants share a pool; large or regulated tenants are promoted to dedicated resources. It is a common destination for growing products.</p>
<h2>How to choose</h2>
<ul>
<li><strong>Data sensitivity and regulation.</strong> Health, finance and public-sector customers often require stronger isolation or specific regions.</li>
<li><strong>Customer size and count.</strong> Thousands of small customers favour pooling; a few large ones may justify silos.</li>
<li><strong>Customisation.</strong> Heavy per-tenant schema changes are painful in a pool.</li>
<li><strong>Team and budget.</strong> A small team operating hundreds of databases will struggle.</li>
</ul>
<h2>Enforce isolation in layers</h2>
<ol>
<li><strong>Carry tenant identity from login to the query.</strong> The tenant is part of the authenticated context, not a parameter the client supplies.</li>
<li><strong>Enforce in the database.</strong> Row-level security policies mean a forgotten filter in application code cannot leak data.</li>
<li><strong>Constrain noisy neighbours.</strong> Per-tenant rate limits, quotas and queue isolation protect everyone from one heavy user.</li>
<li><strong>Test the boundary.</strong> Write automated tests that authenticate as one tenant and try to read, write and enumerate another's data. Run them in CI.</li>
</ol>
<h2>Plan the promotion path</h2>
<p>Even in a pooled design, make it possible to move one tenant to dedicated storage later. Avoid cross-tenant joins, keep identifiers globally unique and keep tenant data exportable. That turns a future enterprise requirement into a project rather than a rewrite.</p>
<h2>Offboarding</h2>
<p>Decide at the start how a tenant's data is exported and deleted. It is much easier to design in than to retrofit when your first customer asks to leave.</p>
<p>See our <a href="${SA}/multi-tenant-saas-architecture/">multi-tenant architecture</a> page for how we approach it, and <a href="${SA}/sso-and-identity/">SSO and identity</a> for the enterprise features that usually follow.</p>`,
    cta: ["Get an architecture review", "contact"],
  },
  {
    slug: "ai-customer-support-triage-urgency-and-mood",
    title: "AI customer support triage: routing by urgency and mood",
    dek: "How to classify incoming requests, honour service levels, resolve the routine ones and hand over the hard ones with context.",
    cat: "Automation", wheel: "automation", icon: "headset", date: DATE, read: 7,
    takeaways: [
      "Classify intent, urgency and sentiment separately; they drive different decisions.",
      "Autopilot is earned: start with drafts that agents approve, then automate proven categories.",
      "A good handover includes a summary, history, sources and a suggested reply.",
    ],
    body: `
<p>Support queues mix simple questions, urgent outages and frustrated customers. Treating them identically wastes the time of your best people. AI triage sorts the queue so each request meets the right resolver at the right speed.</p>
<h2>Three signals, three decisions</h2>
<ul>
<li><strong>Intent</strong> decides who or what should handle it: billing, technical, returns, account access.</li>
<li><strong>Urgency</strong> decides how fast: an outage for a paying plan outranks a feature question. Combine the model's reading with hard rules such as plan tier and SLA.</li>
<li><strong>Sentiment</strong> decides how carefully: a frustrated customer may need an experienced person and a different tone, even when the issue is simple.</li>
</ul>
<h2>Resolve what is routine</h2>
<p>For well-understood intents, such as password resets, order status and policy questions, the agent can answer directly from approved content and act in your helpdesk: update the ticket, look up the order, trigger the reset. Answers should be grounded in your knowledge base, with sources, and the agent should say when it does not know.</p>
<h2>Hand over with context</h2>
<p>When a human takes over, they should start ahead, not from zero. The handover includes a short summary of the issue, the customer's relevant history, the sources the agent consulted, what it already tried and a suggested reply. Time saved here often exceeds time saved by automation of the easy cases.</p>
<h2>Earn autopilot</h2>
<ol>
<li><strong>Shadow mode.</strong> The agent classifies and drafts; nothing is sent. You measure agreement with human decisions.</li>
<li><strong>Assisted mode.</strong> Agents see drafts and approve or edit with one click.</li>
<li><strong>Autopilot by category.</strong> Categories with consistently high approval rates are automated, with sampling and review continuing.</li>
</ol>
<h2>Guardrails</h2>
<ul>
<li>Tone and policy rules that support leads can edit.</li>
<li>Limits on refunds, credits and promises the agent may make.</li>
<li>Immediate escalation on signals such as legal threats, safety issues or repeated contact about the same problem.</li>
</ul>
<h2>How to know it works</h2>
<p>Track resolution rate for automated categories, handover rate, response and resolution time compared with your baseline, reopen rate and customer satisfaction. Read a sample of conversations every week; numbers hide tone problems.</p>
<p>Read more on <a href="${AU}/customer-support-agents/">customer support agents</a> or see the full <a href="${AU}/">AI agents and automation</a> overview.</p>`,
    cta: ["Request a live agent demo", "contact"],
  },
  {
    slug: "staged-research-pipeline-over-a-fixed-corpus",
    title: "Building a staged research pipeline over a fixed text corpus",
    dek: "What we learned engineering Taaweel: why research questions need stages, an evidence ledger and a model that argues against itself.",
    cat: "Case study", wheel: "agentic", icon: "book", date: DATE, read: 9,
    takeaways: [
      "A pipeline of saved, inspectable stages beats a single prompt for research-grade work.",
      "Count and cluster with code; use the model for interpretation, and compute verdicts in code.",
      "Cite everything to an evidence ledger and keep objections visible.",
    ],
    body: `
<p>Taaweel is our research engine for Quranic inquiry. The product is described on its <a href="/products/taaweel/">product page</a>; this article is about the engineering lessons, which apply to any research system built on a fixed body of text, such as case law, standards or technical documentation.</p>
<h2>Why a single prompt is not enough</h2>
<p>Ask a general model a deep question about a text and you receive a fluent answer you cannot audit. You do not know what it counted, which passages it saw or which readings it dropped. For research, the path to the answer is part of the answer.</p>
<h2>Stage the work</h2>
<p>We split the engine into stages that mirror how a careful researcher works: plan, map the corpus, collect evidence, build a model of the answer, attack it, revise it and write it up. Each stage persists its output, its jobs and its cost. A run can be stopped and resumed, and one stage can be rerun with different settings without redoing the rest.</p>
<h2>Use code for counting and the model for judgement</h2>
<p>Every occurrence of a root across the corpus is found by a deterministic concordance over a read-only database. Clustering of those occurrences into patterns of use is computed, and the distinguishing vocabulary of each cluster is ranked statistically. The model is then asked to interpret what the numbers show, rather than to produce the numbers.</p>
<h2>Compute the verdict</h2>
<p>When competing readings are tested, a model makes one judgement per test, but the final accept or reject decision is computed in code from the results. A single failed test, or survival only by an interpretive rescue, rejects a reading. This keeps the decision rule explicit and reviewable, and stops a persuasive paragraph from overriding a failed test.</p>
<h2>An evidence ledger</h2>
<p>All evidence goes into a ledger with a tier, a source and a locator. The final report cites ledger rows, and every citation must resolve to a row; a report that cites something not in the ledger fails validation. Readers can follow any claim back to its evidence.</p>
<h2>Make the system argue against itself</h2>
<p>A dedicated stage mines hard cases, the passages most likely to resist the proposed reading, and a red team writes objections into a ledger. Each objection is ruled on, answered, sustained or carried forward, and the report shows the rulings. The result is more honest, and more useful to an expert, than a confident single answer.</p>
<h2>Label certainty</h2>
<p>Claims carry labels such as mainstream, minority view, author position or provisional, enforced in the data schema rather than left to prose. Readers can see at a glance how much weight a statement bears.</p>
<h2>Limits we state plainly</h2>
<p>Language models are probabilistic; runs on the same question can differ; and the tool assists scholarly work without replacing scholars. Stating this in the product, not only in a footnote, is part of building trust.</p>
<h2>What carries over to your domain</h2>
<ul>
<li>Persist each stage; make runs resumable and costs visible.</li>
<li>Keep sources read-only and cite to a ledger.</li>
<li>Count with code, interpret with models, decide with explicit rules.</li>
<li>Build the adversary into the pipeline.</li>
</ul>
<p>If you have a corpus and questions that need audit trails, our <a href="${A}/">agentic AI development</a> team builds systems like this.</p>`,
    cta: ["Discuss a research system", "contact"],
    bridge: { href: "/products/taaweel/", label: "See the Taaweel product" },
  },
  {
    slug: "realtime-firestore-lessons-from-a-homeschooling-platform",
    title: "Realtime Firestore, tenant isolation and long AI jobs: lessons from a homeschooling platform",
    dek: "Engineering notes from building a multi-tenant family platform on Vue, Firestore and Cloud Functions with AI agents.",
    cat: "Case study", wheel: "saas", icon: "sun", date: DATE, read: 8,
    takeaways: [
      "Treat each family as a tenant and enforce isolation in database rules and again in server code.",
      "Run long AI generation as background jobs with progress documents the UI subscribes to.",
      "Keep platform-wide configuration separate from per-tenant data, and preview destructive AI changes.",
    ],
    body: `
<p>Our homeschooling platform, described on its <a href="/products/homeschooling/">product page</a>, is a multi-tenant system where every family is an isolated workspace and AI agents build curricula, syllabi and schedules. These are the engineering decisions that mattered most.</p>
<h2>Tenant isolation, twice</h2>
<p>Each family's data lives under its own path in Firestore. Security rules enforce who may read and write it, based on the signed-in user's role in that family. Server functions re-verify the family and role on every privileged action and never trust a family identifier supplied only by the client. Two independent layers mean a mistake in one does not expose data.</p>
<h2>Realtime by default</h2>
<p>Parents planning a week together should see each other's changes immediately. Firestore listeners keep the interface in sync, and state stores wrap the listeners so components stay thin. Counters such as point balances change through atomic increments, so simultaneous updates from two devices cannot lose one another.</p>
<h2>Long AI work is a job, not a request</h2>
<p>Generating a six-month syllabus takes too long for a single HTTP request. The server enqueues a background task and writes progress to a document; the interface subscribes to that document and shows subjects filling in as they complete. If the user closes the tab, the work continues, and finished subjects are kept if a run is interrupted.</p>
<h2>Platform config versus tenant data</h2>
<p>Model choices, system instructions and temperatures are platform configuration, editable only by administrators. A family's children, scores and schedule are tenant data, injected into a request for that family only and never mixed. Keeping these apart makes it possible to change prompts without touching family data, and to prove that one family's data never reaches another's prompt.</p>
<h2>Agents with safe write access</h2>
<p>Agents can read and change family data, so their actions are bounded by the caller's family and role, logged to an audit trail and, for destructive batch changes, shown as a preview that a parent must approve. The agent proposes; the parent decides.</p>
<h2>A schema that serves the agents</h2>
<p>Because agents query the database, we keep an index document describing which collections hold which kinds of data. An agent can fetch large sets in small chunks, following a plan, rather than loading everything into context. Designing the index alongside the schema keeps the two in step.</p>
<h2>Child-facing views without sign-in</h2>
<p>The same activity link serves two audiences. Signed in, a parent sees instructions, scoring and notes; signed out, the link shows only the activity. The difference is enforced by what the client is allowed to fetch, not just by what the page chooses to show.</p>
<h2>Takeaways</h2>
<ul>
<li>Design tenancy first; enforce it in the database and again in functions.</li>
<li>Model long AI tasks as resumable jobs with observable progress.</li>
<li>Separate platform configuration from tenant data.</li>
<li>Give agents narrow permissions, logs and previews.</li>
</ul>
<p>We build platforms like this for clients; see <a href="${SA}/multi-tenant-saas-architecture/">multi-tenant architecture</a> and <a href="${A}/">agentic AI development</a>.</p>`,
    cta: ["Plan your platform with us", "contact"],
    bridge: { href: "/products/homeschooling/", label: "See the Homeschooling platform" },
  },
];
