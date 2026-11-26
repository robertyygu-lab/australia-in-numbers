// Australia in Numbers — logic: derived statistics, charts and controls.
// All derived numbers are computed here from data.js, never typed.

import { META, POPULATION, ECONOMY, HEALTH, EDUCATION, ENERGY, SOURCES } from "./data.js";
import { statCard } from "./views.js";

export const fmtInt = (n) => n.toLocaleString("en-AU");
export const fmt1 = (n) => n.toFixed(1);
export const pct = (part, whole) => (100 * part) / whole;

export function derived() {
  const migrationShare = pct(POPULATION.netOverseasMigration, POPULATION.growth);
  const naturalShare = pct(POPULATION.naturalIncrease, POPULATION.growth);
  const top3Markets = ECONOMY.topMarkets.reduce((s, m) => s + m.value, 0);
  const top3MarketsShare = pct(top3Markets, ECONOMY.exportsTotal);
  const top5Exports = ECONOMY.topExports.reduce((s, e) => s + e.value, 0);
  const top5ExportsShare = pct(top5Exports, ECONOMY.exportsTotal);
  const gapMale = HEALTH.nonIndigenous.male - HEALTH.firstNations.male;
  const gapFemale = HEALTH.nonIndigenous.female - HEALTH.firstNations.female;
  const avgGdp = ECONOMY.gdpByYear.reduce((s, y) => s + y.total, 0) / ECONOMY.gdpByYear.length;
  const avgGdpPerPerson = ECONOMY.gdpByYear.reduce((s, y) => s + y.perPerson, 0) / ECONOMY.gdpByYear.length;
  const renewablesGap = ENERGY.target2030 - ENERGY.renewablesShareElectricity;
  const lifeGap = HEALTH.lifeExpectancy.female - HEALTH.lifeExpectancy.male;
  return {
    migrationShare, naturalShare, top3Markets, top3MarketsShare,
    top5Exports, top5ExportsShare, gapMale, gapFemale,
    avgGdp, avgGdpPerPerson, renewablesGap, lifeGap
  };
}

// ---- Inline SVG helpers (no libraries, no network) ----

function barChart(rows, maxValue, unit) {
  const barW = 520, rowH = 34, labelW = 210;
  const height = rows.length * rowH + 8;
  const bars = rows.map((r, i) => {
    const w = Math.max(2, ((r.value / maxValue) * barW));
    const y = 8 + i * rowH;
    return `<g><text x="0" y="${y + 15}" class="chart-label">${r.name}</text>` +
      `<rect x="${labelW}" y="${y}" width="${w}" height="20" rx="3" class="bar" />` +
      `<text x="${labelW + w + 8}" y="${y + 15}" class="chart-value">${fmt1(r.value)}${unit}</text></g>`;
  }).join("");
  return `<svg viewBox="0 0 780 ${height}" role="img" aria-label="Bar chart" class="chart">${bars}</svg>`;
}

function donutChart(slices, total, centreSub) {
  const sub = centreSub || "of GVA";
  const cx = 110, cy = 110, r = 80, circ = 2 * Math.PI * r;
  let offset = 0;
  const rings = slices.map((s, i) => {
    const frac = s.share / total;
    const dash = frac * circ;
    const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--c${i + 1})" stroke-width="34" stroke-dasharray="${dash} ${circ - dash}" stroke-dashoffset="${-offset}" />`;
    offset += dash;
    return el;
  }).join("");
  const legend = slices.map((s, i) =>
    `<li><span class="swatch" style="background:var(--c${i + 1})"></span>${s.name} — ${fmt1(s.share)}%</li>`).join("");
  return `<div class="donut-wrap"><svg viewBox="0 0 220 220" role="img" aria-label="Donut chart" class="donut"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e8e8e8" stroke-width="34" />${rings}<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-centre">${fmt1(total)}%</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-sub">${sub}</text></svg><ul class="legend">${legend}</ul></div>`;
}

function lineChart(points) {
  const W = 720, H = 220, padL = 44, padB = 28, padT = 14;
  const min = Math.min(...points.map(p => p.total), ...points.map(p => p.perPerson), 0) - 0.5;
  const max = Math.max(...points.map(p => p.total), ...points.map(p => p.perPerson)) + 0.5;
  const x = (i) => padL + (i * (W - padL - 16)) / (points.length - 1);
  const y = (v) => padT + ((max - v) / (max - min)) * (H - padT - padB);
  const line = (key, cls) => points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p[key])}`).join(" ");
  const dots = (key, cls, below) => points.map((p, i) =>
    `<circle cx="${x(i)}" cy="${y(p[key])}" r="4" class="${cls}" /><text x="${x(i)}" y="${below ? y(p[key]) + 20 : y(p[key]) - 9}" text-anchor="middle" class="chart-value">${fmt1(p[key])}%</text>`).join("");
  const labels = points.map((p, i) => `<text x="${x(i)}" y="${H - 6}" text-anchor="${i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}" class="chart-label">${p.year}</text>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="GDP growth line chart" class="chart">` +
    `<path d="${line("total", "line-a")}" class="line-a" fill="none" />` +
    `<path d="${line("perPerson", "line-b")}" class="line-b" fill="none" />` +
    `${dots("total", "dot-a", false)}${dots("perPerson", "dot-b", true)}${labels}</svg>`;
}

export function renderAll() {
  const d = derived();
  const root = document.getElementById("app");
  root.innerHTML = views(d);
  wireControls(d);
}

function views(d) {
  return `
  <header class="hero">
    <p class="kicker">AUSTRALIA · OFFICIAL STATISTICS</p>
    <h1>${META.title}</h1>
    <p class="tagline">${META.tagline}</p>
    <p class="updated">Figures as published · Updated ${META.updated}</p>
    <nav class="toc" aria-label="Sections">
      ${["Overview", "Population", "Economy", "Health", "Education", "Energy", "States", "Sources & methods"].map((s, i) =>
        `<a href="#section-${i}">${s}</a>`).join("")}
    </nav>
  </header>
  <main>
  <section id="section-0" class="panel">
    <h2>Overview</h2>
    <p>Australia at a glance: a country of <strong>${fmtInt(POPULATION.total)}</strong> people, an economy of about <strong>US$${fmtInt(ECONOMY.gdpUsdBillion)} billion</strong>, and a life expectancy among the world's highest. This page brings the headline numbers together from the Australian Bureau of Statistics, DFAT, ACARA and the Department of Climate Change, Energy, the Environment and Water.</p>
    <div class="stats">
      ${statCard(fmtInt(POPULATION.total), "People", "at " + POPULATION.asAt)}
      ${statCard(fmt1(ECONOMY.gdpGrowthYear) + "%", "Real GDP growth", "2024–25")}
      ${statCard(fmt1(HEALTH.lifeExpectancy.female) + " yrs", "Female life expectancy", "2022–2024")}
      ${statCard(ENERGY.renewablesShareElectricity + "%", "Renewable electricity", ENERGY.year)}
    </div>
  </section>
  ${populationSection(d)}
  ${economySection(d)}
  ${healthSection(d)}
  ${educationSection()}
  ${energySection(d)}
  ${statesSection()}
  ${sourcesSection()}`;
}

function populationSection(d) {
  const rows = POPULATION.states.map(s =>
    `<tr><td>${s.name}</td><td>${s.capital}</td><td class="num">${fmtInt(s.pop)}</td><td class="num">+${fmtInt(s.change)}</td><td class="num">+${fmt1(s.growthPct)}%</td></tr>`).join("");
  return `
  <section id="section-1" class="panel">
    <h2>Population</h2>
    <div class="stats">
      ${statCard(fmtInt(POPULATION.total), "Total population", "at " + POPULATION.asAt)}
      ${statCard("+" + fmtInt(POPULATION.growth), "Growth in a year", "+" + fmt1(POPULATION.growthPct) + "%")}
      ${statCard(fmt1(d.migrationShare) + "%", "Growth from migration", fmtInt(POPULATION.netOverseasMigration) + " net overseas migrants")}
      ${statCard(fmt1(POPULATION.medianAge) + " yrs", "Median age", "Total fertility rate " + fmt1(POPULATION.fertilityRate))}
    </div>
    <p>Net overseas migration of <strong>${fmtInt(POPULATION.netOverseasMigration)}</strong> accounted for <strong>${fmt1(d.migrationShare)}%</strong> of the year's growth; natural increase (${fmtInt(POPULATION.naturalIncrease)}) made up the other ${fmt1(d.naturalShare)}%. The total fertility rate of <strong>${fmt1(POPULATION.fertilityRate)} babies per woman in 2024</strong> is the lowest since the ABS series began in 1924.</p>
    <h3>What drove the growth</h3>
    ${donutChart([
      { name: "Net overseas migration", share: d.migrationShare },
      { name: "Natural increase", share: d.naturalShare }
    ], 100, "of growth")}
    <h3>States and territories — year to June 2025</h3>
    ${barChart(POPULATION.states.map(s => ({ name: s.code + " · " + s.capital, value: s.pop / 1000000 })), POPULATION.states[0].pop / 1000000, "m")}
    <table class="data-table" id="states-table">
      <thead><tr><th data-sort="name">State / territory</th><th data-sort="capital">Capital</th><th data-sort="pop">Population</th><th data-sort="change">Change</th><th data-sort="growthPct">Growth</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="hint">Tap a column heading to sort the table.</p>
  </section>`;
}

function economySection(d) {
  return `
  <section id="section-2" class="panel">
    <h2>Economy</h2>
    <div class="stats">
      ${statCard(fmt1(ECONOMY.gdpGrowthYear) + "%", "Real GDP growth", "2024–25 · June quarter +" + fmt1(ECONOMY.gdpGrowthQuarter) + "%, +" + fmt1(ECONOMY.gdpGrowthThroughYear) + "% through the year")}
      ${statCard("US$" + fmtInt(ECONOMY.gdpUsdBillion) + "bn", "GDP (IMF, 2025)", "US$" + fmtInt(ECONOMY.gdpPerCapitaPppUsd) + " per person (PPP)")}
      ${statCard(fmt1(ECONOMY.unemployment) + "%", "Unemployment", "Oct 2025 · participation " + fmt1(ECONOMY.participation) + "%")}
      ${statCard(fmt1(ECONOMY.inflation) + "%", "Inflation", "Year to Sep quarter 2025 · trimmed mean " + fmt1(ECONOMY.trimmedMean) + "%")}
    </div>
    <div class="control-row">
      <label for="gdp-metric">GDP growth chart:</label>
      <select id="gdp-metric">
        <option value="both" selected>Both series</option>
        <option value="total">Total GDP only</option>
        <option value="perPerson">GDP per person only</option>
      </select>
    </div>
    <div id="gdp-chart">${lineChart(ECONOMY.gdpByYear)}</div>
    <p>Average real GDP growth over the five years shown was <strong>${fmt1(d.avgGdp)}% a year</strong> (${fmt1(d.avgGdpPerPerson)}% per person). The household saving ratio fell to <strong>${fmt1(ECONOMY.savingRatio)}%</strong> in the June quarter of 2025, down from ${fmt1(ECONOMY.savingRatioPrev)}%.</p>
    <h3>Share of gross value added</h3>
    ${donutChart(ECONOMY.sectors, 100)}
    <h3>Exports — A$${fmt1(ECONOMY.exportsTotal)} billion in 2024</h3>
    ${barChart(ECONOMY.topExports, ECONOMY.topExports[0].value, "")}
    <p>The five largest exports total <strong>A$${fmt1(d.top5Exports)} billion</strong> — ${fmt1(d.top5ExportsShare)}% of all exports. The top three markets (China A$${fmt1(ECONOMY.topMarkets[0].value)}bn, United States A$${fmt1(ECONOMY.topMarkets[1].value)}bn, Japan A$${fmt1(ECONOMY.topMarkets[2].value)}bn) take <strong>${fmt1(d.top3MarketsShare)}%</strong> of exports.</p>
    <h3>Top export markets — A$ billion</h3>
    ${barChart(ECONOMY.topMarkets, ECONOMY.topMarkets[0].value, "")}
  </section>`;
}

function healthSection(d) {
  return `
  <section id="section-3" class="panel">
    <h2>Health</h2>
    <div class="stats">
      ${statCard(fmt1(HEALTH.lifeExpectancy.male) + " yrs", "Male life expectancy", HEALTH.lifeExpectancy.period)}
      ${statCard(fmt1(HEALTH.lifeExpectancy.female) + " yrs", "Female life expectancy", "Women live " + fmt1(d.lifeGap) + " years longer than men")}
      ${statCard(fmtInt(HEALTH.deaths), "Deaths in " + HEALTH.deathsYear, "Crude death rate " + fmt1(HEALTH.crudeDeathRate) + " per 1,000 · median age at death " + HEALTH.medianAgeAtDeath)}
    </div>
    <h3>The gap in life expectancy</h3>
    <p>First Nations life expectancy (${HEALTH.firstNations.period}) is <strong>${fmt1(HEALTH.firstNations.male)} years for males</strong> and <strong>${fmt1(HEALTH.firstNations.female)} years for females</strong>, compared with ${fmt1(HEALTH.nonIndigenous.male)} and ${fmt1(HEALTH.nonIndigenous.female)} years for non-Indigenous Australians — a gap of <strong>${fmt1(d.gapMale)} years for males</strong> and <strong>${fmt1(d.gapFemale)} years for females</strong>.</p>
    ${barChart([
      { name: "All males", value: HEALTH.lifeExpectancy.male },
      { name: "All females", value: HEALTH.lifeExpectancy.female },
      { name: "First Nations males", value: HEALTH.firstNations.male },
      { name: "First Nations females", value: HEALTH.firstNations.female },
      { name: "Non-Indigenous males", value: HEALTH.nonIndigenous.male },
      { name: "Non-Indigenous females", value: HEALTH.nonIndigenous.female }
    ], 90, " yrs")}
    <p class="callout">${HEALTH.leadingCause}</p>
  </section>`;
}

function educationSection() {
  return `
  <section id="section-4" class="panel">
    <h2>Education</h2>
    <div class="stats">
      ${statCard(fmtInt(EDUCATION.students), "Students in " + EDUCATION.year, fmtInt(EDUCATION.schools) + " schools")}
      ${statCard(fmtInt(EDUCATION.teachersFte), "Teachers (FTE)", "Student–teacher ratio " + fmt1(EDUCATION.studentTeacherRatio))}
      ${statCard(fmt1(EDUCATION.year12Retention) + "%", "Year 12 retention", "Up " + fmt1(EDUCATION.retentionChangePts) + " points on 2023")}
      ${statCard(fmt1(EDUCATION.enrolledPct) + "%", "Enrolled", "of 6- to 15-year-olds")}
    </div>
    <p>The student–teacher ratio of <strong>${fmt1(EDUCATION.studentTeacherRatio)}</strong> is the lowest since 2006. Primary students number ${fmtInt(EDUCATION.primary)} (${fmt1(EDUCATION.primaryShare)}%) and secondary students ${fmtInt(EDUCATION.secondary)} (${fmt1(EDUCATION.secondaryShare)}%).</p>
    <h3>School sectors</h3>
    ${donutChart(EDUCATION.sectors, 100, "of students")}
  </section>`;
}

function energySection(d) {
  return `
  <section id="section-5" class="panel">
    <h2>Energy</h2>
    <div class="stats">
      ${statCard(ENERGY.renewablesShareElectricity + "%", "Renewable electricity", ENERGY.year + " · up from " + ENERGY.renewablesSharePrev + "%")}
      ${statCard(fmtInt(ENERGY.renewableElectricityPJ) + " PJ", "Renewable electricity", "+" + fmt1(ENERGY.renewableElectricityGrowth) + "% on last year")}
      ${statCard(fmt1(ENERGY.renewablesShareTotalEnergy) + "%", "Renewables of all energy", "consumed in " + ENERGY.year)}
      ${statCard(ENERGY.target2030 + "%", "2030 target", "Gap to target: " + fmt1(d.renewablesGap) + " percentage points")}
    </div>
    ${barChart([
      { name: "Solar", value: ENERGY.solarPJ },
      { name: "Wind", value: ENERGY.windPJ },
      { name: "Hydro & other", value: ENERGY.hydroOtherPJ }
    ], ENERGY.solarPJ, " PJ")}
    <p>Solar generated <strong>${fmtInt(ENERGY.solarPJ)} PJ</strong> (+${fmt1(ENERGY.solarGrowth)}%) and wind <strong>${fmtInt(ENERGY.windPJ)} PJ</strong> (+${fmt1(ENERGY.windGrowth)}%). Coal still supplies about half of electricity — <strong>${ENERGY.coalShareNow}% in 2024</strong>, down from ${ENERGY.coalShareDecadeAgo}% a decade ago. ${ENERGY.targetNote}</p>
  </section>`;
}

function statesSection() {
  const options = POPULATION.states.map(s =>
    `<option value="${s.code}">${s.name} — ${s.capital}</option>`).join("");
  return `
  <section id="section-6" class="panel">
    <h2>States</h2>
    <div class="control-row">
      <label for="state-select">Explore a state or territory:</label>
      <select id="state-select">${options}</select>
    </div>
    <div id="state-detail" class="state-detail"></div>
    <p>Western Australia grew fastest in the year to June 2025 (+${fmt1(POPULATION.states.find(s => s.code === "WA").growthPct)}%), while Tasmania grew slowest (+${fmt1(POPULATION.states.find(s => s.code === "TAS").growthPct)}%). New South Wales remains the most populous state, with ${fmtInt(POPULATION.states.find(s => s.code === "NSW").pop)} people.</p>
  </section>`;
}

function sourcesSection() {
  const rows = SOURCES.map((s, i) =>
    `<tr><td>${i + 1}</td><td>${s.figure}</td><td>${s.release}</td><td>${s.publisher}</td><td>${s.ref}</td></tr>`).join("");
  return `
  <section id="section-7" class="panel">
    <h2>Sources &amp; methods</h2>
    <p>Every figure on this page comes from an official release. Derived figures (shares, gaps and averages) are computed in code from the published numbers and labelled where they appear. No figure has been estimated or rounded beyond the source's own rounding.</p>
    <table class="data-table sources-table">
      <thead><tr><th>#</th><th>Figure</th><th>Release</th><th>Publisher</th><th>Reference</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="hint">Built as a fully offline static site: no network requests, no external fonts, no libraries. Charts are inline SVG drawn from the same data.</p>
  </section>
  </main>
  <footer><p>Australia in Numbers · Built from official statistics · ${META.updated}</p></footer>`;
}

// ---- Controls ----

function wireControls(d) {
  const metric = document.getElementById("gdp-metric");
  if (metric) {
    metric.addEventListener("change", () => {
      const chart = document.getElementById("gdp-chart");
      const mode = metric.value;
      const series = mode === "total"
        ? ECONOMY.gdpByYear.map(y => ({ ...y, perPerson: y.total }))
        : mode === "perPerson"
          ? ECONOMY.gdpByYear.map(y => ({ ...y, total: y.perPerson }))
          : ECONOMY.gdpByYear;
      chart.innerHTML = lineChart(series);
    });
  }

  const table = document.getElementById("states-table");
  if (table) {
    let asc = true, lastKey = null;
    table.querySelectorAll("th[data-sort]").forEach(th => {
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        asc = (key === lastKey) ? !asc : true;
        lastKey = key;
        const rows = [...POPULATION.states].sort((a, b) => {
          const av = a[key], bv = b[key];
          return (typeof av === "string" ? av.localeCompare(bv) : av - bv) * (asc ? 1 : -1);
        });
        table.querySelector("tbody").innerHTML = rows.map(s =>
          `<tr><td>${s.name}</td><td>${s.capital}</td><td class="num">${fmtInt(s.pop)}</td><td class="num">+${fmtInt(s.change)}</td><td class="num">+${fmt1(s.growthPct)}%</td></tr>`).join("");
      });
    });
  }

  const select = document.getElementById("state-select");
  const detail = document.getElementById("state-detail");
  const showState = (code) => {
    const s = POPULATION.states.find(x => x.code === code);
    const share = pct(s.pop, POPULATION.total);
    detail.innerHTML = `<div class="stats">
      ${statCard(fmtInt(s.pop), s.name, "Capital: " + s.capital)}
      ${statCard("+" + fmtInt(s.change), "Growth in a year", "+" + fmt1(s.growthPct) + "%")}
      ${statCard(fmt1(share) + "%", "Share of Australia", "of " + fmtInt(POPULATION.total) + " people")}
    </div>`;
  };
  if (select && detail) {
    select.addEventListener("change", () => showState(select.value));
    showState(select.value);
  }
}

document.addEventListener("DOMContentLoaded", renderAll);
