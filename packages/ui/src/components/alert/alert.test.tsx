import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import { Alert, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
  it.each([
    ["info", "status"],
    ["success", "status"],
    ["warning", "alert"],
    ["danger", "alert"],
  ] as const)("%s variant uses role=%s", (variant, role) => {
    render(
      <Alert variant={variant}>
        <AlertTitle>Title</AlertTitle>
      </Alert>,
    );
    const alert = screen.getByRole(role);
    expect(alert).toHaveAttribute("data-variant", variant);
    expect(alert).toHaveTextContent("Title");
  });

  it("allows overriding the role", () => {
    render(<Alert variant="danger" role="status" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows a decorative default icon, a custom icon, or none", () => {
    const { container, rerender } = render(<Alert />);
    expect(container.querySelector("[data-slot=alert-icon]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    rerender(<Alert icon={<span data-testid="custom" />} />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
    rerender(<Alert icon={false} />);
    expect(container.querySelector("[data-slot=alert-icon]")).toBeNull();
  });

  it("renders an action and a keyboard-accessible dismiss button", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(
      <Alert variant="warning" action={<Button size="sm">Top up</Button>} onDismiss={onDismiss}>
        <AlertTitle>Low balance</AlertTitle>
        <AlertDescription>৳120 left.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole("button", { name: "Top up" })).toBeInTheDocument();
    await user.tab();
    await user.tab();
    expect(screen.getByRole("button", { name: "Dismiss" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("uses a custom dismiss label", () => {
    render(<Alert onDismiss={() => {}} dismissLabel="Close notice" />);
    expect(screen.getByRole("button", { name: "Close notice" })).toBeInTheDocument();
  });
});
