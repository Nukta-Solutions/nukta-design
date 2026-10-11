import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="bg-primary text-primary-foreground sr-only z-(--z-tooltip) rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <AppSidebar className="hidden md:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
