import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildThemeCss, buildTokensJson } from "../src/build";

const dist = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
mkdirSync(dist, { recursive: true });
writeFileSync(resolve(dist, "theme.css"), buildThemeCss());
writeFileSync(resolve(dist, "tokens.json"), JSON.stringify(buildTokensJson(), null, 2) + "\n");
console.log("✓ wrote dist/theme.css and dist/tokens.json");
