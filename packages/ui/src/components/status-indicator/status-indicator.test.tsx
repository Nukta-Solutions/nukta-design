import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusIndicator } from "./status-indicator";

describe("StatusIndicator", () => {
  it.each([
    ["operational", "Operational"],
    ["degraded", "Degraded"],
    ["down", "Down"],
    ["maintenance", "Maintenance"],
    ["pending", "Pending"],
    ["inactive", "Inactive"],
  ] as const)("%s shows the text %s next to a decorative dot", (status, text) => {
    const { container } = render(<StatusIndicator status={status} />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-status", status);
    expect(root).toHaveTextContent(text);
    expect(root.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("accepts a custom label and pulse", () => {
    const { container } = render(
      <StatusIndicator status="pending" label="Propagating DNS" pulse />,
    );
    expect(screen.getByText("Propagating DNS")).toBeInTheDocument();
    expect(container.querySelector(".animate-ping")).not.toBeNull();
  });
});
