import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rocket } from "lucide-react";
import { useState } from "react";
import { Button } from "../button";
import { Alert, AlertDescription, AlertTitle } from "./alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  argTypes: {
    variant: { control: "select", options: ["info", "success", "warning", "danger"] },
  },
  decorators: [(Story) => <div className="w-xl">{Story()}</div>],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>
        Mail servers restart on Friday at 02:00 BST for about 10 minutes.
      </AlertDescription>
    </Alert>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid gap-3">
      <Alert variant="info">
        <AlertTitle>New invoice available</AlertTitle>
        <AlertDescription>Your October invoice is ready to download.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Payment received</AlertTitle>
        <AlertDescription>৳2,500 was added to your wallet.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Low balance</AlertTitle>
        <AlertDescription>৳120 left. Services pause when the balance reaches ৳0.</AlertDescription>
      </Alert>
      <Alert variant="danger">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Your card was declined. Update your payment method.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Alert variant="warning" action={<Button size="sm">Top up</Button>}>
      <AlertTitle>Low balance</AlertTitle>
      <AlertDescription>৳120 left in your wallet.</AlertDescription>
    </Alert>
  ),
};

function DismissibleAlert() {
  const [open, setOpen] = useState(true);
  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Show alert again
      </Button>
    );
  }
  return (
    <Alert variant="success" onDismiss={() => setOpen(false)}>
      <AlertTitle>Domain connected</AlertTitle>
      <AlertDescription>nukta.app now points to your hosting.</AlertDescription>
    </Alert>
  );
}

export const Dismissible: Story = { render: () => <DismissibleAlert /> };

export const CustomIcon: Story = {
  render: () => (
    <Alert icon={<Rocket />}>
      <AlertTitle>Nusend is live</AlertTitle>
      <AlertDescription>Send transactional email from your apps.</AlertDescription>
    </Alert>
  ),
};

export const DescriptionOnly: Story = {
  render: () => (
    <Alert variant="info" icon={false}>
      <AlertDescription>Prices include 15% VAT.</AlertDescription>
    </Alert>
  ),
};
