import {
  ProductSwitcher,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@nukta-solutions/ui";
import { Link, useLocation } from "react-router";
import { products, siteConfig } from "@/lib/site";
import { LogoMark } from "./logo";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  const { pathname } = useLocation();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <Sidebar aria-label={siteConfig.name}>
      <SidebarHeader>
        <ProductSwitcher
          currentId={siteConfig.productId}
          products={products.map((p) => ({
            ...p,
            icon: p.id === siteConfig.productId ? <LogoMark /> : <p.icon />,
          }))}
        />
      </SidebarHeader>
      <SidebarContent>
        {siteConfig.nav.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={isActive(href)} tooltip={label}>
                    <Link to={href}>
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
