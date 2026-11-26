/* Australia in Numbers — main: hash routing and initialisation.
   The site is one HTML page with eight sections; the address hash
   (#overview, #economy, ...) picks which one is visible. A hash that
   is not a section name falls back to the overview, so a mistyped
   link still shows a working page instead of a blank one. */
(function () {
  "use strict";
  var SECTIONS = ["overview", "population", "economy", "health", "education", "energy", "states", "sources"];

  function currentSection() {
    var hash = (window.location.hash || "#overview").slice(1);
    return SECTIONS.indexOf(hash) >= 0 ? hash : "overview";
  }

  function show() {
    var cur = currentSection();
    SECTIONS.forEach(function (id) {
      var sec = document.getElementById("sec-" + id);
      if (sec) sec.classList.toggle("hidden", id !== cur);
    });
    document.querySelectorAll("nav.main a").forEach(function (a) {
      var on = a.getAttribute("href") === "#" + cur;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }

  // Build every chart and table first, then show the section the
  // hash names; without this order a deep link would show an empty
  // section for a frame. The footer year is set from the clock so it
  // never goes stale.
  function init() {
    window.AUS_VIEWS.buildAll();
    show();
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("hashchange", show);
})();
