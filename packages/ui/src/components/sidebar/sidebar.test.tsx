import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../collapsible";
import { ProductSwitcher } from "./product-switcher";
import {
  Sidebar,
  SIDEBAR_COOKIE_NAME,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  type SidebarProviderProps,
  SidebarTrigger,
  useSidebar,
} from "./sidebar";

function App(props: Partial<SidebarProviderProps>) {
  return (
    <SidebarProvider {...props}>
      <Sidebar aria-label="Main sidebar">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Domains</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive tooltip="All domains">
                  <a href="/domains">
                    <svg aria-hidden="true" />
                    <span>All domains</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuBadge>12</SidebarMenuBadge>
              </SidebarMenuItem>
              <Collapsible asChild>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="DNS">
                      <svg aria-hidden="true" />
                      <span>DNS</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/dns/records">Records</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        <main>Page</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function mockMobile(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  document.cookie = `${SIDEBAR_COOKIE_NAME}=; max-age=0; path=/`;
});

describe("Sidebar (desktop)", () => {
  it("renders an expanded complementary landmark with the current page marked", () => {
    render(<App />);
    const sidebar = screen.getByRole("complementary", { name: "Main sidebar" });
    expect(sidebar).toHaveAttribute("data-state", "expanded");
    expect(within(sidebar).getByRole("link", { name: "All domains" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const trigger = screen.getByRole("button", { name: "Toggle sidebar" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", sidebar.id);
  });

  it("collapses to an icon rail, keeps names for screen readers and remembers it in a cookie", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveAttribute("data-state", "collapsed");
    expect(sidebar).toHaveAttribute("data-collapsible", "icon");
    expect(screen.getByRole("link", { name: "All domains" })).toBeInTheDocument();
    expect(document.cookie).toContain(`${SIDEBAR_COOKIE_NAME}=false`);
  });

  it("shows a tooltip for items in the icon rail", async () => {
    const user = userEvent.setup();
    render(<App defaultOpen={false} />);
    await user.hover(screen.getByRole("link", { name: "All domains" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("All domains");
  });

  it("toggles with ⌘/Ctrl+B", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<App onOpenChange={onOpenChange} />);
    await user.keyboard("{Control>}b{/Control}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("complementary")).toHaveAttribute("data-state", "collapsed");
  });

  it("reads the initial state from the cookie", () => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=false; path=/`;
    render(<App />);
    expect(screen.getByRole("complementary")).toHaveAttribute("data-state", "collapsed");
  });

  it("expands when a collapsible parent is clicked in the icon rail", async () => {
    const user = userEvent.setup();
    render(<App defaultOpen={false} />);
    await user.click(screen.getByRole("button", { name: "DNS" }));
    expect(screen.getByRole("complementary")).toHaveAttribute("data-state", "expanded");
    expect(screen.getByRole("link", { name: "Records" })).toBeInTheDocument();
  });

  it("makes off-canvas content inert while collapsed", () => {
    render(<App collapsible="offcanvas" defaultOpen={false} />);
    const sidebar = screen.getByRole("complementary", { hidden: true });
    expect(sidebar).toHaveAttribute("data-collapsible", "offcanvas");
    expect(sidebar.firstElementChild).toHaveAttribute("inert");
  });

  it("is controlled by open", async () => {
    const user = userEvent.setup();
    render(<App open onOpenChange={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(screen.getByRole("complementary")).toHaveAttribute("data-state", "expanded");
  });
});

describe("Sidebar (mobile)", () => {
  it("opens as a sheet and closes when a link is followed", async () => {
    mockMobile(true);
    const user = userEvent.setup();
    render(<App />);
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: "Toggle sidebar" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    const sheet = screen.getByRole("dialog", { name: "Navigation" });
    await user.click(within(sheet).getByRole("link", { name: "All domains" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("useSidebar", () => {
  it("throws outside a provider", () => {
    function Bad() {
      useSidebar();
      return null;
    }
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Bad />)).toThrow(/SidebarProvider/);
  });
});

describe("ProductSwitcher", () => {
  const products = [
    {
      id: "domain",
      name: "Nukta Domain",
      description: "Domains & DNS",
      icon: <svg />,
      href: "https://domain.nukta.app",
    },
    {
      id: "mail",
      name: "Nukta Mail",
      description: "Business email",
      icon: <svg />,
      href: "https://mail.nukta.app",
    },
  ];

  it("shows the current product and links to the others", async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <ProductSwitcher products={products} currentId="domain" />
          </SidebarHeader>
        </Sidebar>
      </SidebarProvider>,
    );
    const trigger = screen.getByRole("button", { name: /Nukta Domain/ });
    await user.click(trigger);
    const menu = screen.getByRole("menu");
    expect(within(menu).getByText("Nukta products")).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: /Nukta Domain.*\(current\)/ }),
    ).toHaveAttribute("aria-current", "page");
    expect(within(menu).getByRole("menuitem", { name: /Nukta Mail/ })).toHaveAttribute(
      "href",
      "https://mail.nukta.app",
    );
  });

  it("calls onSelect instead of following links when given", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <ProductSwitcher products={products} currentId="domain" onSelect={onSelect} />
      </SidebarProvider>,
    );
    await user.click(screen.getByRole("button", { name: /Nukta Domain/ }));
    await user.click(screen.getByRole("menuitem", { name: /Nukta Mail/ }));
    expect(onSelect).toHaveBeenCalledWith(products[1]);
  });
});

describe("Sidebar icon rail", () => {
  it("keeps a leading avatar or logo visible and hides only the label text", () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <span data-testid="logo">N</span>
                <span>Nukta Admin</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>,
    );
    const button = screen.getByRole("button", { name: /Nukta Admin/ });
    expect(button.className).toContain("[&>span:not(:first-child)]:sr-only");
    expect(button.firstElementChild).toBe(screen.getByTestId("logo"));
  });
});
