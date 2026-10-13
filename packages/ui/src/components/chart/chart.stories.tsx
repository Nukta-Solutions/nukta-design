import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";

const meta = {
  title: "Components/Chart",
  component: ChartContainer,
  decorators: [(Story) => <div className="w-2xl">{Story()}</div>],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const sends = days.map((day, i) => ({
  day,
  delivered: [8200, 7400, 12100, 13800, 12900, 14200, 6100][i],
  bounced: [120, 90, 210, 160, 140, 180, 70][i],
}));

const sendsConfig = {
  delivered: { label: "Delivered", color: "chart-1" },
  bounced: { label: "Bounced", color: "chart-5" },
} satisfies ChartConfig;

export const Bars: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Nusend deliveries</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={sendsConfig}
          title="Nusend deliveries, last 7 days"
          description="Deliveries peaked at 14,200 on Thursday; bounces stayed under 2%."
          className="h-64"
        >
          <BarChart data={sends} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={48} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="delivered" fill="var(--color-delivered)" radius={4} />
            <Bar dataKey="bounced" fill="var(--color-bounced)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

const bandwidth = Array.from({ length: 12 }, (_, i) => ({
  month: new Intl.DateTimeFormat("en-GB", { month: "short" }).format(new Date(2026, i, 1)),
  singapore: 120 + Math.round(40 * Math.sin(i / 2)) + i * 8,
  dhaka: 80 + Math.round(30 * Math.cos(i / 3)) + i * 5,
}));

const bandwidthConfig = {
  singapore: { label: "Singapore", color: "chart-1" },
  dhaka: { label: "Dhaka", color: "chart-3" },
} satisfies ChartConfig;

export const Areas: Story = {
  render: () => (
    <ChartContainer
      config={bandwidthConfig}
      title="Hosting bandwidth by region, 2026"
      description="Bandwidth grew steadily in both regions; Singapore carries about 60% of traffic."
      className="h-64"
    >
      <AreaChart data={bandwidth} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={48} unit=" GB" />
        <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => `${v} GB`} />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="singapore"
          type="monotone"
          stroke="var(--color-singapore)"
          fill="var(--color-singapore)"
          fillOpacity={0.2}
        />
        <Area
          dataKey="dhaka"
          type="monotone"
          stroke="var(--color-dhaka)"
          fill="var(--color-dhaka)"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ChartContainer>
  ),
};

const revenue = Array.from({ length: 6 }, (_, i) => ({
  month: new Intl.DateTimeFormat("en-GB", { month: "short" }).format(new Date(2026, i + 4, 1)),
  domain: 120000 + i * 9000,
  hosting: 210000 + i * 15000,
  mail: 64000 + i * 4000,
}));

const revenueConfig = {
  domain: { label: "Domain", color: "chart-1" },
  hosting: { label: "Hosting", color: "chart-2" },
  mail: { label: "Mail", color: "chart-3" },
} satisfies ChartConfig;

const taka = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  notation: "compact",
});

export const Lines: Story = {
  render: () => (
    <ChartContainer
      config={revenueConfig}
      title="Monthly revenue by product"
      description="Hosting is the largest and fastest-growing product line."
      className="h-64"
    >
      <LineChart data={revenue} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(v: number) => taka.format(v)}
        />
        <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => taka.format(v)} />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="domain" stroke="var(--color-domain)" strokeWidth={2} dot={false} />
        <Line dataKey="hosting" stroke="var(--color-hosting)" strokeWidth={2} dot={false} />
        <Line dataKey="mail" stroke="var(--color-mail)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  ),
};

const plans = [
  { plan: "starter", customers: 412 },
  { plan: "business", customers: 268 },
  { plan: "enterprise", customers: 41 },
];

const plansConfig = {
  starter: { label: "Starter", color: "chart-1" },
  business: { label: "Business", color: "chart-2" },
  enterprise: { label: "Enterprise", color: "chart-4" },
} satisfies ChartConfig;

export const Donut: Story = {
  render: () => (
    <ChartContainer
      config={plansConfig}
      title="Customers by plan"
      description="Starter 412, Business 268, Enterprise 41."
      className="h-72"
    >
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={plans} dataKey="customers" nameKey="plan" innerRadius="55%" strokeWidth={2}>
          {plans.map((p) => (
            <Cell key={p.plan} fill={`var(--color-${p.plan})`} stroke="var(--color-surface)" />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  ),
};
