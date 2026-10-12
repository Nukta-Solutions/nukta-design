import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Slot } from "radix-ui";
import { cloneElement, isValidElement, useId } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { buttonVariants, type ButtonProps } from "../button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";

/* ------------------------------------------------------------------------------------------------
 * Building blocks
 * ----------------------------------------------------------------------------------------------*/

/** Navigation landmark for pagination controls. */
export function Pagination({
  className,
  "aria-label": ariaLabel = "Pagination",
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="pagination"
      aria-label={ariaLabel}
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

export function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

export interface PaginationLinkProps extends React.ComponentProps<"a"> {
  /** The current page: sets aria-current="page". */
  isActive?: boolean;
  /** Disabled links lose their href and leave the tab order. */
  disabled?: boolean;
  size?: ButtonProps["size"];
  /** Render a router link or a `<button>` instead of `<a>`. */
  asChild?: boolean;
}

export function PaginationLink({
  className,
  isActive,
  disabled,
  size = "icon",
  asChild = false,
  href,
  ...props
}: PaginationLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="pagination-link"
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled || undefined}
      {...(href !== undefined && !disabled ? { href } : {})}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
        "tabular-nums aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function PaginationPrevious({
  className,
  children = "Previous",
  "aria-label": ariaLabel = "Go to previous page",
  ...props
}: PaginationLinkProps) {
  return (
    <PaginationLink
      data-slot="pagination-previous"
      aria-label={ariaLabel}
      size="md"
      className={cn("gap-1 px-2.5 sm:pl-2", className)}
      {...props}
    >
      {withContent(props.asChild, children, (text) => (
        <>
          <ChevronLeft aria-hidden="true" />
          <span className="hidden sm:inline">{text}</span>
        </>
      ))}
    </PaginationLink>
  );
}

export function PaginationNext({
  className,
  children = "Next",
  "aria-label": ariaLabel = "Go to next page",
  ...props
}: PaginationLinkProps) {
  return (
    <PaginationLink
      data-slot="pagination-next"
      aria-label={ariaLabel}
      size="md"
      className={cn("gap-1 px-2.5 sm:pr-2", className)}
      {...props}
    >
      {withContent(props.asChild, children, (text) => (
        <>
          <span className="hidden sm:inline">{text}</span>
          <ChevronRight aria-hidden="true" />
        </>
      ))}
    </PaginationLink>
  );
}

/** With asChild, put the chevron + label inside the child element instead of replacing it. */
function withContent(
  asChild: boolean | undefined,
  children: React.ReactNode,
  render: (text: React.ReactNode) => React.ReactNode,
) {
  if (!asChild) return render(children);
  if (!isValidElement<{ children?: React.ReactNode }>(children)) return children;
  return cloneElement(children, undefined, render(children.props.children));
}

export function PaginationEllipsis({
  className,
  label = "More pages",
  ...props
}: React.ComponentProps<"span"> & { label?: string }) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn("text-muted-foreground flex size-10 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal aria-hidden="true" className="size-4" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Page range
 * ----------------------------------------------------------------------------------------------*/

/**
 * Pages to show for `page` of `totalPages` (1-based), with "ellipsis" for gaps.
 * The list length is constant, so controls don't jump while paging.
 *
 * getPageRange(6, 20) → [1, "ellipsis", 5, 6, 7, "ellipsis", 20]
 */
export function getPageRange(
  page: number,
  totalPages: number,
  siblingCount = 1,
  boundaryCount = 1,
): (number | "ellipsis")[] {
  const range = (start: number, end: number) =>
    Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);

  const total = Math.max(totalPages, 0);
  const current = Math.min(Math.max(page, 1), Math.max(total, 1));
  // boundary + ellipsis + siblings + current + siblings + ellipsis + boundary
  if (total <= boundaryCount * 2 + siblingCount * 2 + 3) return range(1, total);

  const startPages = range(1, boundaryCount);
  const endPages = range(total - boundaryCount + 1, total);

  const siblingsStart = Math.max(
    Math.min(current - siblingCount, total - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(current + siblingCount, boundaryCount + siblingCount * 2 + 2),
    total - boundaryCount - 1,
  );

  return [
    ...startPages,
    siblingsStart > boundaryCount + 2 ? "ellipsis" : boundaryCount + 1,
    ...range(siblingsStart, siblingsEnd),
    siblingsEnd < total - boundaryCount - 1 ? "ellipsis" : total - boundaryCount,
    ...endPages,
  ] as (number | "ellipsis")[];
}

/* ------------------------------------------------------------------------------------------------
 * Ready-made pagination
 * ----------------------------------------------------------------------------------------------*/

export interface PaginationLabels {
  pagination: string;
  previous: string;
  next: string;
  previousPage: string;
  nextPage: string;
  page: (page: number) => string;
  morePages: string;
  rowsPerPage: string;
}

const defaultLabels: PaginationLabels = {
  pagination: "Pagination",
  previous: "Previous",
  next: "Next",
  previousPage: "Go to previous page",
  nextPage: "Go to next page",
  page: (page) => `Page ${page}`,
  morePages: "More pages",
  rowsPerPage: "Rows per page",
};

/** Props given to `renderLink`: spread them onto your router's link (with `href`/`to`). */
export type PaginationRenderLinkProps = {
  children: React.ReactNode;
};

interface PageTarget<T> {
  /** Called with the target; renders `<button>`s. */
  onSelect?: (target: T) => void;
  /** Builds a URL for the target; renders `<a href>`s. */
  getHref?: (target: T) => string;
  /** Renders a router link for the target, e.g. `(props, page) => <Link to={`?page=${page}`} {...props} />`. */
  renderLink?: (props: PaginationRenderLinkProps, target: T) => React.ReactElement;
}

/** The element inside a PaginationLink: router link, `<a>` or `<button>`. */
function targetElement<T>(
  target: T,
  children: React.ReactNode,
  how: PageTarget<T>,
  disabled = false,
) {
  if (how.renderLink || how.getHref) {
    // A disabled link has no destination: keep the link role, drop the href (APG pattern).
    if (disabled) {
      // eslint-disable-next-line jsx-a11y/anchor-is-valid -- intentionally no href: it's disabled
      return <a role="link">{children}</a>;
    }
    if (how.renderLink) return how.renderLink({ children }, target);
    return <a href={how.getHref!(target)}>{children}</a>;
  }
  return (
    <button type="button" disabled={disabled} onClick={() => how.onSelect?.(target)}>
      {children}
    </button>
  );
}

interface PageSizeProps {
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

function PageSizeSelect({
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  label,
}: PageSizeProps & { label: string }) {
  const id = useId();
  if (pageSize === undefined || !onPageSizeChange) return null;
  return (
    <div data-slot="pagination-page-size" className="flex items-center gap-2 text-sm">
      <span id={id} className="text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
        <SelectTrigger size="sm" aria-labelledby={id} className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export interface PagePaginationProps extends PageSizeProps {
  /** Current page, 1-based. */
  page: number;
  totalPages: number;
  /** Pages shown on each side of the current one. Default 1. */
  siblingCount?: number;
  /** Pages always shown at the start and end. Default 1. */
  boundaryCount?: number;
  /** Renders buttons that call this with the new page. */
  onPageChange?: (page: number) => void;
  /** Renders `<a href>` links instead of buttons. */
  getPageHref?: (page: number) => string;
  /** Renders your router's link: `(props, page) => <Link to={…} {...props} />`. */
  renderLink?: (props: PaginationRenderLinkProps, page: number) => React.ReactElement;
  /** Text shown on the left, e.g. "Showing 21–40 of 248". */
  summary?: React.ReactNode;
  labels?: Partial<PaginationLabels>;
  className?: string;
}

/** Numbered pagination with Previous/Next, ellipses and an optional rows-per-page Select. */
export function PagePagination({
  page,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1,
  onPageChange,
  getPageHref,
  renderLink,
  summary,
  labels: labelsProp,
  className,
  ...pageSize
}: PagePaginationProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const how: PageTarget<number> = { onSelect: onPageChange, getHref: getPageHref, renderLink };
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div
      data-slot="page-pagination"
      className={cn("flex flex-wrap items-center justify-between gap-x-6 gap-y-3", className)}
    >
      <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        {summary && <span>{summary}</span>}
        <PageSizeSelect {...pageSize} label={labels.rowsPerPage} />
      </div>
      <Pagination aria-label={labels.pagination}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious asChild disabled={isFirst} aria-label={labels.previousPage}>
              {targetElement(Math.max(page - 1, 1), labels.previous, how, isFirst)}
            </PaginationPrevious>
          </PaginationItem>
          {getPageRange(page, totalPages, siblingCount, boundaryCount).map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis label={labels.morePages} />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink asChild isActive={item === page} aria-label={labels.page(item)}>
                  {targetElement(item, item, how)}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext asChild disabled={isLast} aria-label={labels.nextPage}>
              {targetElement(Math.min(page + 1, totalPages), labels.next, how, isLast)}
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export interface CursorPaginationProps extends PageSizeProps {
  hasPrevious: boolean;
  hasNext: boolean;
  /** Renders buttons. */
  onPrevious?: () => void;
  onNext?: () => void;
  /** Renders `<a href>` links. */
  previousHref?: string;
  nextHref?: string;
  /** Renders your router's link for "previous" or "next". */
  renderLink?: (
    props: PaginationRenderLinkProps,
    direction: "previous" | "next",
  ) => React.ReactElement;
  /** Text shown on the left, e.g. "Showing 20 results". */
  summary?: React.ReactNode;
  labels?: Partial<PaginationLabels>;
  className?: string;
}

/** Previous/Next pagination for APIs that return cursors instead of page numbers. */
export function CursorPagination({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  previousHref,
  nextHref,
  renderLink,
  summary,
  labels: labelsProp,
  className,
  ...pageSize
}: CursorPaginationProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const how: PageTarget<"previous" | "next"> = {
    onSelect: (direction) => (direction === "previous" ? onPrevious?.() : onNext?.()),
    getHref:
      previousHref !== undefined || nextHref !== undefined
        ? (direction) => (direction === "previous" ? previousHref : nextHref) ?? "#"
        : undefined,
    renderLink,
  };

  return (
    <div
      data-slot="cursor-pagination"
      className={cn("flex flex-wrap items-center justify-between gap-x-6 gap-y-3", className)}
    >
      <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        {summary && <span>{summary}</span>}
        <PageSizeSelect {...pageSize} label={labels.rowsPerPage} />
      </div>
      <Pagination aria-label={labels.pagination}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious asChild disabled={!hasPrevious} aria-label={labels.previousPage}>
              {targetElement("previous" as const, labels.previous, how, !hasPrevious)}
            </PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext asChild disabled={!hasNext} aria-label={labels.nextPage}>
              {targetElement("next" as const, labels.next, how, !hasNext)}
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
