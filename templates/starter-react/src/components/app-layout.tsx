import {
  AppShell,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellMobileNav,
  AppShellSidebar,
  SkipLink,
} from "@nukta-solutions/ui";
import { Outlet } from "react-router";
import { AppNav } from "./app-nav";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function AppLayout() {
  return (
    <AppShell>
      <SkipLink />
      <AppShellSidebar>
        <AppNav />
      </AppShellSidebar>
      <AppShellBody>
        <AppShellHeader>
          <AppShellMobileNav>
            <AppNav />
          </AppShellMobileNav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </AppShellHeader>
        <AppShellMain>
          <Outlet />
        </AppShellMain>
      </AppShellBody>
    </AppShell>
  );
}
