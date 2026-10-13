import {
  AppShellHeader,
  AppShellMain,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SkipLink,
} from "@nukta-solutions/ui";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { SearchCommand } from "@/components/search-command";
import { ThemeToggle } from "@/components/theme-toggle";

// Same value as SIDEBAR_COOKIE_NAME from @nukta-solutions/ui. It's spelled out because exports
// of a client bundle can't be read as plain values in a server component.
const SIDEBAR_COOKIE = "nukta_sidebar_open";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Read the saved state on the server so the sidebar renders collapsed/expanded without a flash.
  const defaultOpen = (await cookies()).get(SIDEBAR_COOKIE)?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
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
        <AppShellMain>{children}</AppShellMain>
      </SidebarInset>
    </SidebarProvider>
  );
}
