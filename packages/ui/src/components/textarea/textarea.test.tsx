import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a labelled multi-line textbox", async () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Message" />);
    const textarea = screen.getByRole("textbox", { name: "Message" });
    await userEvent.type(textarea, "Hello{enter}World");
    expect(textarea).toHaveValue("Hello\nWorld");
    expect(ref.current).toBe(textarea);
  });
});
