import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Label } from "./label";

describe("Label", () => {
  it("focuses its control when clicked", async () => {
    render(
      <>
        <Label htmlFor="name">Name</Label>
        <input id="name" />
      </>,
    );
    await userEvent.click(screen.getByText("Name"));
    expect(screen.getByLabelText("Name")).toHaveFocus();
  });
});
