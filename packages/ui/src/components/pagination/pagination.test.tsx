import type * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  CursorPagination,
  getPageRange,
  PagePagination,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "./pagination";

describe("getPageRange", () => {
  it.each([
    [1, 5, [1, 2, 3, 4, 5]],
    [1, 20, [1, 2, 3, 4, 5, "ellipsis", 20]],
    [4, 20, [1, 2, 3, 4, 5, "ellipsis", 20]],
    [6, 20, [1, "ellipsis", 5, 6, 7, "ellipsis", 20]],
    [17, 20, [1, "ellipsis", 16, 17, 18, 19, 20]],
    [20, 20, [1, "ellipsis", 16, 17, 18, 19, 20]],
    [1, 0, []],
  ] as const)("page %i of %i", (page, total, expected) => {
    expect(getPageRange(page, total)).toEqual(expected);
  });

  it("keeps a constant length while paging", () => {
    const lengths = new Set(Array.from({ length: 30 }, (_, i) => getPageRange(i + 1, 30).length));
    expect([...lengths]).toEqual([7]);
  });
});

describe("Pagination building blocks", () => {
  it("renders a labelled nav with the current page marked", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="?page=1">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="?page=2" isActive>
              2
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(within(nav).getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "1" })).not.toHaveAttribute("aria-current");
  });
});

describe("PagePagination", () => {
  it("renders buttons and pages with onPageChange (controlled)", async () => {
    function Controlled() {
      const [page, setPage] = useState(6);
      return <PagePagination page={page} totalPages={20} onPageChange={setPage} />;
    }
    const user = userEvent.setup();
    render(<Controlled />);
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(within(nav).getByRole("button", { name: "Page 6" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getAllByText("More pages")).toHaveLength(2);

    await user.click(within(nav).getByRole("button", { name: "Go to next page" }));
    expect(within(nav).getByRole("button", { name: "Page 7" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await user.click(within(nav).getByRole("button", { name: "Page 20" }));
    expect(within(nav).getByRole("button", { name: "Go to next page" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("disables Previous on the first page and keeps it out of the tab order", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<PagePagination page={1} totalPages={3} onPageChange={onPageChange} />);
    const previous = screen.getByRole("button", { name: "Go to previous page" });
    expect(previous).toHaveAttribute("aria-disabled", "true");
    expect(previous).toHaveAttribute("tabindex", "-1");
    await user.tab();
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveFocus();
    await user.keyboard("{Tab}{Enter}");
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("renders links with getPageHref", () => {
    render(<PagePagination page={2} totalPages={3} getPageHref={(p) => `/billing?page=${p}`} />);
    expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute("href", "/billing?page=3");
    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
      "href",
      "/billing?page=1",
    );
    expect(screen.getByRole("link", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  });

  it("renders router links with renderLink", () => {
    function RouterLink({ to, children, ...props }: { to: string; children: React.ReactNode }) {
      return (
        <a href={to} data-router="yes" {...props}>
          {children}
        </a>
      );
    }
    render(
      <PagePagination
        page={1}
        totalPages={2}
        renderLink={(props, page) => <RouterLink to={`/p/${page}`} {...props} />}
      />,
    );
    const link = screen.getByRole("link", { name: "Page 2" });
    expect(link).toHaveAttribute("data-router", "yes");
    expect(link).toHaveAttribute("href", "/p/2");
  });

  it("shows a summary and changes the page size", async () => {
    const onPageSizeChange = vi.fn();
    const user = userEvent.setup();
    render(
      <PagePagination
        page={1}
        totalPages={5}
        onPageChange={() => {}}
        summary="Showing 1–20 of 96"
        pageSize={20}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    expect(screen.getByText("Showing 1–20 of 96")).toBeInTheDocument();
    const select = screen.getByRole("combobox", { name: "Rows per page" });
    expect(select).toHaveTextContent("20");
    await user.click(select);
    await user.click(screen.getByRole("option", { name: "50" }));
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });

  it("supports localized labels", () => {
    render(
      <PagePagination
        page={1}
        totalPages={2}
        onPageChange={() => {}}
        labels={{ pagination: "পৃষ্ঠা", page: (p) => `পৃষ্ঠা ${p}` }}
      />,
    );
    expect(screen.getByRole("navigation", { name: "পৃষ্ঠা" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "পৃষ্ঠা 2" })).toBeInTheDocument();
  });
});

describe("CursorPagination", () => {
  it("renders Previous/Next buttons with disabled states", async () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    const user = userEvent.setup();
    render(
      <CursorPagination hasPrevious={false} hasNext onNext={onNext} onPrevious={onPrevious} />,
    );
    const previous = screen.getByRole("button", { name: "Go to previous page" });
    expect(previous).toHaveAttribute("aria-disabled", "true");
    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(onNext).toHaveBeenCalledOnce();
    expect(onPrevious).not.toHaveBeenCalled();
  });

  it("renders links with hrefs", () => {
    render(
      <CursorPagination
        hasPrevious
        hasNext={false}
        previousHref="?before=abc"
        nextHref="?after=xyz"
      />,
    );
    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
      "href",
      "?before=abc",
    );
    const next = screen.getByRole("link", { name: "Go to next page" });
    expect(next).not.toHaveAttribute("href");
    expect(next).toHaveAttribute("aria-disabled", "true");
  });
});
