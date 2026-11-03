(function () {
  const pageSize = 12;
  const grid = document.getElementById("blog-grid");
  const status = document.getElementById("blog-status");
  const count = document.getElementById("blog-count");
  const pagination = document.getElementById("blog-pagination");
  if (!grid || !status || !pagination) return;

  let page = Math.max(1, Number(new URLSearchParams(location.search).get("page")) || 1);
  let requestController;

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[char]);
  }

  function formatDate(value) {
    if (!value || Number.isNaN(Date.parse(value))) return "";
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
  }

  function card(article) {
    const title = escapeHtml(article.title || "Untitled article");
    const slug = encodeURIComponent(article.slug || "");
    const image = article.coverImage && article.coverImage.url;
    const alt = escapeHtml(article.coverImage && article.coverImage.alt || article.title || "Article cover");
    const category = article.category ? `<span class="blog-card__category">${escapeHtml(article.category)}</span>` : "";
    const date = formatDate(article.publishedAt);
    const author = article.author ? escapeHtml(article.author) : "Snap Kodex";
    const media = image
      ? `<img src="${escapeHtml(image)}" alt="${alt}" loading="lazy">`
      : `<span class="blog-card__placeholder" aria-hidden="true">SK</span>`;
    return `<article class="blog-card"><a class="blog-card__image" href="/blog/${slug}" tabindex="-1" aria-hidden="true">${media}</a><div class="blog-card__body"><div class="blog-card__meta">${category}${date ? `<time datetime="${escapeHtml(article.publishedAt)}">${date}</time>` : ""}<span>${author}</span></div><h3><a href="/blog/${slug}" style="text-decoration:none">${title}</a></h3><p>${escapeHtml(article.excerpt || "Read the latest from Snap Kodex.")}</p><a class="blog-card__read" href="/blog/${slug}">Read article <span aria-hidden="true">→</span></a></div></article>`;
  }

  function updatePagination(total) {
    const pages = Math.ceil(total / pageSize);
    if (pages < 2) {
      pagination.hidden = true;
      pagination.innerHTML = "";
      return;
    }
    pagination.hidden = false;
    pagination.innerHTML = `<button type="button" data-page="${page - 1}" ${page <= 1 ? "disabled" : ""}>← Newer</button><span>Page ${page} of ${pages}</span><button type="button" data-page="${page + 1}" ${page >= pages ? "disabled" : ""}>Older →</button>`;
  }

  async function load() {
    if (requestController) requestController.abort();
    requestController = new AbortController();
    status.textContent = "Loading the latest articles…";
    grid.innerHTML = "";
    pagination.hidden = true;
    if (location.protocol === "file:") {
      status.textContent = "This local file preview can show the blog layout, but published articles load through the Firebase backend. Open the site through Firebase Hosting to load article data.";
      return;
    }
    try {
      const response = await fetch(`/api/blog?limit=${pageSize}&offset=${(page - 1) * pageSize}`, {
        headers: { Accept: "application/json" },
        signal: requestController.signal,
      });
      const contentType = response.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : null;
      if (!response.ok || !payload || typeof payload !== "object") {
        throw new Error(payload?.error || "The blog service is temporarily unavailable. Please try again later.");
      }
      const articles = Array.isArray(payload.articles) ? payload.articles : [];
      count.textContent = payload.total ? `${payload.total} ${payload.total === 1 ? "article" : "articles"}` : "";
      if (!articles.length) {
        status.textContent = "No published articles yet. Please check back soon.";
        return;
      }
      status.textContent = "";
      grid.innerHTML = articles.map(card).join("");
      updatePagination(Number(payload.total) || articles.length);
    } catch (error) {
      if (error.name === "AbortError") return;
      status.innerHTML = `${escapeHtml(error.message)} <a href="/blog" data-retry>Try again</a>`;
    }
  }

  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page]");
    if (!button || button.disabled) return;
    page = Number(button.dataset.page);
    const url = new URL(location.href);
    if (page === 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(page));
    history.pushState({ page }, "", url);
    load();
    document.getElementById("latest-heading").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  status.addEventListener("click", (event) => {
    if (event.target.matches("[data-retry]")) {
      event.preventDefault();
      load();
    }
  });
  window.addEventListener("popstate", () => {
    page = Math.max(1, Number(new URLSearchParams(location.search).get("page")) || 1);
    load();
  });

  const menuToggle = document.querySelector(".nav__toggle");
  const drawer = document.getElementById("blog-nav-drawer");
  if (menuToggle && drawer) {
    const close = () => {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    menuToggle.addEventListener("click", () => {
      const open = !drawer.classList.contains("is-open");
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      menuToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    drawer.querySelectorAll("[data-nav-close], .nav__drawer-links a").forEach((element) => element.addEventListener("click", close));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
  }

  load();
})();
