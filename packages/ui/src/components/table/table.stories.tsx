import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const invoices = [
  { id: "INV-001", status: "Paid", method: "bKash", amount: 2500 },
  { id: "INV-002", status: "Pending", method: "Card", amount: 1500 },
  { id: "INV-003", status: "Overdue", method: "Bank transfer", amount: 3500 },
  { id: "INV-004", status: "Paid", method: "Card", amount: 4500 },
] as const;

const statusVariant = { Paid: "success", Pending: "warning", Overdue: "danger" } as const;

const meta = {
  title: "Components/Table",
  component: Table,
  decorators: [(Story) => <div className="w-xl">{Story()}</div>],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
            </TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">৳{invoice.amount.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">৳12,000</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
