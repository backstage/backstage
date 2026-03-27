/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * Semantic HTML table primitives styled with Tailwind CSS, following the
 * shadcn/ui new-york convention. Replaces MUI Table/TableBody/TableRow/TableCell
 * with lightweight, accessible HTML table elements wrapped in a responsive
 * overflow container.
 *
 * @remarks
 * The root component is exported as `ShadcnTable` to avoid naming conflicts
 * with the existing Backstage `Table` component (which wraps \@tanstack/react-table).
 * Sub-components (TableHeader, TableBody, TableFooter, TableRow, TableHead,
 * TableCell, TableCaption) use standard HTML table element names.
 *
 * All components support `ref` forwarding and accept standard HTML attributes
 * for their respective elements, along with a `className` prop that is merged
 * with default Tailwind classes via the `cn()` utility.
 *
 * For full-featured data tables with sorting, filtering, and pagination,
 * use the DataTable component instead.
 *
 * @example
 * ```tsx
 * import { ShadcnTable, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
 *
 * <ShadcnTable>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Status</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>my-service</TableCell>
 *       <TableCell>Running</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </ShadcnTable>
 * ```
 *
 * @public
 */

/**
 * Root table component wrapped in a responsive overflow container.
 * Renders a `<table>` inside a `<div>` with horizontal scroll support.
 *
 * @public
 */
const ShadcnTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      data-slot="table"
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
));
ShadcnTable.displayName = 'Table';

/**
 * Table header section (`<thead>`) with bottom-border styling on child rows.
 *
 * @public
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    data-slot="table-header"
    className={cn('[&_tr]:border-b', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

/**
 * Table body section (`<tbody>`) that removes the border from the last row.
 *
 * @public
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-slot="table-body"
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

/**
 * Table footer section (`<tfoot>`) with top-border and muted background.
 *
 * @public
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    data-slot="table-footer"
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

/**
 * Table row (`<tr>`) with hover highlight and selection state support.
 * Supports `data-state="selected"` for row selection highlighting.
 *
 * @public
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    data-slot="table-row"
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className,
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

/**
 * Table header cell (`<th>`) with muted foreground text and medium font weight.
 * Adjusts padding when containing a checkbox role element.
 *
 * @public
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    data-slot="table-head"
    className={cn(
      'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

/**
 * Table data cell (`<td>`) with consistent padding and vertical alignment.
 * Adjusts padding when containing a checkbox role element.
 *
 * @public
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    data-slot="table-cell"
    className={cn(
      'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

/**
 * Table caption (`<caption>`) positioned at the bottom with muted text styling.
 *
 * @public
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-slot="table-caption"
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  ShadcnTable,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
