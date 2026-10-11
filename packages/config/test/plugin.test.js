import { RuleTester } from "eslint";
import { describe, it } from "node:test";
import { rules } from "../eslint/plugin.js";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
});

tester.run("no-hardcoded-design-values", rules["no-hardcoded-design-values"], {
  valid: [
    `const c = "bg-primary text-primary-foreground hover:bg-primary/90";`,
    `const c = "data-[state=open]:bg-accent aria-[invalid=true]:border-danger";`,
    `const c = "has-[>svg]:px-3 group-data-[disabled=true]:opacity-50";`,
    `const c = "max-h-(--radix-select-content-available-height)";`,
    `const c = "color: var(--color-primary)";`,
    `const a = <a href="#main-content">Skip</a>;`,
    `import x from "./#abc";`,
    "const c = `p-4 ${active ? 'bg-accent' : ''}`;",
  ],
  invalid: [
    { code: `const c = "#0282C9";`, errors: [{ messageId: "hardcodedColor" }] },
    { code: `const s = { color: "#fff" };`, errors: [{ messageId: "hardcodedColor" }] },
    { code: `const s = { color: "rgb(0 0 0)" };`, errors: [{ messageId: "hardcodedColor" }] },
    { code: `const s = "oklch(0.5 0.1 200)";`, errors: [{ messageId: "hardcodedColor" }] },
    { code: `const c = "bg-[#ff0000] p-4";`, errors: [{ messageId: "hardcodedColor" }] },
    { code: `const c = "p-4 mt-[13px]";`, errors: [{ messageId: "arbitraryValue" }] },
    { code: `const c = "hover:w-[calc(100%-2rem)]";`, errors: [{ messageId: "arbitraryValue" }] },
    { code: `const c = "[mask-type:luminance]";`, errors: [{ messageId: "arbitraryValue" }] },
    {
      code: `const el = <div className="text-[17px]" />;`,
      errors: [{ messageId: "arbitraryValue" }],
    },
    { code: "const c = `gap-[3px] ${x}`;", errors: [{ messageId: "arbitraryValue" }] },
  ],
});
