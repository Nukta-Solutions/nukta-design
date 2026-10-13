import {
  Button,
  createDataTableColumnHelper,
  DataTable,
  type DataTableColumnDef,
  DescriptionDetails,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  PageHeader,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  StatusIndicator,
  Switch,
  toast,
  Toaster,
} from "@nukta-solutions/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { type Domain, day, domainStatus, domains } from "./data";

/**
 * Nukta Domain list: DataTable with status filters, row actions, bulk renew and a details Sheet.
 * Reference composition, not a component.
 */
const meta = { title: "Patterns/Domains", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const col = createDataTableColumnHelper<Domain>();

function DomainsPage() {
  const [selected, setSelected] = useState<Domain | null>(null);

  const columns = useMemo<DataTableColumnDef<Domain>[]>(
    () =>
      col.columns([
        col.accessor("name", {
          header: "Domain",
          cell: (info) => (
            <Button
              variant="link"
              className="h-auto p-0 font-medium"
              onClick={() => setSelected(info.row.original)}
            >
              {info.getValue()}
            </Button>
          ),
        }),
        col.accessor("status", {
          header: "Status",
          filterFn: "arrHas",
          enableGlobalFilter: false,
          cell: (info) => {
            const s = domainStatus[info.getValue() as Domain["status"]];
            return <StatusIndicator status={s.status} label={s.label} size="sm" />;
          },
        }),
        col.accessor("expires", {
          header: "Expires",
          sortFn: "datetime",
          enableGlobalFilter: false,
          cell: (info) => day.format(info.getValue() as Date),
        }),
        col.accessor("autoRenew", {
          header: "Auto-renew",
          enableSorting: false,
          enableGlobalFilter: false,
          cell: (info) => (info.getValue() ? "On" : "Off"),
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
                <DropdownMenuItem onSelect={() => setSelected(row.original)}>
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => toast.success(`${row.original.name} renewed for 1 year`)}
                >
                  Renew now
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="danger">Transfer out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        }),
      ]),
    [],
  );

  return (
    <main className="mx-auto grid max-w-6xl gap-6 p-6 md:p-8">
      <PageHeader
        title="Domains"
        description="Register, renew and manage DNS for your domains."
        actions={
          <Button>
            <Plus aria-hidden="true" /> Register domain
          </Button>
        }
      />
      <DataTable
        caption="Domains"
        columns={columns}
        data={domains}
        getRowId={(d) => d.id}
        enableRowSelection
        initialState={{ sorting: [{ id: "expires", desc: false }] }}
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: Object.entries(domainStatus).map(([value, s]) => ({ value, label: s.label })),
          },
        ]}
        bulkActions={(rows) => (
          <Button size="sm" onClick={() => toast.success(`Renewing ${rows.length} domains`)}>
            <RefreshCw aria-hidden="true" /> Renew {rows.length}
          </Button>
        )}
      />

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>Registered with {selected.registrar}</SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <DescriptionList layout="vertical">
                  <DescriptionItem>
                    <DescriptionTerm>Status</DescriptionTerm>
                    <DescriptionDetails>
                      <StatusIndicator
                        status={domainStatus[selected.status].status}
                        label={domainStatus[selected.status].label}
                      />
                    </DescriptionDetails>
                  </DescriptionItem>
                  <DescriptionItem>
                    <DescriptionTerm>Expires</DescriptionTerm>
                    <DescriptionDetails>{day.format(selected.expires)}</DescriptionDetails>
                  </DescriptionItem>
                  <DescriptionItem>
                    <DescriptionTerm>Nameservers</DescriptionTerm>
                    <DescriptionDetails className="font-mono">
                      {selected.nameservers.join(", ")}
                    </DescriptionDetails>
                  </DescriptionItem>
                  <DescriptionItem>
                    <DescriptionTerm>
                      <label htmlFor="sheet-auto-renew">Auto-renew</label>
                    </DescriptionTerm>
                    <DescriptionDetails>
                      <Switch id="sheet-auto-renew" defaultChecked={selected.autoRenew} />
                    </DescriptionDetails>
                  </DescriptionItem>
                </DescriptionList>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <Toaster />
    </main>
  );
}

export const List: Story = { render: () => <DomainsPage /> };
