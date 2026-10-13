import {
  AppShellHeader,
  AppShellMain,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Kbd,
  KbdGroup,
  PageHeader,
  type Product,
  ProductSwitcher,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  StatCard,
  StatusIndicator,
  useKeyboardShortcut,
} from "@nukta-solutions/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BarChart3,
  CreditCard,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Search,
  Send,
  Server,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

/**
 * Nukta Admin: the shared ecosystem shell (Sidebar + ProductSwitcher + ⌘K) around a
 * dashboard of StatCards, a Chart and service status. Reference composition, not a component.
 */
const meta = { title: "Patterns/Admin Shell", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const products: Product[] = [
  {
    id: "admin",
    name: "Nukta Admin",
    description: "Customers & billing",
    icon: <LayoutDashboard />,
    href: "#admin",
  },
  {
    id: "domain",
    name: "Nukta Domain",
    description: "Domains & DNS",
    icon: <Globe />,
    href: "#domain",
  },
  {
    id: "hosting",
    name: "Nukta Hosting",
    description: "Sites & servers",
    icon: <Server />,
    href: "#hosting",
  },
  { id: "mail", name: "Nukta Mail", description: "Business email", icon: <Mail />, href: "#mail" },
  {
    id: "nusend",
    name: "Nusend",
    description: "Transactional email",
    icon: <Send />,
    href: "#nusend",
  },
];

const nav = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Customers", icon: Users, badge: "1,284" },
  { label: "Billing", icon: CreditCard },
  { label: "Reports", icon: BarChart3 },
  { label: "Support", icon: LifeBuoy, badge: "12" },
];

const revenue = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((month, i) => ({
  month,
  domain: 118 + i * 9,
  hosting: 205 + i * 16,
  mail: 61 + i * 5,
}));

const revenueConfig = {
  domain: { label: "Domain", color: "chart-1" },
  hosting: { label: "Hosting", color: "chart-2" },
  mail: { label: "Mail", color: "chart-3" },
} satisfies ChartConfig;

function Search_() {
  const [open, setOpen] = useState(false);
  useKeyboardShortcut("k", () => setOpen((o) => !o));
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground max-sm:size-9 max-sm:px-0 sm:w-56 sm:justify-between"
      >
        <span className="flex items-center gap-2">
          <Search aria-hidden="true" />
          <span className="max-sm:sr-only">Search…</span>
        </span>
        <KbdGroup className="max-sm:hidden">
          <Kbd title="Command or Control">⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search Nukta Admin">
        <CommandInput placeholder="Search customers, invoices, products…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
            {nav.map((item) => (
              <CommandItem key={item.label}>
                <item.icon aria-hidden="true" /> {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Products">
            {products.map((p) => (
              <CommandItem key={p.id}>
                {p.icon} {p.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function AdminShell() {
  return (
    <SidebarProvider>
      <Sidebar aria-label="Nukta Admin">
        <SidebarHeader>
          <ProductSwitcher products={products} currentId="admin" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={item.active} tooltip={item.label}>
                    <a href={`#${item.label.toLowerCase()}`}>
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <AppShellHeader>
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <Search_ />
          </div>
        </AppShellHeader>
        <AppShellMain>
          <div className="grid gap-6">
            <PageHeader title="Overview" description="All Nukta products, October 2026." />
            <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Customers"
                icon={<Users />}
                value="1,284"
                trend={{ direction: "up", label: "+64 this month" }}
              />
              <StatCard
                label="MRR"
                icon={<Wallet />}
                value="৳4,26,000"
                trend={{ direction: "up", label: "+9.8%" }}
              />
              <StatCard
                label="Active domains"
                icon={<Globe />}
                value="3,912"
                description="148 expire this month"
              />
              <StatCard
                label="Open tickets"
                icon={<LifeBuoy />}
                value="12"
                trend={{ direction: "down", label: "-5 since Monday", sentiment: "positive" }}
              />
            </section>
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue by product</CardTitle>
                  <CardDescription>Thousands of BDT, last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={revenueConfig}
                    title="Revenue by product, last 6 months"
                    description="Hosting grew from ৳205k to ৳285k and remains the largest product."
                    className="h-64"
                  >
                    <BarChart data={revenue} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} width={40} />
                      <ChartTooltip
                        content={<ChartTooltipContent valueFormatter={(v) => `৳${v}k`} />}
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="domain" stackId="r" fill="var(--color-domain)" />
                      <Bar dataKey="hosting" stackId="r" fill="var(--color-hosting)" />
                      <Bar
                        dataKey="mail"
                        stackId="r"
                        fill="var(--color-mail)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Service status</CardTitle>
                  <CardDescription>Updated 1 minute ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 text-sm">
                    {[
                      ["Domain API", "operational"],
                      ["Hosting · Singapore", "operational"],
                      ["Mail · IMAP", "degraded"],
                      ["Nusend delivery", "operational"],
                      ["Billing", "maintenance"],
                    ].map(([name, status]) => (
                      <li key={name} className="flex items-center justify-between gap-4">
                        <span>{name}</span>
                        <StatusIndicator status={status as "operational"} size="sm" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </AppShellMain>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Dashboard: Story = { render: () => <AdminShell /> };
