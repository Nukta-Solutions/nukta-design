import "@nukta-solutions/ui/fonts.css";
import "./storybook.css";
import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // Run axe on every story. Violations show in the Accessibility panel and fail test runs.
    a11y: { test: "error" },
    options: {
      storySort: { order: ["Introduction", "Foundations", "Components"] },
    },
  },
  decorators: [
    // `.light` opts out of the OS dark preference so the toolbar is the source of truth.
    withThemeByClassName({ themes: { light: "light", dark: "dark" }, defaultTheme: "light" }),
  ],
  tags: ["autodocs"],
};

export default preview;
