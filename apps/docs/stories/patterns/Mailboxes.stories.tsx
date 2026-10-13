import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  createDataTableColumnHelper,
  DataTable,
  type DataTableColumnDef,
  PageHeader,
  StatusIndicator,
  ToggleGroup,
  ToggleGroupItem,
  UsageMeter,
} from "@nukta-solutions/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { useState } from "react";

/**
 * Nukta Mail: plan usage with UsageMeter, a billing-cycle ToggleGroup and a mailbox table with
 * per-mailbox storage. Reference composition, not a component.
 */
const meta = { title: "Patterns/Mailboxes", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type Mailbox = {
  id: string;
  address: string;
  name: string;
  usedGb: number;
  quotaGb: number;
  active: boolean;
};

const people = [
  "Harun Rashid",
  "Asif Rahman",
  "Nadia Karim",
  "Tanvir Hasan",
  "Farhana Akter",
  "Support",
  "Billing",
  "Hello",
];
const mailboxes: Mailbox[] = people.map((name, i) => ({
  id: `mb_${i}`,
  name,
  address: `${name.split(" ")[0]!.toLowerCase()}@nukta.app`,
  usedGb: [4.2, 8.7, 1.1, 9.6, 0.4, 6.3, 2.2, 0.9][i]!,
  quotaGb: 10,
  active: i !== 4,
}));

const gb = (n: number) => `${n.toLocaleString("en-GB", { maximumFractionDigits: 1 })} GB`;

const col = createDataTableColumnHelper<Mailbox>();
const columns: DataTableColumnDef<Mailbox>[] = col.columns([
  col.accessor("address", {
    header: "Mailbox",
    cell: ({ row }) => (
      <span className="flex items-center gap-3">
        <Avatar size="sm" aria-hidden="true">
          <AvatarFallback>{row.original.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="grid">
          <span className="font-medium">{row.original.address}</span>
          <span className="text-muted-foreground text-xs">{row.original.name}</span>
        </span>
      </span>
    ),
  }),
  col.accessor("usedGb", {
    header: "Storage",
    enableGlobalFilter: false,
    meta: { className: "min-w-56" },
    cell: ({ row }) => (
      <UsageMeter
        label={<span className="sr-only">Storage for {row.original.address}</span>}
        used={row.original.usedGb}
        limit={row.original.quotaGb}
        formatValue={gb}
      />
    ),
  }),
  col.accessor("active", {
    header: "Status",
    enableGlobalFilter: false,
    cell: (info) =>
      info.getValue() ? (
        <StatusIndicator status="operational" label="Active" size="sm" />
      ) : (
        <StatusIndicator status="inactive" label="Suspended" size="sm" />
      ),
  }),
]);

function MailboxesPage() {
  const [cycle, setCycle] = useState("monthly");
  return (
    <main className="mx-auto grid max-w-6xl gap-6 p-6 md:p-8">
      <PageHeader
        title="Mailboxes"
        description="nukta.app · Business plan"
        actions={
          <Button>
            <Plus aria-hidden="true" /> Add mailbox
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Plan usage</CardTitle>
            <CardDescription>Resets 1 Nov 2026</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <UsageMeter label="Mailboxes" used={8} limit={10} />
            <UsageMeter label="Total storage" used={33.4} limit={100} formatValue={gb} />
            <UsageMeter label="Outgoing emails today" used={4720} limit={5000} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>৳150 per mailbox</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ToggleGroup
              type="single"
              aria-label="Billing cycle"
              value={cycle}
              onValueChange={(v) => v && setCycle(v)}
            >
              <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
              <ToggleGroupItem value="yearly">Yearly · save 20%</ToggleGroupItem>
            </ToggleGroup>
            <p className="font-display text-2xl font-semibold">
              {cycle === "monthly" ? "৳1,200 / month" : "৳11,520 / year"}
            </p>
          </CardContent>
        </Card>
      </div>
      <DataTable caption="Mailboxes" columns={columns} data={mailboxes} getRowId={(m) => m.id} />
    </main>
  );
}

export const Overview: Story = { render: () => <MailboxesPage /> };
