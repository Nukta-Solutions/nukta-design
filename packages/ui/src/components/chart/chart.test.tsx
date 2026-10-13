import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Bar, BarChart } from "recharts";
import { type ChartConfig, ChartContainer, ChartLegendContent, ChartTooltipContent } from "./chart";

const config = {
  sent: { label: "Sent", color: "chart-1" },
  bounced: { label: "Bounced", color: "chart-5" },
} satisfies ChartConfig;

describe("ChartContainer", () => {
  it("is a named figure with a hidden description and series color variables", () => {
    render(
      <ChartContainer config={config} title="Emails per day" description="Sends grew 18% this week">
        <BarChart data={[{ day: "Mon", sent: 10, bounced: 1 }]}>
          <Bar dataKey="sent" fill="var(--color-sent)" />
        </BarChart>
      </ChartContainer>,
    );
    const figure = screen.getByRole("figure", { name: "Emails per day" });
    expect(figure).toHaveAccessibleDescription("Sends grew 18% this week");
    expect(figure.style.getPropertyValue("--color-sent")).toBe("var(--color-chart-1)");
    expect(figure.style.getPropertyValue("--color-bounced")).toBe("var(--color-chart-5)");
  });
});

describe("ChartTooltipContent", () => {
  it("shows the label and formatted values with series labels", () => {
    // Rendered directly, as Recharts would, with the config passed explicitly.
    render(
      <ChartTooltipContent
        config={config}
        active
        label="Mon"
        payload={[
          { dataKey: "sent", value: 12000 },
          { dataKey: "bounced", value: 35 },
        ]}
        valueFormatter={(v) => `${v.toLocaleString("en-GB")} emails`}
      />,
    );
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Sent")).toBeInTheDocument();
    expect(screen.getByText("12,000 emails")).toBeInTheDocument();
    expect(screen.getByText("Bounced")).toBeInTheDocument();
  });

  it("renders nothing when inactive", () => {
    const { container } = render(
      <ChartTooltipContent config={config} active={false} payload={[]} />,
    );
    expect(container.querySelector("[data-slot=chart-tooltip]")).toBeNull();
  });
});

describe("ChartLegendContent", () => {
  it("lists series labels", () => {
    render(
      <ChartLegendContent
        config={config}
        payload={[{ dataKey: "sent" }, { dataKey: "bounced" }]}
      />,
    );
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "Sent",
      "Bounced",
    ]);
  });
});
