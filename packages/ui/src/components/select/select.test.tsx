import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

function Fruit({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="mango">Mango</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("opens a listbox and selects an option", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Fruit onValueChange={onValueChange} />);

    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveTextContent("Pick a fruit");

    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: "Mango" }));

    expect(onValueChange).toHaveBeenCalledWith("mango");
    expect(trigger).toHaveTextContent("Mango");
  });

  it("opens from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Fruit />);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });
});
