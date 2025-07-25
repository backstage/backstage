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

import { forwardRef } from 'react';
import clsx from 'clsx';
import { useStyles } from '../../hooks/useStyles';

/** @public */
export const Table = forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Table');

  return (
    <table ref={ref} className={clsx(classNames.root, className)} {...props} />
  );
});
Table.displayName = 'Table';

/** @public */
export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Table');

  return (
    <thead
      ref={ref}
      className={clsx(classNames.header, className)}
      {...props}
    />
  );
});
TableHeader.displayName = 'TableHeader';

/** @public */
export const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Table');

  return (
    <tbody ref={ref} className={clsx(classNames.body, className)} {...props} />
  );
});
TableBody.displayName = 'TableBody';

/** @public */
export const TableRow = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Table');

  return (
    <tr ref={ref} className={clsx(classNames.row, className)} {...props}>
      {props.children}
    </tr>
  );
});
TableRow.displayName = 'TableRow';

/** @public */
export const TableHead = forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Table');

  return (
    <th ref={ref} className={clsx(classNames.head, className)} {...props} />
  );
});
TableHead.displayName = 'TableHead';

/** @public */
export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Table');

  return (
    <caption
      ref={ref}
      className={clsx(classNames.caption, className)}
      {...props}
    />
  );
});
TableCaption.displayName = 'TableCaption';
