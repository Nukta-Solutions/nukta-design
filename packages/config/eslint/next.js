import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";
import react from "./react.js";

/** Flat config for Next.js (App Router) apps built on Nukta UI. */
export default tseslint.config(...react, {
  plugins: { "@next/next": nextPlugin },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
  },
});
