// Enlarge screenshots. A [data-zoom] element opens a full-screen dialog:
// - annotated device stages (.stage__inner) are shown whole: frame, labels, connectors, crops;
// - plain screenshot cards show their full-resolution image.
// "Fit" shows everything on screen; "actual" renders it large so it can be panned/pinched.
// Phones open in "actual" (a fitted 2:1 stage would be too small to read), centred.
(function () {
  if (window.__skLightbox) return;
  window.__skLightbox = true;
  var dlg, view, box, cap, prev;
  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", "Enlarged screenshot");
    dlg.innerHTML = '<div class="lightbox__bar"><span class="lightbox__cap"></span><button type="button" class="lightbox__btn" data-act="zoom" aria-label="Toggle actual size">⤢</button><button type="button" class="lightbox__btn" data-act="close" aria-label="Close">✕</button></div><div class="lightbox__view" tabindex="0"><div class="lightbox__content"></div></div>';
    document.body.appendChild(dlg);
    view = dlg.querySelector(".lightbox__view");
    box = dlg.querySelector(".lightbox__content");
    cap = dlg.querySelector(".lightbox__cap");
    dlg.addEventListener("click", function (e) {
      var act = e.target.closest("[data-act]");
      if (act) return act.dataset.act === "close" ? dlg.close() : setMode(!dlg.classList.contains("is-actual"));
      if (e.target.closest(".lightbox__content")) return setMode(!dlg.classList.contains("is-actual"));
      if (e.target === view || e.target === dlg) dlg.close();
    });
    view.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMode(!dlg.classList.contains("is-actual")); }
    });
    dlg.addEventListener("close", function () {
      document.documentElement.classList.remove("lightbox-open");
      box.innerHTML = "";
      if (prev) prev.focus();
    });
  }
  function setMode(actual) {
    dlg.classList.toggle("is-actual", actual);
    requestAnimationFrame(function () {
      // desktop centres the large view; phones start at the left edge, where the first labels are
      view.scrollLeft = actual && window.innerWidth >= 760 ? (view.scrollWidth - view.clientWidth) / 2 : 0;
      view.scrollTop = 0;
    });
  }
  function open(trigger) {
    if (!dlg) build();
    prev = document.activeElement;
    var alt = trigger.dataset.zoomAlt || (trigger.querySelector("img") || {}).alt || "";
    box.innerHTML = "";
    if (trigger.classList.contains("stage__inner")) {
      // clone the whole annotated stage, keeping its tone and stage modifiers
      var stage = trigger.closest(".stage");
      var toned = trigger.closest("[class*='tone-']");
      var wrap = document.createElement("div");
      wrap.className = stage.className + " lightbox__stage " + ((toned && toned.className.match(/tone-\w+/)) || [""])[0];
      var clone = trigger.cloneNode(true);
      clone.removeAttribute("data-zoom");
      clone.querySelectorAll(".stage__zoom").forEach(function (b) { b.remove(); });
      clone.querySelectorAll("img").forEach(function (i) { i.loading = "eager"; });
      clone.querySelector(".stage__screen").setAttribute("alt", alt);
      wrap.appendChild(clone);
      box.appendChild(wrap);
      dlg.classList.add("is-stage");
    } else {
      var img = document.createElement("img");
      img.src = trigger.dataset.zoom;
      img.alt = alt;
      box.appendChild(img);
      dlg.classList.remove("is-stage");
    }
    cap.textContent = alt;
    document.documentElement.classList.add("lightbox-open");
    dlg.showModal();
    setMode(window.innerWidth < 760 && dlg.classList.contains("is-stage"));
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-zoom]");
    if (!t || e.target.closest("a") || e.target.closest(".lightbox")) return;
    e.preventDefault();
    open(t);
  });
})();
