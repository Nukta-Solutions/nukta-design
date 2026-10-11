import { FolderKanban, LayoutDashboard, Settings } from "lucide-react";

/** Rename the product and edit navigation here. */
export const siteConfig = {
  name: "Nukta Starter",
  description: "A new Nukta product, built on Nukta UI.",
  nav: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
} as const;
