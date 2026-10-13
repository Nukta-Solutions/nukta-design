import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { StatusIndicator } from "./status-indicator";

const meta = {
  title: "Components/Status Indicator",
  component: StatusIndicator,
  args: { status: "operational" },
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStatuses: Story = {
  render: () => (
    <div className="grid gap-3">
      <StatusIndicator status="operational" />
      <StatusIndicator status="degraded" label="Degraded performance" />
      <StatusIndicator status="down" label="Major outage" />
      <StatusIndicator status="maintenance" label="Scheduled maintenance" />
      <StatusIndicator status="pending" label="Propagating DNS" pulse />
      <StatusIndicator status="inactive" label="Suspended" />
    </div>
  ),
};

export const ServiceStatusTable: Story = {
  render: () => (
    <div className="w-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["Nukta Domain API", "operational"],
            ["Nukta Mail · IMAP", "degraded"],
            ["Nusend delivery", "operational"],
            ["Hosting · Singapore", "maintenance"],
          ].map(([service, status]) => (
            <TableRow key={service}>
              <TableCell className="font-medium">{service}</TableCell>
              <TableCell>
                <StatusIndicator status={status as "operational"} size="sm" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
