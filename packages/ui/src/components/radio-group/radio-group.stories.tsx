import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "Components/Radio Group",
  component: RadioGroup,
  args: { defaultValue: "pro", "aria-label": "Plan" },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const plans = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      {plans.map((plan) => (
        <div key={plan.value} className="flex items-center gap-2">
          <RadioGroupItem value={plan.value} id={`plan-${plan.value}`} />
          <Label htmlFor={`plan-${plan.value}`}>{plan.label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup {...args} orientation="horizontal" className="flex gap-6">
      {plans.map((plan) => (
        <div key={plan.value} className="flex items-center gap-2">
          <RadioGroupItem value={plan.value} id={`h-plan-${plan.value}`} />
          <Label htmlFor={`h-plan-${plan.value}`}>{plan.label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};
