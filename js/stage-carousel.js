// Prev/next arrows for the "Inside the app" carousel. Without JS it still scrolls and swipes.
(function () {
  var band = document.querySelector(".stagesband");
  if (!band) return;
  var track = band.querySelector(".stages");
  var btns = band.querySelectorAll(".stages__btn");
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function update() {
    var max = track.scrollWidth - track.clientWidth - 2;
    btns[0].disabled = track.scrollLeft <= 2;
    btns[1].disabled = track.scrollLeft >= max;
  }
  btns.forEach(function (b) {
    b.hidden = false;
    b.addEventListener("click", function () {
      var card = track.querySelector(".stagecard");
      var step = card.offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
      track.scrollBy({ left: step * Number(b.dataset.dir), behavior: calm ? "auto" : "smooth" });
    });
  });
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
