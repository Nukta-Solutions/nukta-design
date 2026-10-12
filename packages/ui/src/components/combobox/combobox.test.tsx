import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Field, FieldError, FieldLabel } from "../field";
import { Combobox, type ComboboxOption } from "./combobox";

const domains: ComboboxOption[] = [
  { value: "nukta.app", label: "nukta.app" },
  { value: "nuktasolutions.com", label: "nuktasolutions.com", keywords: ["company"] },
  { value: "nusend.io", label: "nusend.io", description: "Transactional email" },
  { value: "old.net", label: "old.net", disabled: true },
];

describe("Combobox", () => {
  it("is a labelled combobox that opens a searchable list and selects (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Field>
        <FieldLabel>Domain</FieldLabel>
        <Combobox options={domains} placeholder="Choose a domain" onValueChange={onValueChange} />
      </Field>,
    );
    const trigger = screen.getByRole("combobox", { name: /^Domain/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Choose a domain");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("company");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await user.keyboard("{Enter}");

    expect(onValueChange).toHaveBeenCalledWith("nuktasolutions.com");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAccessibleName("Domain nuktasolutions.com");
  });

  it("toggles a selected value off and skips disabled options", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Combobox
        aria-label="Domain"
        options={domains}
        defaultValue="nukta.app"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: /old\.net/ })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(screen.getByRole("option", { name: /^nukta\.app, selected/ }));
    expect(onValueChange).toHaveBeenCalledWith(undefined);
  });

  it("supports multiple selection (controlled) and stays open", async () => {
    function Multi() {
      const [value, setValue] = useState<string[]>(["nukta.app"]);
      return (
        <>
          <Combobox
            multiple
            aria-label="Domains"
            options={domains}
            value={value}
            onValueChange={setValue}
          />
          <output>{value.join("|")}</output>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Multi />);
    const trigger = screen.getByRole("combobox", { name: /^Domains/ });
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    await user.click(screen.getByRole("option", { name: /nusend\.io/ }));
    expect(screen.getByText("nukta.app|nusend.io")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAccessibleName(/nukta\.app, nusend\.io/);
  });

  it("shows invalid state from Field and an empty message", async () => {
    const user = userEvent.setup();
    render(
      <Field invalid required>
        <FieldLabel>Country</FieldLabel>
        <Combobox options={[{ value: "bd", label: "Bangladesh" }]} emptyText="No country found." />
        <FieldError>Choose a country</FieldError>
      </Field>,
    );
    const trigger = screen.getByRole("combobox", { name: /^Country/ });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute("aria-required", "true");
    expect(trigger).toHaveAccessibleDescription("Choose a country");
    await user.click(trigger);
    await user.keyboard("xyz");
    expect(screen.getByText("No country found.")).toBeInTheDocument();
  });
});
