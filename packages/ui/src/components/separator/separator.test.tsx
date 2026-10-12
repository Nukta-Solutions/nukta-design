import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "./separator";

describe("Separator", () => {
  it("is decorative by default", () => {
    const { container } = render(<Separator />);
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("data-orientation", "horizontal");
  });

  it("exposes role and orientation when not decorative", () => {
    render(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });
});
