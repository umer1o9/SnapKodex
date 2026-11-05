// Enlarge screenshots: any [data-zoom] element (or an img inside one) opens the full-resolution
// image in a dialog. Fit-to-screen first; tap/click or Enter toggles 100% so it can be panned.
(function () {
  if (window.__skLightbox) return;
  window.__skLightbox = true;
  var dlg, img, cap, prev;
  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", "Enlarged screenshot");
    dlg.innerHTML = '<div class="lightbox__bar"><span class="lightbox__cap"></span><button type="button" class="lightbox__btn" data-act="zoom" aria-label="Toggle actual size">⤢</button><button type="button" class="lightbox__btn" data-act="close" aria-label="Close">✕</button></div><div class="lightbox__view" tabindex="0"><img alt="" /></div>';
    document.body.appendChild(dlg);
    img = dlg.querySelector("img");
    cap = dlg.querySelector(".lightbox__cap");
    var view = dlg.querySelector(".lightbox__view");
    function toggle() { dlg.classList.toggle("is-actual"); }
    dlg.addEventListener("click", function (e) {
      var act = e.target.closest("[data-act]");
      if (act) return act.dataset.act === "close" ? dlg.close() : toggle();
      if (e.target === img) return toggle();
      if (e.target === view || e.target === dlg) dlg.close();
    });
    view.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    dlg.addEventListener("close", function () { document.documentElement.classList.remove("lightbox-open"); if (prev) prev.focus(); });
  }
  function open(src, alt) {
    if (!dlg) build();
    prev = document.activeElement;
    dlg.classList.remove("is-actual");
    img.src = src;
    img.alt = alt || "";
    cap.textContent = alt || "";
    document.documentElement.classList.add("lightbox-open");
    dlg.showModal();
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-zoom]");
    if (!t || e.target.closest("a")) return;
    e.preventDefault();
    open(t.dataset.zoom, t.dataset.zoomAlt || (t.querySelector("img") || {}).alt);
  });
})();
