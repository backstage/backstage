/*
 * Copyright 2026 The Backstage Authors
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

import {
  EntityTextFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import { SearchField } from '@backstage/ui';
import { useEffect, useMemo, useState } from 'react';
import useDebounce from 'react-use/lib/useDebounce';

/**
 * Search input for the v2 catalog page. Dispatches an `EntityTextFilter`
 * scoped to the union of `searchFields` declared by the visible columns,
 * so server-side full-text search only inspects the fields those columns
 * care about. Falls back to `EntityTextFilter`'s default field set when
 * no `searchFields` are declared.
 *
 * Mirrors `EntitySearchBar`'s URL query-parameter sync and debounce
 * behavior so the search term round-trips through `?text=...`.
 *
 * @alpha
 */
export function NextCatalogSearchBar(props: { searchFields: string[] }) {
  const {
    updateFilters,
    queryParameters: { text: textParameter },
  } = useEntityList();

  const queryParamTextFilter = useMemo(
    () => [textParameter].flat()[0],
    [textParameter],
  );

  const [search, setSearch] = useState(queryParamTextFilter ?? '');

  useDebounce(
    () => {
      updateFilters({
        text: search
          ? new EntityTextFilter(
              props.searchFields.length
                ? [search, ...props.searchFields]
                : search,
            )
          : undefined,
      });
    },
    250,
    [search, props.searchFields, updateFilters],
  );

  useEffect(() => {
    if (queryParamTextFilter) {
      setSearch(queryParamTextFilter);
    }
  }, [queryParamTextFilter]);

  return (
    <SearchField
      aria-label="Search entities"
      placeholder="Search"
      value={search}
      onChange={setSearch}
    />
  );
}
