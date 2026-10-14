import { cva, type VariantProps } from "class-variance-authority";
import { LogOut, UserRound } from "lucide-react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";

export interface AccountMenuUser {
  name?: string | null;
  email?: string | null;
  /** Profile picture URL. Initials are shown when missing or while loading. */
  image?: string | null;
}

export const accountMenuTriggerVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-full",
    "ease-standard hover:ring-muted transition-shadow duration-(--duration-fast) hover:ring-4",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
  ],
  {
    variants: {
      size: { sm: "size-8", md: "size-10" },
    },
    defaultVariants: { size: "sm" },
  },
);

export interface AccountMenuProps extends VariantProps<typeof accountMenuTriggerVariants> {
  user: AccountMenuUser;
  /** Link to the Nukta account (profile, security) page. Hidden when omitted. */
  accountHref?: string;
  /** Text of the account link. Default "Manage your Nukta account". */
  accountLabel?: string;
  /** Sign-out URL. Use `onSignOut` instead for a client-side sign-out. */
  signOutHref?: string;
  onSignOut?: () => void;
  /** Extra `DropdownMenuItem`s shown between the account link and sign out. */
  children?: React.ReactNode;
  /** Classes for the trigger button. */
  className?: string;
}

/** Up to two initials from the name, or the first letter of the email. */
export function getInitials(user: AccountMenuUser): string {
  const words = user.name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (words.length > 0) {
    return words
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }
  return (user.email?.[0] ?? "?").toUpperCase();
}

/**
 * The signed-in person's avatar in the top-right corner of every Nukta app. It opens a menu with
 * their name and email, a link to manage their Nukta account, and sign out.
 */
export function AccountMenu({
  user,
  accountHref,
  accountLabel = "Manage your Nukta account",
  signOutHref,
  onSignOut,
  children,
  size,
  className,
}: AccountMenuProps) {
  const initials = getInitials(user);
  const who = user.name ?? user.email ?? "your account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-slot="account-menu"
        aria-label={`Account: ${who}`}
        className={cn(accountMenuTriggerVariants({ size }), className)}
      >
        <UserAvatar user={user} initials={initials} className="size-full" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-72">
        <DropdownMenuLabel className="flex items-center gap-3 py-2 font-normal">
          <UserAvatar user={user} initials={initials} size="md" />
          <span className="grid min-w-0 leading-tight">
            {user.name && <span className="truncate font-medium">{user.name}</span>}
            {user.email && (
              <span className="text-muted-foreground truncate text-xs">{user.email}</span>
            )}
          </span>
        </DropdownMenuLabel>
        {accountHref && (
          <DropdownMenuItem asChild>
            <a href={accountHref}>
              <UserRound aria-hidden="true" />
              {accountLabel}
            </a>
          </DropdownMenuItem>
        )}
        {children}
        {(signOutHref || onSignOut) && (
          <>
            <DropdownMenuSeparator />
            {signOutHref && !onSignOut ? (
              <DropdownMenuItem asChild>
                <a href={signOutHref}>
                  <LogOut aria-hidden="true" />
                  Sign out
                </a>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={onSignOut}>
                <LogOut aria-hidden="true" />
                Sign out
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserAvatar({
  user,
  initials,
  size = "sm",
  className,
}: {
  user: AccountMenuUser;
  initials: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <Avatar size={size} aria-hidden="true" className={className}>
      {user.image && <AvatarImage src={user.image} alt="" />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
