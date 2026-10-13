import type { Meta, StoryObj } from "@storybook/react-vite";
import { Globe, Plus, Receipt, SearchX } from "lucide-react";
import { Button } from "../button";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Components/Empty State",
  component: EmptyState,
  args: {
    icon: <Globe />,
    title: "No domains yet",
    description: "Register a new domain or connect one you already own.",
  },
  decorators: [(Story) => <div className="w-2xl">{Story()}</div>],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    primaryAction: (
      <Button>
        <Plus aria-hidden="true" /> Register domain
      </Button>
    ),
    secondaryAction: <Button variant="outline">Connect existing</Button>,
  },
};

export const TitleOnly: Story = { args: { description: undefined, icon: undefined } };

export const CompactInCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Recent invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          size="compact"
          headingLevel={3}
          icon={<Receipt />}
          title="No invoices"
          description="Invoices appear here after your first payment."
        />
      </CardContent>
    </Card>
  ),
};

export const CompactInTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={3}>
            <EmptyState
              size="compact"
              headingLevel={3}
              icon={<SearchX />}
              title="No transactions match your filters"
              description="Try a different date range."
              primaryAction={
                <Button variant="outline" size="sm">
                  Clear filters
                </Button>
              }
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
