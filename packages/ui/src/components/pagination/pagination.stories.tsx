import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  CursorPagination,
  PagePagination,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const meta = {
  title: "Components/Pagination",
  component: PagePagination,
  decorators: [(Story) => <div className="w-3xl">{Story()}</div>],
} satisfies Meta<typeof PagePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function PagedExample({ totalPages = 20, withPageSize = false }) {
  const [page, setPage] = useState(6);
  const [pageSize, setPageSize] = useState(20);
  const total = totalPages * pageSize;
  return (
    <PagePagination
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      summary={`Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total}`}
      {...(withPageSize
        ? {
            pageSize,
            onPageSizeChange: (size: number) => {
              setPageSize(size);
              setPage(1);
            },
          }
        : {})}
    />
  );
}

export const PageNumbers: Story = {
  args: { page: 6, totalPages: 20 },
  render: () => <PagedExample />,
};

export const WithPageSize: Story = {
  args: { page: 6, totalPages: 20 },
  render: () => <PagedExample withPageSize />,
};

export const FewPages: Story = {
  args: { page: 2, totalPages: 4 },
  render: () => <PagedExample totalPages={4} />,
};

export const AsLinks: Story = {
  args: { page: 3, totalPages: 12 },
  render: (args) => <PagePagination {...args} getPageHref={(page) => `?page=${page}`} />,
};

export const FirstAndLastPage: Story = {
  args: { page: 1, totalPages: 8 },
  render: () => (
    <div className="grid gap-6">
      <PagePagination
        page={1}
        totalPages={8}
        onPageChange={() => {}}
        labels={{ pagination: "Pagination, first page" }}
      />
      <PagePagination
        page={8}
        totalPages={8}
        onPageChange={() => {}}
        labels={{ pagination: "Pagination, last page" }}
      />
    </div>
  ),
};

function CursorExample() {
  const [index, setIndex] = useState(0);
  const pages = 4;
  return (
    <CursorPagination
      hasPrevious={index > 0}
      hasNext={index < pages - 1}
      onPrevious={() => setIndex((i) => i - 1)}
      onNext={() => setIndex((i) => i + 1)}
      summary={`Batch ${index + 1} · 50 emails per batch`}
      pageSize={50}
      pageSizeOptions={[25, 50, 100]}
      onPageSizeChange={() => setIndex(0)}
    />
  );
}

export const Cursor: Story = {
  args: { page: 1, totalPages: 1 },
  render: () => <CursorExample />,
};

export const BuildingBlocks: Story = {
  args: { page: 2, totalPages: 10 },
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=1" aria-label="Page 1">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=2" isActive aria-label="Page 2">
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=3" aria-label="Page 3">
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
