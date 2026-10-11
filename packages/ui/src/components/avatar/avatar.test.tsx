import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

describe("Avatar", () => {
  it("shows the fallback when the image has not loaded", () => {
    render(
      <Avatar size="lg">
        <AvatarImage src="/missing.png" alt="Harun Rashid" />
        <AvatarFallback>HR</AvatarFallback>
      </Avatar>,
    );
    // jsdom never loads images, so Radix renders the fallback.
    expect(screen.getByText("HR")).toBeInTheDocument();
    expect(screen.getByText("HR").parentElement).toHaveClass("size-12");
  });
});
