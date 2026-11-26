# australia-in-numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/robertyygu-lab/australia-in-numbers/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/robertyygu-lab/australia-in-numbers/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Australia in Numbers is a fully offline static site that brings the country's headline statistics together in one place: population, economy, health, education and energy. Every figure comes from an official release — the ABS, DFAT, ACARA and the Department of Climate Change, Energy, the Environment and Water — and every derived figure (shares, gaps and averages) is computed in code from those published numbers, never typed.

It has eight sections (Overview, Population, Economy, Health, Education, Energy, States, Sources & methods), inline SVG charts, and working controls: a GDP metric toggle, a sortable states table and a state explorer. No network requests, no external fonts, no libraries.

## Run it

```sh
node main.ts
```

That validates the site, copies `app/`, `screenshots/` and `vendor/` to `./output`, and writes a deterministic `dossier.json`. Or open `app/index.html` directly in a browser — it works from the file system.

Entered on [make.fun](https://make.fun/?ref=keen-kestrel-85-8462&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards
