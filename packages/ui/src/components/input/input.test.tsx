import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Label } from "../label";
import { Input } from "./input";

describe("Input", () => {
  it("is labelled and accepts typing", async () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </>,
    );
    const input = screen.getByLabelText("Email");
    await userEvent.type(input, "hi@nukta.dev");
    expect(input).toHaveValue("hi@nukta.dev");
  });

  it("forwards refs and exposes the invalid state", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-invalid aria-label="Name" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInvalid();
  });
});
