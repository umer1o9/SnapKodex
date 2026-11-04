// Renders /services/ (overview), 3 service hubs, 18 spokes and /contact/.
import { wheels } from "./content-agency.mjs";

let articles = [];
try {
  articles = (await import("./content-insights.mjs")).articles;
} catch {
  /* insights not built yet */
}

const SITE = "https://snapkodex.com";

export function render({ write, L, extras }) {
  const { esc } = L;
  extras.hasServices = true;
  const hubUrl = (w) => `${w.base}/`;
  wheels.forEach((w) => w.spokes.forEach((s) => (s.url = `${w.base}/${s.slug}/`)));
  const bridges = { agentic: ["automation", "saas"], automation: ["agentic"], saas: ["agentic"] };
  const wheelByKey = Object.fromEntries(wheels.map((w) => [w.key, w]));

  const insightsFor = (key, n = 3) => articles.filter((a) => a.wheel === key).slice(0, n);
  const insightCards = (list) =>
    list.map((a) => L.cardLink({ href: `/insights/${a.slug}/`, icon: a.icon, tag: a.cat, title: a.title, text: a.dek, more: "Read the insight" })).join("");

  const serviceSchema = (w, url, name, desc) => ({
    "@type": "Service",
    name,
    serviceType: w.service,
    description: desc,
    url: SITE + url,
    provider: { "@type": "Organization", name: "Snap Kodex", url: SITE + "/", "@id": SITE + "/#organization" },
    areaServed: "Worldwide",
  });

  // ---------- /services/ overview ----------
  {
    const bc = [["/", "SnapKodex"], ["/services/", "Services"]];
    const disciplines = [
      ["Agentic AI Development", "agentic"], ["SaaS Development", "saas"], ["Custom Solution Development", "saas"], ["Web Development", "saas"],
      ["AI Automation", "automation"], ["AI Chatbot Development", "automation"], ["Sales Agent Development", "automation"],
      ["Customer Service Agent Development", "automation"], ["Ecommerce Bot Development", "automation"],
    ];
    const body = `${L.globalHeader("Services")}
<main id="main" class="pg"><div class="wrap">${L.crumbs(bc)}
${L.hero({ eyebrow: "Services", h1: "Engineering for <em>agents, platforms and automation</em>", lead: "Snap Kodex is an AI-native software house. We build production agent systems, cloud-native SaaS and enterprise platforms, and automations that take repetitive work off your team.", actions: [[L.U.contact(), "Start a project"], ["#wheels", "Explore services", "ghost"]], art: L.heroArt("layers", ["robot", "cloud", "bolt", "code", "shield"], "Snap Kodex services") })}
</div>
<section class="band" id="wheels"><div class="wrap">${L.secHead("Three service areas", "Where we can help", "Nine disciplines, grouped by what you are trying to achieve.")}
<div class="cards">${wheels.map((w) => L.cardLink({ href: hubUrl(w), icon: w.hub.icon, tag: w.service, title: w.hub.h1.replace(/<\/?em>/g, ""), text: w.hub.lead.split(". ")[0] + ".", more: "Explore " + w.hub.nav })).join("")}</div></div></section>
<section class="band band--tint"><div class="wrap">${L.secHead("All disciplines", "Nine disciplines, one team")}<div class="chips">${disciplines.map(([n, k]) => `<a class="chip" href="${hubUrl(wheelByKey[k])}">${n}</a>`).join("")}</div></div></section>
<section class="band"><div class="wrap">${L.secHead("Why Snap Kodex", "How we work")}<div class="cards">${[
      ["code", "Engineers, not intermediaries", "You work directly with the people who design and build your system."],
      ["shield", "Production by default", "Testing, observability, security review and handover documentation come standard."],
      ["brain", "AI where it earns its place", "We use models where they help and conventional software where it is better."],
      ["book", "Products of our own", "We run a product studio, so we know what it costs to maintain what we ship."],
    ].map(([i, t, d]) => L.cardPlain({ icon: i, title: t, text: d })).join("")}</div></div></section>
<section class="band"><div class="wrap">${L.cta({ title: "Tell us what you are building", text: "A short conversation is enough to know whether we are the right team.", primary: [L.U.contact(), "Start a project"], secondary: ["/products/", "See our products"] })}</div></section>
</main>${L.globalFooter()}`;
    write("/services/", L.page(L.head({ title: "Services | AI Agents, SaaS & Enterprise Software | Snap Kodex", description: "Agentic AI development, SaaS and enterprise software, AI agents and automation. Nine engineering disciplines from one AI-native software house.", path: "/services/", schema: [L.breadcrumbSchema(bc)] }), body, "theme-agency"), "agency", 0.9);
  }

  // ---------- hubs and spokes ----------
  for (const w of wheels) {
    const h = w.hub;
    const hubPath = hubUrl(w);
    const bcHub = [["/", "SnapKodex"], ["/services/", "Services"], [hubPath, h.nav]];
    const rel = (bridges[w.key] || []).map((k) => wheelByKey[k]);
    const body = `${L.globalHeader("Services")}
<main id="main" class="pg"><div class="wrap">${L.crumbs(bcHub)}
${L.hero({ eyebrow: h.eyebrow, h1: h.h1, lead: h.lead, actions: [[L.U.contact(), h.cta.label], ["#capabilities", "See what we cover", "ghost"]], art: L.heroArt(h.art.main, h.art.sats, h.nav) })}
</div>
<section class="band"><div class="wrap split"><div>${L.secHead("The challenge", h.why.title)}<div class="prose">${h.why.paras.map((p) => `<p>${p}</p>`).join("")}</div></div><div>${L.checklist(h.points)}</div></div></section>
<section class="band band--tint" id="capabilities"><div class="wrap">${L.secHead("What we cover", "Six focus areas", h.capLead)}<div class="cards">${w.spokes.map((s) => L.cardLink({ href: s.url, icon: s.icon, tag: s.nav, title: s.h1.replace(/<\/?em>/g, ""), text: s.lead.split(". ")[0] + ".", more: "Explore architecture & specs" })).join("")}</div></div></section>
<section class="band" id="process"><div class="wrap">${L.secHead("Process", h.stepsTitle)}${L.stepsHtml(h.steps)}</div></section>
<section class="band band--tint"><div class="wrap">${L.secHead("Production stack", "Technology we use for this work")}<div class="chips">${h.stack.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></div></section>
${insightsFor(w.key).length ? `<section class="band"><div class="wrap">${L.secHead("Insights", "Engineering notes on this topic")}<div class="cards">${insightCards(insightsFor(w.key))}</div></div></section>` : ""}
<section class="band" id="faq"><div class="wrap">${L.secHead("FAQ", "Questions we hear")}${L.faqHtml(h.faqs)}</div></section>
<section class="band"><div class="wrap"><div class="chips" style="margin-bottom:28px"><span class="chip" style="border-style:dashed">Related services</span>${rel.map((r) => `<a class="chip" href="${hubUrl(r)}">${r.hub.nav}</a>`).join("")}</div>${L.cta({ title: h.cta.title, text: h.cta.text, primary: [L.U.contact(), h.cta.label], secondary: ["/services/", "All services"] })}</div></section>
</main>${L.globalFooter()}`;
    write(hubPath, L.page(L.head({ title: h.meta.title, description: h.meta.desc, path: hubPath, schema: [L.breadcrumbSchema(bcHub), serviceSchema(w, hubPath, h.nav, h.meta.desc), L.faqSchema(h.faqs)] }), body, w.theme), "agency", 0.9);

    w.spokes.forEach((s, i) => {
      const bc = [["/", "SnapKodex"], ["/services/", "Services"], [hubPath, h.nav], [s.url, s.nav]];
      const title = `${s.nav} | ${h.nav} | Snap Kodex`;
      const desc = s.lead.length > 158 ? s.lead.slice(0, 155).replace(/\s+\S*$/, "") + "..." : s.lead;
      const mini = L.stepsHtml(s.steps);
      const body2 = `${L.globalHeader("Services")}
<main id="main" class="pg"><div class="wrap">${L.crumbs(bc)}
${L.hero({ eyebrow: s.nav, h1: s.h1, lead: s.lead, actions: [[L.U.contact(), h.cta.label], [hubPath, h.nav, "ghost"]], art: L.heroArt(s.icon, s.sats, s.nav) })}
</div>
<section class="band"><div class="wrap split"><div>${L.secHead("Overview", "How we approach it")}<div class="prose">${s.overview.map((p) => `<p>${p}</p>`).join("")}</div></div><div>${L.callout(s.callout[0], s.callout[1], s.callout[2])}<div style="height:22px"></div>${L.checklist(s.check)}</div></div></section>
<section class="band band--tint"><div class="wrap">${L.secHead("Delivery", "Step by step")}${mini}</div></section>
<section class="band"><div class="wrap">${L.secHead("Deliverables", "What you receive")}<div class="cards">${s.features.map(([ic, t, d]) => L.cardPlain({ icon: ic, title: t, text: d })).join("")}</div></div></section>
<section class="band band--tint"><div class="wrap">${L.secHead("Keep exploring", h.nav)}${L.wheelNav({ url: hubPath, nav: h.nav }, w.spokes.map((x) => ({ url: x.url, nav: x.nav })), i)}</div></section>
<section class="band"><div class="wrap">${L.secHead("FAQ", "Common questions")}${L.faqHtml(s.faqs)}</div></section>
<section class="band"><div class="wrap">${L.cta({ title: h.cta.title, text: h.cta.text, primary: [L.U.contact(), h.cta.label], secondary: [hubPath, h.nav] })}</div></section>
</main>${L.globalFooter()}`;
      write(s.url, L.page(L.head({ title, description: desc, path: s.url, schema: [L.breadcrumbSchema(bc), serviceSchema(w, s.url, s.nav, desc), L.faqSchema(s.faqs.map(([q, a]) => [q, a]))] }), body2, w.theme), "agency", 0.8);
    });
  }

  // ---------- /contact/ ----------
  {
    const bc = [["/", "SnapKodex"], ["/contact/", "Contact"]];
    const topics = ["Agentic AI development", "SaaS & enterprise development", "AI agents & automation", "Taaweel", "Homeschooling platform", "Snap Projects", "Partnership", "Something else"];
    const body = `${L.globalHeader("Contact Us")}
<main id="main" class="pg"><div class="wrap">${L.crumbs(bc)}
<section class="phero"><div><span class="phero__eyebrow">Contact</span><h1>Tell us what you are <em>building</em></h1><p class="phero__lead">Describe your product, timeline and goals. We reply quickly with questions or a proposed next step.</p>
<ul class="checklist"><li><span><strong>Email:</strong> <a href="mailto:hello@snapkodex.com">hello@snapkodex.com</a></span></li><li><span><strong>Hours:</strong> Monday to Friday, 9:00 to 18:00</span></li><li><span><strong>First step:</strong> a short call to understand the problem, the data and the risks</span></li></ul></div>
<div class="contact-panel"><form class="contact__form" action="#" method="post" aria-label="Contact Snap Kodex">
<label class="sr-only" for="contact-name">Full name</label><input id="contact-name" type="text" name="name" placeholder="Full name" autocomplete="name" required />
<label class="sr-only" for="contact-email">Work email</label><input id="contact-email" type="email" name="email" placeholder="Work email" autocomplete="email" required />
<label class="sr-only" for="contact-topic">Topic</label><select id="contact-topic" name="topic">${topics.map((t) => `<option>${esc(t)}</option>`).join("")}</select>
<label class="sr-only" for="contact-message">Project details</label><textarea id="contact-message" name="message" placeholder="Project details" required></textarea>
<div class="contact__status" role="status" aria-live="polite" hidden></div><button type="submit">Send message</button></form></div></section>
</div></main>${L.globalFooter()}<script type="module" src="/js/contact-form.js"></script>`;
    write("/contact/", L.page(L.head({ title: "Contact Snap Kodex | Start a Project", description: "Contact Snap Kodex about agentic AI, SaaS and enterprise development, automation or our products. We reply quickly.", path: "/contact/", schema: [L.breadcrumbSchema(bc), { "@type": "ContactPage", name: "Contact Snap Kodex", url: SITE + "/contact/" }] }), body, "theme-agency"), "agency", 0.8);
  }
}
