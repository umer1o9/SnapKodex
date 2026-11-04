const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret, defineString } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");

const deliveryKey = defineSecret("AUTOBLOG_API_KEY");
const siteId = defineString("AUTOBLOG_SITE_ID");
const API_BASE = "https://autoblogging.snaprytr.com";
const SITE_BASE = "https://snapkodex.com";

function getSiteId() {
  const value = siteId.value();
  if (!value) throw new Error("AutoBlog website ID is not configured.");
  return value;
}

async function requestArticleApi(path, query = {}) {
  const url = new URL(path, API_BASE);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${deliveryKey.value()}` },
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  const requestId = response.headers.get("x-request-id");
  let body;
  try {
    body = await response.json();
  } catch {
    const error = new Error("AutoBlog returned a non-JSON response.");
    error.status = response.status;
    error.requestId = requestId;
    throw error;
  }
  if (!response.ok) {
    const error = new Error(body.error || "AutoBlog request failed.");
    error.status = response.status;
    error.requestId = body.requestId || requestId;
    throw error;
  }
  return body;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function sendError(res, error) {
  const status = Number(error.status) || 502;
  if (status >= 500) {
    logger.error("AutoBlog delivery request failed", {
      status,
      requestId: error.requestId,
      message: error.message,
    });
  }
  res.status(status).json({
    error: status === 404 ? "Article not found." : "Blog content is temporarily unavailable.",
    requestId: error.requestId || undefined,
  });
}

exports.autoblogApi = onRequest(
  { region: "us-central1", secrets: [deliveryKey], timeoutSeconds: 20 },
  async (req, res) => {
    res.set("Cache-Control", "no-store");
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed." });

    try {
      const route = req.path.replace(/^\/api\/blog/, "");
      if (route && route !== "/") return res.status(404).json({ error: "Not found." });
      const limit = Number(req.query.limit ?? 12);
      const offset = Number(req.query.offset ?? 0);
      if (!Number.isInteger(limit) || limit < 1 || limit > 100 ||
          !Number.isInteger(offset) || offset < 0) {
        return res.status(400).json({ error: "Invalid pagination." });
      }

      const payload = await requestArticleApi(
        `/api/v1/sites/${encodeURIComponent(getSiteId())}/articles`,
        { limit, offset },
      );
      const articles = Array.isArray(payload.articles) ? payload.articles : [];
      return res.json({
        articles: articles.map((article) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          category: article.category,
          author: article.author,
          coverImage: article.coverImage || null,
          publishedAt: article.publishedAt,
        })),
        total: Number(payload.total) || 0,
        offset,
        limit,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },
);

function articleDocument(article) {
  const title = escapeHtml(article.title || "Snap Kodex Blog");
  const description = escapeHtml(article.metaDescription || article.excerpt || "Insights from Snap Kodex.");
  const canonical = `${SITE_BASE}/blog/${encodeURIComponent(article.slug)}`;
  const image = article.coverImage && article.coverImage.url ? article.coverImage.url : "";
  const imageMeta = image ? `<meta property="og:image" content="${escapeHtml(image)}"><meta name="twitter:image" content="${escapeHtml(image)}">` : "";
  const content = article.html || `<h1>${title}</h1>${article.excerpt ? `<p>${escapeHtml(article.excerpt)}</p>` : ""}`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | Snap Kodex Blog</title><meta name="description" content="${description}">
<link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.ico"><meta name="robots" content="index,follow">
<meta property="og:type" content="article"><meta property="og:site_name" content="Snap Kodex"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}">${imageMeta}
<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}">
<link rel="stylesheet" href="/css/theme.css"><link rel="stylesheet" href="/css/blog.css"><link rel="stylesheet" href="/css/article.css"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,0,0" rel="stylesheet"><script>try{if(localStorage.getItem('sk-theme')==='light')document.documentElement.dataset.theme='light'}catch(e){}</script>
<script src="/js/theme.js" defer></script></head><body><div class="blog-ambient" aria-hidden="true"></div>
<header class="site-header"><nav class="nav" aria-label="Primary"><a class="nav__logo" href="/" aria-label="Snap Kodex home"><img data-logo="snapkodex" src="/snapkodex logo full dark.svg" alt="Snap Kodex" width="160" height="36"></a><div class="nav__links"><a href="/products.html">Our products</a><a href="/blog">Blog</a><a href="/#services">Our services</a><a href="/#contact">Contact Us</a></div><div class="nav__actions"><button type="button" class="nav__theme-toggle" data-theme-toggle aria-pressed="false" aria-label="Switch to light theme"><span class="material-symbols-rounded" aria-hidden="true">light_mode</span></button><a class="nav__cta" href="/#contact">Start a project</a></div></nav></header>
<main class="blog-article-page"><a class="blog-back" href="/blog">← All articles</a><div class="blog-content autoblog-article">${content}</div></main>
<footer class="footer"><div class="footer__inner"><img class="footer__logo" src="/snapkodex logo full dark.svg" data-logo="snapkodex" alt="Snap Kodex"><div class="footer__links"><a href="/">Home</a><a href="/products.html">Products</a><a href="/blog">Blog</a><a href="/#contact">Contact</a></div></div></footer></body></html>`;
}

exports.blogPage = onRequest(
  { region: "us-central1", secrets: [deliveryKey], timeoutSeconds: 20 },
  async (req, res) => {
    res.set("Cache-Control", "no-store");
    if (req.method !== "GET") return res.status(405).send("Method not allowed.");
    let slug;
    try {
      slug = decodeURIComponent(req.path.replace(/^\/blog\//, "")).replace(/\/$/, "");
      if (!slug) return res.redirect(308, "/blog");
      if (slug.includes("/")) return res.status(404).send("Not found.");
    } catch {
      return res.status(404).send("Not found.");
    }
    try {
      const payload = await requestArticleApi(
        `/api/v1/sites/${encodeURIComponent(getSiteId())}/articles/${encodeURIComponent(slug)}`,
      );
      if (!payload.article) return res.status(404).send("Not found.");
      return res.status(200).type("html").send(articleDocument(payload.article));
    } catch (error) {
      if (Number(error.status) === 404) return res.status(404).type("html").send("<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Article not found | Snap Kodex</title><link rel=\"stylesheet\" href=\"/css/theme.css\"><link rel=\"stylesheet\" href=\"/css/blog.css\"><body><main class=\"blog-error\"><p>404</p><h1>Article not found</h1><a href=\"/blog\">Back to all articles</a></main></body></html>");
      logger.error("Unable to render AutoBlog article", { status: error.status, requestId: error.requestId, message: error.message });
      return res.status(503).type("html").send("<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Blog unavailable | Snap Kodex</title><link rel=\"stylesheet\" href=\"/css/theme.css\"><link rel=\"stylesheet\" href=\"/css/blog.css\"><body><main class=\"blog-error\"><p>Temporarily unavailable</p><h1>We couldn't load this article right now.</h1><a href=\"/blog\">Back to all articles</a></main></body></html>");
    }
  },
);

exports.siteMap = onRequest(
  { region: "us-central1", secrets: [deliveryKey], timeoutSeconds: 60 },
  async (req, res) => {
    res.set("Cache-Control", "public, max-age=300, s-maxage=300");
    res.type("application/xml");
    if (req.method !== "GET") return res.status(405).send("<?xml version=\"1.0\"?><error>Method not allowed</error>");
    try {
      const urls = [
        `${SITE_BASE}/`,
        `${SITE_BASE}/products.html`,
        `${SITE_BASE}/snap-projects.html`,
        `${SITE_BASE}/blog`,
      ];
      const limit = 100;
      let offset = 0;
      let total = 0;
      do {
        const payload = await requestArticleApi(
          `/api/v1/sites/${encodeURIComponent(getSiteId())}/articles`,
          { limit, offset },
        );
        const articles = Array.isArray(payload.articles) ? payload.articles : [];
        total = Number(payload.total) || 0;
        for (const article of articles) {
          if (article.slug) urls.push(`${SITE_BASE}/blog/${encodeURIComponent(article.slug)}`);
        }
        offset += articles.length;
        if (!articles.length) break;
      } while (offset < total && offset < 100000);

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`).join("\n")}\n</urlset>`;
      return res.status(200).send(xml);
    } catch (error) {
      logger.error("Unable to generate sitemap", { status: error.status, requestId: error.requestId, message: error.message });
      return res.status(503).send("<?xml version=\"1.0\" encoding=\"UTF-8\"?><error>Sitemap temporarily unavailable.</error>");
    }
  },
);
