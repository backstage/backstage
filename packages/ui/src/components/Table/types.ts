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

import { Table } from '@tanstack/react-table';

/** @public */
export interface TableProps<TData>
  extends React.HTMLAttributes<HTMLTableElement> {
  table: Table<TData>;
  /**
   * Background click handler for rows. This will be called when clicking on empty
   * areas of a row that don't have their own click handlers. Cell-level interactions
   * (like Links or buttons) will automatically prevent this from firing.
   */
  onRowClick?: (
    row: TData,
    event: React.MouseEvent<HTMLTableRowElement>,
  ) => void;
}
