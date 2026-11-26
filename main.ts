// Australia in Numbers — make.fun entrypoint.
//
// This program hands the site in. The site itself is the plain static
// files in app/ (ES-free plain scripts, one stylesheet, no build step),
// so a browser can open app/index.html straight from disk and it works
// with no network at all. This file's job is only to package it: copy
// app/ and screenshots/ into the output directory and write
// dossier.json there, using buildDossier from the vendored make.fun
// library (vendor/makefun-frontend.ts, the kit's copy, unchanged — the
// scorer requires dossier.json to be byte-for-byte what its own copy of
// that library writes, so this file never hand-builds the dossier).
//
// It validates the entry before copying anything, so a broken entry
// fails here with a readable message instead of failing inside the
// grader, and it re-checks the written dossier afterwards.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (Node 22, standard library only — no dependencies, no network.)

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// The scorer's caps (reference/gate.json). Only text_max_bytes shapes
// the dossier's bytes; the rest refuse an entry the scorer would refuse:
// more than 4 screenshots or one over 256 KiB; more than 993 files and
// directories in app/, or more than 16 MiB of app files in total (app/
// counts beside /output's own 1000-entry cap, its screenshots/ and its
// dossier.json).
const TEXT_MAX_BYTES = 163840;
const SCREENSHOTS_MAX = 4;
const SCREENSHOT_MAX_BYTES = 262144;
const APP_MAX_FILES = 993;
const APP_MAX_BYTES = 16777216;

const here = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Fail loudly with a message that names the file and the rule broken.
function fail(message: string): never {
  throw new Error(`main.ts: ${message}`);
}

// Walk a directory depth-first, collecting files in a stable order so
// every run sees the same list (and the same dossier bytes).
function collectFiles(dir: string, found: string[] = []): string[] {
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) collectFiles(path, found);
    else found.push(path);
  }
  return found;
}

function sha256Hex(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function bytesOf(paths: string[]): number {
  return paths.reduce((total, p) => total + statSync(p).size, 0);
}

// ---- Pre-flight: refuse to hand in an entry the scorer would refuse. ----
// Every check names the exact file and the cap it breaks, so a failure
// here tells the builder what to fix instead of failing silently in
// the grader.
const appDir = join(here, "app");
const shotsDir = join(here, "screenshots");
const vendorFile = join(here, "vendor", "makefun-frontend.ts");
const requiredFiles = [
  join(appDir, "index.html"),
  join(appDir, "data.js"),
  join(appDir, "views.js"),
  join(appDir, "main.js"),
  join(appDir, "style.css"),
  vendorFile,
];
for (const required of requiredFiles) {
  if (!existsSync(required)) {
    fail(`required file is missing: ${relative(here, required)}`);
  }
}

const appFiles = collectFiles(appDir);
const appBytes = bytesOf(appFiles);
if (appFiles.length > APP_MAX_FILES) {
  fail(
    `app/ has ${appFiles.length} files, over the ${APP_MAX_FILES} cap — ` +
      `remove files or split the site before submitting`,
  );
}
if (appBytes > APP_MAX_BYTES) {
  fail(
    `app/ is ${appBytes} bytes, over the ${APP_MAX_BYTES} byte cap — ` +
      `shrink the app files before submitting`,
  );
}

// Screenshots are optional, but if present they must be few and small:
// the scorer caps them at 4 files of 256 KiB each, and refuses the
// whole entry otherwise. Hidden files (e.g. .DS_Store) do not count.
const shotFiles = existsSync(shotsDir)
  ? readdirSync(shotsDir)
      .filter((name) => !name.startsWith("."))
      .sort()
  : [];
if (shotFiles.length > SCREENSHOTS_MAX) {
  fail(
    `${shotFiles.length} screenshots in screenshots/, over the ` +
      `${SCREENSHOTS_MAX} cap — keep only the best ${SCREENSHOTS_MAX}`,
  );
}
for (const name of shotFiles) {
  const size = statSync(join(shotsDir, name)).size;
  if (size > SCREENSHOT_MAX_BYTES) {
    fail(
      `screenshot ${name} is ${size} bytes, over the ` +
        `${SCREENSHOT_MAX_BYTES} byte cap — re-export it smaller`,
    );
  }
  if (!/\.(jpe?g|png|webp)$/i.test(name)) {
    fail(`screenshot ${name} is not a JPG, PNG or WebP image`);
  }
}

// ---- Copy the site and write the dossier. ----
mkdirSync(outDir, { recursive: true });
cpSync(appDir, join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });
}

// The dossier must be exactly what the vendored library writes —
// buildDossier reads the copied files back from the output directory,
// so it describes what was actually handed in, not what was intended.
const dossierJson = buildDossier(outDir, {
  text_max_bytes: TEXT_MAX_BYTES,
  screenshots: { max: SCREENSHOTS_MAX, max_bytes: SCREENSHOT_MAX_BYTES },
  app_max_files: APP_MAX_FILES,
  app_max_bytes: APP_MAX_BYTES,
});
const dossierPath = join(outDir, "dossier.json");
writeFileSync(dossierPath, dossierJson);

// ---- Post-write check: the dossier is real, tagged, and complete. ----
// Parse it back (a corrupt write must fail here, not in the grader),
// confirm the schema tag the scorer looks for, and confirm every app
// file actually landed in the output.
const dossier = JSON.parse(readFileSync(dossierPath, "utf8")) as {
  schema?: string;
};
if (dossier.schema !== "makefun/dossier/v1") {
  fail(`dossier.json has unexpected schema ${String(dossier.schema)}`);
}
for (const source of appFiles) {
  const rel = relative(appDir, source);
  if (!existsSync(join(outDir, "app", rel))) {
    fail(`copied app/${rel} is missing from the output`);
  }
}
for (const name of shotFiles) {
  if (!existsSync(join(outDir, "screenshots", name))) {
    fail(`copied screenshots/${name} is missing from the output`);
  }
}

const dossierSize = statSync(dossierPath).size;
console.log(
  `Australia in Numbers: ${appFiles.length} app files (${appBytes} bytes), ` +
    `${shotFiles.length} screenshots, dossier.json ${dossierSize} bytes ` +
    `sha256 ${sha256Hex(dossierPath).slice(0, 16)}…`,
);
