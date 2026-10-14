import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCard, Globe, Mail, Send, Server, UserRound } from "lucide-react";
import { AccountMenu } from "../account-menu";
import { AppShellHeader } from "../app-shell";
import { AppLauncher } from "./app-launcher";

const products = [
  { id: "account", name: "Account", icon: <UserRound />, href: "https://myaccount.nukta.app" },
  {
    id: "domain",
    name: "Domains",
    description: "Domains & DNS",
    icon: <Globe />,
    href: "https://domain.nukta.app",
  },
  {
    id: "hosting",
    name: "Hosting",
    description: "Websites & apps",
    icon: <Server />,
    href: "https://hosting.nukta.app",
  },
  {
    id: "mail",
    name: "Mail",
    description: "Business email",
    icon: <Mail />,
    href: "https://mail.nukta.app",
  },
  {
    id: "nusend",
    name: "Nusend",
    description: "Email campaigns",
    icon: <Send />,
    href: "https://nusend.io",
  },
  {
    id: "billing",
    name: "Billing",
    description: "Wallet & invoices",
    icon: <CreditCard />,
    href: "https://billing.nukta.app",
  },
];

const meta = {
  title: "Components/AppLauncher",
  component: AppLauncher,
  args: { products, currentId: "domain" },
  parameters: { layout: "centered" },
} satisfies Meta<typeof AppLauncher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PlainTiles: Story = {
  args: { tile: "plain" },
};

export const WithFooter: Story = {
  args: {
    footer: (
      <a href="https://nukta.app/products" className="text-accent hover:underline">
        All Nukta products
      </a>
    ),
  },
};

/** The standard top-right corner of a Nukta app: app launcher, then the account avatar. */
export const InHeader: Story = {
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <AppShellHeader>
      <span className="font-display font-semibold">Nukta Domains</span>
      <div className="ml-auto flex items-center gap-1">
        <AppLauncher {...args} />
        <AccountMenu
          user={{ name: "Harun Rashid", email: "harun@nukta.app" }}
          accountHref="https://myaccount.nukta.app"
          signOutHref="/auth/logout"
        />
      </div>
    </AppShellHeader>
  ),
};
