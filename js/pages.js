(function () {
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-shrunk", window.scrollY > 20); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var drawer = document.getElementById("site-nav-drawer");
  var toggle = document.querySelector(".nav__toggle");
  if (!drawer || !toggle) return;
  var panel = drawer.querySelector(".nav__drawer-panel");
  var icon = toggle.querySelector(".material-symbols-rounded");
  var lastFocused = null;

  function setOpen(open) {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
    if (icon) icon.textContent = open ? "close" : "menu";
    if (open) {
      lastFocused = document.activeElement;
      var c = drawer.querySelector(".nav__drawer-close");
      if (c) c.focus();
    } else if (lastFocused && lastFocused.focus) {
      lastFocused.focus();
    }
  }
  toggle.addEventListener("click", function () { setOpen(!drawer.classList.contains("is-open")); });
  drawer.querySelectorAll("[data-nav-close], .nav__drawer-links a, .nav__drawer-actions a").forEach(function (el) {
    el.addEventListener("click", function () { setOpen(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) setOpen(false);
  });
  if (panel) {
    panel.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !drawer.classList.contains("is-open")) return;
      var f = panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
})();
