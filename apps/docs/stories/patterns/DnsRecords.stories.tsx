import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CopyButton,
  CopyField,
  createDataTableColumnHelper,
  DataTable,
  type DataTableColumnDef,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Step,
  Stepper,
} from "@nukta-solutions/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";

/**
 * Nukta Domain DNS: record table with copyable values, an "Add record" dialog and the
 * verification steps for connecting Nusend. Reference composition, not a component.
 */
const meta = { title: "Patterns/DNS Records", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type DnsRecord = {
  id: string;
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT";
  name: string;
  value: string;
  ttl: number;
};

const records: DnsRecord[] = [
  { id: "r1", type: "A", name: "@", value: "203.0.113.10", ttl: 3600 },
  { id: "r2", type: "AAAA", name: "@", value: "2001:db8::10", ttl: 3600 },
  { id: "r3", type: "CNAME", name: "www", value: "nukta.app", ttl: 3600 },
  { id: "r4", type: "MX", name: "@", value: "10 mail.nukta.app", ttl: 3600 },
  { id: "r5", type: "TXT", name: "@", value: "v=spf1 include:_spf.nusend.io ~all", ttl: 3600 },
  {
    id: "r6",
    type: "TXT",
    name: "nusend._domainkey",
    value: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOC",
    ttl: 3600,
  },
];

const col = createDataTableColumnHelper<DnsRecord>();
const columns: DataTableColumnDef<DnsRecord>[] = col.columns([
  col.accessor("type", {
    header: "Type",
    filterFn: "arrHas",
    cell: (info) => (
      <Badge variant="secondary" className="font-mono">
        {info.getValue() as string}
      </Badge>
    ),
  }),
  col.accessor("name", {
    header: "Name",
    cell: (info) => <span className="font-mono">{info.getValue() as string}</span>,
  }),
  col.accessor("value", {
    header: "Value",
    enableSorting: false,
    cell: (info) => (
      <span className="flex max-w-md items-center gap-1">
        <span className="truncate font-mono">{info.getValue() as string}</span>
        <CopyButton
          value={info.getValue() as string}
          labels={{ copy: `Copy ${info.row.original.type} value` }}
        />
      </span>
    ),
  }),
  col.accessor("ttl", { header: "TTL", meta: { align: "end" }, enableGlobalFilter: false }),
]);

function AddRecordDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus aria-hidden="true" /> Add record
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add DNS record</DialogTitle>
          <DialogDescription>Changes usually propagate within a few minutes.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field>
            <FieldLabel>Type</FieldLabel>
            <Select defaultValue="A">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["A", "AAAA", "CNAME", "MX", "TXT"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input placeholder="@ or a subdomain" className="font-mono" />
            <FieldDescription>Use @ for the root domain.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Value</FieldLabel>
            <Input placeholder="203.0.113.10" className="font-mono" />
          </Field>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Add record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DnsPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 p-6 md:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#domains">Domains</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#nukta-app">nukta.app</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>DNS</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader title="DNS records" description="nukta.app · managed by Nukta nameservers" />

      <Alert variant="info">
        <AlertTitle>Connect nukta.app to Nusend</AlertTitle>
        <AlertDescription>
          Add the CNAME below, then verify. SPF and DKIM are already in place.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Sending domain setup</CardTitle>
          <CardDescription>Nusend checks these records every few minutes.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Stepper aria-label="Nusend domain verification">
            <Step step={1} status="complete" title="SPF" description="Found" />
            <Step step={2} status="complete" title="DKIM" description="Found" />
            <Step step={3} status="current" title="Return path" description="Add the CNAME" />
            <Step step={4} status="upcoming" title="Verified" />
          </Stepper>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>CNAME name</FieldLabel>
              <CopyField value="bounces.nukta.app" />
            </Field>
            <Field>
              <FieldLabel>CNAME target</FieldLabel>
              <CopyField value="return.nusend.io" />
            </Field>
          </div>
        </CardContent>
      </Card>

      <DataTable
        caption="DNS records for nukta.app"
        columns={columns}
        data={records}
        getRowId={(r) => r.id}
        filters={[
          {
            columnId: "type",
            title: "Type",
            options: ["A", "AAAA", "CNAME", "MX", "TXT"].map((t) => ({ value: t, label: t })),
          },
        ]}
        toolbarActions={<AddRecordDialog />}
        columnToggle={false}
      />
    </main>
  );
}

export const Records: Story = { render: () => <DnsPage /> };
