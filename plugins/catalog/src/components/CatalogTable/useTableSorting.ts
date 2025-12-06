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

import { useState, useMemo, useCallback } from 'react';
import type { SortDescriptor } from 'react-aria-components';
import { TableColumn } from '@backstage/core-components';
import { CatalogTableRow } from './types';
import { extractValueByField } from './utils';

/**
 * Hook that provides sorting functionality for catalog tables
 * @internal
 */
export function useTableSorting<T extends CatalogTableRow>(
  data: T[],
  columns: TableColumn<T>[],
) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(
    null,
  );

  // Sort the table data based on sortDescriptor
  const sortedData = useMemo(() => {
    if (!sortDescriptor || !sortDescriptor.column) {
      return data;
    }

    const result = [...data];
    const column = columns?.find(
      col => (col.field || String(col.title)) === sortDescriptor.column,
    );

    if (!column) {
      return result;
    }

    // Use customSort if available, otherwise use field-based sorting
    if (column.customSort) {
      result.sort((a, b) => {
        // Material Table's customSort signature: (data1, data2) => number
        // TypeScript may expect 3 params but in practice it's 2
        const sortResult = (column.customSort as any)(a, b);
        return sortDescriptor.direction === 'descending'
          ? -sortResult
          : sortResult;
      });
    } else if (column.field) {
      result.sort((a, b) => {
        const fieldStr = String(column.field!);
        const valueA = extractValueByField(a, fieldStr);
        const valueB = extractValueByField(b, fieldStr);

        // Handle arrays (like tags)
        if (Array.isArray(valueA) && Array.isArray(valueB)) {
          const strA = valueA.join(', ').toLowerCase();
          const strB = valueB.join(', ').toLowerCase();
          const sortResult = strA.localeCompare(strB);
          return sortDescriptor.direction === 'descending'
            ? -sortResult
            : sortResult;
        }

        // Handle strings and other primitives
        const strA =
          valueA !== undefined && valueA !== null
            ? String(valueA).toLowerCase()
            : '';
        const strB =
          valueB !== undefined && valueB !== null
            ? String(valueB).toLowerCase()
            : '';
        const sortResult = strA.localeCompare(strB);
        return sortDescriptor.direction === 'descending'
          ? -sortResult
          : sortResult;
      });
    }

    return result;
  }, [data, sortDescriptor, columns]);

  const handleSortChange = useCallback(
    (descriptor: SortDescriptor) => {
      // Handle three-state cycle: none -> ascending -> descending -> none
      // If clicking the same column that's already descending and react-aria
      // wants to cycle back to ascending, reset to none instead
      if (
        sortDescriptor &&
        sortDescriptor.column === descriptor.column &&
        sortDescriptor.direction === 'descending' &&
        descriptor.direction === 'ascending'
      ) {
        // Reset to no sort
        setSortDescriptor(null);
      } else {
        setSortDescriptor(descriptor);
      }
    },
    [sortDescriptor],
  );

  return {
    sortDescriptor,
    sortedData,
    handleSortChange,
  };
}
