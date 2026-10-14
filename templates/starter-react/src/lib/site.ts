import {
  FolderKanban,
  Globe,
  LayoutDashboard,
  Mail,
  Send,
  Server,
  Settings,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Rename the product and edit navigation here. */
export const siteConfig = {
  name: "Nukta Starter",
  description: "A new Nukta product, built on Nukta UI.",
  /** This app's id in `products` below; it's marked as current in the product switcher. */
  productId: "starter",
  nav: [
    {
      label: "Workspace",
      items: [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/projects", label: "Projects", icon: FolderKanban },
      ],
    },
    {
      label: "Account",
      items: [{ href: "/settings", label: "Settings", icon: Settings }],
    },
  ] satisfies { label: string; items: NavItem[] }[],
};

/**
 * The Nukta ecosystem shown in the product switcher and the app launcher. Replace the hrefs with
 * real app URLs.
 */
export const products = [
  {
    id: "starter",
    name: siteConfig.name,
    description: "This app",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    id: "account",
    name: "Nukta Account",
    description: "Profile & security",
    href: "https://myaccount.nukta.app",
    icon: UserRound,
  },
  {
    id: "admin",
    name: "Nukta Admin",
    description: "Customers & billing",
    href: "#",
    icon: ShieldCheck,
  },
  { id: "domain", name: "Nukta Domain", description: "Domains & DNS", href: "#", icon: Globe },
  { id: "hosting", name: "Nukta Hosting", description: "Sites & servers", href: "#", icon: Server },
  { id: "mail", name: "Nukta Mail", description: "Business email", href: "#", icon: Mail },
  { id: "nusend", name: "Nusend", description: "Transactional email", href: "#", icon: Send },
];

/** Every nav item, for search. */
export const allNavItems: NavItem[] = siteConfig.nav.flatMap((group) => group.items);
