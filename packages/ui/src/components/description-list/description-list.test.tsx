import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  DescriptionDetails,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
} from "./description-list";

describe("DescriptionList", () => {
  it("renders term/definition pairs", () => {
    render(
      <DescriptionList layout="grid">
        <DescriptionItem>
          <DescriptionTerm>Registrar</DescriptionTerm>
          <DescriptionDetails>Nukta Domain</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Expires</DescriptionTerm>
          <DescriptionDetails>12 Mar 2027</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>,
    );
    expect(screen.getAllByRole("term")).toHaveLength(2);
    expect(screen.getByText("Registrar").tagName).toBe("DT");
    expect(screen.getByText("12 Mar 2027").tagName).toBe("DD");
    expect(screen.getByText("Registrar").closest("dl")).toHaveAttribute("data-layout", "grid");
  });
});
