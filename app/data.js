/* Australia in Numbers — data
   Every figure below was taken from an official release (ABS, DFAT,
   ACARA, DCCEEW) and is labelled with its reference period. No figure
   here is invented. See app/index.html "Sources & methods" and NOTES.md.
   All money is Australian dollars unless stated. */

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
    states: [
      { code: "NSW", name: "New South Wales", capital: "Sydney", pop: 8593900, growth: 1.2, change: 101821 },
      { code: "VIC", name: "Victoria", capital: "Melbourne", pop: 7074500, growth: 1.8, change: 123507 },
      { code: "QLD", name: "Queensland", capital: "Brisbane", pop: 5669800, growth: 1.8, change: 97944 },
      { code: "SA", name: "South Australia", capital: "Adelaide", pop: 1902300, growth: 1.1, change: 20167 },
      { code: "WA", name: "Western Australia", capital: "Perth", pop: 3043700, growth: 2.2, change: 65584 },
      { code: "TAS", name: "Tasmania", capital: "Hobart", pop: 576000, growth: 0.2, change: 1195 },
      { code: "NT", name: "Northern Territory", capital: "Darwin", pop: 264400, growth: 1.4, change: 3527 },
      { code: "ACT", name: "Australian Capital Territory", capital: "Canberra", pop: 484800, growth: 1.3, change: 6362 }
    ]
  },

  /* ABS Australian System of National Accounts 2024-25; ABS National Accounts June quarter 2025;
     ABS Labour Force October 2025; ABS CPI September quarter 2025; IMF WEO 2025; DFAT trade factsheet 2024 */
  economy: {
    gdpGrowth: [
      { year: "2020–21", gdp: 2.0, perCapita: 1.6 },
      { year: "2021–22", gdp: 4.3, perCapita: 3.7 },
      { year: "2022–23", gdp: 3.6, perCapita: 1.4 },
      { year: "2023–24", gdp: 1.4, perCapita: -1.0 },
      { year: "2024–25", gdp: 1.4, perCapita: -0.3 }
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
    sectors: [
      { name: "Services", share: 67.5 },
      { name: "Industry", share: 23.9 },
      { name: "Agriculture", share: 2.3 }
    ],
    exportsTotal: 645.9,
    exports: [
      { name: "Iron ore & concentrates", value: 124.5 },
      { name: "Coal", value: 85.2 },
      { name: "Natural gas", value: 67.4 },
      { name: "Education-related travel", value: 51.9 },
      { name: "Gold", value: 35.7 }
    ],
    topMarkets: [
      { name: "China", value: 196.3 },
      { name: "United States", value: 92.8 },
      { name: "Japan", value: 75.7 }
    ]
  },

  /* ABS Life expectancy 2022-2024; ABS Deaths 2024; ABS Causes of Death 2024 */
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

  /* ABS Schools 2024; ACARA National Report on Schooling in Australia 2024 */
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

  /* ABS Energy Account 2024-25; DCCEEW Australian Energy Statistics 2024-25 */
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

  sources: [
    { figure: "Population, states & territories", publisher: "Australian Bureau of Statistics", release: "National, state and territory population, June 2025", ref: "30 June 2025" },
    { figure: "Median age", publisher: "Australian Bureau of Statistics", release: "Population projections, Australia", ref: "2022 base" },
    { figure: "Fertility rate", publisher: "Australian Bureau of Statistics", release: "Births, Australia, 2024", ref: "2024" },
    { figure: "GDP growth & GDP per capita", publisher: "Australian Bureau of Statistics", release: "Australian System of National Accounts, 2024–25", ref: "2024–25" },
    { figure: "GDP, June quarter", publisher: "Australian Bureau of Statistics", release: "Australian National Accounts, June quarter 2025", ref: "June quarter 2025" },
    { figure: "GDP in US dollars; GDP per capita (PPP)", publisher: "International Monetary Fund / World Bank", release: "World Economic Outlook; World Development Indicators", ref: "2025" },
    { figure: "Unemployment & participation", publisher: "Australian Bureau of Statistics", release: "Labour Force, Australia, October 2025", ref: "October 2025" },
    { figure: "Consumer prices", publisher: "Australian Bureau of Statistics", release: "Consumer Price Index, September quarter 2025", ref: "September quarter 2025" },
    { figure: "Exports & trading partners", publisher: "Department of Foreign Affairs and Trade", release: "Australia's trade factsheet — goods & services", ref: "Calendar 2024" },
    { figure: "Life expectancy", publisher: "Australian Bureau of Statistics", release: "Life expectancy, 2022–2024", ref: "2022–2024" },
    { figure: "Deaths & leading cause", publisher: "Australian Bureau of Statistics", release: "Deaths, Australia, 2024; Causes of Death, Australia, 2024", ref: "2024" },
    { figure: "Schools, students & teachers", publisher: "Australian Bureau of Statistics", release: "Schools, 2024", ref: "2024" },
    { figure: "School sectors & retention", publisher: "ACARA", release: "National Report on Schooling in Australia 2024", ref: "2024" },
    { figure: "Renewable electricity", publisher: "Australian Bureau of Statistics", release: "Energy Account, Australia, 2024–25", ref: "2024–25" },
    { figure: "Renewables share of total energy", publisher: "Dept. of Climate Change, Energy, the Environment and Water", release: "Australian Energy Statistics, Table R", ref: "2024–25" }
  ]
};
