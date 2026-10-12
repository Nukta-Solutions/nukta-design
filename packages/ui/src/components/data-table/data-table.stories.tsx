import type { Meta, StoryObj } from "@storybook/react-vite";
import { Globe, MoreHorizontal, Plus, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { EmptyState } from "../empty-state";
import { StatusIndicator } from "../status-indicator";
import {
  createDataTableColumnHelper,
  DataTable,
  type DataTableColumnDef,
  type PaginationState,
  type SortingState,
} from "./index";

const meta = {
  title: "Components/Data Table",
  component: DataTable,
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type Domain = {
  id: string;
  name: string;
  status: "active" | "expiring" | "expired" | "pending";
  expires: Date;
  autoRenew: boolean;
  price: number;
};

const tlds = [".com", ".app", ".com.bd", ".io", ".net"];
const names = [
  "nukta",
  "renova",
  "itqaan",
  "gateway",
  "littlelegacy",
  "imtr",
  "eperfect",
  "nupem",
  "ld",
  "financial",
];
const statuses: Domain["status"][] = [
  "active",
  "active",
  "active",
  "expiring",
  "expired",
  "pending",
];

const domains: Domain[] = Array.from({ length: 42 }, (_, i) => ({
  id: `dom_${i + 1}`,
  name: `${names[i % names.length]}${i >= names.length ? i : ""}${tlds[i % tlds.length]}`,
  status: statuses[i % statuses.length]!,
  expires: new Date(2026, 9 + (i % 14), 1 + ((i * 7) % 27)),
  autoRenew: i % 4 !== 0,
  price: [1450, 2100, 990, 3600, 1800][i % 5]!,
}));

const statusMap = {
  active: { status: "operational", label: "Active" },
  expiring: { status: "degraded", label: "Expiring soon" },
  expired: { status: "down", label: "Expired" },
  pending: { status: "pending", label: "Pending transfer" },
} as const;

const money = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});
const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

const col = createDataTableColumnHelper<Domain>();
const columns: DataTableColumnDef<Domain>[] = col.columns([
  col.accessor("name", {
    header: "Domain",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  col.accessor("status", {
    header: "Status",
    filterFn: "arrHas",
    cell: (info) => {
      const s = statusMap[info.getValue() as Domain["status"]];
      return <StatusIndicator status={s.status} label={s.label} size="sm" />;
    },
  }),
  col.accessor("expires", {
    header: "Expires",
    sortFn: "datetime",
    enableGlobalFilter: false,
    cell: (info) => day.format(info.getValue()),
  }),
  col.accessor("autoRenew", {
    header: "Auto-renew",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: (info) => (info.getValue() ? "On" : "Off"),
  }),
  col.accessor("price", {
    header: "Renewal",
    enableGlobalFilter: false,
    meta: { align: "end", label: "Renewal price" },
    cell: (info) => money.format(info.getValue()),
  }),
  col.display({
    id: "actions",
    enableHiding: false,
    meta: { className: "w-12" },
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={`Actions for ${row.original.name}`}
          >
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Manage DNS</DropdownMenuItem>
          <DropdownMenuItem>Renew now</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="danger">Transfer out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
]);

const statusFilter = {
  columnId: "status",
  title: "Status",
  options: Object.entries(statusMap).map(([value, s]) => ({ value, label: s.label })),
};

export const Domains: Story = {
  render: () => (
    <DataTable
      caption="Domains"
      columns={columns}
      data={domains}
      getRowId={(d) => d.id}
      enableRowSelection
      filters={[statusFilter]}
      initialState={{ sorting: [{ id: "expires", desc: false }] }}
      bulkActions={(rows) => (
        <Button size="sm">
          <RefreshCw aria-hidden="true" /> Renew {rows.length}
        </Button>
      )}
      toolbarActions={
        <Button size="sm">
          <Plus aria-hidden="true" /> Add domain
        </Button>
      }
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <DataTable caption="Domains" columns={columns} data={[]} loading searchable={false} />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable
      caption="Domains"
      columns={columns}
      data={[]}
      searchable={false}
      emptyState={
        <EmptyState
          size="compact"
          headingLevel={3}
          icon={<Globe />}
          title="No domains yet"
          description="Register a domain or transfer one you own."
          primaryAction={
            <Button size="sm">
              <Plus aria-hidden="true" /> Register domain
            </Button>
          }
        />
      }
    />
  ),
};

/** Simulates an API that sorts and pages on the server. */
function ServerExample() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const all = useMemo(
    () =>
      Array.from({ length: 240 }, (_, i) => ({
        ...domains[i % domains.length]!,
        id: `srv_${i}`,
        name: `customer-${i + 1}.com`,
      })),
    [],
  );
  // The request this view needs; "loading" until a response for it arrives.
  const requestKey = JSON.stringify({ pagination, sorting });
  const [response, setResponse] = useState<{ key: string; rows: Domain[] }>({ key: "", rows: [] });
  const loading = response.key !== requestKey;

  useEffect(() => {
    // Stand-in for `fetch("/api/domains?page=…&sort=…")`.
    const timer = setTimeout(() => {
      const sorted = [...all];
      const sort = sorting[0];
      if (sort) {
        sorted.sort((a, b) => {
          const av = a[sort.id as keyof Domain];
          const bv = b[sort.id as keyof Domain];
          return (av < bv ? -1 : av > bv ? 1 : 0) * (sort.desc ? -1 : 1);
        });
      }
      const start = pagination.pageIndex * pagination.pageSize;
      setResponse({ key: requestKey, rows: sorted.slice(start, start + pagination.pageSize) });
    }, 400);
    return () => clearTimeout(timer);
  }, [all, pagination, sorting, requestKey]);

  return (
    <DataTable
      caption="Customer domains (server-side)"
      showCaption
      columns={columns}
      data={response.rows}
      getRowId={(d) => d.id}
      manual
      rowCount={all.length}
      loading={loading}
      searchable={false}
      pagination={pagination}
      onPaginationChange={setPagination}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}

export const ServerSide: Story = { render: () => <ServerExample /> };
