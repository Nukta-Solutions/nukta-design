import react from "@nukta-solutions/config/eslint/react";
import storybook from "eslint-plugin-storybook";

export default [...react, ...storybook.configs["flat/recommended"], { ignores: ["!.storybook"] }];
