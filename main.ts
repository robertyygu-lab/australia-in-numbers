// Australia in Numbers — entrypoint.
// Validates the offline static site, copies app/ + screenshots/ + vendor/
// to the output directory and writes a deterministic dossier.json
// through the kit's vendor/makefun-frontend.ts (buildDossier).
// Node 22, standard library only, erasable TypeScript.

import { buildDossier } from "./vendor/makefun-frontend.ts";
import { createHash } from "node:crypto";
import {
  cpSync, existsSync, mkdirSync, readdirSync, readFileSync,
  statSync, writeFileSync
} from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? join(ROOT, "output"));
const MAX_FILES = 993;
const MAX_BYTES = 16 * 1024 * 1024;
const MAX_SHOT_BYTES = 256 * 1024;

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

function walk(dir: string, base: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, out);
    else if (entry.isFile()) out.push(relative(base, full));
  }
}

function sha256(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function main(): void {
  const appDir = join(ROOT, "app");
  const shotsDir = join(ROOT, "screenshots");
  const vendorDir = join(ROOT, "vendor");

  // --- Validation ---
  if (!existsSync(join(appDir, "index.html"))) fail("app/index.html is missing");
  if (!existsSync(join(vendorDir, "makefun-frontend.ts"))) fail("vendor/makefun-frontend.ts is missing");
  for (const needed of ["data.js", "main.js", "style.css", "views.js"]) {
    if (!existsSync(join(appDir, needed))) fail(`app/${needed} is missing`);
  }

  const files: string[] = [];
  walk(appDir, ROOT, files);
  walk(shotsDir, ROOT, files);
  walk(vendorDir, ROOT, files);
  files.sort();

  if (files.length > MAX_FILES) fail(`too many files: ${files.length} (max ${MAX_FILES})`);
  let total = 0;
  for (const f of files) total += statSync(join(ROOT, f)).size;
  if (total > MAX_BYTES) fail(`app too large: ${total} bytes (max ${MAX_BYTES})`);

  const shots = files.filter((f) => f.startsWith("screenshots/"));
  if (shots.length === 0) fail("no screenshots found");
  if (shots.length > 4) fail(`too many screenshots: ${shots.length} (max 4)`);
  for (const s of shots) {
    const size = statSync(join(ROOT, s)).size;
    if (size > MAX_SHOT_BYTES) fail(`screenshot too large: ${s} (${size} bytes, max ${MAX_SHOT_BYTES})`);
  }

  // --- Build the dossier through the kit's frontend helper ---
  // buildDossier takes the entry root directory and the scorer caps,
  // and returns the dossier bytes.
  const dossierBytes = buildDossier(ROOT, { text_max_bytes: 1572864 });

  // --- Copy everything to the output directory ---
  mkdirSync(OUT, { recursive: true });
  cpSync(appDir, join(OUT, "app"), { recursive: true });
  cpSync(shotsDir, join(OUT, "screenshots"), { recursive: true });
  cpSync(vendorDir, join(OUT, "vendor"), { recursive: true });
  writeFileSync(join(OUT, "dossier.json"), dossierBytes);

  console.log(`ok: ${files.length} files, ${total} bytes, ${shots.length} screenshots -> ${OUT} dossier.json sha256=${sha256(dossierBytes)}`);
}

main();
