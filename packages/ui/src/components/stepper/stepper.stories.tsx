import type { Meta, StoryObj } from "@storybook/react-vite";
import { Step, Stepper } from "./stepper";

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  decorators: [(Story) => <div className="w-2xl">{Story()}</div>],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <Stepper aria-label="Connect your domain">
      <Step step={1} status="complete" title="Add domain" description="nukta.app" />
      <Step step={2} status="current" title="Verify DNS" description="Add a TXT record" />
      <Step step={3} status="upcoming" title="Go live" />
    </Stepper>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stepper orientation="vertical" aria-label="Set up Nusend">
      <Step step={1} status="complete" title="Create API key" description="Done 12 Oct 2026" />
      <Step
        step={2}
        status="complete"
        title="Verify sending domain"
        description="SPF and DKIM found"
      />
      <Step
        step={3}
        status="error"
        title="Send a test email"
        description="Delivery failed: mailbox not found"
      />
      <Step step={4} status="upcoming" title="Go to production" />
    </Stepper>
  ),
};
