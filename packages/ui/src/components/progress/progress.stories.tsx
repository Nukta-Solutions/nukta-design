import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { Progress, UsageMeter } from "./progress";

const meta = {
  title: "Components/Progress",
  component: Progress,
  args: { value: 60, "aria-label": "Upload progress" },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SizesAndTones: Story = {
  render: () => (
    <div className="grid gap-4">
      <Progress value={40} size="sm" aria-label="Small" />
      <Progress value={55} aria-label="Medium" />
      <Progress value={70} size="lg" aria-label="Large" />
      <Progress value={100} tone="success" aria-label="Complete" />
      <Progress value={85} tone="warning" aria-label="Warning" />
      <Progress value={98} tone="danger" aria-label="Danger" />
    </div>
  ),
};

export const Indeterminate: Story = { args: { value: null, "aria-label": "Provisioning server" } };

const bytes = (gb: number) => `${gb.toLocaleString("en-GB", { maximumFractionDigits: 1 })} GB`;

export const UsageMeters: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Plan usage</CardTitle>
        <CardDescription>Business plan · resets 1 Nov 2026</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <UsageMeter label="Mailbox storage" used={4.2} limit={10} formatValue={bytes} />
        <UsageMeter label="Emails sent (Nusend)" used={41800} limit={50000} />
        <UsageMeter label="Disk space" used={19.7} limit={20} formatValue={bytes} />
        <UsageMeter label="Bandwidth" used={182} limit={null} formatValue={bytes} />
      </CardContent>
    </Card>
  ),
};
