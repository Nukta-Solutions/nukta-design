"use client";

import { AccountMenu, AppLauncher, DropdownMenuItem } from "@nukta-solutions/ui";
import { Settings } from "lucide-react";
import Link from "next/link";
import { products, siteConfig } from "@/lib/site";

/**
 * The top-right corner of every Nukta app: the app launcher, then the signed-in person's avatar.
 * Wire `user` and sign-out to your auth.
 */
export function NavUser() {
  return (
    <>
      <AppLauncher
        currentId={siteConfig.productId}
        products={products.map(({ icon: Icon, ...p }) => ({ ...p, icon: <Icon /> }))}
      />
      <AccountMenu
        user={{ name: "Nukta Solutions", email: "hello@nuktasolutions.com" }}
        accountHref="https://myaccount.nukta.app"
        onSignOut={() => {}}
      >
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings aria-hidden="true" /> Settings
          </Link>
        </DropdownMenuItem>
      </AccountMenu>
    </>
  );
}
