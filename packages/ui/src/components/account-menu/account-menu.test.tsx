import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AccountMenu, getInitials } from "./account-menu";

const user = { name: "Harun Rashid", email: "harun@nukta.app" };

describe("getInitials", () => {
  it("uses up to two words of the name, else the email", () => {
    expect(getInitials({ name: "Harun Rashid" })).toBe("HR");
    expect(getInitials({ name: "  asif  " })).toBe("A");
    expect(getInitials({ name: "A B C" })).toBe("AB");
    expect(getInitials({ email: "dev@nukta.local" })).toBe("D");
    expect(getInitials({})).toBe("?");
  });
});

describe("AccountMenu", () => {
  it("shows initials and opens a menu with the account link and sign out", async () => {
    const u = userEvent.setup();
    render(
      <AccountMenu
        user={user}
        accountHref="https://myaccount.nukta.app"
        signOutHref="/auth/logout"
      />,
    );
    const trigger = screen.getByRole("button", { name: "Account: Harun Rashid" });
    expect(trigger).toHaveTextContent("HR");

    await u.click(trigger);
    expect(screen.getByText("harun@nukta.app")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Manage your Nukta account" })).toHaveAttribute(
      "href",
      "https://myaccount.nukta.app",
    );
    expect(screen.getByRole("menuitem", { name: "Sign out" })).toHaveAttribute(
      "href",
      "/auth/logout",
    );
  });

  it("calls onSignOut and renders extra items", async () => {
    const onSignOut = vi.fn();
    const u = userEvent.setup();
    render(
      <AccountMenu user={{ email: "dev@nukta.local" }} onSignOut={onSignOut}>
        <li role="menuitem">Billing</li>
      </AccountMenu>,
    );
    await u.click(screen.getByRole("button", { name: "Account: dev@nukta.local" }));
    expect(screen.queryByRole("menuitem", { name: /Manage/ })).not.toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Billing" })).toBeInTheDocument();
    await u.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
