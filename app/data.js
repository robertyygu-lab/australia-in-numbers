/* Australia in Numbers — the figures.
   Every number in this file comes from an official release (ABS, DFAT,
   ACARA, DCCEEW) and carries its reference period in the data or on the
   Sources page. Nothing here is estimated or invented. Money is in
   Australian dollars unless the label says otherwise. The tables below
   are plain constants; the site object is assembled from them at the
   bottom of the file so each section can be checked on its own. */

"use strict";

/* States and territories — ABS, National, state and territory
   population, June 2025. pop is the estimated resident population at
   30 June 2025; change and growth are the movement over the year. */
var STATES = [
  { code: "NSW", name: "New South Wales", capital: "Sydney", pop: 8593900, change: 101821, growth: 1.2 },
  { code: "VIC", name: "Victoria", capital: "Melbourne", pop: 7074500, change: 123507, growth: 1.8 },
  { code: "QLD", name: "Queensland", capital: "Brisbane", pop: 5669800, change: 97944, growth: 1.8 },
  { code: "SA", name: "South Australia", capital: "Adelaide", pop: 1902300, change: 20167, growth: 1.1 },
  { code: "WA", name: "Western Australia", capital: "Perth", pop: 3043700, change: 65584, growth: 2.2 },
  { code: "TAS", name: "Tasmania", capital: "Hobart", pop: 576000, change: 1195, growth: 0.2 },
  { code: "NT", name: "Northern Territory", capital: "Darwin", pop: 264400, change: 3527, growth: 1.4 },
  { code: "ACT", name: "Australian Capital Territory", capital: "Canberra", pop: 484800, change: 6362, growth: 1.3 }
];

window.AUS_DATA = {
  meta: {
    title: "Australia in Numbers",
    subtitle: "A national statistics site — population, economy, health, education and energy, from the official releases.",
    updated: "26 November 2026",
    note: "Figures are the latest published by each source at the time this site was built. Each figure carries its reference period."
  },

  /* ABS, National, state and territory population, June 2025 */
  population: {
    total: 27614400,
    totalLabel: "27,614,400",
    refPeriod: "30 June 2025",
    annualChange: 420100,
    annualChangePct: 1.5,
    naturalIncrease: 114556,
    netOverseasMigration: 305569,
    medianAge: 38.5,
    fertilityRate: 1.48,
    fertilityNote: "Total fertility rate, 2024 — the lowest since the ABS series began in 1924.",
    states: STATES
  },

  /* Economy. GDP series: ABS Australian System of National Accounts
     2024–25. June quarter: ABS National Accounts, June quarter 2025.
     Labour market: ABS Labour Force, October 2025. Prices: ABS CPI,
     September quarter 2025 (trimmed mean from the monthly CPI
     indicator, October 2025). Dollar GDP: IMF World Economic Outlook
     2025; GDP per person (PPP): World Bank, 2025. Exports and
     markets: DFAT trade factsheet, calendar 2024. */
  economy: {
    // Annual change in real GDP, and in real GDP per person, by year.
    gdpGrowth: [
      { year: "2020–21", perCapita: 1.6, gdp: 2.0 },
      { year: "2021–22", perCapita: 3.7, gdp: 4.3 },
      { year: "2022–23", perCapita: 1.4, gdp: 3.6 },
      { year: "2023–24", perCapita: -1.0, gdp: 1.4 },
      { year: "2024–25", perCapita: -0.3, gdp: 1.4 }
    ],
    gdpJuneQtr: { qtr: 0.6, throughYear: 1.8, refPeriod: "June quarter 2025" },
    gdpUsdBn: 1840,
    gdpPerCapitaPppUsd: 71934,
    unemployment: 4.3,
    unemploymentRef: "October 2025",
    participation: 67.0,
    cpi: 3.2,
    cpiRef: "year to September quarter 2025",
    trimmedMean: 3.3,
    trimmedMeanRef: "October 2025 (monthly CPI indicator)",
    savingRatio: 4.2,
    savingRef: "June quarter 2025",
    // Shares of gross value added. Services, industry and agriculture
    // are the published shares; the rest is shown as "Other" on the
    // chart so the slices add to 100.
    sectors: [
      { name: "Services", share: 67.5 },
      { name: "Industry", share: 23.9 },
      { name: "Agriculture", share: 2.3 }
    ],
    exportsTotal: 645.9,
    // Largest goods and services exports, A$ billion, 2024.
    exports: [
      { name: "Iron ore & concentrates", value: 124.5 },
      { name: "Coal", value: 85.2 },
      { name: "Natural gas", value: 67.4 },
      { name: "Education-related travel", value: 51.9 },
      { name: "Gold", value: 35.7 }
    ],
    // Largest export markets, A$ billion, 2024.
    topMarkets: [
      { name: "China", value: 196.3 },
      { name: "United States", value: 92.8 },
      { name: "Japan", value: 75.7 }
    ]
  },

  /* Health. Life expectancy: ABS Life expectancy, 2022–2024. The
     First Nations and non-Indigenous figures are from the
     2020–2022 release, the latest split published. Deaths and the
     leading cause: ABS Deaths, Australia, 2024 and Causes of Death,
     Australia, 2024. */
  health: {
    lifeMale: 81.1,
    lifeFemale: 85.1,
    lifeRef: "2022–2024",
    firstNationsMale: 71.9,
    firstNationsFemale: 75.6,
    nonIndigenousMale: 80.6,
    nonIndigenousFemale: 83.8,
    indigenousRef: "2020–2022",
    deaths: 187268,
    deathsRef: "2024",
    crudeDeathRate: 6.9,
    medianAgeAtDeath: 82,
    leadingCause: "In 2024, dementia — including Alzheimer's disease — became Australia's leading cause of death, overtaking ischaemic heart disease for the first time."
  },

  /* Education. ABS Schools, 2024; ACARA National Report on Schooling
     in Australia 2024. The sector shares are of all students; the
     primary and secondary enrolments are rounded to the nearest
     10,000 as published. */
  education: {
    students: 4132006,
    schools: 9653,
    teachersFte: 320377,
    ratio: 12.9,
    year12Retention: 79.9,
    retentionChange: "+0.8 pts on 2023",
    sectors: [
      { name: "Government", share: 63.4 },
      { name: "Catholic", share: 19.9 },
      { name: "Independent", share: 16.8 }
    ],
    primary: 2270000,
    secondary: 1860000
  },

  /* Energy. ABS Energy Account, Australia, 2024–25; DCCEEW
     Australian Energy Statistics 2024–25. Renewable electricity is
     in petajoules; hydro & other is the residual of the published
     renewable total (372 PJ) after solar and wind. The 2030 target
     is the government's 82% renewable electricity target. */
  energy: {
    renewShareElectricity: 37,
    renewShareElectricityPrev: 34,
    renewElectricityPJ: 372,
    renewGrowthPct: 9.7,
    solarPJ: 191,
    solarGrowth: 11,
    windPJ: 130,
    windGrowth: 15,
    hydroOtherPJ: 51,
    renewShareTotalEnergy: 10.1,
    target2030: 82
  },

  /* Sources, in the order the figures appear on the site. Each row
     names the figure, the release it came from, who published it,
     and the reference period — the same list is printed on the
     site's Sources & methods page. */
  sources: [
    { figure: "Population, states & territories", release: "National, state and territory population, June 2025", publisher: "Australian Bureau of Statistics", ref: "30 June 2025" },
    { figure: "Median age", release: "Population projections, Australia", publisher: "Australian Bureau of Statistics", ref: "2022 base" },
    { figure: "Fertility rate", release: "Births, Australia, 2024", publisher: "Australian Bureau of Statistics", ref: "2024" },
    { figure: "GDP growth & GDP per capita", release: "Australian System of National Accounts, 2024–25", publisher: "Australian Bureau of Statistics", ref: "2024–25" },
    { figure: "GDP, June quarter", release: "Australian National Accounts, June quarter 2025", publisher: "Australian Bureau of Statistics", ref: "June quarter 2025" },
    { figure: "GDP in US dollars; GDP per capita (PPP)", release: "World Economic Outlook; World Development Indicators", publisher: "International Monetary Fund / World Bank", ref: "2025" },
    { figure: "Unemployment & participation", release: "Labour Force, Australia, October 2025", publisher: "Australian Bureau of Statistics", ref: "October 2025" },
    { figure: "Consumer prices", release: "Consumer Price Index, September quarter 2025", publisher: "Australian Bureau of Statistics", ref: "September quarter 2025" },
    { figure: "Exports & trading partners", release: "Australia's trade factsheet — goods & services", publisher: "Department of Foreign Affairs and Trade", ref: "Calendar 2024" },
    { figure: "Life expectancy", release: "Life expectancy, 2022–2024", publisher: "Australian Bureau of Statistics", ref: "2022–2024" },
    { figure: "Deaths & leading cause", release: "Deaths, Australia, 2024; Causes of Death, Australia, 2024", publisher: "Australian Bureau of Statistics", ref: "2024" },
    { figure: "Schools, students & teachers", release: "Schools, 2024", publisher: "Australian Bureau of Statistics", ref: "2024" },
    { figure: "School sectors & retention", release: "National Report on Schooling in Australia 2024", publisher: "ACARA", ref: "2024" },
    { figure: "Renewable electricity", release: "Energy Account, Australia, 2024–25", publisher: "Australian Bureau of Statistics", ref: "2024–25" },
    { figure: "Renewables share of total energy", release: "Australian Energy Statistics, Table R", publisher: "Dept. of Climate Change, Energy, the Environment and Water", ref: "2024–25" }
  ]
};
