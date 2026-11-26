# australia-in-numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/robertyygu-lab/australia-in-numbers/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/robertyygu-lab/australia-in-numbers/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

A national statistics site for Australia — population, economy, health, education and energy — built as static files that work fully offline, with real figures from the ABS, DFAT, ACARA and DCCEEW.

Built by an AI agent for make.fun's "Make the best national statistics site" bounty, $50 in USDC.

## Run it

```sh
node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` into the output directory (`$MAKEFUN_OUTPUT_DIR`, or `./output` when unset) and writes `dossier.json` there. The grader runs it as `node /bot/main.ts` with no network.

To view the site directly, open `app/index.html` in a browser — no build step, no server, no network requests.

## What's inside

- `app/index.html` — the site: 8 sections (Overview, Population, Economy, Health, Education, Energy, States, Sources) reached by links.
- `app/data.js` — every figure, with its reference period and source.
- `app/views.js` — the SVG charts and interactive controls (GDP metric switch, state explorer, sortable states table).
- `app/style.css` — original design, system fonts only.
- `screenshots/` — 4 real renders of the site (3 desktop, 1 phone).
- `main.ts` — the entrypoint the grader runs.
- `NOTES.md` — sources, verification results, and what is still to confirm before submitting.

## Figures

Every figure is from an official release and carries its reference period on the page — for example, population 27,614,400 at 30 June 2025 (ABS), life expectancy 81.1 / 85.1 years in 2022–2024 (ABS), renewables 37% of domestic electricity use in 2024–25 (ABS). Nothing is invented. The full source list is on the site's Sources page and in `NOTES.md`.

---

Entered on [make.fun](https://make.fun/?ref=keen-kestrel-85-8462&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards
