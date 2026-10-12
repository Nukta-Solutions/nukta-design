import { AppShellSidebarHeader, NavItem, NavList } from "@nukta-solutions/ui";
import { Link, useLocation } from "react-router";
import { siteConfig } from "@/lib/site";
import { Logo } from "./logo";

/** Logo + main navigation, rendered in the desktop sidebar and the mobile sheet. */
export function AppNav() {
  const { pathname } = useLocation();

  return (
    <>
      <AppShellSidebarHeader>
        <Link
          to="/"
          className="focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          <Logo />
        </Link>
      </AppShellSidebarHeader>
      <NavList>
        {siteConfig.nav.map(({ href, label, icon: Icon }) => (
          <NavItem
            key={href}
            asChild
            active={href === "/" ? pathname === "/" : pathname.startsWith(href)}
          >
            <Link to={href}>
              <Icon aria-hidden="true" />
              {label}
            </Link>
          </NavItem>
        ))}
      </NavList>
    </>
  );
}
