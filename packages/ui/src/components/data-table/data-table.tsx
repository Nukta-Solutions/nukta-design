import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrHas,
  filterFn_arrIncludesSome,
  filterFn_includesString,
  functionalUpdate,
  globalFilteringFeature,
  type PaginationState,
  type Row,
  rowPaginationFeature,
  type RowSelectionState,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  type SortingState,
  type Table as TanStackTable,
  tableFeatures,
  type Updater,
  useTable,
  type ColumnVisibilityState as VisibilityState,
  type RowData,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronsUpDown,
  Columns3,
  PlusCircle,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { Badge } from "../badge";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { EmptyState } from "../empty-state";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import { PagePagination } from "../pagination";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Skeleton } from "../skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

/** Extra column settings read by DataTable. */
export interface DataTableColumnMeta {
  /** Name used in the column menu and filters when the header isn't plain text. */
  label?: string;
  /** Right-align numbers and amounts. */
  align?: "start" | "end";
  /** Classes for this column's header and cells. */
  className?: string;
}

/** The TanStack Table features DataTable registers: sorting, filtering, pagination, selection, visibility. */
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    // Faceted filters: the cell value is one of the selected values.
    arrHas: filterFn_arrHas,
    // Faceted filters on array cells (e.g. tags): the cell includes any selected value.
    arrIncludesSome: filterFn_arrIncludesSome,
  },
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
    basic: sortFn_basic,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnVisibilityFeature,
  columnMeta: {} as DataTableColumnMeta,
});

export type DataTableFeatures = typeof dataTableFeatures;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- columns hold mixed value types
export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>;
export type DataTableInstance<TData extends RowData> = TanStackTable<DataTableFeatures, TData>;

/** Typed column helper for DataTable: `const col = createDataTableColumnHelper<Domain>()`. */
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

export interface DataTableFacetedFilter {
  /**
   * Column id to filter. Set the column's `filterFn` to `"arrHas"` (cell value is one of the
   * selected values) or `"arrIncludesSome"` when the cell holds an array, e.g. tags.
   */
  columnId: string;
  title: string;
  options: { label: string; value: string; icon?: React.ReactNode }[];
}

export interface DataTableLabels {
  search: string;
  columns: string;
  toggleColumns: string;
  reset: string;
  selected: (count: number) => string;
  clearSelection: string;
  selectAll: string;
  selectRow: string;
  noResults: string;
  noResultsDescription: string;
  loading: string;
  sortAscending: string;
  sortDescending: string;
  showing: (from: number, to: number, total: number) => string;
}

const defaultLabels: DataTableLabels = {
  search: "Search…",
  columns: "Columns",
  toggleColumns: "Toggle columns",
  reset: "Reset",
  selected: (count) => `${count} selected`,
  clearSelection: "Clear selection",
  selectAll: "Select all rows on this page",
  selectRow: "Select row",
  noResults: "No results",
  noResultsDescription: "Try a different search or filter.",
  loading: "Loading",
  sortAscending: "Sorted ascending",
  sortDescending: "Sorted descending",
  showing: (from, to, total) => `Showing ${from}–${to} of ${total}`,
};

/** State that is controlled when `value` is given, internal otherwise; accepts TanStack updaters. */
function useSlice<T>(value: T | undefined, initial: T, onChange?: (next: T) => void) {
  const [internal, setInternal] = useState(initial);
  const current = value ?? internal;
  const set = (updater: Updater<T>) => {
    const next = functionalUpdate(updater, current);
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  /** Stable row id, e.g. `(row) => row.id`. Needed for selection to survive sorting and paging. */
  getRowId?: (row: TData) => string;
  /** Accessible name of the table (visually hidden unless `showCaption`). */
  caption: string;
  showCaption?: boolean;
  /** Shows skeleton rows. */
  loading?: boolean;
  /** Shown when there are no rows. Defaults to a compact "No results" EmptyState. */
  emptyState?: React.ReactNode;

  /** Adds a checkbox column and a bulk-action bar. */
  enableRowSelection?: boolean | ((row: Row<DataTableFeatures, TData>) => boolean);
  /** Actions shown while rows are selected, e.g. "Renew" or "Delete". */
  bulkActions?: (selectedRows: TData[], table: DataTableInstance<TData>) => React.ReactNode;

  /** Global search box. `false` hides it. */
  searchable?: boolean;
  filters?: DataTableFacetedFilter[];
  /** Column visibility menu. Default true. */
  columnToggle?: boolean;
  /** Extra toolbar content on the right, e.g. an "Add domain" button. */
  toolbarActions?: React.ReactNode;

  /** Pagination footer. Default true. */
  paginated?: boolean;
  pageSizeOptions?: number[];

  /**
   * Server mode: the parent fetches rows for the current sorting/filters/page and passes them
   * in `data`, with the total in `rowCount`. Control the state slices to build the request.
   */
  manual?: boolean;
  rowCount?: number;

  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  /** Initial values for uncontrolled state slices. */
  initialState?: {
    sorting?: SortingState;
    pagination?: PaginationState;
    columnVisibility?: VisibilityState;
    columnFilters?: ColumnFiltersState;
  };

  labels?: Partial<DataTableLabels>;
  className?: string;
}

/**
 * A full-featured data table: search, faceted filters, sortable columns, column visibility,
 * row selection with bulk actions, loading/empty states and pagination. Built on TanStack Table.
 */
export function DataTable<TData extends RowData>({
  columns: columnsProp,
  data,
  getRowId,
  caption,
  showCaption = false,
  loading = false,
  emptyState,
  enableRowSelection = false,
  bulkActions,
  searchable = true,
  filters = [],
  columnToggle = true,
  toolbarActions,
  paginated = true,
  pageSizeOptions = [10, 20, 50],
  manual = false,
  rowCount,
  initialState,
  labels: labelsProp,
  className,
  ...state
}: DataTableProps<TData>) {
  const labels = { ...defaultLabels, ...labelsProp };

  const [sorting, setSorting] = useSlice(
    state.sorting,
    initialState?.sorting ?? [],
    state.onSortingChange,
  );
  const [globalFilter, setGlobalFilter] = useSlice(
    state.globalFilter,
    "",
    state.onGlobalFilterChange,
  );
  const [columnFilters, setColumnFilters] = useSlice(
    state.columnFilters,
    initialState?.columnFilters ?? [],
    state.onColumnFiltersChange,
  );
  const [pagination, setPagination] = useSlice(
    state.pagination,
    initialState?.pagination ?? { pageIndex: 0, pageSize: pageSizeOptions[0] ?? 10 },
    state.onPaginationChange,
  );
  const [rowSelection, setRowSelection] = useSlice(
    state.rowSelection,
    {},
    state.onRowSelectionChange,
  );
  const [columnVisibility, setColumnVisibility] = useSlice(
    state.columnVisibility,
    initialState?.columnVisibility ?? {},
    state.onColumnVisibilityChange,
  );

  const columns = useMemo<DataTableColumnDef<TData>[]>(
    () =>
      enableRowSelection
        ? [selectionColumn<TData>(labels.selectAll, labels.selectRow), ...columnsProp]
        : columnsProp,
    [columnsProp, enableRowSelection, labels.selectAll, labels.selectRow],
  );

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
    state: { sorting, globalFilter, columnFilters, pagination, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection,
    globalFilterFn: "includesString",
    manualSorting: manual,
    manualFiltering: manual,
    manualPagination: manual,
    rowCount: manual ? rowCount : undefined,
  });

  const rows = table.getRowModel().rows;
  const total = manual ? (rowCount ?? data.length) : table.getFilteredRowModel().rows.length;
  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const isFiltered = globalFilter !== "" || columnFilters.length > 0;
  const { pageIndex, pageSize } = pagination;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div data-slot="data-table" className={cn("grid gap-4", className)}>
      {(searchable || filters.length > 0 || columnToggle || toolbarActions) && (
        <div data-slot="data-table-toolbar" className="flex flex-wrap items-center gap-2">
          {searchable && (
            <InputGroup size="sm" className="w-full sm:w-64">
              <InputGroupAddon>
                <Search aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                aria-label={labels.search.replace(/…$/, "")}
                placeholder={labels.search}
                value={globalFilter}
                onChange={(event) => {
                  setGlobalFilter(event.target.value);
                  setPagination((p) => ({ ...p, pageIndex: 0 }));
                }}
              />
            </InputGroup>
          )}
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            return column ? (
              <FacetedFilter key={filter.columnId} column={column} {...filter} />
            ) : null;
          })}
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setGlobalFilter("");
                setColumnFilters([]);
              }}
            >
              {labels.reset} <X aria-hidden="true" />
            </Button>
          )}
          <div className="ml-auto flex items-center gap-2">
            {toolbarActions}
            {columnToggle && <ColumnToggle table={table} labels={labels} />}
          </div>
        </div>
      )}

      {enableRowSelection && selectedRows.length > 0 && (
        <div
          data-slot="data-table-bulk-actions"
          role="region"
          aria-label={labels.selected(selectedRows.length)}
          className="bg-secondary text-secondary-foreground flex flex-wrap items-center gap-2 rounded-md border px-3 py-2 text-sm"
        >
          <span className="font-medium" aria-live="polite">
            {labels.selected(selectedRows.length)}
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {bulkActions?.(selectedRows, table)}
            <Button variant="ghost" size="sm" onClick={() => table.resetRowSelection()}>
              {labels.clearSelection}
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table aria-busy={loading || undefined}>
          <TableCaption className={cn(!showCaption && "sr-only")}>{caption}</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                      className={cn(meta?.align === "end" && "text-right", meta?.className)}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn("-ml-2 h-8 px-2", meta?.align === "end" && "-mr-2 ml-auto")}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                          {sorted === "asc" ? (
                            <ArrowUp aria-hidden="true" />
                          ) : sorted === "desc" ? (
                            <ArrowDown aria-hidden="true" />
                          ) : (
                            <ChevronsUpDown aria-hidden="true" className="opacity-50" />
                          )}
                          {sorted && (
                            <span className="sr-only">
                              , {sorted === "asc" ? labels.sortAscending : labels.sortDescending}
                            </span>
                          )}
                        </Button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: Math.min(pageSize, 5) }, (_, i) => (
                <TableRow key={`loading-${i}`} className="hover:bg-transparent">
                  {Array.from({ length: visibleColumnCount }, (__, j) => (
                    <TableCell key={j}>
                      {i === 0 && j === 0 && <span className="sr-only">{labels.loading}</span>}
                      <Skeleton className="h-4 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={visibleColumnCount}>
                  {emptyState ?? (
                    <EmptyState
                      size="compact"
                      headingLevel={3}
                      icon={<Search />}
                      title={labels.noResults}
                      description={isFiltered ? labels.noResultsDescription : undefined}
                    />
                  )}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          meta?.align === "end" && "text-right tabular-nums",
                          meta?.className,
                        )}
                      >
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginated && total > 0 && (
        <PagePagination
          page={pageIndex + 1}
          totalPages={Math.max(table.getPageCount(), 1)}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageIndex: page - 1 }))}
          summary={labels.showing(from, to, total)}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={(size) => setPagination({ pageIndex: 0, pageSize: size })}
        />
      )}
    </div>
  );
}

function selectionColumn<TData extends RowData>(
  selectAll: string,
  selectRow: string,
): DataTableColumnDef<TData> {
  return {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    meta: { className: "w-10" },
    header: ({ table }) => (
      <Checkbox
        aria-label={selectAll}
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={selectRow}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(value === true)}
      />
    ),
  };
}

function FacetedFilter<TData extends RowData>({
  column,
  title,
  options,
}: DataTableFacetedFilter & { column: Column<DataTableFeatures, TData> }) {
  const selected = new Set((column.getFilterValue() as string[] | undefined) ?? []);
  const setSelected = (next: Set<string>) =>
    column.setFilterValue(next.size ? Array.from(next) : undefined);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          <PlusCircle aria-hidden="true" />
          {title}
          {selected.size > 0 && (
            <>
              <span aria-hidden="true" className="bg-border mx-1 h-4 w-px" />
              <Badge aria-hidden="true" variant="secondary" className="rounded-sm px-1 font-normal">
                {selected.size}
              </Badge>
              {/* The comma keeps the name from running together ("Status, 2 selected"). */}
              <span className="sr-only">, {selected.size} selected</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start" aria-label={`Filter by ${title}`}>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList aria-multiselectable="true">
            <CommandEmpty>No options.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      const next = new Set(selected);
                      if (isSelected) next.delete(option.value);
                      else next.add(option.value);
                      setSelected(next);
                    }}
                  >
                    {/* Visual only: a real checkbox inside an option would nest interactive controls. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "border-input flex size-4 shrink-0 items-center justify-center rounded-sm border",
                        isSelected && "border-primary bg-primary text-primary-foreground",
                      )}
                    >
                      {isSelected && <Check className="size-3.5 text-current" />}
                    </span>
                    {option.icon}
                    <span>{option.label}</span>
                    {isSelected && <span className="sr-only">, selected</span>}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selected.size > 0 && (
              <>
                <CommandSeparator alwaysRender />
                <CommandGroup>
                  <CommandItem onSelect={() => setSelected(new Set())} className="justify-center">
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ColumnToggle<TData extends RowData>({
  table,
  labels,
}: {
  table: DataTableInstance<TData>;
  labels: DataTableLabels;
}) {
  const hideable = table.getAllLeafColumns().filter((column) => column.getCanHide());
  if (hideable.length === 0) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label={labels.toggleColumns}>
          <Columns3 aria-hidden="true" />
          <span className="max-sm:hidden">{labels.columns}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{labels.toggleColumns}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideable.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(value === true)}
            // Keep the menu open while toggling several columns.
            onSelect={(event) => event.preventDefault()}
          >
            {column.columnDef.meta?.label ??
              (typeof column.columnDef.header === "string" ? column.columnDef.header : column.id)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
