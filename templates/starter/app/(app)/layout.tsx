import {
  AppShell,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellMobileNav,
  AppShellSidebar,
  SkipLink,
} from "@nukta-solutions/ui";
import { AppNav } from "@/components/app-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
        <AppShellMain>{children}</AppShellMain>
      </AppShellBody>
    </AppShell>
  );
}
