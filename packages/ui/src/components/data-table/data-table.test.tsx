import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import {
  createDataTableColumnHelper,
  DataTable,
  type DataTableColumnDef,
  type PaginationState,
} from "./index";

type Domain = {
  id: string;
  name: string;
  status: "active" | "expiring" | "expired";
  price: number;
};

const domains: Domain[] = Array.from({ length: 25 }, (_, i) => ({
  id: `d${i + 1}`,
  name: `site${String(i + 1).padStart(2, "0")}.com`,
  status: (["active", "expiring", "expired"] as const)[i % 3]!,
  price: 1000 + i * 10,
}));

const col = createDataTableColumnHelper<Domain>();
const columns: DataTableColumnDef<Domain>[] = col.columns([
  col.accessor("name", { header: "Domain" }),
  col.accessor("status", { header: "Status", filterFn: "arrHas" }),
  col.accessor("price", { header: "Price", meta: { align: "end", label: "Price (BDT)" } }),
]);

function bodyRows() {
  const [, body] = screen.getAllByRole("rowgroup");
  return within(body!).getAllByRole("row");
}

describe("DataTable", () => {
  it("renders a named table with the first page and a summary", () => {
    render(<DataTable caption="Domains" columns={columns} data={domains} getRowId={(d) => d.id} />);
    expect(screen.getByRole("table", { name: "Domains" })).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText("Showing 1–10 of 25")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Price/ })).toHaveClass("text-right");
  });

  it("sorts by a column with aria-sort (numbers sort descending first)", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Domains" columns={columns} data={domains} />);
    const header = screen.getByRole("columnheader", { name: /Price/ });
    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(bodyRows()[0]).toHaveTextContent("site25.com");
    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(bodyRows()[0]).toHaveTextContent("site01.com");
  });

  it("searches across columns, shows an empty state and resets", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Domains" columns={columns} data={domains} />);
    const search = screen.getByRole("searchbox", { name: "Search" });
    await user.type(search, "site07");
    expect(bodyRows()).toHaveLength(1);
    await user.clear(search);
    await user.type(search, "nothing-here");
    expect(screen.getByRole("heading", { name: "No results" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(bodyRows()).toHaveLength(10);
  });

  it("filters with a faceted filter", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DataTable
        caption="Domains"
        columns={columns}
        data={domains}
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Expired", value: "expired" },
            ],
          },
        ]}
      />,
    );
    const toolbar = container.querySelector<HTMLElement>("[data-slot=data-table-toolbar]")!;
    await user.click(within(toolbar).getByRole("button", { name: "Status" }));
    await user.click(screen.getByRole("option", { name: "Expired" }));
    await user.keyboard("{Escape}");
    expect(screen.getByText("Showing 1–8 of 8")).toBeInTheDocument();
    expect(within(toolbar).getByRole("button", { name: "Status, 1 selected" })).toBeInTheDocument();
  });

  it("hides columns from the column menu", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Domains" columns={columns} data={domains} />);
    await user.click(screen.getByRole("button", { name: "Toggle columns" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Price (BDT)" }));
    expect(screen.queryByRole("columnheader", { name: /Price/ })).not.toBeInTheDocument();
  });

  it("selects rows and runs bulk actions", async () => {
    const onRenew = vi.fn();
    const user = userEvent.setup();
    render(
      <DataTable
        caption="Domains"
        columns={columns}
        data={domains}
        getRowId={(d) => d.id}
        enableRowSelection
        bulkActions={(rows) => (
          <Button size="sm" onClick={() => onRenew(rows.map((r) => r.id))}>
            Renew
          </Button>
        )}
      />,
    );
    const rowBoxes = screen.getAllByRole("checkbox", { name: "Select row" });
    await user.click(rowBoxes[0]!);
    await user.click(rowBoxes[2]!);
    expect(screen.getByRole("region", { name: "2 selected" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Renew" }));
    expect(onRenew).toHaveBeenCalledWith(["d1", "d3"]);

    const all = screen.getByRole("checkbox", { name: "Select all rows on this page" });
    expect(all).toHaveAttribute("aria-checked", "mixed");
    await user.click(all);
    expect(screen.getByRole("region", { name: "10 selected" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(screen.queryByRole("region", { name: /selected/ })).not.toBeInTheDocument();
  });

  it("pages and changes page size", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Domains" columns={columns} data={domains} />);
    await user.click(screen.getByRole("button", { name: "Page 3" }));
    expect(bodyRows()).toHaveLength(5);
    expect(screen.getByText("Showing 21–25 of 25")).toBeInTheDocument();
    await user.click(screen.getByRole("combobox", { name: "Rows per page" }));
    await user.click(screen.getByRole("option", { name: "50" }));
    expect(bodyRows()).toHaveLength(25);
  });

  it("shows a loading state", () => {
    render(<DataTable caption="Domains" columns={columns} data={[]} loading />);
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("supports server-side (manual) pagination", async () => {
    function Server() {
      const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
      const page = domains
        .slice(pagination.pageIndex * 10, pagination.pageIndex * 10 + 10)
        .slice(0, 3);
      return (
        <DataTable
          caption="Domains"
          columns={columns}
          data={page}
          manual
          rowCount={240}
          pagination={pagination}
          onPaginationChange={setPagination}
          searchable={false}
        />
      );
    }
    const user = userEvent.setup();
    render(<Server />);
    // Manual mode trusts the given rows: no client-side slicing.
    expect(bodyRows()).toHaveLength(3);
    expect(screen.getByText("Showing 1–10 of 240")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(screen.getByText("Showing 11–20 of 240")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 24" })).toBeInTheDocument();
  });

  it("localizes labels", () => {
    render(
      <DataTable
        caption="ডোমেইন"
        columns={columns}
        data={domains}
        labels={{ search: "খুঁজুন…", showing: (a, b, t) => `${t} টির মধ্যে ${a}–${b}` }}
      />,
    );
    expect(screen.getByRole("searchbox", { name: "খুঁজুন" })).toBeInTheDocument();
    expect(screen.getByText("25 টির মধ্যে 1–10")).toBeInTheDocument();
  });
});
