// Idempotent patches to the hand-written root pages (index.html, products.html redirect target links, blog.html, snap-projects.html).
import fs from "node:fs";
import path from "node:path";

export function patchSite({ ROOT, L, BASE, hasInsights = false, hasServices = false, insightsPreview = "" }) {
  const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
  const save = (f, s) => fs.writeFileSync(path.join(ROOT, f), s, "utf8");
  const inject = (s, id, html, anchorRe, where = "before") => {
    const start = `<!-- ${id}:start -->`;
    const end = `<!-- ${id}:end -->`;
    const block = `${start}\n${html}\n${end}`;
    const re = new RegExp(`${start}[\\s\\S]*?${end}`);
    if (re.test(s)) return s.replace(re, () => block);
    const m = s.match(anchorRe);
    if (!m) throw new Error("anchor not found for " + id);
    return where === "before" ? s.replace(anchorRe, () => block + "\n" + m[0]) : s.replace(anchorRe, () => m[0] + "\n" + block);
  };

  // ---- shared nav/footer link fixes ----
  const fixLinks = (s) =>
    s
      .replace(/href="\.\/products\.html"/g, 'href="/products/"')
      .replace(/href="products\.html"/g, 'href="/products/"')
      .replace(/snapkodex\.com\/products\.html/g, "snapkodex.com/products/");
  const addInsightsLink = (s) => {
    if (!hasInsights) return s;
    // after the Blog link inside nav__links and nav__drawer-links, add an Insights link once
    return s.replace(/(<a href="(?:\.\/)?blog\.html" data-blog-link[^>]*>Blog<\/a>)(?!<a href="\/insights\/">)(\s*)/g, '$1$2<a href="/insights/">Insights</a>$2');
  };

  // ---- homepage ----
  let idx = fixLinks(read("index.html"));
  idx = addInsightsLink(idx);
  if (!idx.includes('/css/pages.css')) idx = idx.replace('</head>', '    <link rel="stylesheet" href="/css/pages.css" />\n  </head>');
  const card = (href, ic, tag, title, text) => `<a class="card" href="${href}">${L.pict(ic)}<span class="card__tag">${tag}</span><h3>${title}</h3><p>${text}</p><span class="card__more">Explore</span></a>`;
  const productsSection = `<section class="band hp-products" id="products" style="position:relative;z-index:1">${L.SVG_DEFS}<div class="wrap">
${L.secHead("Products", "Software we build, ship and own", "Alongside client delivery we run a product studio. Each product is a working application with its own page.")}
<div class="cards">
${card(BASE.taaweel + "/", "book", "Early access", "Taaweel", "An AI research engine for Quranic inquiry: whole-corpus concordance, tiered evidence, adversarial audit and cited reports.")}
${card(BASE.home + "/", "sun", "Live", "Homeschooling", "Guiding-light curriculum, an AI-built syllabus, a drag-and-drop planner and fair completion-based scoring for families.")}
${card("/snap-projects.html", "tasks", "Desktop app", "Snap Projects", "An AI workspace for managers: your files, Jira and Confluence, meeting answers and a commitment ledger.")}
${card("https://snaprytr.com", "pencil", "Live SaaS", "SnapRytr", "AI chat for expert marketers: briefs, campaign tuning and content flows.")}
</div>
<p style="margin-top:28px"><a class="btn btn--ghost" href="/products/">View the full portfolio</a></p></div></section>`;
  idx = inject(idx, "hp-products", productsSection, /<section class="techstack" id="techstack">/);
  if (insightsPreview) idx = inject(idx, "hp-insights", insightsPreview, /<section class="faq" id="faq"/);
  save("index.html", idx);

  // ---- other pages: just fix links and add Insights link ----
  for (const f of ["blog.html", "snap-projects.html"]) {
    let s = addInsightsLink(fixLinks(read(f)));
    save(f, s);
  }
}
