#!/usr/bin/env node
/**
 * Copies templates/<template> to <outDir> as a standalone project:
 * `workspace:*` dependencies are replaced with the current published versions.
 *
 *   node scripts/export-starter.mjs starter ../nukta-starter
 *   node scripts/export-starter.mjs starter-react ../nukta-starter-react
 */
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [template, outDir] = process.argv.slice(2);
if (!template || !outDir || !existsSync(join(root, "templates", template, "package.json"))) {
  console.error("Usage: node scripts/export-starter.mjs <starter|starter-react> <outDir>");
  process.exit(1);
}

const versions = Object.fromEntries(
  readdirSync(join(root, "packages")).map((dir) => {
    const pkg = JSON.parse(readFileSync(join(root, "packages", dir, "package.json"), "utf8"));
    return [pkg.name, pkg.version];
  }),
);

const src = join(root, "templates", template);
const dest = resolve(outDir);
const skip = new Set(["node_modules", ".next", ".turbo", "dist", "next-env.d.ts"]);

// Keep the destination's .git so the export can be committed to the template repo.
if (existsSync(dest)) {
  for (const entry of readdirSync(dest))
    if (entry !== ".git") rmSync(join(dest, entry), { recursive: true });
}
cpSync(src, dest, {
  recursive: true,
  filter: (path) =>
    !path.endsWith(".tsbuildinfo") && !path.split("/").some((part) => skip.has(part)),
});

const pkgPath = join(dest, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.name = `nukta-${template}`;
for (const field of ["dependencies", "devDependencies"]) {
  for (const [name, range] of Object.entries(pkg[field] ?? {})) {
    if (!range.startsWith("workspace:")) continue;
    if (!versions[name]) throw new Error(`No local package found for ${name}`);
    pkg[field][name] = `^${versions[name]}`;
  }
}
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`✓ exported starter to ${dest}`);
