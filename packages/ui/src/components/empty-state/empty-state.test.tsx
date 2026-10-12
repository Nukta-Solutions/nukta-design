import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import { Table, TableBody, TableCell, TableRow } from "../table";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders a heading, description, decorative icon and actions", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <EmptyState
        icon={<svg />}
        title="No transactions yet"
        description="Top up your wallet to get started."
        primaryAction={<Button onClick={onClick}>Top up</Button>}
        secondaryAction={<Button variant="outline">Learn more</Button>}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "No transactions yet" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Top up your wallet to get started.")).toBeInTheDocument();
    expect(container.querySelector("svg")?.parentElement).toHaveAttribute("aria-hidden", "true");
    await user.tab();
    expect(screen.getByRole("button", { name: "Top up" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("supports a compact size and heading level inside a table", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4}>
              <EmptyState size="compact" headingLevel={3} title="No results" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const heading = screen.getByRole("heading", { level: 3, name: "No results" });
    expect(heading.closest("[data-slot=empty-state]")).toHaveAttribute("data-size", "compact");
  });
});
