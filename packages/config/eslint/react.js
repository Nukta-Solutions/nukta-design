import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import base from "./base.js";
import nukta from "./plugin.js";

/**
 * Flat config for React code (libraries and apps).
 * Includes the Nukta design-system rule that flags hardcoded colors and arbitrary Tailwind values.
 */
export default tseslint.config(
  ...base,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    settings: { react: { version: "detect" } },
    plugins: { nukta },
    rules: {
      "react/prop-types": "off",
      "nukta/no-hardcoded-design-values": "warn",
    },
  },
);
