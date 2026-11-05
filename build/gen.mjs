// Snap Kodex static page generator.  Usage:  node build/gen.mjs
// Writes HTML into the repo (folders with index.html) plus segmented sitemaps. Commit the output.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as L from "./lib.mjs";
import { taaweel } from "./content-taaweel.mjs";
import { home } from "./content-home.mjs";
import { patchSite } from "./patch-site.mjs";

const { SITE, esc } = L;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
import { existsSync } from "node:fs";
const HERE = path.dirname(fileURLToPath(import.meta.url));
L.LIVE.services = existsSync(path.join(HERE, "pages-agency.mjs"));
L.LIVE.contact = L.LIVE.services;
L.LIVE.insights = existsSync(path.join(HERE, "pages-insights.mjs"));
export const registry = []; // { url, section, lastmod, priority }
const today = new Date().toISOString().slice(0, 10);

export function write(urlPath, html, section, priority = 0.7) {
  const file = path.join(ROOT, urlPath.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, "utf8");
  registry.push({ url: SITE + urlPath, section, lastmod: today, priority });
}

const CARD = {
  "research-pipeline": "Plan, map, collect, audit, compose. Each stage saved, resumable and reviewable.",
  "evidence-and-citations": "Evidence in five tiers, with every citation resolving to a ledger row.",
  "root-and-word-studies": "Whole-corpus concordance, clustered by how a word is used, beside the lexicon.",
  "adversarial-audit": "A red team and 14 uṣūl principles try to break the conclusion first.",
  "ontology-explorer": "A concept graph where machine proposals wait for human adjudication.",
  "mizan-numerical-analysis": "24 interactive perspectives with named null models and stated limits.",
  "guiding-light-curriculum": "An agent interviews you, then builds a six-month plan around your philosophy.",
  "ai-syllabus-builder": "Activities written subject by subject, deepening for each child.",
  "weekly-planner": "Drag activities into day slots for each child, or for everyone.",
  "activity-player": "One link, two views: parent guidance and a focused child screen.",
  "fair-scoring-and-observations": "Completion-based tokens, co-op modes and parent observations. No sibling ranking.",
  "kids-learning-world": "A picture encyclopedia, a phonics playground and a live voice companion.",
};

// ---------------- product wheel pages ----------------
function productChrome(p) {
  const links = [
    [`${p.base}/#how`, "How it works"],
    [`${p.base}/#audience`, "Who it's for"],
    [`${p.base}/#faq`, "FAQ"],
  ];
  const ctaTarget = p.app || p.mail;
  const ctaLabel = p.app ? "Open the app" : "Request early access";
  const header = L.productHeader({ name: p.name, tag: p.tag, iconName: p.icon, base: p.base, links, features: p.spokes.map((s) => [s.url, s.nav, s.icon]), tone: p.key === "home" ? "amber" : "violet", cta: [ctaTarget, ctaLabel] });
  const footer = L.productFooter({
    tone: p.key === "home" ? "amber" : "violet",
    name: p.name,
    base: p.base,
    cols: {
      icon: p.icon,
      blurb: p.hub.meta.desc.split(". ")[0] + ".",
      groups: [
        { title: "Capabilities", links: p.spokes.map((s) => [s.url, s.nav]) },
        { title: p.name, links: [[`${p.base}/`, "Overview"], [`${p.base}/#how`, "How it works"], [`${p.base}/#faq`, "FAQ"], [ctaTarget, ctaLabel]] },
      ],
    },
  });
  return { header, footer, ctaTarget, ctaLabel };
}

function appSchema(p, url) {
  const o = {
    "@type": "SoftwareApplication",
    name: p.name,
    applicationCategory: p.key === "home" ? "EducationalApplication" : "ReferenceApplication",
    operatingSystem: "Web",
    url: SITE + url,
    description: p.hub.meta.desc,
    creator: { "@type": "Organization", name: "Snap Kodex", url: SITE + "/" },
  };
  if (p.app) o.installUrl = p.app;
  return o;
}

function renderProductHub(p) {
  const { header, footer, ctaTarget, ctaLabel } = productChrome(p);
  const h = p.hub;
  const url = h.url;
  const bc = [["/", "SnapKodex"], ["/products/", "Products"], [url, p.name]];
  const body = `${header}
<main id="main" class="pg"><div class="wrap">
${L.crumbs(bc)}
${L.hero({
    eyebrow: h.eyebrow,
    h1: h.h1,
    lead: h.lead,
    actions: [[ctaTarget, ctaLabel + (p.app ? " →" : "")], ["#capabilities", "Explore capabilities", "ghost"]],
    art: L.heroArt(h.art.main, h.art.sats, h.art.label),
  })}
<section class="stats" aria-label="At a glance">${h.stats.map(([b, s]) => `<div class="stat"><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join("")}</section>
</div>
${p.galleryShots ? L.appGallery({ url: p.app, shots: p.galleryShots, logoAlt: p.name + " — تأويل logo" }) : ""}
<section class="band"><div class="wrap split"><div>${L.secHead("The problem", h.problemTitle)}<div class="prose">${h.problem.map((t) => `<p>${t}</p>`).join("")}</div></div><div>${L.checklist(h.problemPoints)}</div></div></section>
<section class="band band--tint" id="capabilities"><div class="wrap">${L.secHead("Capabilities", h.capTitle, h.capLead)}
<div class="cards">${p.spokes.map((s) => L.cardLink({ href: s.url, icon: s.icon, tag: s.eyebrow, title: s.h1.replace(/<\/?em>/g, ""), text: CARD[s.slug] || s.lead.split(". ")[0] + ".", more: "Read more" })).join("")}</div></div></section>
<section class="band" id="how"><div class="wrap">${L.secHead("How it works", h.stepsTitle)}${L.stepsHtml(h.steps)}</div></section>
<section class="band band--tint" id="audience"><div class="wrap">${L.secHead("Who it's for", "Built for people who do this work")}<div class="cards">${h.audience.map(([ic, t, d]) => L.cardPlain({ icon: ic, title: t, text: d })).join("")}</div></div></section>
<section class="band"><div class="wrap split"><div>${L.secHead("Principles", h.principlesTitle)}</div><div>${L.checklist(h.principles)}</div></div></section>
<section class="band" id="faq"><div class="wrap">${L.secHead("FAQ", "Questions people ask")}${L.faqHtml(h.faqs)}</div></section>
<section class="band"><div class="wrap">${L.cta({ title: h.ctaTitle, text: h.ctaText, primary: [ctaTarget, ctaLabel], secondary: ["#capabilities", "Explore capabilities"] })}</div></section>
</main>${footer}`;
  const headHtml = L.head({
    title: h.meta.title,
    description: h.meta.desc,
    path: url,
    schema: [L.breadcrumbSchema(bc), appSchema(p, url), L.faqSchema(h.faqs)],
  });
  write(url, L.page(headHtml, body, p.theme), p.key === "taaweel" ? "taaweel" : "homeschooling", 0.9);
}

function renderSpoke(p, s, i) {
  const { header, footer, ctaTarget, ctaLabel } = productChrome(p);
  const bc = [["/", "SnapKodex"], ["/products/", "Products"], [p.hub.url, p.name], [s.url, s.nav]];
  const body = `${header}
<main id="main" class="pg"><div class="wrap">
${L.crumbs(bc)}
${L.hero({
    eyebrow: s.eyebrow,
    h1: s.h1,
    lead: s.lead,
    actions: [[ctaTarget, ctaLabel + (p.app ? " →" : "")], [p.hub.url, `${p.name} overview`, "ghost"]],
    art: L.heroArt(s.icon, s.sats, s.nav),
  })}
</div>
<section class="band"><div class="wrap split"><div>${L.secHead("Overview", "What it does")}<div class="prose">${s.overview.map((t) => `<p>${t}</p>`).join("")}</div></div><div>${L.callout(s.callout.icon, s.callout.title, s.callout.text)}<div style="height:22px"></div>${L.checklist(s.check)}</div></div></section>
${s.shot ? L.appShot(s.shot) : ""}
<section class="band band--tint"><div class="wrap">${L.secHead("How it works", "Step by step")}${L.stepsHtml(s.steps)}</div></section>
<section class="band"><div class="wrap">${L.secHead("Features", s.featuresTitle)}<div class="cards">${s.features.map((f) => L.cardPlain(f)).join("")}</div></div></section>
<section class="band band--tint"><div class="wrap">${L.secHead("Keep exploring", `More from ${p.name}`)}${L.wheelNav(p.hub, p.spokes, i)}</div></section>
<section class="band"><div class="wrap">${L.secHead("FAQ", "Common questions")}${L.faqHtml(s.faqs)}</div></section>
<section class="band"><div class="wrap">${L.cta({ title: p.hub.ctaTitle, text: p.hub.ctaText, primary: [ctaTarget, ctaLabel], secondary: [p.hub.url, `${p.name} overview`] })}</div></section>
</main>${footer}`;
  const headHtml = L.head({
    title: s.meta.title,
    description: s.meta.desc,
    path: s.url,
    schema: [L.breadcrumbSchema(bc), appSchema(p, s.url), L.faqSchema(s.faqs)],
  });
  write(s.url, L.page(headHtml, body, p.theme), p.key === "taaweel" ? "taaweel" : "homeschooling", 0.8);
}

function prepare(p) {
  p.spokes.forEach((s) => (s.url = `${p.base}/${s.slug}/`));
}
for (const p of [taaweel, home]) {
  prepare(p);
  renderProductHub(p);
  p.spokes.forEach((s, i) => renderSpoke(p, s, i));
}

// ---------------- /products/ directory ----------------
function renderProductsIndex() {
  const bc = [["/", "SnapKodex"], ["/products/", "Products"]];
  const prods = [
    { href: taaweel.hub.url, key: "taaweel", ic: "book", tag: "Live", t: "Taaweel", d: "An AI research engine for Quranic inquiry: whole-corpus concordance, tiered evidence, adversarial audit and cited reports. With Mizan for transparent numerical analysis.", more: "Explore Taaweel", art: "product-taaweel", cls: "card--taaweel", ar: "تأويل", app: "taaweel.snapkodex.com" },
    { href: home.hub.url, key: "home", ic: "sun", tag: "Live", t: "Homeschooling", d: "A family learning OS: guiding-light curriculum, AI-built syllabus, drag-and-drop planner, parent and child players, and fair completion-based scoring.", more: "Explore Homeschooling", art: "product-homeschooling" },
    { href: "/snap-projects.html", key: "sp", ic: "tasks", tag: "Desktop app", t: "Snap Projects", d: "An AI workspace for managers: chat with your files, Jira and Confluence, meeting answers, a commitment ledger that catches what people promised, goals, checks and skills.", more: "Explore Snap Projects", art: "product-snap-projects" },
    { href: "https://snaprytr.com", key: "sr", ic: "pencil", tag: "Live SaaS", t: "SnapRytr", d: "AI chat for expert marketers: briefs, campaign tuning and content flows.", more: "Visit SnapRytr", art: "product-snaprytr" },
    { href: null, key: "slm", ic: "mail", tag: "Coming soon", t: "SLM", d: "Industry-targeted lead discovery with configurable cadences and email campaigns on public leads.", more: "", art: "product-slm" },
  ];
  const card = (x) => {
    const inner = `<img class="post-card__art" data-theme-img="${x.art}" src="/assets/${x.art}.svg" alt="" width="400" height="120" style="width:100%;height:auto;border-radius:14px" />${L.pict(x.ic)}<span class="card__tag">${x.tag}</span><h3>${x.t}${x.ar ? ` <span class="card__ar" lang="ar" dir="rtl">${x.ar}</span>` : ""}</h3><p>${x.d}</p>${x.app ? `<span class="card__app">${x.app}</span>` : ""}${x.more ? `<span class="card__more">${x.more}</span>` : ""}`;
    const cls = x.cls ? ` ${x.cls}` : "";
    return x.href ? `<a class="card${cls}" href="${x.href}"${/^https?:/.test(x.href) ? ' target="_blank" rel="noopener"' : ""}>${inner}</a>` : `<div class="card${cls}">${inner}</div>`;
  };
  const body = `${L.globalHeader("Products")}
<main id="main" class="pg"><div class="wrap">
${L.crumbs(bc)}
${L.hero({
    eyebrow: "Product studio",
    h1: "Proprietary software engineered by <em>Snap Kodex</em>",
    lead: "Alongside client delivery, we build and ship our own vertical AI products. Each one is a working application, not a demo, and each is built with the same agentic AI and cloud-native practices we bring to client projects.",
    actions: [["#portfolio", "See the portfolio"], [L.U.contact(), "Build a product with us", "ghost"]],
    art: L.heroArt("layers", ["book", "sun", "tasks", "pencil", "mail"], "Snap Kodex product portfolio"),
  })}
</div>
<section class="band" id="portfolio"><div class="wrap">${L.secHead("Portfolio", "Five products, one engineering standard", "Taaweel and Homeschooling have dedicated pages with a full tour of what they do.")}<div class="cards">${prods.map(card).join("")}</div></div></section>
<section class="band band--tint"><div class="wrap">${L.secHead("How we build", "What the products share")}<div class="cards">${[
    ["robot", "Agentic AI where it earns its place", "Agents that plan, call tools and check their work, with humans approving what matters."],
    ["lock", "Isolation and auditability", "Tenant isolation, read-only corpora, logged changes and previews before destructive actions."],
    ["cloud", "Cloud-native foundations", "Firebase, Node.js, Python and React or Vue on managed infrastructure."],
    ["check", "Honest claims", "We describe what each product does and where its limits are."],
  ].map(([ic, t, d]) => L.cardPlain({ icon: ic, title: t, text: d })).join("")}</div></div></section>
<section class="band"><div class="wrap">${L.cta({ title: "Have a product in mind?", text: "We design and ship custom products from concept to launch with the same stack behind our own.", primary: [L.U.contact(), "Start a project"], secondary: [L.U.services(), "Our services"] })}</div></section>
</main>${L.globalFooter()}`;
  const headHtml = L.head({
    title: "AI Products & Platforms | Snap Kodex Product Studio",
    description: "Explore proprietary AI software built by Snap Kodex: Taaweel (Quranic research engine), the Homeschooling platform, Snap Projects and SnapRytr.",
    path: "/products/",
    schema: [L.breadcrumbSchema(bc), { "@type": "CollectionPage", name: "Snap Kodex products", url: SITE + "/products/" }],
  });
  write("/products/", L.page(headHtml, body, "theme-agency"), "agency", 0.9);
}
renderProductsIndex();

// ---------------- optional modules (services, insights, contact) ----------------
const ctx = { write, L, registry, ROOT, extras: {} };
for (const mod of ["./pages-agency.mjs", "./pages-insights.mjs"]) {
  const f = path.join(path.dirname(fileURLToPath(import.meta.url)), mod.replace("./", ""));
  if (fs.existsSync(f)) {
    const m = await import(mod);
    m.render(ctx);
  }
}
patchSite({ ROOT, L, BASE: L.BASE, hasInsights: !!ctx.extras.hasInsights, hasServices: !!ctx.extras.hasServices, insightsPreview: ctx.extras.insightsPreview || "" });

// ---------------- sitemaps ----------------
const urlset = (items) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.map((r) => `  <url><loc>${r.url}</loc><lastmod>${r.lastmod}</lastmod><priority>${r.priority}</priority></url>`).join("\n")}\n</urlset>\n`;
const agency = [
  { url: SITE + "/", section: "agency", lastmod: today, priority: 1.0 },
  { url: SITE + "/snap-projects.html", section: "agency", lastmod: today, priority: 0.8 },
  ...registry.filter((r) => r.section === "agency"),
];
fs.writeFileSync(path.join(ROOT, "sitemap-agency.xml"), urlset(agency));
fs.writeFileSync(path.join(ROOT, "sitemap-taaweel.xml"), urlset(registry.filter((r) => r.section === "taaweel")));
fs.writeFileSync(path.join(ROOT, "sitemap-homeschooling.xml"), urlset(registry.filter((r) => r.section === "homeschooling")));
fs.writeFileSync(
  path.join(ROOT, "sitemap_index.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["sitemap-agency.xml", "sitemap-taaweel.xml", "sitemap-homeschooling.xml", "sitemap.xml"].map((f) => `  <sitemap><loc>${SITE}/${f}</loc><lastmod>${today}</lastmod></sitemap>`).join("\n")}\n</sitemapindex>\n`,
);
// Master list for the live /sitemap.xml (Cloud Function appends blog articles) and the repo copy of it.
const blogHub = { url: SITE + "/blog", section: "agency", lastmod: today, priority: 0.7 };
const master = [...agency, blogHub, ...registry.filter((r) => r.section !== "agency")];
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), urlset(master));
fs.writeFileSync(path.join(ROOT, "functions", "site-pages.json"), JSON.stringify(master.map(({ url, lastmod, priority }) => ({ url, lastmod, priority })), null, 1) + "\n");
// Shared chrome for pages the Cloud Function renders (/blog/<slug>).
fs.writeFileSync(path.join(ROOT, "functions", "site-chrome.json"), JSON.stringify({ header: L.navBlock("company"), footer: L.richFooter() }) + "\n");
console.log(`Generated ${registry.length} pages, ${master.length} URLs in sitemap.xml.`);
