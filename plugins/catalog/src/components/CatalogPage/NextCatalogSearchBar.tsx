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

import { useTranslationRef } from '@backstage/frontend-plugin-api';
import {
  catalogReactTranslationRef,
  EntityFilter,
  EntityTextFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import { Box, SearchField } from '@backstage/ui';
import { useMemo, useState } from 'react';
import useMount from 'react-use/lib/useMount';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

/**
 * Search input for the v2 catalog page. Dispatches an `EntityTextFilter`
 * scoped to the union of `searchFields` declared by the columns (including
 * hidden columns, which still contribute to search), so server-side full-text
 * search only inspects the fields those columns care about. Falls back to
 * `EntityTextFilter`'s default field set when no `searchFields` are declared.
 *
 * Mirrors `EntitySearchBar`'s URL query-parameter sync and debounce
 * behavior so the search term round-trips through `?text=...`.
 */
export function NextCatalogSearchBar(props: { searchFields: string[] }) {
  const {
    updateFilters,
    queryParameters: { text: textParameter },
  } = useEntityList();
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const queryParamTextFilter = useMemo(
    () => [textParameter].flat()[0],
    [textParameter],
  );

  const [search, setSearch] = useState(queryParamTextFilter ?? '');

  function dispatchTextFilter(term: string) {
    const filter = new EntityTextFilter(
      props.searchFields.length ? [term, ...props.searchFields] : term,
    );
    (filter as EntityFilter).filterEntity = undefined;
    updateFilters({ text: filter });
  }

  // On mount, dispatch immediately with column-derived fields so the first
  // fetch uses the correct searchFields (the provider reconstructs
  // EntityTextFilter from the URL with no fields, falling back to defaults).
  useMount(() => {
    if (queryParamTextFilter) {
      dispatchTextFilter(queryParamTextFilter);
    }
  });

  // Debounced dispatch for subsequent typing — skips mount to avoid
  // a duplicate dispatch when useMount already handled the URL term.
  useUpdateEffect(() => {
    const handle = setTimeout(() => {
      if (search) {
        dispatchTextFilter(search);
      } else {
        updateFilters({ text: undefined });
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [search, props.searchFields, updateFilters]);

  return (
    <Box>
      <SearchField
        aria-label="Search entities"
        placeholder={t('entitySearchBar.placeholder')}
        value={search}
        onChange={setSearch}
      />
    </Box>
  );
}
