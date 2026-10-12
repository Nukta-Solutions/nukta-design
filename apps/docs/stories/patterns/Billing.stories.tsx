import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type DateRange,
  DateRangePicker,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  PagePagination,
  RadioGroup,
  RadioGroupItem,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
  Toaster,
} from "@nukta-solutions/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarClock, CreditCard, Receipt, RefreshCw, SearchX, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

/**
 * Reference composition for Nukta billing screens. Not a component: copy the parts you need.
 * Uses StatCard, Alert, DateRangePicker, Table, PagePagination, EmptyState, Dialog, Field,
 * InputGroup and RadioGroup.
 */
const meta = {
  title: "Patterns/Billing",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// A fixed "today" keeps the pattern stable in docs and screenshots.
const today = new Date(2026, 9, 13);
const LOW_BALANCE = 500;

type Transaction = {
  id: string;
  date: Date;
  description: string;
  product: "Domain" | "Hosting" | "Mail" | "Nusend" | "Wallet";
  amount: number; // positive = credit, negative = charge
};

const products: Transaction["product"][] = ["Domain", "Hosting", "Mail", "Nusend"];
const descriptions: Record<Transaction["product"], string> = {
  Domain: "Renewal · nukta.app",
  Hosting: "Business plan · monthly",
  Mail: "5 mailboxes · monthly",
  Nusend: "Email credits · 10,000",
  Wallet: "Top-up via bKash",
};

const transactions: Transaction[] = Array.from({ length: 46 }, (_, i) => {
  const date = new Date(2026, 9, 13 - Math.floor(i * 1.3));
  const product = i % 5 === 0 ? "Wallet" : (products[i % products.length] ?? "Domain");
  const amount = product === "Wallet" ? 2000 + (i % 3) * 500 : -(150 + ((i * 137) % 900));
  return {
    id: `TXN-${(10046 - i).toString()}`,
    date,
    description: descriptions[product],
    product,
    amount,
  };
});

const money = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});
const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

function WalletSummary({ balance, onTopUp }: { balance: number; onTopUp: () => void }) {
  return (
    <section aria-label="Wallet summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Wallet balance"
        icon={<Wallet />}
        value={money.format(balance)}
        trend={{ direction: "down", label: "-৳1,240 this week", sentiment: "neutral" }}
        footer={
          <Button size="sm" onClick={onTopUp}>
            Top up
          </Button>
        }
      />
      <StatCard
        label="Spent this month"
        icon={<Receipt />}
        value={money.format(3820)}
        trend={{ direction: "up", label: "+14% vs September", sentiment: "negative" }}
      />
      <StatCard
        label="Next invoice"
        icon={<CalendarClock />}
        value={money.format(1650)}
        description="Due 1 Nov 2026"
      />
      <StatCard
        label="Auto top-up"
        icon={<RefreshCw />}
        value="Off"
        description="Top up ৳2,000 when below ৳500"
      />
    </section>
  );
}

function Transactions() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 8, 14),
    to: today,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) => (!range?.from || t.date >= range.from) && (!range?.to || t.date <= range.to),
      ),
    [range],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Charges and top-ups across all Nukta products.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <DateRangePicker
            aria-label="Filter by date"
            presets
            now={today}
            value={range}
            onValueChange={(next) => {
              setRange(next);
              setPage(1);
            }}
            className="w-auto min-w-64"
          />
          {range && (
            <Button variant="ghost" size="sm" onClick={() => setRange(undefined)}>
              Clear
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4}>
                  <EmptyState
                    size="compact"
                    headingLevel={3}
                    icon={<SearchX />}
                    title="No transactions in this period"
                    description="Choose a different date range."
                    primaryAction={
                      <Button variant="outline" size="sm" onClick={() => setRange(undefined)}>
                        Show all transactions
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground">{day.format(t.date)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{t.description}</div>
                    <div className="text-muted-foreground text-xs">{t.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.product === "Wallet" ? "success" : "secondary"}>
                      {t.product}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {t.amount > 0 ? "+" : "−"}
                    {money.format(Math.abs(t.amount))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {filtered.length > 0 && (
          <PagePagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            summary={`Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length}`}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

function TopUpDialog({
  open,
  onOpenChange,
  onTopUp,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTopUp: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bkash");
  const [submitted, setSubmitted] = useState(false);
  const value = Number(amount.replaceAll(",", ""));
  const invalid = submitted && !(value >= 100 && value <= 100000);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setSubmitted(false);
          setAmount("");
        }
      }}
    >
      <DialogContent>
        <form
          noValidate
          className="grid gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
            if (value >= 100 && value <= 100000) {
              onTopUp(value);
              onOpenChange(false);
              setSubmitted(false);
              setAmount("");
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Top up wallet</DialogTitle>
            <DialogDescription>
              Funds are available immediately for all Nukta products.
            </DialogDescription>
          </DialogHeader>

          <Field invalid={invalid} required>
            <FieldLabel>Amount</FieldLabel>
            <InputGroup>
              <InputGroupAddon>৳</InputGroupAddon>
              <InputGroupInput
                inputMode="decimal"
                placeholder="2,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <InputGroupAddon align="end">BDT</InputGroupAddon>
            </InputGroup>
            <FieldDescription>Between ৳100 and ৳1,00,000.</FieldDescription>
            <FieldError>Enter an amount between ৳100 and ৳1,00,000.</FieldError>
          </Field>

          <Field>
            <FieldLabel>Payment method</FieldLabel>
            <RadioGroup
              value={method}
              onValueChange={setMethod}
              className="grid gap-2 sm:grid-cols-3"
            >
              {[
                { value: "bkash", label: "bKash" },
                { value: "card", label: "Card" },
                { value: "bank", label: "Bank transfer" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="has-data-[state=checked]:border-primary has-data-[state=checked]:bg-secondary flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm"
                >
                  <RadioGroupItem value={option.value} />
                  {option.label}
                </label>
              ))}
            </RadioGroup>
          </Field>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              <CreditCard aria-hidden="true" /> Continue to payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BillingPage() {
  const [balance, setBalance] = useState(320);
  const [topUpOpen, setTopUpOpen] = useState(false);

  return (
    <main className="mx-auto grid max-w-6xl gap-6 p-6 md:p-8">
      <div className="grid gap-1">
        <h1 className="text-3xl font-semibold">Billing</h1>
        <p className="text-muted-foreground">Wallet, invoices and payment history.</p>
      </div>

      {balance < LOW_BALANCE && (
        <Alert
          variant="warning"
          action={
            <Button size="sm" onClick={() => setTopUpOpen(true)}>
              Top up
            </Button>
          }
        >
          <AlertTitle>Low balance</AlertTitle>
          <AlertDescription>
            {money.format(balance)} left. Services pause when your wallet reaches ৳0.
          </AlertDescription>
        </Alert>
      )}

      <WalletSummary balance={balance} onTopUp={() => setTopUpOpen(true)} />
      <Transactions />

      <TopUpDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        onTopUp={(amount) => {
          setBalance((b) => b + amount);
          toast.success(`${money.format(amount)} added to your wallet`);
        }}
      />
      <Toaster />
    </main>
  );
}

export const Overview: Story = { render: () => <BillingPage /> };
