import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd, KbdGroup } from "./kbd";

describe("Kbd", () => {
  it("renders keyboard keys in a group", () => {
    render(
      <KbdGroup>
        <Kbd title="Command">⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    );
    const key = screen.getByText("K");
    expect(key.tagName).toBe("KBD");
    expect(key.parentElement).toHaveAttribute("data-slot", "kbd-group");
    expect(screen.getByTitle("Command")).toHaveTextContent("⌘");
  });
});
