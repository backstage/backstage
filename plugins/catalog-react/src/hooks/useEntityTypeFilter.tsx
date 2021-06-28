/*
 * Copyright 2021 The Backstage Authors
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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '../api';
import {
  DefaultEntityFilters,
  useEntityListProvider,
} from './useEntityListProvider';
import { EntityTypeFilter } from '../filters';

type EntityTypeReturn = {
  loading: boolean;
  error?: Error;
  types: string[];
  selectedType: string | undefined;
  setType: (type: string | undefined) => void;
  setTypes: (types: string[]) => void;
};

/**
 * A hook built on top of `useEntityListProvider` for enabling selection of valid `spec.type` values
 * based on the selected EntityKindFilter.
 */
export function useEntityTypeFilter(): EntityTypeReturn {
  const catalogApi = useApi(catalogApiRef);
  const {
    filters: { kind: kindFilter, type: typeFilter },
    updateFilters,
  } = useEntityListProvider();

  const [allTypes, setAllTypes] = useState<string[]>([]);
  const kind = useMemo(() => kindFilter?.value, [kindFilter]);

  // Load all valid spec.type values straight from the catalogApi, paying attention to only the
  // kind filter for a complete list.
  const { error, loading, value: entities } = useAsync(async () => {
    if (kind) {
      const items = await catalogApi
        .getEntities({
          filter: { kind },
          fields: ['spec.type'],
        })
        .then(response => response.items);
      return items;
    }
    return [];
  }, [kind, catalogApi]);

  useEffect(() => {
    // Resolve the unique set of types from returned entities; could be optimized by a new endpoint
    // in the catalog-backend that does this, rather than loading entities with redundant types.
    const newTypes = [
      ...new Set(
        (entities ?? []).map(e => e.spec?.type).filter(Boolean) as string[],
      ),
    ].sort();
    setAllTypes(newTypes);

    // Update type filter to only valid values when the list of available types has changed
    updateFilters((oldFilters: DefaultEntityFilters) => {
      // No filter previously set; no-op
      if (!oldFilters.type) {
        return {};
      }
      const stillValidTypes = oldFilters.type
        .getTypes()
        .filter(value => newTypes.includes(value));
      if (!stillValidTypes.length) {
        // None of the previously selected types are present any more; clear the filter
        return { type: undefined };
      }
      return { type: new EntityTypeFilter(stillValidTypes) };
    });
  }, [updateFilters, entities]);

  const setTypes = useCallback(
    (types: string[]) =>
      updateFilters({
        type: types.length ? undefined : new EntityTypeFilter(types),
      }),
    [updateFilters],
  );

  const setType = (type: string | undefined) =>
    setTypes(type === undefined ? [] : [type]);

  // TODO(timbonicus): selectedType should be selectedTypes
  // TODO(timbonicus): remove setType, make this only array-based
  return {
    loading,
    error,
    types: allTypes,
    selectedType: typeFilter?.value,
    setType,
    setTypes,
  };
}
