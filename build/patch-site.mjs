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


  // ---- shared chrome: one header (mega menu + drawer) and one footer on every hand-written page ----
  const endOfEl = (s, start, tag) => {
    const re = new RegExp("<(/?)" + tag + "\\b[^>]*>", "g");
    re.lastIndex = start;
    let depth = 0, m;
    while ((m = re.exec(s))) {
      depth += m[1] ? -1 : 1;
      if (depth === 0) return m.index + m[0].length;
    }
    throw new Error("unbalanced " + tag);
  };
  const swapChrome = (s, current) => {
    // header + drawer
    const hs = "<!-- site-nav:start -->", he = "<!-- site-nav:end -->";
    const block = hs + "\n" + L.navBlock(current) + "\n" + he;
    if (s.includes(hs)) s = s.replace(new RegExp(hs + "[\\s\\S]*?" + he), () => block);
    else {
      const a = s.indexOf('<header class="site-header">');
      if (a < 0) throw new Error("header not found");
      const hEnd = s.indexOf("</header>", a) + "</header>".length;
      const d = s.indexOf('<div class="nav__drawer"', hEnd);
      const b = d >= 0 && !s.slice(hEnd, d).trim() ? endOfEl(s, d, "div") : hEnd;
      s = s.slice(0, a) + block + s.slice(b);
    }
    // footer
    const fs_ = "<!-- site-footer:start -->", fe = "<!-- site-footer:end -->";
    const fblock = fs_ + "\n" + L.richFooter() + "\n" + fe;
    if (s.includes(fs_)) s = s.replace(new RegExp(fs_ + "[\\s\\S]*?" + fe), () => fblock);
    else {
      const a = s.indexOf('<footer class="footer">');
      if (a < 0) throw new Error("footer not found");
      const b = s.indexOf("</footer>", a) + "</footer>".length;
      s = s.slice(0, a) + fblock + s.slice(b);
    }
    if (!s.includes("/css/nav.css")) s = s.replace("</head>", () => '<link rel="stylesheet" href="/css/nav.css" />\n</head>');
    if (!s.includes("/js/nav.js")) s = s.replace("</body>", () => '<script src="/js/nav.js" defer></script>\n</body>');
    return s;
  };

  // ---- homepage ----
  let idx = fixLinks(read("index.html"));
  if (!idx.includes('/css/pages.css')) idx = idx.replace('</head>', '    <link rel="stylesheet" href="/css/pages.css" />\n  </head>');
  const card = (href, ic, tag, title, text, x = {}) => `<a class="card${x.cls ? " " + x.cls : ""}" href="${href}">${L.pict(ic)}<span class="card__tag">${tag}</span><h3>${title}${x.ar ? ` <span class="card__ar" lang="ar" dir="rtl">${x.ar}</span>` : ""}</h3><p>${text}</p>${x.app ? `<span class="card__app">${x.app}</span>` : ""}<span class="card__more">Explore</span></a>`;
  const productsSection = `<section class="band hp-products" id="products" style="position:relative;z-index:1"><div class="wrap">
${L.secHead("Products", "Software we build, ship and own", "Alongside client delivery we run a product studio. Each product is a working application with its own page.")}
<div class="cards">
${card(BASE.taaweel + "/", "book", "Early access", "Taaweel", "An AI research engine for Quranic inquiry: whole-corpus concordance, tiered evidence, adversarial audit and cited reports.", { cls: "card--taaweel", ar: "تأويل", app: "taaweel.snapkodex.com" })}
${card(BASE.home + "/", "sun", "Live", "Homeschooling", "Guiding-light curriculum, an AI-built syllabus, a drag-and-drop planner and fair completion-based scoring for families.")}
${card("/snap-projects.html", "tasks", "Desktop app", "Snap Projects", "An AI workspace for managers: your files, Jira and Confluence, meeting answers and a commitment ledger.")}
${card("https://snaprytr.com", "pencil", "Live SaaS", "SnapRytr", "AI chat for expert marketers: briefs, campaign tuning and content flows.")}
</div>
<p style="margin-top:28px"><a class="btn btn--ghost" href="/products/">View the full portfolio</a></p></div></section>`;
  if (hasServices) {
    const map = {
      "service-web-development": ["/services/saas-and-enterprise-development/web-application-development/", "Explore web development"],
      "service-agentic-ai": ["/services/agentic-ai-development/", "Explore architecture & specs"],
      "service-saas": ["/services/saas-and-enterprise-development/", "Explore architecture & specs"],
      "service-custom-solutions": ["/services/saas-and-enterprise-development/erp-crm-development/", "Explore architecture & specs"],
      "service-automation": ["/services/ai-agents-and-automation/", "Explore architecture & specs"],
      "service-sales-agent": ["/services/ai-agents-and-automation/sales-agents/", "Explore architecture & specs"],
      "service-chatbot": ["/services/ai-agents-and-automation/rag-chatbots/", "Explore architecture & specs"],
      "service-customer-service": ["/services/ai-agents-and-automation/customer-support-agents/", "Explore architecture & specs"],
      "service-ecommerce": ["/services/ai-agents-and-automation/ecommerce-bots/", "Explore architecture & specs"],
    };
    for (const [id, [href, label]] of Object.entries(map)) {
      const start = idx.indexOf(`id="${id}"`);
      if (start < 0) continue;
      const leadAt = idx.indexOf('class="service-card__lead"', start);
      const pEnd = idx.indexOf("</p>", leadAt);
      const nextCard = idx.indexOf("<article", start + 10);
      if (leadAt < 0 || pEnd < 0 || (nextCard > 0 && pEnd > nextCard)) continue;
      const link = `<a class="service-more" href="${href}">${label} &rarr;</a>`;
      const seg = idx.slice(pEnd, pEnd + 400);
      if (seg.includes("service-more")) continue;
      idx = idx.slice(0, pEnd + 4) + "\n                " + link + idx.slice(pEnd + 4);
    }
  }
  idx = inject(idx, "hp-products", productsSection, /<section class="techstack" id="techstack">/);
  if (insightsPreview) idx = inject(idx, "hp-insights", insightsPreview, /<section class="faq" id="faq"/);
  idx = swapChrome(idx, "");
  save("index.html", idx);

  // ---- other pages: just fix links and add Insights link ----
  for (const f of ["blog.html", "snap-projects.html", "products.html", "-snap-projects.html", "fonts/index.html"]) {
    let s = fixLinks(read(f));
    if (f === "snap-projects.html") {
      if (!s.includes("/css/pages.css")) s = s.replace("</head>", '<link rel="stylesheet" href="/css/pages.css" /></head>');
      const items = [
        ["mic", "Meeting answers", "A short answer to say aloud, a delivery cue and deeper follow-ups with dated, sourced evidence tiles. Statistics are accepted only when they match real search citations."],
        ["flag", "Commitment ledger", "Reads meeting transcripts, Slack, Jira and ClickUp to catch verbal commitments that never landed anywhere, and flags drift between what was said and what the tracker shows."],
        ["target", "Goals", "Give the assistant a durable objective with a token budget. It keeps working across many turns, checkpoints its progress and stops when it can show the work is done."],
        ["check", "Checks", "Write a question once, such as whether a contract renews automatically, and get a probability, a pick or a score for every document, with flagged results queued for review."],
        ["sparkle", "Skills", "Save how you like recurring work done, including release notes or client reports, and the assistant follows it whenever a request matches. Import Claude-style SKILL.md files."],
        ["video", "Video and 3D animation", "Generate narrated videos and standalone 3D animations. Scenes are written as code by your chosen model, checked and repaired automatically, and rendered offline."],
      ];
      const sec = `<section class="band" id="whats-new" style="position:relative;z-index:1"><div class="wrap theme-snapprojects">${L.secHead("Built into the desktop app", "Beyond chat: tools for running real projects", "Recent releases add the features managers asked for most. Pricing and availability are shown below.")}<div class="cards">${items.map(([ic, t, d]) => L.cardPlain({ icon: ic, title: t, text: d })).join("")}</div></div></section>`;
      s = inject(s, "sp-whatsnew", sec, /<section class="comparison" id="pricing">/);
    }
    s = swapChrome(s, f === "blog.html" ? "company" : f === "fonts/index.html" ? "" : "products");
    save(f, s);
  }
}
