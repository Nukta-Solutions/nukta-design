import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders text with variant classes", () => {
    render(<Badge variant="success">Active</Badge>);
    expect(screen.getByText("Active")).toHaveClass("bg-success", "text-success-foreground");
  });

  it("can render as a link", () => {
    render(
      <Badge asChild variant="outline">
        <a href="/tags/design">design</a>
      </Badge>,
    );
    expect(screen.getByRole("link", { name: "design" })).toHaveAttribute("data-slot", "badge");
  });
});
