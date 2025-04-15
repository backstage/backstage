/*
 * Copyright 2024 The Backstage Authors
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

import { forwardRef } from 'react';
import clsx from 'clsx';
import { TableCell } from './TableCell/TableCell';
import { TableCellText } from './TableCellText/TableCellText';
import { TableCellLink } from './TableCellLink/TableCellLink';
import { TableCellProfile } from './TableCellProfile/TableCellProfile';

const TableRoot = forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table ref={ref} className={clsx('canon-TableRoot', className)} {...props} />
));
TableRoot.displayName = 'TableRoot';

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={clsx('canon-TableHeader', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={clsx('canon-TableBody', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableRow = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={clsx('canon-TableRow', className)} {...props}>
    {props.children}
  </tr>
));
TableRow.displayName = 'TableRow';

const TableHead = forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={clsx('canon-TableHead', className)} {...props} />
));
TableHead.displayName = 'TableHead';

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={clsx('canon-TableCaption', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

/**
 * Table component for displaying tabular data
 * @public
 */
export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Head: TableHead,
  Row: TableRow,
  Cell: TableCell,
  CellText: TableCellText,
  CellLink: TableCellLink,
  CellProfile: TableCellProfile,
  Caption: TableCaption,
};
