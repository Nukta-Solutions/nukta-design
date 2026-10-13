import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../button";
import { StatCard } from "./stat-card";

describe("StatCard", () => {
  it("is a group named by its label, with value and description", () => {
    render(<StatCard label="Wallet balance" value="৳4,820" description="Updated 2 min ago" />);
    const card = screen.getByRole("group", { name: "Wallet balance" });
    expect(within(card).getByText("৳4,820")).toBeInTheDocument();
    expect(within(card).getByText("Updated 2 min ago")).toBeInTheDocument();
  });

  it.each([
    ["up", undefined, "positive", "Increased: +12%"],
    ["down", undefined, "negative", "Decreased: -3%"],
    ["neutral", undefined, "neutral", "No change: 0%"],
    ["up", "negative", "negative", "Increased: +8%"],
  ] as const)(
    "trend %s (sentiment %s) → %s, announced as text",
    (direction, sentimentProp, sentiment, text) => {
      const label = text.split(": ")[1];
      const { container } = render(
        <StatCard
          label="Spend"
          value="৳1,200"
          trend={{ direction, label, sentiment: sentimentProp }}
        />,
      );
      const trend = container.querySelector("[data-slot=stat-card-trend]")!;
      expect(trend).toHaveAttribute("data-sentiment", sentiment);
      expect(trend).toHaveTextContent(text);
      expect(trend.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    },
  );

  it("localizes the trend words", () => {
    render(
      <StatCard
        label="ব্যালেন্স"
        value="৳৪,৮২০"
        trend={{ direction: "up", label: "+১২%" }}
        trendLabels={{ up: "বেড়েছে" }}
      />,
    );
    expect(screen.getByText("বেড়েছে:", { exact: false })).toBeInTheDocument();
  });

  it("shows skeletons and aria-busy while loading", () => {
    render(<StatCard label="Active domains" value="12" description="2 expiring" loading />);
    const card = screen.getByRole("group", { name: "Active domains" });
    expect(card).toHaveAttribute("aria-busy", "true");
    expect(within(card).queryByText("12")).not.toBeInTheDocument();
    expect(within(card).getByText("Loading")).toBeInTheDocument();
  });

  it("renders icon, action and footer slots", () => {
    render(
      <StatCard
        label="Emails sent"
        value="18,420"
        icon={<svg data-testid="icon" />}
        action={<Button size="sm">Details</Button>}
        footer={<a href="/nusend/logs">View logs</a>}
      />,
    );
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View logs" })).toBeInTheDocument();
  });
});
