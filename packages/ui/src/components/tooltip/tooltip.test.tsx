import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

describe("Tooltip", () => {
  it("appears on keyboard focus and describes the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" aria-label="Settings">
            ⚙
          </Button>
        </TooltipTrigger>
        <TooltipContent>Open settings</TooltipContent>
      </Tooltip>,
    );

    await user.tab();
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Open settings");
    expect(screen.getByRole("button", { name: "Settings" })).toHaveAccessibleDescription(
      "Open settings",
    );
  });
});
