import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCard, Settings } from "lucide-react";
import { DropdownMenuItem } from "../dropdown-menu";
import { AccountMenu } from "./account-menu";

const meta = {
  title: "Components/AccountMenu",
  component: AccountMenu,
  args: {
    user: { name: "Harun Rashid", email: "harun@nukta.app" },
    accountHref: "https://myaccount.nukta.app",
    signOutHref: "/auth/logout",
  },
  parameters: { layout: "centered" },
} satisfies Meta<typeof AccountMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmailOnly: Story = {
  args: { user: { email: "dev@nukta.local" } },
};

export const WithAppItems: Story = {
  render: (args) => (
    <AccountMenu {...args}>
      <DropdownMenuItem asChild>
        <a href="/wallet">
          <CreditCard aria-hidden="true" /> Wallet
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a href="/settings">
          <Settings aria-hidden="true" /> Settings
        </a>
      </DropdownMenuItem>
    </AccountMenu>
  ),
};
