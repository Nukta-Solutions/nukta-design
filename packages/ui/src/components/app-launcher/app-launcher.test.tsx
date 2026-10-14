import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppLauncher } from "./app-launcher";

const products = [
  { id: "account", name: "Account", icon: <svg />, href: "https://myaccount.nukta.app" },
  {
    id: "domain",
    name: "Domains",
    description: "Domains & DNS",
    icon: <svg />,
    href: "https://domain.nukta.app",
  },
];

describe("AppLauncher", () => {
  it("opens a panel linking to every product and marks the current one", async () => {
    const user = userEvent.setup();
    render(<AppLauncher products={products} currentId="domain" />);
    const trigger = screen.getByRole("button", { name: "Nukta apps" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const nav = screen.getByRole("navigation", { name: "Nukta apps" });
    expect(within(nav).getByRole("link", { name: "Account" })).toHaveAttribute(
      "href",
      "https://myaccount.nukta.app",
    );
    const current = within(nav).getByRole("link", { name: "Domains" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("title", "Domains & DNS");
  });

  it("closes with Escape and returns focus to the button", async () => {
    const user = userEvent.setup();
    render(<AppLauncher products={products} label="Apps" />);
    const trigger = screen.getByRole("button", { name: "Apps" });
    await user.click(trigger);
    expect(screen.getByRole("navigation", { name: "Apps" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("navigation", { name: "Apps" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("renders a footer and passes className to the trigger", async () => {
    const user = userEvent.setup();
    render(
      <AppLauncher
        products={products}
        className="custom"
        footer={<a href="https://nukta.app/products">All products</a>}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Nukta apps" });
    expect(trigger).toHaveClass("custom");
    await user.click(trigger);
    expect(screen.getByRole("link", { name: "All products" })).toBeInTheDocument();
  });
});
