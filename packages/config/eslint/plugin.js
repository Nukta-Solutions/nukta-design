/**
 * eslint-plugin-nukta — design-system guard rails.
 *
 * `no-hardcoded-design-values` flags string literals that bypass the token system:
 *   - raw colors: hex (#0282c9), rgb()/rgba()/hsl()/hsla()/oklch()/oklab()/lab()/lch()/color()
 *   - arbitrary Tailwind values: bg-[#fff], p-[13px], w-[calc(100%-2rem)], [mask-type:alpha]
 *
 * Arbitrary *variants* such as `data-[state=open]:`, `aria-[invalid]:` or `has-[>svg]:` are allowed,
 * as is Tailwind v4's CSS-variable shorthand, e.g. `max-h-(--radix-select-content-available-height)`.
 */

const HEX_COLOR = /(?<![\w&/#])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/i;
const COLOR_FN = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(/i;
// A utility whose value is in brackets and is NOT followed by ":" (which would make it a variant).
const ARBITRARY_VALUE = /(?:^|[\s:!])(-?[a-z][\w-]*-\[[^\]\s]+\])(?=$|[\s/!])/i;
// Arbitrary property, e.g. [mask-type:luminance] — not followed by ":".
const ARBITRARY_PROPERTY = /(?:^|[\s:!])(\[[a-z-]+:[^\]\s]+\])(?=$|[\s/!])/i;

function check(value) {
  if (HEX_COLOR.test(value) || COLOR_FN.test(value)) return "hardcodedColor";
  const arbitrary = value.match(ARBITRARY_VALUE) ?? value.match(ARBITRARY_PROPERTY);
  if (arbitrary) return { messageId: "arbitraryValue", data: { value: arbitrary[1] } };
  return null;
}

/** @type {import("eslint").Rule.RuleModule} */
const noHardcodedDesignValues = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow hardcoded colors and arbitrary Tailwind values; use Nukta design tokens instead.",
    },
    schema: [],
    messages: {
      hardcodedColor:
        "Hardcoded color found. Use a semantic token instead (e.g. `bg-primary`, `text-muted-foreground`, `var(--color-danger)`).",
      arbitraryValue:
        "Arbitrary Tailwind value `{{value}}` found. Use a token-based utility from the Nukta scale instead.",
    },
  },
  create(context) {
    function report(node, value) {
      const result = check(value);
      if (!result) return;
      if (typeof result === "string") context.report({ node, messageId: result });
      else context.report({ node, ...result });
    }

    return {
      Literal(node) {
        if (typeof node.value !== "string") return;
        const parent = node.parent;
        // Module specifiers and directives are never design values.
        if (
          parent?.type === "ImportDeclaration" ||
          parent?.type === "ExportNamedDeclaration" ||
          parent?.type === "ExportAllDeclaration" ||
          parent?.type === "ImportExpression" ||
          (parent?.type === "ExpressionStatement" && parent.directive)
        ) {
          return;
        }
        report(node, node.value);
      },
      TemplateElement(node) {
        report(node, node.value.cooked ?? node.value.raw);
      },
    };
  },
};

export const rules = { "no-hardcoded-design-values": noHardcodedDesignValues };

export default {
  meta: { name: "eslint-plugin-nukta" },
  rules,
};
