(function () {
  var buttons = document.querySelectorAll("[data-filter]");
  var cards = document.querySelectorAll("#post-grid [data-cat]");
  if (!buttons.length) return;
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filter");
      buttons.forEach(function (x) { x.removeAttribute("aria-current"); });
      b.setAttribute("aria-current", "true");
      cards.forEach(function (c) { c.hidden = !(f === "all" || c.getAttribute("data-cat") === f); });
    });
  });
})();
