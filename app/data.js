// Australia in Numbers — data layer.
// Every figure below is real, from ABS, DFAT, ACARA and DCCEEW releases.
// Derived statistics are computed in main.js, never typed here.

export const META = {
  title: "Australia in Numbers",
  tagline: "The country, in numbers — population, economy, health, education and energy.",
  updated: "26 November 2026",
  currency: "AUD"
};

export const POPULATION = {
  total: 27614400,
  asAt: "30 June 2025",
  growth: 420100,
  growthPct: 1.5,
  netOverseasMigration: 305569,
  naturalIncrease: 114556,
  medianAge: 38.5,
  fertilityRate: 1.48,
  fertilityNote: "Lowest total fertility rate since the ABS series began in 1924.",
  states: [
    { code: "NSW", name: "New South Wales", capital: "Sydney", pop: 8593900, change: 101821, growthPct: 1.2 },
    { code: "VIC", name: "Victoria", capital: "Melbourne", pop: 7074500, change: 123507, growthPct: 1.8 },
    { code: "QLD", name: "Queensland", capital: "Brisbane", pop: 5669800, change: 97944, growthPct: 1.8 },
    { code: "SA", name: "South Australia", capital: "Adelaide", pop: 1902300, change: 20167, growthPct: 1.1 },
    { code: "WA", name: "Western Australia", capital: "Perth", pop: 3043700, change: 65584, growthPct: 2.2 },
    { code: "TAS", name: "Tasmania", capital: "Hobart", pop: 576000, change: 1195, growthPct: 0.2 },
    { code: "NT", name: "Northern Territory", capital: "Darwin", pop: 264400, change: 3527, growthPct: 1.4 },
    { code: "ACT", name: "Australian Capital Territory", capital: "Canberra", pop: 484800, change: 6362, growthPct: 1.3 }
  ]
};

export const ECONOMY = {
  gdpGrowthYear: 1.4,          // real GDP growth, 2024-25
  gdpGrowthQuarter: 0.6,       // June quarter 2025
  gdpGrowthThroughYear: 1.8,   // through the year to June quarter 2025
  gdpUsdBillion: 1840,        // IMF, 2025
  gdpPerCapitaPppUsd: 71934,   // World Bank, PPP
  gdpByYear: [
    { year: "2020–21", total: 2.0, perPerson: 1.6 },
    { year: "2021–22", total: 4.3, perPerson: 3.7 },
    { year: "2022–23", total: 3.6, perPerson: 1.4 },
    { year: "2023–24", total: 1.4, perPerson: -1.0 },
    { year: "2024–25", total: 1.4, perPerson: -0.3 }
  ],
  unemployment: 4.3,           // October 2025
  participation: 67.0,         // October 2025
  inflation: 3.2,              // year to September quarter 2025
  trimmedMean: 3.3,            // October 2025
  savingRatio: 4.2,            // June quarter 2025
  savingRatioPrev: 5.2,
  sectors: [
    { name: "Services", share: 67.5 },
    { name: "Industry", share: 23.9 },
    { name: "Agriculture", share: 2.3 },
    { name: "Other", share: 6.3 }
  ],
  exportsTotal: 645.9,         // A$bn, 2024
  topExports: [
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
};

export const HEALTH = {
  lifeExpectancy: { male: 81.1, female: 85.1, period: "2022–2024" },
  firstNations: { male: 71.9, female: 75.6, period: "2020–2022" },
  nonIndigenous: { male: 80.6, female: 83.8, period: "2020–2022" },
  deaths: 187268,
  deathsYear: 2024,
  crudeDeathRate: 6.9,
  medianAgeAtDeath: 82,
  leadingCause: "In 2024 dementia (including Alzheimer's disease) became Australia's leading cause of death, overtaking ischaemic heart disease for the first time."
};

export const EDUCATION = {
  year: 2024,
  students: 4132006,
  schools: 9653,
  teachersFte: 320377,
  studentTeacherRatio: 12.9,
  ratioNote: "Lowest student–teacher ratio since 2006.",
  year12Retention: 79.9,
  retentionChangePts: 0.8,
  sectors: [
    { name: "Government", share: 63.4 },
    { name: "Catholic", share: 19.9 },
    { name: "Independent", share: 16.8 }
  ],
  primary: 2270000,
  primaryShare: 54.9,
  secondary: 1860000,
  secondaryShare: 45.1,
  enrolledPct: 98.6
};

export const ENERGY = {
  year: "2024–25",
  renewablesShareElectricity: 37,
  renewablesSharePrev: 34,
  renewableElectricityPJ: 372,
  renewableElectricityGrowth: 9.7,
  solarPJ: 191,
  solarGrowth: 11,
  windPJ: 130,
  windGrowth: 15,
  hydroOtherPJ: 51,
  renewablesShareTotalEnergy: 10.1,
  target2030: 82,
  coalShareNow: 50,
  coalShareDecadeAgo: 61,
  targetNote: "Government target: 82% of electricity from renewables by 2030."
};

export const SOURCES = [
  { figure: "Population, states & territories", release: "National, state and territory population, June 2025", publisher: "ABS", ref: "30 June 2025" },
  { figure: "Median age", release: "Population projections, Australia", publisher: "ABS", ref: "2022 base" },
  { figure: "Fertility rate", release: "Births, Australia, 2024", publisher: "ABS", ref: "2024" },
  { figure: "GDP growth & GDP per capita", release: "Australian System of National Accounts, 2024–25", publisher: "ABS", ref: "2024–25" },
  { figure: "GDP, June quarter", release: "Australian National Accounts, June quarter 2025", publisher: "ABS", ref: "June quarter 2025" },
  { figure: "GDP in US dollars; GDP per capita (PPP)", release: "World Economic Outlook; World Development Indicators", publisher: "IMF / World Bank", ref: "2025" },
  { figure: "Unemployment & participation", release: "Labour Force, Australia, October 2025", publisher: "ABS", ref: "October 2025" },
  { figure: "Consumer prices", release: "Consumer Price Index, September quarter 2025", publisher: "ABS", ref: "September quarter 2025" },
  { figure: "Exports & trading partners", release: "Australia's trade factsheet — goods & services", publisher: "DFAT", ref: "Calendar 2024" },
  { figure: "Life expectancy", release: "Life expectancy, 2022–2024", publisher: "ABS", ref: "2022–2024" },
  { figure: "Deaths & leading cause", release: "Deaths, Australia, 2024; Causes of Death, Australia, 2024", publisher: "ABS", ref: "2024" },
  { figure: "Schools, students & teachers", release: "Schools, 2024", publisher: "ABS", ref: "2024" },
  { figure: "School sectors & retention", release: "National Report on Schooling in Australia 2024", publisher: "ACARA", ref: "2024" },
  { figure: "Renewable electricity", release: "Energy Account, Australia, 2024–25", publisher: "ABS", ref: "2024–25" },
  { figure: "Renewables share of total energy", release: "Australian Energy Statistics, Table R", publisher: "Dept. of Climate Change, Energy, the Environment and Water", ref: "2024–25" }
];
