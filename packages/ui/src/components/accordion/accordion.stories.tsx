import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

// Accordion's props are a union (single/multiple), so each story sets them in JSX.
const meta = {
  title: "Components/Accordion",
  component: Accordion,
  decorators: [(Story) => <div className="w-lg">{Story()}</div>],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const faqs = [
  [
    "How am I billed?",
    "Charges come from your Nukta wallet. Top up with bKash, card or bank transfer.",
  ],
  [
    "Can I move a domain to Nukta?",
    "Yes. Unlock it at your current registrar and start a transfer.",
  ],
  ["Is there a free plan for Nusend?", "The first 3,000 emails each month are free."],
] as const;

function Items() {
  return faqs.map(([q, a], i) => (
    <AccordionItem key={q} value={`item-${i}`}>
      <AccordionTrigger>{q}</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
    </AccordionItem>
  ));
}

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-0">
      <Items />
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["item-0", "item-2"]}>
      <Items />
    </Accordion>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="a">
        <AccordionTrigger>Available section</AccordionTrigger>
        <AccordionContent>Content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b" disabled>
        <AccordionTrigger>Locked section (upgrade to unlock)</AccordionTrigger>
        <AccordionContent>Hidden</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
