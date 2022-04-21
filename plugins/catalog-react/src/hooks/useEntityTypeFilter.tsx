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
import useAsync from 'react-use/lib/useAsync';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '../api';
import { useEntityList } from './useEntityListProvider';
import { EntityTypeFilter } from '../filters';

/**
 * A hook built on top of `useEntityList` for enabling selection of valid `spec.type` values
 * based on the selected EntityKindFilter.
 * @public
 */
export function useEntityTypeFilter(): {
  loading: boolean;
  error?: Error;
  availableTypes: string[];
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
} {
  const catalogApi = useApi(catalogApiRef);
  const {
    filters: { kind: kindFilter, type: typeFilter },
    queryParameters: { type: typeParameter },
    updateFilters,
  } = useEntityList();

  const flattenedQueryTypes = useMemo(
    () => [typeParameter].flat().filter(Boolean) as string[],
    [typeParameter],
  );

  const [selectedTypes, setSelectedTypes] = useState(
    flattenedQueryTypes.length
      ? flattenedQueryTypes
      : typeFilter?.getTypes() ?? [],
  );

  // Set selected types on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (flattenedQueryTypes.length) {
      setSelectedTypes(flattenedQueryTypes);
    }
  }, [flattenedQueryTypes]);

  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const kind = useMemo(() => kindFilter?.value, [kindFilter]);

  // Load all valid spec.type values straight from the catalogApi, paying attention to only the
  // kind filter for a complete list.
  const {
    error,
    loading,
    value: facets,
  } = useAsync(async () => {
    if (kind) {
      const items = await catalogApi
        .getEntityFacets({
          filter: { kind },
          facets: ['spec.type'],
        })
        .then(response => response.facets['spec.type'] || []);
      return items;
    }
    return [];
  }, [kind, catalogApi]);

  const facetsRef = useRef(facets);
  useEffect(() => {
    const oldFacets = facetsRef.current;
    facetsRef.current = facets;
    // Delay processing hook until kind and facets load updates have settled to generate list of types;
    // This prevents resetting the type filter due to saved type value from query params not matching the
    // empty set of type values while values are still being loaded; also only run this hook on changes
    // to facets
    if (loading || !kind || oldFacets === facets || !facets) {
      return;
    }

    // Sort by facet count descending, so the most common types appear on top
    const newTypes = sortBy(facets, f => -f.count).map(f => f.value);
    setAvailableTypes(newTypes);

    // Update type filter to only valid values when the list of available types has changed
    const stillValidTypes = selectedTypes.filter(value =>
      newTypes.includes(value),
    );
    if (!isEqual(selectedTypes, stillValidTypes)) {
      setSelectedTypes(stillValidTypes);
    }
  }, [loading, kind, selectedTypes, setSelectedTypes, facets]);

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
