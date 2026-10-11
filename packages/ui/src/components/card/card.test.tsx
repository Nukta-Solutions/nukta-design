import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

describe("Card", () => {
  it("renders its parts with a heading", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref}>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>$12,400</CardContent>
        <CardFooter>Updated now</CardFooter>
      </Card>,
    );
    expect(screen.getByRole("heading", { name: "Revenue" })).toBeInTheDocument();
    expect(screen.getByText("$12,400")).toBeInTheDocument();
    expect(ref.current).toHaveAttribute("data-slot", "card");
  });
});
