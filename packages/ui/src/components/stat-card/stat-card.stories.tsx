import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Globe, Mail, MoreHorizontal, Server, Wallet } from "lucide-react";
import { Button } from "../button";
import { StatCard } from "./stat-card";

const meta = {
  title: "Components/Stat Card",
  component: StatCard,
  args: {
    label: "Wallet balance",
    value: "৳4,820.00",
    description: "Updated 2 min ago",
  },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTrend: Story = {
  args: {
    icon: <Wallet />,
    trend: { direction: "up", label: "+12.4% vs last month" },
  },
};

export const Trends: Story = {
  decorators: [(Story) => <div className="w-3xl">{Story()}</div>],
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        label="Revenue"
        value="৳4,82,000"
        trend={{ direction: "up", label: "+12.4%" }}
        description="vs last month"
      />
      <StatCard
        label="Open tickets"
        value="41"
        trend={{ direction: "down", label: "-8 since Monday", sentiment: "positive" }}
      />
      <StatCard
        label="Monthly spend"
        value="৳12,300"
        trend={{ direction: "up", label: "+18%", sentiment: "negative" }}
        description="above budget"
      />
      <StatCard
        label="Uptime"
        value="99.98%"
        trend={{ direction: "neutral", label: "Same as last week" }}
      />
    </div>
  ),
};

export const WithActionAndFooter: Story = {
  args: {
    label: "Emails sent",
    value: "18,420",
    icon: <Mail />,
    description: "of 50,000 this month",
    action: (
      <Button variant="ghost" size="icon" className="-mt-1 -mr-2 size-8" aria-label="More options">
        <MoreHorizontal aria-hidden="true" />
      </Button>
    ),
    footer: (
      <Button variant="link" className="h-auto p-0" asChild>
        <a href="#logs">
          View delivery logs <ArrowRight aria-hidden="true" />
        </a>
      </Button>
    ),
  },
};

export const Loading: Story = { args: { loading: true, icon: <Wallet /> } };

export const DashboardRow: Story = {
  decorators: [(Story) => <div className="w-5xl">{Story()}</div>],
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label="Wallet balance"
        icon={<Wallet />}
        value="৳4,820"
        trend={{ direction: "down", label: "-৳1,200 this week" }}
      />
      <StatCard
        label="Active domains"
        icon={<Globe />}
        value="12"
        description="2 expire this month"
      />
      <StatCard label="Hosting plans" icon={<Server />} value="3" description="All healthy" />
      <StatCard label="Mailboxes" icon={<Mail />} value="24" loading />
    </div>
  ),
};
