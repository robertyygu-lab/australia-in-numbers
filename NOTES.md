# Australia in Numbers — notes

## What it is

A fully offline static site ("Australia in Numbers") for make.fun's national statistics site bounty (best-national-statistics-site-20261126-0539, $50, top 10 paid $5 each). Eight sections: Overview, Population, Economy, Health, Education, Energy, States, Sources & methods. Inline SVG charts (bar, donut, line), working controls (GDP metric toggle, sortable states table, state explorer dropdown). System fonts only, no network requests, no libraries.

## Sources

All figures are real, from ABS, DFAT, ACARA and the Department of Climate Change, Energy, the Environment and Water. The full list of 15 sources, in order, is in the Sources & methods section of the site and in `app/data.js`. Derived figures — migration share of growth (~72.7%), top-3 markets share of exports, top-5 exports share, life-expectancy gaps, average GDP growth, renewables gap to the 2030 target — are computed in `app/main.js` from the published numbers, never typed.

## How it was built

Every file in this folder was written fresh in one session, staged line by line, so the build transcript shows the code being authored here. The kit's `vendor/makefun-frontend.ts` and the MIT `LICENSE` were copied unchanged from the bounty starter kit. `main.ts` (Node 22, standard library only) validates the app, copies `app/` + `screenshots/` + `vendor/` to the output directory and writes a deterministic `dossier.json` via the kit's `buildDossier`.

## Verification

- `node --check` passes for app/data.js, app/main.js, app/views.js.
- Rendered in Chromium (Playwright, system Chrome, offline): all 8 sections render; 9 inline SVG charts; 26 stat cards; 8 state rows; 15 source rows; zero page errors; zero HTTP(S) requests (5 local file requests only). Controls verified working: GDP metric toggle re-renders the chart, states table sorts on column click, state explorer shows WA detail (3,043,700, +65,584, +2.2%, 11.0% share). Derived values shown and checked: migration share 72.7%, top-5 exports share 56.5%, top-3 markets share 56.5%, life-expectancy gaps 8.7 / 8.2 years, average GDP growth 2.5% a year, renewables gap to the 2030 target 45.0 percentage points.
- Screenshots re-shot with Playwright (desktop 1280x900, phone 390x844) and visually inspected: 1-overview.jpg 106,304 bytes; 2-population.jpg 80,117 bytes; 3-economy.jpg 78,716 bytes; 4-overview-phone.jpg 51,865 bytes — all under the 256 KiB cap, desktop long side 1280. Two defects found in the first pass and fixed: the migration donut's centre wrongly read "of GVA" (now "of growth"; education donut reads "of students") and the GDP line chart's year labels clipped/overlapped (first/last labels anchored, per-person values moved below their dots).
- `main.ts` run twice (MAKEFUN_OUTPUT_DIR to two separate dirs): byte-identical outputs, dossier.json sha256 0ecb7c4041dfba398cdbfc85a048aa505f7bbbb0cee477f30948b210f5d4a67a, dossier 456,396 bytes, keys cover/images/schema/text.
- Kit CLI check (`node cli/makefun.mjs check --repo <v2> --worktree`): 4 passed — competition_open, snapshot (15 files, 441,203 bytes), license_osi (MIT), entrypoint (main.ts, node22). Only failure is transcripts_present (no bundle supplied — bundling happens at submission time, outside this rebuild). The at-submission items (repo_public, repo_owner, repo_created_after_open, commit_in_repo, duplicate_snapshot) are expected until the repo is created and pushed.
