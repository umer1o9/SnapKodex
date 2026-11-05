// Renders /insights/ (hub) and /insights/<slug>/ (articles). Content lives in content-insights.mjs.
import { articles } from "./content-insights.mjs";

const SITE = "https://snapkodex.com";
const fmtDate = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const THEMES = { agentic: "theme-ai", saas: "theme-saas", automation: "theme-auto", products: "theme-taaweel" };
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function render({ write, L, extras }) {
  const { esc } = L;
  extras.hasInsights = true;

  const banner = (a, w = 600, h = 170) => {
    const ico = L.icon(a.icon).replace("<svg ", `<svg x="${w - 150}" y="${h / 2 - 50}" width="100" height="100" `);
    const dots = Array.from({ length: 7 }, (_, i) => `<circle cx="${40 + i * 24}" cy="${28}" r="2" fill="rgba(var(--accent-rgb),.5)"/>`).join("");
    return `<svg class="art post-card__svg ${THEMES[a.wheel] || ""}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(a.cat)}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="bn-${a.slug.slice(0, 8)}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgb(var(--accent-rgb))" stop-opacity=".28"/><stop offset="1" stop-color="#ab54ec" stop-opacity=".12"/></linearGradient></defs><rect width="${w}" height="${h}" rx="18" fill="url(#bn-${a.slug.slice(0, 8)})"/><rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="18" fill="none" stroke="rgba(var(--accent-rgb),.35)"/>${dots}<circle cx="${w - 100}" cy="${h / 2}" r="62" style="fill:var(--svg-glass)" stroke="rgba(var(--accent-rgb),.5)"/><g class="ico">${ico}</g><text x="40" y="${h - 36}" style="fill:var(--brand-text);font-size:20px;font-weight:500">${esc(a.cat)}</text><text x="40" y="${h - 14}" style="fill:var(--brand-muted);font-size:13px">${a.read} min read</text></svg>`;
  };
  const card = (a) => `<a class="card post-card ${THEMES[a.wheel] || ""}" href="/insights/${a.slug}/" data-cat="${esc(a.cat)}"><div class="post-card__art">${banner(a)}</div><span class="card__tag">${esc(a.cat)} · ${a.read} min</span><h3>${esc(a.title)}</h3><p>${esc(a.dek)}</p><span class="card__more">Read the insight</span></a>`;

  // ---------- hub ----------
  {
    const bc = [["/", "SnapKodex"], ["/insights/", "Insights"]];
    const cats = [...new Set(articles.map((a) => a.cat))];
    const featured = articles.find((a) => a.slug === "staged-research-pipeline-over-a-fixed-corpus") || articles[0];
    const rest = articles.filter((a) => a !== featured);
    const body = `${L.globalHeader("Insights")}
<main id="main" class="pg"><div class="wrap">${L.crumbs(bc)}
${L.hero({ eyebrow: "Insights", h1: "Engineering notes from the people <em>who build the systems</em>", lead: "Practical write-ups on agentic AI, SaaS architecture and automation, plus case studies from our own products. No hype, no invented benchmarks: how we think about the problems and what we would do again.", actions: [["#latest", "Read the latest"], [L.U.contact(), "Talk to an engineer", "ghost"]], art: L.heroArt("pencil", ["network", "search", "users", "code", "book"], "Snap Kodex insights") })}
</div>
<section class="band" id="latest"><div class="wrap">
<div class="sec-head"><span class="sec-eyebrow">Featured</span><h2>${esc(featured.title)}</h2><p>${esc(featured.dek)}</p><p style="margin-top:18px"><a class="btn btn--primary" href="/insights/${featured.slug}/">Read the case study</a></p></div>
<div class="chips" role="group" aria-label="Filter by topic" style="margin:36px 0 24px"><button type="button" class="chip" data-filter="all" aria-current="true" style="cursor:pointer;font-family:inherit">All</button>${cats.map((c) => `<button type="button" class="chip" data-filter="${esc(c)}" style="cursor:pointer;font-family:inherit">${esc(c)}</button>`).join("")}</div>
<div class="cards" id="post-grid">${[featured, ...rest].map(card).join("")}</div></div></section>
<section class="band band--tint"><div class="wrap">${L.secHead("Topics", "Where these notes lead")}<div class="cards">${[
      ["robot", "Agentic AI development", "Orchestration, retrieval, tools and evaluation.", "/services/agentic-ai-development/"],
      ["cloud", "SaaS and enterprise development", "Tenancy, identity, billing and scale.", "/services/saas-and-enterprise-development/"],
      ["bolt", "AI agents and automation", "Support, sales, ecommerce and workflow automation.", "/services/ai-agents-and-automation/"],
    ].map(([i, t, d, h]) => L.cardLink({ href: h, icon: i, title: t, text: d, more: "See the service" })).join("")}</div></div></section>
<section class="band"><div class="wrap">${L.cta({ title: "Have a problem like one of these?", text: "Bring it to an engineer. We will tell you plainly whether and how we can help.", primary: [L.U.contact(), "Start a conversation"], secondary: ["/services/", "Our services"] })}</div></section>
</main>${L.globalFooter()}<script src="/js/insights.js" defer></script>`;
    write("/insights/", L.page(L.head({ title: "Insights | Agentic AI, SaaS Architecture & Automation | Snap Kodex", description: "Engineering insights on agentic AI, hybrid RAG, multi-tenant SaaS, support automation and case studies from Snap Kodex products.", path: "/insights/", schema: [L.breadcrumbSchema(bc), { "@type": "CollectionPage", name: "Snap Kodex Insights", url: SITE + "/insights/" }] }), body, "theme-insights"), "agency", 0.8);
  }

  // ---------- articles ----------
  for (const a of articles) {
    const url = `/insights/${a.slug}/`;
    const bc = [["/", "SnapKodex"], ["/insights/", "Insights"], [url, a.title]];
    const toc = [];
    const bodyHtml = a.body.replace(/<h2>(.*?)<\/h2>/g, (_, t) => {
      const id = slugify(t);
      toc.push([id, t]);
      return `<h2 id="${id}">${t}</h2>`;
    });
    const related = articles.filter((r) => r !== a && (r.wheel === a.wheel || r.cat === a.cat)).slice(0, 3);
    const fill = related.length < 3 ? [...related, ...articles.filter((r) => r !== a && !related.includes(r))].slice(0, 3) : related;
    const hubLink = { agentic: ["/services/agentic-ai-development/", "Agentic AI development"], saas: ["/services/saas-and-enterprise-development/", "SaaS & enterprise development"], automation: ["/services/ai-agents-and-automation/", "AI agents & automation"] }[a.wheel];
    const ldArticle = { "@type": "Article", headline: a.title, description: a.dek, datePublished: a.date, dateModified: a.date, author: { "@type": "Organization", name: "Snap Kodex Engineering", url: SITE + "/" }, publisher: { "@type": "Organization", name: "Snap Kodex", url: SITE + "/", "@id": SITE + "/#organization" }, mainEntityOfPage: SITE + url };
    const body = `${L.globalHeader("Insights")}
<main id="main" class="pg ${THEMES[a.wheel] || ""}"><div class="wrap">${L.crumbs(bc.map(([h, t], i) => (i === 2 ? [h, t.length > 48 ? t.slice(0, 46) + "…" : t] : [h, t])))}
<article class="article" style="padding:28px 0 56px">
<div class="tagrow"><a class="tag" href="/insights/">${esc(a.cat)}</a>${hubLink ? `<a class="tag" href="${hubLink[0]}">${hubLink[1]}</a>` : ""}</div>
<h1>${esc(a.title)}</h1>
<p class="phero__lead" style="margin-bottom:18px">${esc(a.dek)}</p>
<div class="meta"><span>By Snap Kodex Engineering</span><span>&middot;</span><time datetime="${a.date}">${fmtDate(a.date)}</time><span>&middot;</span><span>${a.read} min read</span></div>
<div style="margin-bottom:30px">${banner(a, 800, 220)}</div>
${L.callout("star", "Key takeaways", `<ul style="margin:8px 0 0 18px">${a.takeaways.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`)}
<nav class="toc" aria-label="Contents" style="margin-top:28px"><b>In this article</b><ol>${toc.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join("")}</ol></nav>
${bodyHtml}
${a.bridge ? `<div style="margin:36px 0">${L.callout("compass", "See it in the product", `This article describes engineering behind a product we run. <a href="${a.bridge.href}">${a.bridge.label}</a>.`, true)}</div>` : ""}
</article></div>
<section class="band band--tint"><div class="wrap">${L.secHead("Keep reading", "More insights")}<div class="cards">${fill.map(card).join("")}</div></div></section>
<section class="band"><div class="wrap">${L.cta({ title: "Want this applied to your system?", text: "Tell us about it and an engineer will reply with questions and a realistic first step.", primary: [L.U.contact(), a.cta[0]], secondary: hubLink ? [hubLink[0], hubLink[1]] : ["/services/", "Our services"] })}</div></section>
</main>${L.globalFooter()}`;
    write(url, L.page(L.head({ title: `${a.title} | Snap Kodex Insights`, description: a.dek, path: url, type: "article", schema: [L.breadcrumbSchema(bc), ldArticle] }), body, THEMES[a.wheel] || "theme-insights"), "agency", 0.7);
  }

  // ---------- homepage preview ----------
  const pick = ["staged-research-pipeline-over-a-fixed-corpus", "multi-tenant-saas-pool-bridge-silo", "ai-customer-support-triage-urgency-and-mood"].map((s) => articles.find((a) => a.slug === s)).filter(Boolean);
  extras.insightsPreview = `<section class="band hp-insights" id="insights" style="position:relative;z-index:1"><div class="wrap">${L.secHead("Insights", "Engineering notes from our team", "Practical write-ups on agents, SaaS architecture and automation, plus case studies from our own products.")}<div class="cards">${pick.map(card).join("")}</div><p style="margin-top:28px"><a class="btn btn--ghost" href="/insights/">All insights</a></p></div></section>`;
}
