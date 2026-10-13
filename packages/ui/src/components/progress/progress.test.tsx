import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress, UsageMeter } from "./progress";

const gb = (n: number) => `${n} GB`;

describe("Progress", () => {
  it("exposes value and range", () => {
    render(<Progress value={30} aria-label="Upload" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "30");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("supports an indeterminate state", () => {
    render(<Progress value={null} aria-label="Provisioning" />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });
});

describe("UsageMeter", () => {
  it("shows usage, percent and a meaningful value text", () => {
    render(<UsageMeter label="Storage" used={4} limit={10} formatValue={gb} />);
    expect(screen.getByText(/4 GB of 10 GB · 40%/)).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Storage" })).toHaveAttribute(
      "aria-valuetext",
      "4 GB of 10 GB, 40%",
    );
  });

  it.each([
    [8.5, "warning", "Almost full"],
    [9.8, "danger", "Limit reached"],
  ] as const)("at %s GB shows the %s level as text", (used, level, text) => {
    const { container } = render(
      <UsageMeter label="Storage" used={used} limit={10} formatValue={gb} />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-level", level);
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      expect.stringContaining(text),
    );
  });

  it("handles unlimited plans without a bar", () => {
    render(<UsageMeter label="Bandwidth" used={120} limit={null} formatValue={gb} />);
    expect(screen.getByText("120 GB · Unlimited")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("caps the bar at the limit when over quota", () => {
    render(<UsageMeter label="Sends" used={12000} limit={10000} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "10000");
    expect(screen.getByText("Limit reached")).toBeInTheDocument();
  });
});

describe("UsageMeter labelling", () => {
  it("names the bar from any label, including visually hidden ones", () => {
    render(
      <UsageMeter
        label={<span className="sr-only">Storage for hello@nukta.app</span>}
        used={2}
        limit={10}
      />,
    );
    expect(
      screen.getByRole("progressbar", { name: "Storage for hello@nukta.app" }),
    ).toBeInTheDocument();
  });
});
