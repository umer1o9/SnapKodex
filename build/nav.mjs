// Shared header (mega menu + mobile drawer) and footer for every page.
// One source of truth: lib.mjs re-exports these, patch-site.mjs injects the same markup into the hand-written pages.
// Product pages use the same component with a silo-scoped menu (no cross-product links).
import { icon, esc, U, LIVE, BASE, SVG_DEFS } from "./lib.mjs";
import { wheels } from "./content-agency.mjs";
import { articles } from "./content-insights.mjs";

const ext = (h) => (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : "");
const chev = `<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const arrow = `<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false"><path d="M2.5 6h7M6.5 3l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const toggleBtn = `<button type="button" class="nav__theme-toggle" data-theme-toggle aria-pressed="false" aria-label="Switch to light theme"><span class="material-symbols-rounded" aria-hidden="true">light_mode</span></button>`;
const burger = `<button class="mnav__burger" type="button" aria-expanded="false" aria-controls="mdrawer" aria-label="Open menu"><span></span><span></span><span></span></button>`;

// ---------- global menu model ----------
const TAAWEEL = [["research-pipeline", "Research pipeline"], ["evidence-and-citations", "Evidence & citations"], ["root-and-word-studies", "Root & word studies"], ["adversarial-audit", "Adversarial audit"], ["ontology-explorer", "Ontology explorer"], ["mizan-numerical-analysis", "Mizan numerical analysis"]];
const HOME = [["guiding-light-curriculum", "Guiding-light curriculum"], ["ai-syllabus-builder", "AI syllabus builder"], ["weekly-planner", "Weekly planner"], ["activity-player", "Activity player"], ["fair-scoring-and-observations", "Fair scoring & observations"], ["kids-learning-world", "Kids' learning world"]];
const WHEEL_BLURB = { agentic: "Multi-agent systems, retrieval, evaluation", saas: "Platforms, tenancy, billing, ERP and CRM", automation: "Chatbots, support, sales and ecommerce agents" };
const INSIGHT_GROUPS = { agentic: "Agentic AI", saas: "SaaS & enterprise", automation: "Automation & agents", products: "Product case studies" };

export function globalMenu() {
  const items = [];
  items.push({
    key: "services", label: "Services", href: U.services(), kind: "mega", cols: 3,
    cols_: wheels.map((w) => ({ href: `${w.base}/`, title: w.hub.nav, icon: w.hub.icon, desc: WHEEL_BLURB[w.key] || "", links: w.spokes.map((s) => [`${w.base}/${s.slug}/`, s.nav]) })),
    foot: [[U.services(), "All services"], [U.contact(), "Start a project"]],
  });
  items.push({
    key: "products", label: "Products", href: "/products/", kind: "mega", cols: 4,
    cols_: [
      { href: `${BASE.taaweel}/`, title: "Taaweel", icon: "book", desc: "AI research engine for Quranic inquiry", links: TAAWEEL.map(([s, t]) => [`${BASE.taaweel}/${s}/`, t]) },
      { href: `${BASE.home}/`, title: "Homeschooling", icon: "sun", desc: "Curriculum, planner and scoring for families", links: HOME.map(([s, t]) => [`${BASE.home}/${s}/`, t]) },
      { href: "/snap-projects.html", title: "Snap Projects", icon: "tasks", desc: "AI workspace for managers", links: [["/snap-projects.html#whats-new", "Built into the desktop app"], ["/snap-projects.html#pricing", "Pricing"]] },
      { href: "https://snaprytr.com", title: "SnapRytr", icon: "pencil", desc: "AI chat for expert marketers", links: [["https://snaprytr.com", "Visit snaprytr.com"]] },
    ],
    foot: [["/products/", "Full portfolio"]],
  });
  if (LIVE.insights) {
    const groups = Object.keys(INSIGHT_GROUPS)
      .map((k) => ({ k, list: articles.filter((a) => a.wheel === k) }))
      .filter((g) => g.list.length);
    items.push({
      key: "insights", label: "Insights", href: "/insights/", kind: "mega", cols: groups.length,
      cols_: groups.map((g) => ({ href: "/insights/", title: INSIGHT_GROUPS[g.k], icon: g.list[0].icon, desc: "", links: g.list.map((a) => [`/insights/${a.slug}/`, a.title]) })),
      foot: [["/insights/", "All insights"]],
    });
  }
  items.push({
    key: "company", label: "Company", href: "/#about", kind: "sm", noLink: true,
    links: [["/blog.html", "Blog", " data-blog-link"], ["/#techstack", "Tech stack"], ["/#partners", "Strategic partners"], ["/#faq", "FAQ"], [U.contact(), "Contact us"]],
  });
  return items;
}

// ---------- renderers ----------
function linkHtml([h, t, attrs = ""]) {
  return `<a href="${h}"${ext(h)}${attrs}>${esc(t)}</a>`;
}

function megaPanel(it) {
  const cols = it.cols_
    .map(
      (c) =>
        `<div class="mega__col"><a class="mega__head" href="${c.href}"${ext(c.href)}><span class="mega__ico">${icon(c.icon)}</span><span class="mega__title"><b>${esc(c.title)}</b>${c.desc ? `<small>${esc(c.desc)}</small>` : ""}</span></a><ul>${c.links.map((l) => `<li>${linkHtml(l)}</li>`).join("")}</ul></div>`
    )
    .join("");
  const foot = it.foot ? `<div class="mega__foot">${it.foot.map(([h, t], i) => `<a class="mega__foot-link${i ? " mega__foot-link--alt" : ""}" href="${h}">${esc(t)} ${arrow}</a>`).join("")}</div>` : "";
  return `<div class="mega" id="mega-${it.key}" role="region" aria-label="${esc(it.label)} menu"><div class="mega__panel" style="--cols:${it.cols}"><div class="mega__grid">${cols}</div>${foot}</div></div>`;
}

function smPanel(it) {
  return `<div class="mega mega--sm" id="mega-${it.key}" role="region" aria-label="${esc(it.label)} menu"><div class="mega__panel"><ul class="mega__list">${it.links.map((l) => `<li>${linkHtml(l)}</li>`).join("")}</ul></div></div>`;
}

function navItem(it, current) {
  const cur = current === it.key;
  if (it.kind === "link") return `<li class="mnav__item"><a class="mnav__link" href="${it.href}"${ext(it.href)}${cur ? ' aria-current="page"' : ""}>${esc(it.label)}</a></li>`;
  const label = it.noLink
    ? `<button type="button" class="mnav__link mnav__link--btn" aria-expanded="false" aria-controls="mega-${it.key}"${cur ? ' data-current="true"' : ""}>${esc(it.label)}<span class="mnav__chev">${chev}</span></button>`
    : `<a class="mnav__link" href="${it.href}"${cur ? ' aria-current="true"' : ""}>${esc(it.label)}</a><button type="button" class="mnav__caret" aria-expanded="false" aria-controls="mega-${it.key}" aria-label="${esc(it.label)} submenu">${chev}</button>`;
  return `<li class="mnav__item mnav__item--${it.kind}" data-mega>${label}${it.kind === "sm" ? smPanel(it) : megaPanel(it)}</li>`;
}

function drawerGroup(it, current) {
  if (it.kind === "link") return `<a class="md__link" href="${it.href}"${ext(it.href)}>${esc(it.label)}</a>`;
  const open = current === it.key ? " open" : "";
  let body = "";
  if (it.kind === "mega") {
    body += it.noLink ? "" : `<a class="md__all" href="${it.href}">${esc(it.label)} overview ${arrow}</a>`;
    body += it.cols_
      .map((c) => `<div class="md__sub"><a class="md__subhead" href="${c.href}"${ext(c.href)}><span class="mega__ico">${icon(c.icon)}</span>${esc(c.title)}</a><ul>${c.links.map((l) => `<li>${linkHtml(l)}</li>`).join("")}</ul></div>`)
      .join("");
    if (it.foot) body += `<div class="md__foot">${it.foot.map(([h, t]) => `<a href="${h}">${esc(t)} ${arrow}</a>`).join("")}</div>`;
  } else {
    body += `<ul class="md__list">${it.links.map((l) => `<li>${linkHtml(l)}</li>`).join("")}</ul>`;
  }
  return `<details class="md__group"${open}><summary><span>${esc(it.label)}</span>${chev}</summary><div class="md__body">${body}</div></details>`;
}

function drawerHtml(items, cta, current) {
  return `<div class="mdrawer" id="mdrawer" aria-hidden="true"><div class="mdrawer__backdrop" data-nav-close tabindex="-1" aria-hidden="true"></div>
<div class="mdrawer__panel" role="dialog" aria-modal="true" aria-label="Site menu"><div class="mdrawer__head"><span>Menu</span><button class="mdrawer__close" type="button" data-nav-close aria-label="Close menu"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div>
<div class="mdrawer__links">${items.map((it) => drawerGroup(it, current)).join("")}</div>
<div class="mdrawer__actions">${toggleBtn}<a class="nav__cta" href="${cta[0]}"${ext(cta[0])}>${esc(cta[1])}</a></div></div></div>`;
}

function headerHtml({ brand, items, cta, current, label = "Primary" }) {
  return `<header class="site-header"><nav class="nav" aria-label="${label}">${brand}
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
export function productNavBlock({ name, tag, pictHtml, base, features, links, cta }) {
  const items = [
    { key: "features", label: "Capabilities", href: `${base}/#capabilities`, kind: "mega", cols: 1, cols_: [{ href: `${base}/`, title: `${name} overview`, icon: "compass", desc: tag, links: features }] },
    ...links.map(([h, t]) => ({ key: t, label: t, href: h, kind: "link" })),
  ];
  const brand = `<a class="pbrand" href="${base}/" aria-label="${esc(name)} home">${pictHtml}<span>${esc(name)}<small>${esc(tag)}</small></span></a>`;
  return `${SVG_DEFS}${headerHtml({ brand, items, cta, current: "", label: `${name} navigation` })}`;
}

// ---------- footers ----------
const logo = `<img class="footer__logo" data-logo="snapkodex" src="/snapkodex logo full dark.svg" alt="Snap Kodex logo" />`;

export function richFooter() {
  const col = (title, links) => `<div class="footer__col"><h4>${title}</h4><ul>${links.map((l) => `<li>${linkHtml(l)}</li>`).join("")}</ul></div>`;
  const svc = wheels.map((w) => [`${w.base}/`, w.hub.nav]);
  const prod = [["/products/", "All products"], [`${BASE.taaweel}/`, "Taaweel"], [`${BASE.home}/`, "Homeschooling"], ["/snap-projects.html", "Snap Projects"], ["https://snaprytr.com", "SnapRytr"]];
  const ins = [["/insights/", "All insights"], ...articles.slice(0, 3).map((a) => [`/insights/${a.slug}/`, a.title])];
  const co = [["/blog.html", "Blog", " data-blog-link"], ["/#techstack", "Tech stack"], ["/#partners", "Strategic partners"], ["/#faq", "FAQ"], [U.contact(), "Contact us"], ["mailto:hello@snapkodex.com", "hello@snapkodex.com"]];
  return `<footer class="footer footer--rich"><div class="footer__cols">
<div class="footer__brand">${logo}<p>AI-native software house for SaaS, enterprise software and agentic AI, plus proprietary products.</p><a class="footer__cta" href="${U.contact()}">Start a project ${arrow}</a></div>
${col("Services", [[U.services(), "All services"], ...svc])}${col("Products", prod)}${LIVE.insights ? col("Insights", ins) : ""}${col("Company", co)}</div>
<div class="footer__bar"><span>&copy; ${new Date().getFullYear()} Snap Kodex. Mon&ndash;Fri 9:00&ndash;18:00.</span><span>snapkodex.com</span></div></footer>`;
}

export function productFooterHtml({ name, pictHtml, blurb, groups }) {
  return `<footer class="footer footer--rich footer--product"><div class="footer__cols">
<div class="footer__brand"><div class="pbrand">${pictHtml}<span>${esc(name)}</span></div><p>${esc(blurb)}</p></div>
${groups.map((g) => `<div class="footer__col"><h4>${g.title}</h4><ul>${g.links.map((l) => `<li>${linkHtml(l)}</li>`).join("")}</ul></div>`).join("")}</div>
<div class="footer__bar"><span class="footer__attrib">An AI product engineered by <a href="https://snapkodex.com/">Snap Kodex</a>.</span><span>&copy; ${new Date().getFullYear()} Snap Kodex</span></div></footer>`;
}
