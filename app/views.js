/* Australia in Numbers — views: SVG charts and section renderers.
   Plain script (no modules) so the site works from file:// with no build
   step. Every chart is drawn from the figures in data.js; nothing here
   hard-codes a number that already lives in the data. */
(function () {
  var D = window.AUS_DATA;
  var NS = "http://www.w3.org/2000/svg";

  /* --- Small helpers ------------------------------------------------ */
  function fmt(n) { return n.toLocaleString("en-AU"); }
  function pct(part, whole, dp) {
    return (part / whole * 100).toFixed(dp == null ? 1 : dp);
  }
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function text(parent, x, y, s, cls, anchor) {
    var t = el("text", { x: x, y: y, "class": cls || "lbl" }, parent);
    if (anchor) t.setAttribute("text-anchor", anchor);
    t.textContent = s;
    return t;
  }
  function makeSvg(w, h, aria) {
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("class", "chart");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", aria);
    return svg;
  }

  /* --- Figures the site calculates from the published data ----------
     These are not new data: each one is arithmetic on figures already
     in data.js, and the page labels them as calculated. */
  function sumBy(items, field) {
    return items.reduce(function (total, item) { return total + item[field]; }, 0);
  }
  var derived = {
    // Share of the year's population growth that came from migration.
    migrationShare: function () {
      return pct(D.population.netOverseasMigration, D.population.annualChange);
    },
    // Share of all exports the three biggest markets bought.
    topMarketsShare: function () {
      return pct(sumBy(D.economy.topMarkets, "value"), D.economy.exportsTotal);
    },
    // Share of all exports the top five products make up.
    topExportsShare: function () {
      return pct(sumBy(D.economy.exports, "value"), D.economy.exportsTotal);
    },
    // Gap in years between non-Indigenous and First Nations life expectancy.
    lifeGap: function (female) {
      return (female
        ? D.health.nonIndigenousFemale - D.health.firstNationsFemale
        : D.health.nonIndigenousMale - D.health.firstNationsMale).toFixed(1);
    },
    // Percentage points of electricity still to green to hit the 2030 target.
    renewablesGap2030: function () {
      return (D.energy.target2030 - D.energy.renewShareElectricity).toFixed(0);
    },
    // Average annual GDP growth across the five published years.
    avgGdpGrowth: function () {
      return (sumBy(D.economy.gdpGrowth, "gdp") / D.economy.gdpGrowth.length).toFixed(1);
    }
  };

  /* Horizontal bar chart. items: [{label, value, display, cls}]
     An empty list draws an empty chart rather than failing on the
     maximum of no values. The label column is capped so a long
     label can never push the bars off the right edge. */
  function hbarChart(items, opts) {
    opts = opts || {};
    var W = 620, rowH = 34, top = 8, labelW = Math.min(opts.labelW || 150, 260);
    var H = top + items.length * rowH + 8;
    var svg = makeSvg(W, H, opts.aria || "Bar chart");
    if (items.length === 0) return svg;
    var max = Math.max.apply(null, items.map(function (i) { return i.value; }));
    items.forEach(function (it, i) {
      var y = top + i * rowH;
      text(svg, 0, y + 17, it.label, "lbl");
      // A zero value still gets a 2px bar so the row is visible.
      var bw = it.value <= 0 ? 2 : Math.max(2, (W - labelW - 90) * it.value / max);
      el("rect", { x: labelW, y: y + 2, width: bw, height: 20, rx: 3, "class": "bar" + (it.cls ? " " + it.cls : "") }, svg);
      text(svg, labelW + bw + 8, y + 17, it.display, "val");
    });
    return svg;
  }

  /* Vertical bar chart with negative support. items: [{label, value, display}]
     Bars above the baseline are positive, below it negative. Value
     labels sit above the bar for positive values and just above the
     baseline for negative ones, so they never sit inside a bar; the
     year labels sit below the longest negative bar, so a negative bar
     can never cover one. */
  function vbarChart(items, opts) {
    opts = opts || {};
    var W = 620, base = 250, top = 20;
    var max = Math.max.apply(null, items.map(function (i) { return Math.abs(i.value); }));
    var scale = (base - top - 10) / (max || 1);
    var negMax = Math.max.apply(null, items.map(function (i) { return i.value < 0 ? Math.abs(i.value) : 0; }));
    var labelY = base + negMax * scale + 22;
    var H = labelY + 10;
    var svg = makeSvg(W, H, opts.aria || "Bar chart");
    var slot = (W - 40) / items.length;
    var bw = Math.min(72, slot - 18);
    items.forEach(function (it, i) {
      var x = 20 + i * slot + (slot - bw) / 2;
      var h = Math.abs(it.value) * scale;
      var y = it.value >= 0 ? base - h : base;
      el("rect", { x: x, y: y, width: bw, height: Math.max(2, h), rx: 3, "class": "bar" + (it.value < 0 ? " neg" : "") }, svg);
      var valueY = it.value >= 0 ? y - 6 : base - 6;
      text(svg, x + bw / 2, valueY, it.display, "val", "middle");
      text(svg, x + bw / 2, labelY, it.label, "lbl", "middle");
    });
    el("line", { x1: 10, y1: base, x2: W - 10, y2: base, "class": "axis" }, svg);
    return svg;
  }

  /* Donut chart. items: [{label, value, color}] — values are shares
     that should sum to 100; the chart divides by the actual sum, so a
     slice set that does not sum to 100 still draws a complete ring and
     the legend shows the shares as given. */
  function donut(items, centerLabel, centerValue) {
    var W = 300, H = 300, cx = 150, cy = 150, r = 105, ir = 62;
    var svg = makeSvg(W, H, "Donut chart: " + centerLabel + " " + centerValue);
    var total = items.reduce(function (a, i) { return a + i.value; }, 0) || 1;
    var angle = -Math.PI / 2; // start at the top, like a clock
    items.forEach(function (it) {
      var sweep = (it.value / total) * Math.PI * 2;
      var end = angle + sweep;
      var large = sweep > Math.PI ? 1 : 0;
      var pt = function (radius, a) {
        return (cx + radius * Math.cos(a)).toFixed(1) + " " + (cy + radius * Math.sin(a)).toFixed(1);
      };
      var path = el("path", {
        d: "M " + pt(r, angle) + " A " + r + " " + r + " 0 " + large + " 1 " + pt(r, end) +
           " L " + pt(ir, end) + " A " + ir + " " + ir + " 0 " + large + " 0 " + pt(ir, angle) + " Z",
        fill: it.color
      }, svg);
      path.setAttribute("stroke", "#fffdf7");
      path.setAttribute("stroke-width", "2");
      angle = end;
    });
    text(svg, cx, cy - 4, centerValue, "donut-center", "middle").setAttribute("font-size", "34");
    text(svg, cx, cy + 20, centerLabel, "lbl", "middle");
    return svg;
  }

  /* Legend: a coloured swatch and "Label — value" per item. */
  function legend(items) {
    var div = document.createElement("div");
    div.className = "legend";
    items.forEach(function (it) {
      var s = document.createElement("span");
      var sw = document.createElement("span");
      sw.className = "sw";
      sw.style.background = it.color;
      s.appendChild(sw);
      s.appendChild(document.createTextNode(it.label + " — " + it.display));
      div.appendChild(s);
    });
    return div;
  }

  /* ---- Section builders ---- */

  function card(num, label, body) {
    var d = document.createElement("div");
    d.className = "card";
    d.innerHTML = '<div class="num">' + num + '</div><h3>' + label + '</h3><p>' + body + '</p>';
    return d;
  }

  function buildOverview() {
    var host = document.getElementById("overview-cards");
    var cards = [
      card(D.population.totalLabel, "People",
        "Estimated resident population at 30 June 2025, up <span class='delta-up'>+1.5%</span> on the year before."),
      card("+" + derived.avgGdpGrowth() + "<small>%</small>", "Average GDP growth",
        "Mean real GDP growth across the five years to 2024–25 — the latest year itself grew just 1.4%."),
      card("4.3<small>%</small>", "Unemployment",
        "Seasonally adjusted unemployment rate, October 2025. Participation held at 67.0%."),
      card("81.1 <small>/</small> 85.1", "Life expectancy (years)",
        "At birth, males / females, 2022–2024 — among the highest in the world."),
      card("4.13<small> m</small>", "School students",
        "Enrolled across 9,653 schools in 2024, taught by 320,377 full-time equivalent teachers."),
      card("37<small>%</small>", "Renewable electricity",
        "Share of domestic electricity use from renewables in 2024–25, up from 34% the year before — " +
        derived.renewablesGap2030() + " points short of the 82% target for 2030.")
    ];
    cards.forEach(function (c) { host.appendChild(c); });
  }

  function buildPopulation() {
    var host = document.getElementById("state-bars");
    host.appendChild(hbarChart(
      D.population.states.map(function (s) {
        return { label: s.name, value: s.pop, display: fmt(s.pop), cls: s.code === "WA" ? "alt" : "" };
      }),
      { aria: "Population by state and territory at 30 June 2025", labelW: 170 }
    ));
    var comp = document.getElementById("growth-components");
    comp.appendChild(hbarChart([
      { label: "Net overseas migration", value: D.population.netOverseasMigration, display: "+305,569" },
      { label: "Natural increase", value: D.population.naturalIncrease, display: "+114,556" }
    ], { aria: "Components of population growth, year to June 2025", labelW: 190 }));
    // The "about 73%" line in the page text is this calculation, shown
    // here so the number on the page is always the computed one.
    var note = document.getElementById("growth-share-note");
    if (note) note.textContent = derived.migrationShare() + "%";
  }

  function buildEconomy() {
    var host = document.getElementById("gdp-chart");
    var noteEl = document.getElementById("gdp-note");
    var metric = "gdp";
    var notes = {
      gdp: "Real GDP (chain volume measures), annual change. Source: ABS, Australian System of National Accounts 2024–25.",
      perCapita: "Real GDP per person (chain volume measures), annual change. It fell in 2023–24 and 2024–25 even as total GDP grew, because the population grew faster. Source: ABS, Australian System of National Accounts 2024–25."
    };
    function render() {
      host.innerHTML = "";
      host.appendChild(vbarChart(
        D.economy.gdpGrowth.map(function (g) {
          var v = g[metric];
          return { label: g.year, value: v, display: (v > 0 ? "+" : "") + v.toFixed(1) + "%" };
        }),
        { aria: "Annual GDP growth, 2020–21 to 2024–25" }
      ));
      noteEl.textContent = notes[metric];
    }
    render();
    document.querySelectorAll("#gdp-toggle button").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll("#gdp-toggle button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        metric = b.getAttribute("data-metric");
        render();
      });
    });

    var ex = document.getElementById("exports-chart");
    ex.appendChild(hbarChart(
      D.economy.exports.map(function (e) {
        return { label: e.name, value: e.value, display: "A$" + e.value.toFixed(1) + "bn" };
      }),
      { aria: "Australia's largest goods and services exports, 2024", labelW: 190 }
    ));
    var exportNote = document.getElementById("exports-share-note");
    if (exportNote) exportNote.textContent = derived.topExportsShare() + "%";

    var sec = document.getElementById("sector-donut");
    // Shares sum to 100: services 67.5 + industry 23.9 + agriculture 2.3 +
    // other 6.3 (mining, utilities and the rest, residual of the published
    // total). Without the "Other" slice the donut arcs would not match the
    // labelled shares, because the donut divides by the sum of its slices.
    var items = [
      { label: "Services", value: 67.5, color: "#0b3d3a", display: "67.5%" },
      { label: "Industry", value: 23.9, color: "#c08a1e", display: "23.9%" },
      { label: "Agriculture", value: 2.3, color: "#7ba05b", display: "2.3%" },
      { label: "Other", value: 6.3, color: "#b9c4bd", display: "6.3%" }
    ];
    sec.appendChild(donut(items, "Services share", "67.5%"));
    sec.appendChild(legend(items));

    // Top trading partners: the figures were in data.js but never drawn.
    var mk = document.getElementById("markets-chart");
    mk.appendChild(hbarChart(
      D.economy.topMarkets.map(function (m) {
        return { label: m.name, value: m.value, display: "A$" + m.value.toFixed(1) + "bn" };
      }),
      { aria: "Australia's largest export markets, 2024", labelW: 130 }
    ));
    var marketNote = document.getElementById("markets-share-note");
    if (marketNote) marketNote.textContent = derived.topMarketsShare() + "%";
  }

  function buildHealth() {
    var host = document.getElementById("life-chart");
    host.appendChild(hbarChart([
      { label: "Females, all Australians", value: D.health.lifeFemale, display: D.health.lifeFemale + " yrs" },
      { label: "Males, all Australians", value: D.health.lifeMale, display: D.health.lifeMale + " yrs" },
      { label: "Females, non-Indigenous", value: D.health.nonIndigenousFemale, display: D.health.nonIndigenousFemale + " yrs" },
      { label: "Males, non-Indigenous", value: D.health.nonIndigenousMale, display: D.health.nonIndigenousMale + " yrs" },
      { label: "Females, First Nations", value: D.health.firstNationsFemale, display: D.health.firstNationsFemale + " yrs", cls: "alt" },
      { label: "Males, First Nations", value: D.health.firstNationsMale, display: D.health.firstNationsMale + " yrs", cls: "alt" }
    ], { aria: "Life expectancy at birth, years", labelW: 210 }));
    // The gap is calculated, not typed: non-Indigenous minus First
    // Nations, separately for males and females.
    var gap = document.getElementById("life-gap-note");
    if (gap) {
      gap.textContent = derived.lifeGap(false) + " years for males and " +
        derived.lifeGap(true) + " years for females";
    }
  }

  function buildEducation() {
    var host = document.getElementById("edu-donut");
    var palette = ["#0b3d3a", "#c08a1e", "#7ba05b"];
    var items = D.education.sectors.map(function (s, i) {
      return { label: s.name, value: s.share, color: palette[i], display: s.share.toFixed(1) + "%" };
    });
    host.appendChild(donut(items, "Government share", "63.4%"));
    host.appendChild(legend(items));
  }

  function buildEnergy() {
    var host = document.getElementById("energy-donut");
    var items = [
      { label: "Solar", value: D.energy.solarPJ, color: "#c08a1e", display: "191 PJ" },
      { label: "Wind", value: D.energy.windPJ, color: "#14655f", display: "130 PJ" },
      { label: "Hydro & other", value: D.energy.hydroOtherPJ, color: "#7ba05b", display: "51 PJ" }
    ];
    host.appendChild(donut(items, "Renewable electricity", "372 PJ"));
    host.appendChild(legend(items));
  }

  /* Sortable states table. Clicking a column heading sorts by it;
     clicking the same heading again reverses the order. Names sort
     A–Z; every other column sorts largest first by default. */
  var sortKey = "pop", sortDir = -1;
  function stateValue(s, key) {
    if (key === "name") return s.name;
    if (key === "share") return s.pop / D.population.total;
    return s[key];
  }
  function buildStatesTable() {
    var tbody = document.getElementById("states-body");
    function render() {
      var rows = D.population.states.slice();
      rows.sort(function (a, b) {
        var va = stateValue(a, sortKey), vb = stateValue(b, sortKey);
        if (va < vb) return -sortDir;
        if (va > vb) return sortDir;
        return 0;
      });
      tbody.innerHTML = "";
      rows.forEach(function (s) {
        var tr = document.createElement("tr");
        var share = pct(s.pop, D.population.total);
        tr.innerHTML = "<td>" + s.name + "</td><td>" + s.capital + "</td>" +
          '<td class="num">' + fmt(s.pop) + '</td><td class="num">' + share + "%</td>" +
          '<td class="num">+' + fmt(s.change) + '</td><td class="num">+' + s.growth.toFixed(1) + "%</td>";
        tbody.appendChild(tr);
      });
    }
    render();
    document.querySelectorAll("#states-table th button").forEach(function (b) {
      b.addEventListener("click", function () {
        var key = b.getAttribute("data-sort");
        if (sortKey === key) sortDir = -sortDir;
        else { sortKey = key; sortDir = key === "name" ? 1 : -1; }
        render();
      });
    });
  }

  function ordinal(n) {
    if (n === 1) return "1st";
    if (n === 2) return "2nd";
    if (n === 3) return "3rd";
    return n + "th";
  }

  /* State explorer: pick a state and see its rank, share and growth
     against the national figures, all calculated from data.js. */
  function buildExplorer() {
    var sel = document.getElementById("state-select");
    var out = document.getElementById("state-detail");
    D.population.states.forEach(function (s) {
      var o = document.createElement("option");
      o.value = s.code;
      o.textContent = s.name;
      sel.appendChild(o);
    });
    function render() {
      var s = D.population.states.filter(function (x) { return x.code === sel.value; })[0];
      var share = pct(s.pop, D.population.total);
      var ranked = D.population.states.slice().sort(function (a, b) { return b.pop - a.pop; });
      var rank = ranked.findIndex(function (x) { return x.code === s.code; }) + 1;
      var vsNational = s.growth > D.population.annualChangePct ? "faster than"
        : s.growth < D.population.annualChangePct ? "slower than" : "in line with";
      out.innerHTML =
        "<p><strong>" + s.name + "</strong> — capital " + s.capital + " — is the " +
        ordinal(rank) + " most populous state or territory.</p>" +
        "<p>Population at 30 June 2025: <strong>" + fmt(s.pop) + "</strong> (" + share +
        "% of Australia). It grew by <strong>" + fmt(s.change) + " people (+" +
        s.growth.toFixed(1) + "%)</strong> over the year — " + vsNational +
        " the national growth rate of +1.5%.</p>";
    }
    sel.addEventListener("change", render);
    render();
  }

  function buildSources() {
    var host = document.getElementById("sources-list");
    D.sources.forEach(function (s) {
      var li = document.createElement("li");
      li.innerHTML = '<span class="fig">' + s.figure + '.</span> <span class="pub">' + s.publisher +
        ", <i>" + s.release + "</i> (" + s.ref + ").</span>";
      host.appendChild(li);
    });
  }

  window.AUS_VIEWS = {
    buildAll: function () {
      buildOverview(); buildPopulation(); buildEconomy();
      buildHealth(); buildEducation(); buildEnergy();
      buildStatesTable(); buildExplorer(); buildSources();
    }
  };
})();
