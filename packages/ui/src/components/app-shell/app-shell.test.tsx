import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  AppShell,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellMobileNav,
  AppShellSidebar,
  NavItem,
  NavList,
  PageHeader,
  SkipLink,
} from "./app-shell";

function Nav() {
  return (
    <NavList>
      <NavItem href="#dashboard" active>
        Dashboard
      </NavItem>
      <NavItem href="#settings">Settings</NavItem>
    </NavList>
  );
}

function Example() {
  return (
    <AppShell>
      <SkipLink />
      <AppShellSidebar>
        <Nav />
      </AppShellSidebar>
      <AppShellBody>
        <AppShellHeader>
          <AppShellMobileNav>
            <Nav />
          </AppShellMobileNav>
        </AppShellHeader>
        <AppShellMain>
          <PageHeader title="Dashboard" description="Overview" />
        </AppShellMain>
      </AppShellBody>
    </AppShell>
  );
}

describe("AppShell", () => {
  it("exposes landmarks, a skip link and the current page", () => {
    render(<Example />);
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Settings" })).not.toHaveAttribute("aria-current");
  });

  it("opens mobile navigation in a sheet and closes it when a link is followed", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const sheet = screen.getByRole("dialog", { name: "Navigation" });
    const links = sheet.querySelectorAll("a[href]");
    expect(links).toHaveLength(2);
    await user.click(links[1]!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders a router link via asChild", () => {
    render(
      <NavItem asChild active>
        <a href="/projects" data-router="yes">
          Projects
        </a>
      </NavItem>,
    );
    const link = screen.getByRole("link", { name: "Projects" });
    expect(link).toHaveAttribute("data-router", "yes");
    expect(link).toHaveAttribute("aria-current", "page");
  });
});
