/*
 * Copyright 2021 Spotify AB
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

import { TableColumn, TableFilter } from '@backstage/core';
import {
  defaultColumns,
  defaultFilters,
  EntityRow,
  NullableColumn,
} from './defaults';

const toMap = <T extends any>(
  list: Array<T>,
  identifier: string,
): Map<string, T> => {
  const map = new Map();

  list.forEach((item: any) => {
    if (typeof item === 'object') {
      map.set(item[identifier], item);
    }
  });

  return map;
};

export const toTableColumnsArray = <T extends TableColumn<EntityRow>>(
  columns: Array<string | T>,
): T[] => {
  if (!columns.length) {
    return defaultColumns as T[];
  }

  const columnsMap = toMap(defaultColumns, 'title');

  const conformedColumns = columns
    .map(c => {
      if (typeof c === 'string') {
        const providedColumn = columnsMap.get(c) as NullableColumn;

        if (providedColumn) {
          return providedColumn;
        }
      }

      return c;
    })
    .filter(c => !!c) as T[];

  return conformedColumns;
};

export const toTableFiltersArray = <T extends TableFilter>(
  filters: Array<string | T>,
): T[] => {
  if (!filters.length) {
    return defaultFilters as T[];
  }

  const filtersMap = toMap(defaultFilters, 'column');

  const conformedFilters = filters.map(f => {
    if (typeof f === 'string') {
      const providedFilter = filtersMap.get(f);

      if (providedFilter) {
        return providedFilter;
      }
    }

    return f;
  }) as T[];

  return conformedFilters;
};
