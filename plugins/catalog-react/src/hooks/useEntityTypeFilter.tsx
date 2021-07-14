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

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '../api';
import { useEntityListProvider } from './useEntityListProvider';
import { EntityTypeFilter } from '../filters';

type EntityTypeReturn = {
  loading: boolean;
  error?: Error;
  availableTypes: string[];
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
};

/**
 * A hook built on top of `useEntityListProvider` for enabling selection of valid `spec.type` values
 * based on the selected EntityKindFilter.
 */
export function useEntityTypeFilter(): EntityTypeReturn {
  const catalogApi = useApi(catalogApiRef);
  const {
    filters: { kind: kindFilter, type: typeFilter },
    queryParameters,
    updateFilters,
  } = useEntityListProvider();

  const queryParamTypes = [queryParameters.type]
    .flat()
    .filter(Boolean) as string[];
  const [selectedTypes, setSelectedTypes] = useState(
    queryParamTypes.length ? queryParamTypes : typeFilter?.getTypes() ?? [],
  );

  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
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

  const entitiesRef = useRef(entities);
  useEffect(() => {
    const oldEntities = entitiesRef.current;
    entitiesRef.current = entities;
    // Delay processing hook until kind and entity load updates have settled to generate list of types;
    // This prevents reseting the type filter due to saved type value from query params not matching the
    // empty set of type values while values are still being loaded; also only run this hook on changes
    // to entities
    if (loading || !kind || oldEntities === entities) {
      return;
    }

    // Resolve the unique set of types from returned entities; could be optimized by a new endpoint
    // in the catalog-backend that does this, rather than loading entities with redundant types.
    if (!entities) return;

    // Sort by entity count descending, so the most common types appear on top
    const countByType = entities.reduce((acc, entity) => {
      if (typeof entity.spec?.type !== 'string') return acc;

      const entityType = entity.spec.type.toLocaleLowerCase('en-US');
      if (!acc[entityType]) {
        acc[entityType] = 0;
      }
      acc[entityType] += 1;
      return acc;
    }, {} as Record<string, number>);

    const newTypes = Object.entries(countByType)
      .sort(([, count1], [, count2]) => count2 - count1)
      .map(([type]) => type);
    setAvailableTypes(newTypes);

    // Update type filter to only valid values when the list of available types has changed
    const stillValidTypes = selectedTypes.filter(value =>
      newTypes.includes(value),
    );
    setSelectedTypes(stillValidTypes);
  }, [loading, kind, selectedTypes, setSelectedTypes, entities]);

  useEffect(() => {
    updateFilters({
      type: selectedTypes.length
        ? new EntityTypeFilter(selectedTypes)
        : undefined,
    });
  }, [selectedTypes, updateFilters]);

  return {
    loading,
    error,
    availableTypes,
    selectedTypes,
    setSelectedTypes,
  };
}
