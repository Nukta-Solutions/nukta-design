import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BarChart3,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  Globe,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  MoreHorizontal,
  Plus,
  Send,
  Server,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AppShellHeader, AppShellMain, PageHeader } from "../app-shell";
import { Avatar, AvatarFallback } from "../avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../breadcrumb";
import { Button } from "../button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../collapsible";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Kbd, KbdGroup } from "../kbd";
import { Separator } from "../separator";
import { ProductSwitcher, type Product } from "./product-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  type SidebarProviderProps,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "./sidebar";
import { useKeyboardShortcut } from "../../lib/use-keyboard-shortcut";

const meta = {
  title: "Components/Sidebar",
  component: SidebarProvider,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SidebarProvider>;

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

function NavUser() {
  const { isMobile, state } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" tooltip="Account" className="text-foreground">
              <Avatar size="sm" aria-hidden="true">
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">Asif Rahman</span>
                <span className="text-muted-foreground truncate text-xs">asif@nukta.app</span>
              </span>
              <ChevronsUpDown aria-hidden="true" className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            side={isMobile || state === "expanded" ? "top" : "right"}
            align="end"
          >
            <DropdownMenuLabel>Asif Rahman</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings /> Account settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard /> Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="danger">
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const mailboxGroups = [
  { title: "Inbox", icon: Inbox, badge: "24", items: ["All mail", "Unread", "Flagged"] },
  { title: "Domains", icon: Globe, items: ["nukta.app", "nuktasolutions.com", "nusend.io"] },
];

function AdminSidebar() {
  const [active, setActive] = useState("Overview");
  return (
    <Sidebar aria-label="Nukta Admin">
      <SidebarHeader>
        <ProductSwitcher products={products} currentId="admin" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {[
              { title: "Overview", icon: LayoutDashboard },
              { title: "Customers", icon: Users, badge: "128" },
              { title: "Billing", icon: CreditCard },
              { title: "Reports", icon: BarChart3 },
            ].map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active === item.title} tooltip={item.title}>
                  <a
                    href={`#${item.title.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive(item.title);
                    }}
                  >
                    <item.icon aria-hidden="true" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Mail</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Add mailbox">
            <Plus aria-hidden="true" />
          </SidebarGroupAction>
          <SidebarMenu>
            {mailboxGroups.map((group, index) => (
              <Collapsible
                key={group.title}
                asChild
                defaultOpen={index === 0}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={group.title}>
                      <group.icon aria-hidden="true" />
                      <span>{group.title}</span>
                      <ChevronRight
                        aria-hidden="true"
                        className="ml-auto transition-transform duration-(--duration-normal) group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {group.items.map((item) => (
                        <SidebarMenuSubItem key={item}>
                          <SidebarMenuSubButton href={`#${item}`}>
                            <span>{item}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Security</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Access control">
                <a href="#access">
                  <ShieldCheck aria-hidden="true" />
                  <span>Access control</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover aria-label="Access control options">
                    <MoreHorizontal aria-hidden="true" />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuItem>View audit log</DropdownMenuItem>
                  <DropdownMenuItem>Manage roles</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function SearchButton() {
  const [open, setOpen] = useState(false);
  useKeyboardShortcut("k", () => setOpen((o) => !o));
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground w-56 justify-between max-md:hidden"
      >
        Search…
        <KbdGroup>
          <Kbd title="Command or Control">⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search Nukta">
        <CommandInput placeholder="Search products, customers and actions…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
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

function Shell(props: Partial<SidebarProviderProps>) {
  return (
    <SidebarProvider {...props}>
      <AdminSidebar />
      <SidebarInset>
        <AppShellHeader>
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="max-md:hidden">
                <BreadcrumbLink href="#admin">Nukta Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="max-md:hidden" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <SearchButton />
          </div>
        </AppShellHeader>
        <AppShellMain>
          <div className="grid gap-6">
            <PageHeader title="Overview" description="Press ⌘/Ctrl+B to collapse the sidebar." />
            <div className="grid gap-4 md:grid-cols-3">
              {["Customers", "MRR", "Open tickets"].map((t) => (
                <Card key={t}>
                  <CardHeader>
                    <CardDescription>{t}</CardDescription>
                    <CardTitle className="text-2xl">—</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm">Placeholder</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AppShellMain>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Default: Story = { render: () => <Shell defaultOpen /> };

export const IconRail: Story = {
  name: "Collapsed (icon rail)",
  render: () => <Shell defaultOpen={false} />,
};

export const Offcanvas: Story = {
  name: "Off-canvas",
  render: () => <Shell collapsible="offcanvas" defaultOpen={false} />,
};

export const Mobile: Story = {
  render: () => <Shell defaultOpen />,
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
