import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { toast, Toaster } from "./toast";

describe("Toaster", () => {
  it("renders an announced region and shows toasts", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Profile saved");
    });
    expect(await screen.findByText("Profile saved")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /notifications/i })).toBeInTheDocument();
  });
});
