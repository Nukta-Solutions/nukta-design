import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { toast, Toaster } from "./toast";

const meta: Meta<typeof Toaster> = {
  title: "Components/Toast",
  component: Toaster,
  decorators: [
    (Story) => (
      <>
        {Story()}
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Event created")}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Profile saved")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info("New version available")}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Storage almost full")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.error("Payment failed")}>
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Invoice deleted", {
            description: "INV-003 was moved to trash.",
            action: { label: "Undo", onClick: () => toast.success("Restored") },
          })
        }
      >
        With action
      </Button>
    </div>
  ),
};
