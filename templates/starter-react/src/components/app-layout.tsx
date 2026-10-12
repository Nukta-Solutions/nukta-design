import {
  AppShellHeader,
  AppShellMain,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SkipLink,
} from "@nukta-solutions/ui";
import { Outlet } from "react-router";
import { AppSidebar } from "./app-sidebar";
import { SearchCommand } from "./search-command";
import { ThemeToggle } from "./theme-toggle";

export function AppLayout() {
  return (
    // The expanded/collapsed state is restored from a cookie; ⌘/Ctrl+B toggles it.
    <SidebarProvider>
      <SkipLink />
      <AppSidebar />
      <SidebarInset>
        <AppShellHeader>
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-2">
            <SearchCommand />
            <ThemeToggle />
          </div>
        </AppShellHeader>
        <AppShellMain>
          <Outlet />
        </AppShellMain>
      </SidebarInset>
    </SidebarProvider>
  );
}
