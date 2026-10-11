import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../label";
import { Input } from "./input";

const meta = {
  title: "Components/Input",
  component: Input,
  args: { placeholder: "you@company.com", "aria-label": "Email" },
  argTypes: { size: { control: "select", options: ["sm", "md", "lg"] } },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input {...args} id="email" type="email" aria-label={undefined} />
    </div>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="email-invalid">Email</Label>
      <Input
        {...args}
        id="email-invalid"
        aria-label={undefined}
        aria-invalid
        aria-describedby="email-error"
        defaultValue="not-an-email"
      />
      <p id="email-error" className="text-danger text-sm">
        Enter a valid email address.
      </p>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Input {...args} size="sm" aria-label="Small" />
      <Input {...args} size="md" aria-label="Medium" />
      <Input {...args} size="lg" aria-label="Large" />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const File: Story = { args: { type: "file", "aria-label": "Upload file" } };
