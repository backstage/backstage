/*
 * Copyright 2020 The Backstage Authors
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
import { type ReactNode, type TdHTMLAttributes } from 'react';
import { ShadcnTable, TableBody, TableRow, TableCell } from '../ui/table';
import { cn } from '../../lib/utils';

export type MetadataTableTitleCellClassKey = 'root';

export type MetadataTableCellClassKey = 'root';

export type MetadataTableListClassKey = 'root';

export type MetadataTableListItemClassKey = 'root' | 'random';

/**
 * Styled table cell for metadata title/key column.
 * Renders bold, non-wrapping text with right padding and top alignment.
 *
 * Tailwind class mapping from MUI tableTitleCellStyles:
 * - fontWeight: theme.typography.fontWeightBold → font-bold (700)
 * - whiteSpace: 'nowrap' → whitespace-nowrap
 * - paddingRight: theme.spacing(4) → pr-8 (32px = 2rem)
 * - border: '0' → border-0
 * - verticalAlign: 'top' → align-top
 */
const TitleCell = ({
  children,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) => (
  <TableCell
    className={cn(
      'font-bold whitespace-nowrap pr-8 border-0 align-top',
      className,
    )}
    {...props}
  >
    {children}
  </TableCell>
);

/**
 * Styled table cell for metadata content/value column.
 * Renders with no border and top vertical alignment.
 *
 * Tailwind class mapping from MUI tableContentCellStyles:
 * - border: '0' → border-0
 * - verticalAlign: 'top' → align-top
 */
const ContentCell = ({
  children,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) => (
  <TableCell className={cn('border-0 align-top', className)} {...props}>
    {children}
  </TableCell>
);

/**
 * Renders a metadata key-value table with optional density toggle.
 * Uses shadcn/ui ShadcnTable as the root table element with a TableBody.
 *
 * ShadcnTable applies `text-sm` by default (matching MUI Table size="small").
 * When `dense` is false, overrides to `text-base` for standard density
 * (matching MUI Table size="medium").
 */
export const MetadataTable = ({
  dense,
  children,
}: {
  dense?: boolean;
  children: ReactNode;
}) => (
  <ShadcnTable className={cn(!dense && 'text-base')}>
    <TableBody>{children}</TableBody>
  </ShadcnTable>
);

/**
 * A single row in the MetadataTable, displaying a title cell and content cell.
 * When no title is provided, the content cell spans both columns via colSpan.
 */
export const MetadataTableItem = ({
  title,
  children,
  ...rest
}: {
  title: string;
  children: ReactNode;
}) => (
  <TableRow>
    {title && <TitleCell>{title}</TitleCell>}
    <ContentCell colSpan={title ? 1 : 2} {...rest}>
      {children}
    </ContentCell>
  </TableRow>
);

/**
 * A semantic list for displaying metadata values, rendered as an unstyled `<ul>`.
 * Accepts a `className` prop for consumer customization.
 *
 * Tailwind class mapping from MUI listStyles:
 * - List disablePadding → list-none p-0
 * - margin: theme.spacing(0, 0, -1, 0) → -mb-2 (margin-bottom: -8px = -0.5rem)
 */
export const MetadataList = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => <ul className={cn('list-none p-0 -mb-2', className)}>{children}</ul>;

/**
 * A single item within the MetadataList, rendered as a `<li>`.
 * Applies bottom padding matching the original MUI ListItem spacing.
 *
 * Tailwind class mapping from MUI listItemStyles:
 * - padding: theme.spacing(0, 0, 1, 0) → pb-2 (padding-bottom: 8px = 0.5rem)
 *   with px-0 pt-0 for explicit zero padding on other sides
 */
export const MetadataListItem = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => <li className={cn('pb-2 px-0 pt-0', className)}>{children}</li>;
