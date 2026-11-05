/* Shared header behaviour: sticky shrink, desktop mega menus (hover, click, keyboard) and the mobile drawer. */
(function () {
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-shrunk", window.scrollY > 20); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var BP = window.matchMedia("(min-width: 1000px)");
  var items = Array.prototype.slice.call(document.querySelectorAll(".mnav__item[data-mega]"));
  var closeTimer = null;

  function trigger(item) { return item.querySelector(".mnav__caret, .mnav__link--btn"); }
  function setItem(item, open) {
    item.classList.toggle("is-open", open);
    var t = trigger(item);
    if (t) t.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function closeAll(except) { items.forEach(function (it) { if (it !== except) setItem(it, false); }); }
  function openItem(item) { clearTimeout(closeTimer); closeAll(item); setItem(item, true); }

  items.forEach(function (item) {
    var t = trigger(item);
    if (t) t.addEventListener("click", function (e) {
      e.preventDefault();
      if (item.classList.contains("is-open")) setItem(item, false); else openItem(item);
    });
    item.addEventListener("mouseenter", function () { if (BP.matches && window.matchMedia("(hover: hover)").matches) openItem(item); });
    item.addEventListener("mouseleave", function () {
      if (!(BP.matches && window.matchMedia("(hover: hover)").matches)) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () { setItem(item, false); }, 140);
    });
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) setItem(item, false);
    });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && item.classList.contains("is-open")) { setItem(item, false); if (t) t.focus(); }
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest(".mnav__item[data-mega]")) closeAll();
  });

  /* mobile drawer */
  var drawer = document.getElementById("mdrawer");
  var burger = document.querySelector(".mnav__burger");
  if (!drawer || !burger) return;
  var panel = drawer.querySelector(".mdrawer__panel");
  var lastFocused = null;

  function setOpen(open) {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
    if (open) {
      lastFocused = document.activeElement;
      var c = drawer.querySelector(".mdrawer__close");
      if (c) c.focus();
    } else if (lastFocused && lastFocused.focus) {
      lastFocused.focus();
    }
  }
  burger.addEventListener("click", function () { setOpen(!drawer.classList.contains("is-open")); });
  drawer.querySelectorAll("[data-nav-close]").forEach(function (el) { el.addEventListener("click", function () { setOpen(false); }); });
  drawer.querySelectorAll(".mdrawer__links a, .mdrawer__actions a").forEach(function (el) { el.addEventListener("click", function () { setOpen(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) setOpen(false);
  });
  panel.addEventListener("keydown", function (e) {
    if (e.key !== "Tab" || !drawer.classList.contains("is-open")) return;
    var f = panel.querySelectorAll("a[href], button:not([disabled]), summary");
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  var onBp = function () { if (BP.matches) { setOpen(false); closeAll(); } };
  if (BP.addEventListener) BP.addEventListener("change", onBp); else if (BP.addListener) BP.addListener(onBp);
})();
