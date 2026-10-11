"use client";

import { cn } from "@nukta-solutions/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { Logo } from "./logo";

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("bg-surface flex w-60 shrink-0 flex-col border-r", className)}>
      <div className="flex h-16 items-center border-b px-5">
        <Link
          href="/"
          className="focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          <Logo />
        </Link>
      </div>
      <nav aria-label="Main" className="flex flex-1 flex-col gap-1 p-3">
        {siteConfig.nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "text-muted-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                "aria-[current=page]:bg-secondary aria-[current=page]:text-secondary-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
