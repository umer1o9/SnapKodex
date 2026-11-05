// Shared header (mega menu + mobile drawer) and footer for every page.
// One source of truth: lib.mjs re-exports these, patch-site.mjs injects the same markup into the hand-written pages,
// and gen.mjs writes functions/site-chrome.json so the Cloud Function blog articles use it too.
// Product pages use the same component with a silo-scoped menu (no cross-product links).
import { icon, esc, U, LIVE, BASE, SVG_DEFS } from "./lib.mjs";
import { wheels } from "./content-agency.mjs";
import { articles } from "./content-insights.mjs";

const ext = (h) => (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : "");
const chev = `<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const arrow = `<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false"><path d="M2.5 6h7M6.5 3l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const toggleBtn = `<button type="button" class="nav__theme-toggle" data-theme-toggle aria-pressed="false" aria-label="Switch to light theme"><span class="material-symbols-rounded" aria-hidden="true">light_mode</span></button>`;
const burger = `<button class="mnav__burger" type="button" aria-expanded="false" aria-controls="mdrawer" aria-label="Open menu"><span></span><span></span><span></span></button>`;

// ---------- menu copy ----------
// Colours carry meaning: each service area and product keeps the tone of its own pages.
const WHEEL_TONE = { agentic: "violet", saas: "sky", automation: "coral" };
const WHEEL_BLURB = { agentic: "Agents that plan, act and check", saas: "Platforms built to grow with you", automation: "Take repetitive work off your team" };
const WHEEL_TITLE = { agentic: "Agentic AI", saas: "SaaS & enterprise", automation: "Agents & automation" };
const SPOKE = {
  "multi-agent-orchestration": ["Agents that work as a team", "network"],
  "tool-calling-and-api-actions": ["Let agents use your systems safely", "code"],
  "hybrid-rag-pgvector": ["Answers grounded in your data", "search"],
  "agent-memory-knowledge-graphs": ["Context that carries over", "brain"],
  "human-in-the-loop-workflows": ["People approve what matters", "users"],
  "agent-evaluation-and-observability": ["Measure quality, trace every run", "bars"],
  "multi-tenant-saas-architecture": ["One platform, many customers", "blocks"],
  "sso-and-identity": ["Single sign-on, SCIM and roles", "lock"],
  "usage-based-billing": ["Seats, usage, tiers and credits", "coin"],
  "erp-crm-development": ["Built around your process", "layers"],
  "high-load-queues-and-pipelines": ["Stay responsive under load", "server"],
  "web-application-development": ["Fast, accessible web apps", "globe"],
  "customer-support-agents": ["Answer, act and escalate", "headset"],
  "sales-agents": ["Qualify leads and book meetings", "target"],
  "rag-chatbots": ["Chat that cites its sources", "chat"],
  "ecommerce-bots": ["Products, orders and returns", "cart"],
  "document-extraction-automation": ["Paperwork into clean records", "doc"],
  "rpa-and-workflow-automation": ["Connect tools, add judgement", "tasks"],
};
const TAAWEEL = [
  ["research-pipeline", "Research pipeline", "Plan, collect, audit, compose", "route"],
  ["evidence-and-citations", "Evidence & citations", "Every citation resolves to a source", "layers"],
  ["root-and-word-studies", "Root & word studies", "Word use across the whole corpus", "search"],
  ["adversarial-audit", "Adversarial audit", "A red team tests each conclusion", "shield"],
  ["ontology-explorer", "Ontology explorer", "A concept graph people adjudicate", "graph"],
  ["mizan-numerical-analysis", "Mizan numerical analysis", "24 perspectives, limits stated", "scale"],
];
const HOME = [
  ["guiding-light-curriculum", "Guiding-light curriculum", "A plan built around your values", "sun"],
  ["ai-syllabus-builder", "AI syllabus builder", "Activities written for each child", "sparkle"],
  ["weekly-planner", "Weekly planner", "Drag activities into the week", "calendar"],
  ["activity-player", "Activity player", "Parent guidance, child focus view", "play"],
  ["fair-scoring-and-observations", "Fair scoring & observations", "Rewards finishing, never ranking", "trophy"],
  ["kids-learning-world", "Kids' learning world", "Encyclopedia, phonics and voice", "globe"],
];
const INSIGHT = {
  "supervisor-vs-hierarchical-agent-orchestration": ["Supervisor vs hierarchical agents", "network", "violet"],
  "hybrid-rag-on-postgresql-pgvector": ["Hybrid RAG on PostgreSQL", "search", "violet"],
  "human-in-the-loop-review-lanes-for-ai-agents": ["Human review lanes for agents", "users", "violet"],
  "idempotent-tool-calling-for-ai-agents": ["Idempotent tool calling", "code", "violet"],
  "multi-tenant-saas-pool-bridge-silo": ["Multi-tenant: pool, bridge or silo?", "blocks", "sky"],
  "ai-customer-support-triage-urgency-and-mood": ["Support triage by urgency and mood", "headset", "coral"],
  "staged-research-pipeline-over-a-fixed-corpus": ["A staged research pipeline", "route", "amber"],
  "realtime-firestore-lessons-from-a-homeschooling-platform": ["Realtime Firestore lessons", "wave", "amber"],
};

const lk = (h, t, d, i, tone, attrs = "") => ({ h, t, d, i, tone, attrs });

// ---------- global menu model ----------
export function globalMenu() {
  const items = [];
  items.push({
    key: "services", label: "Services", href: U.services(), kind: "mega", icon: "layers", tone: "violet",
    columns: wheels.map((w) => [{
      head: { href: `${w.base}/`, title: WHEEL_TITLE[w.key] || w.hub.nav, icon: w.hub.icon, desc: WHEEL_BLURB[w.key] },
      tone: WHEEL_TONE[w.key],
      links: w.spokes.map((s) => lk(`${w.base}/${s.slug}/`, s.nav, SPOKE[s.slug]?.[0], SPOKE[s.slug]?.[1] || s.icon, WHEEL_TONE[w.key])),
    }]),
    side: { tone: "cyan", icon: "chat", title: "Not sure where to start?", text: "Tell us what you are building. An engineer will reply with questions and a realistic first step.", cta: [U.contact(), "Say hello"], more: [U.services(), "See all services"] },
  });
  items.push({
    key: "products", label: "Products", href: "/products/", kind: "mega", icon: "cube", tone: "amber",
    columns: [
      [{ head: { href: `${BASE.taaweel}/`, title: "Taaweel", icon: "book", desc: "AI engine for Quranic research" }, tone: "violet", links: TAAWEEL.map(([s, t, d, i]) => lk(`${BASE.taaweel}/${s}/`, t, d, i, "violet")) }],
      [{ head: { href: `${BASE.home}/`, title: "Homeschooling", icon: "sun", desc: "Curriculum and planner for families" }, tone: "amber", links: HOME.map(([s, t, d, i]) => lk(`${BASE.home}/${s}/`, t, d, i, "amber")) }],
      [
        { head: { href: "/snap-projects.html", title: "Snap Projects", icon: "tasks", desc: "AI workspace for managers" }, tone: "mint", links: [lk("/snap-projects.html#whats-new", "What's inside", "Meetings, goals, checks and skills", "sparkle", "mint"), lk("/snap-projects.html#pricing", "Pricing", "Plans and availability", "coin", "mint")] },
        { head: { href: "https://snaprytr.com", title: "SnapRytr", icon: "pencil", desc: "AI chat for expert marketers" }, tone: "coral", links: [lk("https://snaprytr.com", "Visit snaprytr.com", "Briefs, campaigns and content flows", "globe", "coral")] },
      ],
    ],
    side: { tone: "amber", icon: "rocket", title: "Products we build and run", text: "Alongside client work we run a product studio. Each product is a working application with its own page.", cta: ["/products/", "See the portfolio"] },
  });
  if (LIVE.insights) {
    const rows = articles.map((a) => {
      const [t, i, tone] = INSIGHT[a.slug] || [a.title, a.icon, "cyan"];
      return lk(`/insights/${a.slug}/`, t, `${a.cat} · ${a.read} min read`, i, tone);
    });
    const half = Math.ceil(rows.length / 2);
    items.push({
      key: "insights", label: "Insights", href: "/insights/", kind: "mega", icon: "book", tone: "mint",
      columns: [[{ tone: "mint", links: rows.slice(0, half) }], [{ tone: "mint", links: rows.slice(half) }]],
      side: { tone: "mint", icon: "pencil", title: "Fresh from the team", text: "Practical write-ups on agents, SaaS and automation. No hype, no invented benchmarks.", cta: ["/insights/", "Read all insights"] },
      narrow: true,
    });
  }
  items.push({
    key: "company", label: "Company", kind: "sm", icon: "compass", tone: "coral",
    links: [
      lk("/blog.html", "Blog", "Field notes and ideas", "pencil", "coral", " data-blog-link"),
      lk("/#techstack", "Tech stack", "The tools we build with", "layers", "sky"),
      lk("/#partners", "Strategic partners", "Who we work alongside", "heart", "violet"),
      lk("/#faq", "FAQ", "Answers to common questions", "chat", "amber"),
      lk(U.contact(), "Contact us", "Talk to an engineer", "mail", "mint"),
    ],
  });
  return items;
}

// ---------- renderers ----------
const tile = (ic, solid = false) => `<span class="tile${solid ? " tile--solid" : ""}">${icon(ic)}</span>`;
const extMark = (h) => (/^https?:/.test(h) ? `<i class="mi__ext" aria-hidden="true">↗</i>` : "");

const menuLink = (l) =>
  `<li><a class="mi t-${l.tone}" href="${l.h}"${ext(l.h)}${l.attrs || ""}>${tile(l.i)}<span class="mi__txt"><b>${esc(l.t)}${extMark(l.h)}</b>${l.d ? `<small>${esc(l.d)}</small>` : ""}</span></a></li>`;

const groupHtml = (g) =>
  `<div class="mg t-${g.tone}">${g.head ? `<a class="mg__head" href="${g.head.href}"${ext(g.head.href)}>${tile(g.head.icon, true)}<span class="mg__title"><b>${esc(g.head.title)}${extMark(g.head.href)}</b>${g.head.desc ? `<small>${esc(g.head.desc)}</small>` : ""}</span></a>` : ""}<ul class="mg__list">${g.links.map(menuLink).join("")}</ul></div>`;

const sideHtml = (s) =>
  `<aside class="mside t-${s.tone}"><span class="mside__ico">${icon(s.icon)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><a class="mside__cta" href="${s.cta[0]}"${ext(s.cta[0])}>${esc(s.cta[1])} ${arrow}</a>${s.more ? `<a class="mside__more" href="${s.more[0]}">${esc(s.more[1])}</a>` : ""}</aside>`;

function megaPanel(it) {
  const cols = it.columns.map((c) => `<div class="mega__col">${c.map(groupHtml).join("")}</div>`).join("");
  return `<div class="mega" id="mega-${esc(it.key)}" role="region" aria-label="${esc(it.label)} menu"><div class="mega__panel${it.narrow ? " mega__panel--narrow" : ""}"><div class="mega__grid" style="--cols:${it.columns.length}">${cols}</div>${it.side ? sideHtml(it.side) : ""}</div></div>`;
}
const smPanel = (it) => `<div class="mega mega--sm" id="mega-${esc(it.key)}" role="region" aria-label="${esc(it.label)} menu"><div class="mega__panel"><ul class="mg__list">${it.links.map(menuLink).join("")}</ul></div></div>`;

function navItem(it, current) {
  const cur = current === it.key;
  const tone = `t-${it.tone || "cyan"}`;
  if (it.kind === "link") return `<li class="mnav__item ${tone}"><span class="mnav__pill"><a class="mnav__link" href="${it.href}"${ext(it.href)}${cur ? ' aria-current="page"' : ""}>${esc(it.label)}</a></span></li>`;
  const inner = it.href
    ? `<a class="mnav__link" href="${it.href}"${cur ? ' aria-current="true"' : ""}>${esc(it.label)}</a><button type="button" class="mnav__caret" aria-expanded="false" aria-controls="mega-${esc(it.key)}" aria-label="${esc(it.label)} submenu">${chev}</button>`
    : `<button type="button" class="mnav__link mnav__link--btn" aria-expanded="false" aria-controls="mega-${esc(it.key)}"${cur ? ' data-current="true"' : ""}>${esc(it.label)}<span class="mnav__chev">${chev}</span></button>`;
  return `<li class="mnav__item mnav__item--${it.kind} ${tone}${cur ? " is-current" : ""}" data-mega><span class="mnav__pill">${inner}</span>${it.kind === "sm" ? smPanel(it) : megaPanel(it)}</li>`;
}

const drawerLink = (l) =>
  `<li><a class="md__item t-${l.tone}" href="${l.h}"${ext(l.h)}${l.attrs || ""}>${tile(l.i)}<span>${esc(l.t)}${extMark(l.h)}</span></a></li>`;

function drawerGroup(it, current) {
  if (it.kind === "link") return `<a class="md__link" href="${it.href}"${ext(it.href)}>${esc(it.label)}</a>`;
  const open = current === it.key ? " open" : "";
  let body = "";
  if (it.kind === "mega") {
    if (it.href) body += `<a class="md__all" href="${it.href}">${esc(it.label)} overview ${arrow}</a>`;
    body += it.columns
      .flat()
      .map((g) => `<div class="md__sub">${g.head ? `<a class="md__subhead t-${g.tone}" href="${g.head.href}"${ext(g.head.href)}>${tile(g.head.icon, true)}<span>${esc(g.head.title)}${extMark(g.head.href)}</span></a>` : ""}<ul>${g.links.map(drawerLink).join("")}</ul></div>`)
      .join("");
  } else {
    body += `<ul class="md__flat">${it.links.map(drawerLink).join("")}</ul>`;
  }
  return `<details class="md__group t-${it.tone || "cyan"}"${open}><summary>${tile(it.icon || "compass", true)}<span class="md__label">${esc(it.label)}</span>${chev}</summary><div class="md__body">${body}</div></details>`;
}

function drawerHtml(items, cta, current) {
  return `<div class="mdrawer" id="mdrawer" aria-hidden="true"><div class="mdrawer__backdrop" data-nav-close tabindex="-1" aria-hidden="true"></div>
<div class="mdrawer__panel" role="dialog" aria-modal="true" aria-label="Site menu"><div class="mdrawer__head"><span>Menu</span><button class="mdrawer__close" type="button" data-nav-close aria-label="Close menu"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div>
<div class="mdrawer__links">${items.map((it) => drawerGroup(it, current)).join("")}</div>
<div class="mdrawer__actions">${toggleBtn}<a class="nav__cta" href="${cta[0]}"${ext(cta[0])}>${esc(cta[1])}</a></div></div></div>`;
}

function headerHtml({ brand, items, cta, current, label = "Primary" }) {
  return `<header class="site-header"><nav class="nav" aria-label="${esc(label)}">${brand}
<ul class="mnav">${items.map((it) => navItem(it, current)).join("")}</ul>
<div class="nav__actions">${toggleBtn}<a class="nav__cta" href="${cta[0]}"${ext(cta[0])}>${esc(cta[1])}</a></div>${burger}</nav></header>
${drawerHtml(items, cta, current)}`;
}

const CURRENT_MAP = { services: "services", products: "products", insights: "insights", "contact us": "company", company: "company" };

// Header + mobile drawer block (without skip link / ambient), used by generated and hand-written pages.
export function navBlock(current = "") {
  const key = CURRENT_MAP[String(current).toLowerCase()] || "";
  const brand = `<a class="nav__logo" href="/" aria-label="Snap Kodex home"><img data-logo="snapkodex" src="/snapkodex logo full dark.svg" alt="Snap Kodex" width="160" height="36" /></a>`;
  return `${SVG_DEFS}${headerHtml({ brand, items: globalMenu(), cta: [U.contact(), "Start a project"], current: key })}`;
}

// Product-scoped menu: same component, only that product's own pages.
export function productNavBlock({ name, tag, pictHtml, base, features, links, cta, tone = "cyan" }) {
  const copy = Object.fromEntries([...TAAWEEL, ...HOME].map(([s, , d, i]) => [s, [d, i]]));
  const rows = features.map(([h, t, ic]) => {
    const slug = h.replace(/\/$/, "").split("/").pop();
    return lk(h, t, copy[slug]?.[0], copy[slug]?.[1] || ic || "sparkle", tone);
  });
  const half = Math.ceil(rows.length / 2);
  const items = [
    {
      key: "features", label: "Capabilities", href: `${base}/#capabilities`, kind: "mega", icon: "sparkle", tone, narrow: true,
      columns: [[{ tone, links: rows.slice(0, half) }], [{ tone, links: rows.slice(half) }]],
      side: { tone, icon: "compass", title: `Curious about ${name}?`, text: "Start with the overview, or take the next step when you are ready.", cta, more: [`${base}/`, `${name} overview`] },
    },
    ...links.map(([h, t]) => ({ key: t, label: t, href: h, kind: "link", tone })),
  ];
  const brand = `<a class="pbrand" href="${base}/" aria-label="${esc(name)} home">${pictHtml}<span>${esc(name)}<small>${esc(tag)}</small></span></a>`;
  return `${SVG_DEFS}${headerHtml({ brand, items, cta, current: "", label: `${name} navigation` })}`;
}

// ---------- footers ----------
const logo = `<img class="footer__logo" data-logo="snapkodex" src="/snapkodex logo full dark.svg" alt="Snap Kodex logo" />`;
const footLink = (l) => `<li><a href="${l[0]}"${ext(l[0])}${l[2] || ""}>${esc(l[1])}</a></li>`;
const footCol = (title, tone, links) => `<div class="footer__col t-${tone}"><h4>${title}</h4><ul>${links.map(footLink).join("")}</ul></div>`;

export function richFooter() {
  const svc = wheels.map((w) => [`${w.base}/`, w.hub.nav]);
  const prod = [["/products/", "All products"], [`${BASE.taaweel}/`, "Taaweel"], [`${BASE.home}/`, "Homeschooling"], ["/snap-projects.html", "Snap Projects"], ["https://snaprytr.com", "SnapRytr"]];
  const ins = [["/insights/", "All insights"], ...articles.slice(0, 3).map((a) => [`/insights/${a.slug}/`, INSIGHT[a.slug]?.[0] || a.title])];
  const co = [["/blog.html", "Blog", " data-blog-link"], ["/#techstack", "Tech stack"], ["/#partners", "Strategic partners"], ["/#faq", "FAQ"], [U.contact(), "Contact us"], ["mailto:hello@snapkodex.com", "hello@snapkodex.com"]];
  return `<footer class="footer footer--rich"><div class="footer__cols">
<div class="footer__brand">${logo}<p>AI-native software house for SaaS, enterprise software and agentic AI, plus proprietary products.</p><a class="footer__cta" href="${U.contact()}">Start a project ${arrow}</a></div>
${footCol("Services", "violet", [[U.services(), "All services"], ...svc])}${footCol("Products", "amber", prod)}${LIVE.insights ? footCol("Insights", "mint", ins) : ""}${footCol("Company", "coral", co)}</div>
<div class="footer__bar"><span>&copy; ${new Date().getFullYear()} Snap Kodex. Mon&ndash;Fri 9:00&ndash;18:00.</span><span>snapkodex.com</span></div></footer>`;
}

export function productFooterHtml({ name, pictHtml, blurb, groups, tone = "cyan" }) {
  return `<footer class="footer footer--rich footer--product"><div class="footer__cols">
<div class="footer__brand"><div class="pbrand">${pictHtml}<span>${esc(name)}</span></div><p>${esc(blurb)}</p></div>
${groups.map((g) => footCol(g.title, tone, g.links)).join("")}</div>
<div class="footer__bar"><span class="footer__attrib">An AI product engineered by <a href="https://snapkodex.com/">Snap Kodex</a>.</span><span>&copy; ${new Date().getFullYear()} Snap Kodex</span></div></footer>`;
}
