import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Field, FieldDescription, FieldLabel } from "../field";
import { CopyButton, CopyField } from "./copy-button";

describe("CopyButton", () => {
  it("copies the value and announces it", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();
    render(<CopyButton value="v=spf1 include:nusend ~all" onCopy={onCopy} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await navigator.clipboard.readText()).toBe("v=spf1 include:nusend ~all");
    expect(onCopy).toHaveBeenCalledWith("v=spf1 include:nusend ~all");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });

  it("works with visible text and custom labels", async () => {
    const user = userEvent.setup();
    render(
      <CopyButton value="abc" variant="outline" size="sm" labels={{ copied: "কপি হয়েছে" }}>
        Copy key
      </CopyButton>,
    );
    await user.click(screen.getByRole("button", { name: "Copy key" }));
    expect(screen.getByRole("status")).toHaveTextContent("কপি হয়েছে");
  });
});

describe("CopyField", () => {
  it("shows a labelled read-only value inside a Field and copies it", async () => {
    const user = userEvent.setup();
    render(
      <Field>
        <FieldLabel>SMTP host</FieldLabel>
        <CopyField value="smtp.nusend.io" />
        <FieldDescription>Port 587, STARTTLS</FieldDescription>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "SMTP host" });
    expect(input).toHaveAttribute("readonly");
    expect(input).toHaveValue("smtp.nusend.io");
    expect(input).toHaveAccessibleDescription("Port 587, STARTTLS");
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await navigator.clipboard.readText()).toBe("smtp.nusend.io");
  });

  it("masks secrets with a show/hide toggle", async () => {
    const user = userEvent.setup();
    render(<CopyField aria-label="API key" value="nk_live_123" secret />);
    const input = screen.getByLabelText("API key");
    expect(input).toHaveAttribute("type", "password");
    const toggle = screen.getByRole("button", { name: "Show value" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide value" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await navigator.clipboard.readText()).toBe("nk_live_123");
  });
});
