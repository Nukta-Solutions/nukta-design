import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

mkdirSync(dist, { recursive: true });
cpSync(resolve(root, "src/styles.css"), resolve(dist, "styles.css"));
cpSync(resolve(root, "src/fonts.css"), resolve(dist, "fonts.css"));
cpSync(resolve(root, "src/fonts"), resolve(dist, "fonts"), { recursive: true });
console.log("✓ copied styles.css, fonts.css and fonts/ to dist");
