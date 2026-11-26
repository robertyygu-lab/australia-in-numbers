// Australia in Numbers — make.fun entrypoint (Node 22, standard library only).
//
// The site is this directory's app/ folder, plain static files a browser opens
// at app/index.html (ES modules, CSS, no build step), its content held in its
// own files: nothing it runs, styles or shows loads over the network. The
// program hands it in: it copies app/ and screenshots/ from beside this file
// to /output and writes /output/dossier.json with buildDossier from the
// vendored make.fun library (vendor/makefun-frontend.ts, the kit's copy,
// unchanged: the scorer requires dossier.json to be byte for byte what its
// own copy of that library writes).
//
// Before copying it validates the entry against the scorer's caps, so a
// broken entry fails here with a readable message instead of failing in the
// grader; after writing it re-reads dossier.json and checks the schema tag
// and that the copied files are present, then prints a one-line summary.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

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
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 16 MiB of app files: app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json).
const TEXT_MAX_BYTES = 163840;
const SCREENSHOTS_MAX = 4;
const SCREENSHOT_MAX_BYTES = 262144;
const APP_MAX_FILES = 993;
const APP_MAX_BYTES = 16777216;

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function fail(message: string): never {
  throw new Error(`main.ts: ${message}`);
}

function walk(dir: string, outFiles: string[]): void {
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, outFiles);
    else outFiles.push(path);
  }
}

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

// ---- Pre-flight: refuse to hand in an entry the scorer would refuse. ----
const appDir = join(here, "app");
const shotsDir = join(here, "screenshots");
const vendorFile = join(here, "vendor", "makefun-frontend.ts");
if (!existsSync(appDir)) fail("app/ is missing");
if (!existsSync(join(appDir, "index.html"))) fail("app/index.html is missing");
if (!existsSync(vendorFile)) fail("vendor/makefun-frontend.ts is missing");

const appFiles: string[] = [];
walk(appDir, appFiles);
const appBytes = appFiles.reduce((n, f) => n + statSync(f).size, 0);
if (appFiles.length > APP_MAX_FILES) {
  fail(`app/ has ${appFiles.length} files, over the ${APP_MAX_FILES} cap`);
}
if (appBytes > APP_MAX_BYTES) {
  fail(`app/ is ${appBytes} bytes, over the ${APP_MAX_BYTES} cap`);
}

const shotFiles = existsSync(shotsDir)
  ? readdirSync(shotsDir).filter((f) => !f.startsWith(".")).sort()
  : [];
if (shotFiles.length > SCREENSHOTS_MAX) {
  fail(`${shotFiles.length} screenshots, over the ${SCREENSHOTS_MAX} cap`);
}
for (const f of shotFiles) {
  const size = statSync(join(shotsDir, f)).size;
  if (size > SCREENSHOT_MAX_BYTES) {
    fail(`screenshot ${f} is ${size} bytes, over the ${SCREENSHOT_MAX_BYTES} cap`);
  }
}

// ---- Copy and write the dossier. ----
mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(out, "screenshots"), { recursive: true });
}

writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: TEXT_MAX_BYTES,
    screenshots: { max: SCREENSHOTS_MAX, max_bytes: SCREENSHOT_MAX_BYTES },
    app_max_files: APP_MAX_FILES,
    app_max_bytes: APP_MAX_BYTES,
  }),
);

// ---- Post-write check: the dossier is real, tagged, and complete. ----
const dossierPath = join(out, "dossier.json");
const dossier = JSON.parse(readFileSync(dossierPath, "utf8")) as {
  schema?: string;
};
if (dossier.schema !== "makefun/dossier/v1") {
  fail(`dossier.json has unexpected schema ${String(dossier.schema)}`);
}
for (const f of appFiles) {
  const rel = f.slice(appDir.length + 1);
  if (!existsSync(join(out, "app", rel))) fail(`copied app/${rel} is missing`);
}

console.log(
  `Australia in Numbers: ${appFiles.length} app files (${appBytes} bytes), ` +
    `${shotFiles.length} screenshots, dossier.json ` +
    `${statSync(dossierPath).size} bytes sha256 ${sha256(dossierPath).slice(0, 16)}…`,
);
