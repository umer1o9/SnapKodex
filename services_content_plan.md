# Services Content Plan

Companion to `snapkodex_content_link_wheel_plan.md` and `product_knowledge.md`. The nine service disciplines on the homepage are consolidated into three commercial wheels. Each wheel is a hub (money page) plus six spokes (one per buyer question), linked in a ring. Insights articles (`/insights/`) feed each wheel and bridge to the product pages.

## Wheels

| Hub | Disciplines covered | Buyer | Primary CTA |
|---|---|---|---|
| `/services/agentic-ai-development/` | Agentic AI Development | CTOs, product leads building agents | Book a technical discovery call |
| `/services/saas-and-enterprise-development/` | SaaS Development, Custom Solution Development, Web Development | Founders, ops and IT leaders | Request scope and estimate |
| `/services/ai-agents-and-automation/` | AI Automation, AI Chatbot, Sales Agent, Customer Service Agent, Ecommerce Bot | Support, sales and ecommerce leaders | Request a live agent demo |

## Spokes (6 per wheel)

- **Agentic AI:** multi-agent orchestration, tool calling and API actions, hybrid RAG, agent memory and knowledge graphs, human-in-the-loop workflows, evaluation and observability.
- **SaaS & enterprise:** multi-tenant architecture, SSO and identity, usage-based billing, ERP and CRM development, high-load queues and pipelines, web application development.
- **Agents & automation:** customer support agents, sales agents, RAG chatbots, ecommerce bots, document extraction automation, RPA and workflow automation.

## Page template

Hero (problem-led headline, CTA, pictogram art) -> overview with a "what to expect" callout -> delivery steps -> deliverables (4 cards) -> production stack chips (hubs) -> ring navigation (previous, hub, next, all topics) -> FAQ with FAQPage schema -> CTA band. Service schema on every page, BreadcrumbList on every page.

## Linking rules

Ring links inside each wheel; hubs link to all six spokes; at most two bridge links between agency wheels where topics overlap (agentic <-> automation, agentic <-> SaaS); every page links to `/contact/`; insights articles link up to one hub and one spoke; product pages are linked from the products directory and homepage, not from service spokes, except the two bridge articles that tell product stories.

## Honesty rules for copy

Describe the work we do and the way we do it, without invented client names, statistics or guarantees. Use ranges and principles instead of made-up numbers. Do not claim certifications.

## Insights plan (10 articles, 2 bridges)

Agentic: supervisor vs hierarchical orchestration; hybrid RAG on PostgreSQL; human-in-the-loop review lanes; idempotent tool calling; evaluating agents. SaaS: multi-tenant models (pool, bridge, silo). Automation: support triage by urgency and mood. Backend: FastAPI vs Node.js for agent backends. Bridges: staged research pipeline over a fixed corpus (Taaweel), and realtime Firestore lessons from the homeschooling platform.
