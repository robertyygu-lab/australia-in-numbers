/* Australia in Numbers — main: hash routing and initialisation. */
(function () {
  var SECTIONS = ["overview", "population", "economy", "health", "education", "energy", "states", "sources"];

  function currentSection() {
    var h = (location.hash || "#overview").slice(1);
    return SECTIONS.indexOf(h) >= 0 ? h : "overview";
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
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.AUS_VIEWS.buildAll();
    show();
    document.getElementById("year").textContent = new Date().getFullYear();
  });
  window.addEventListener("hashchange", show);
})();
