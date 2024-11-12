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
import { useEntityList } from './useEntityListProvider';
import { useEffect, useMemo, useState } from 'react';
import { EntityKindFilter } from '../filters';
import { catalogApiRef } from '../api';
import useAsync from 'react-use/esm/useAsync';
import { useApi } from '@backstage/core-plugin-api';

/**
 * Fetch and return all available kinds.
 */
export function useAllKinds(): {
  loading: boolean;
  error?: Error;
  allKinds: string[];
} {
  const catalogApi = useApi(catalogApiRef);

  const {
    error,
    loading,
    value: allKinds,
  } = useAsync(async () => {
    return await catalogApi
      .getEntityFacets({ facets: ['kind'] })
      .then(response => response.facets.kind?.map(f => f.value).sort() || []);
  }, [catalogApi]);

  return { loading, error, allKinds: allKinds ?? [] };
}

/**
 * A hook built on top of `useAllKinds` for enabling selection of a single Kind.
 * @public
 */
export function useEntityKindFilter(opts: { initialFilter: string }): {
  loading: boolean;
  error?: Error;
  allKinds: string[];
  selectedKind: string;
  setSelectedKind: (kind: string) => void;
} {
  const {
    filters,
    queryParameters: { kind: kindParameter },
    updateFilters,
  } = useEntityList();

  const queryParamKind = useMemo(
    () => [kindParameter].flat()[0],
    [kindParameter],
  );

  const [selectedKind, setSelectedKind] = useState(
    queryParamKind ?? filters.kind?.value ?? opts.initialFilter,
  );

  // Set selected kinds on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamKind) {
      setSelectedKind(queryParamKind);
    }
  }, [queryParamKind]);

  // Set selected kind from filters; this happens when the kind filter is
  // updated from another component
  useEffect(() => {
    if (filters.kind?.value) {
      setSelectedKind(filters.kind?.value);
    }
  }, [filters.kind]);

  useEffect(() => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : undefined,
    });
  }, [selectedKind, updateFilters]);

  const { allKinds, loading, error } = useAllKinds();

  return {
    loading,
    error,
    allKinds: allKinds ?? [],
    selectedKind,
    setSelectedKind,
  };
}
