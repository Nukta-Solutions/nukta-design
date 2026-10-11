import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  // tsup's dts build sets `baseUrl` internally, which TypeScript 6 flags as deprecated.
  dts: { compilerOptions: { ignoreDeprecations: "6.0" } },
  sourcemap: true,
  clean: true,
  target: "es2022",
});
