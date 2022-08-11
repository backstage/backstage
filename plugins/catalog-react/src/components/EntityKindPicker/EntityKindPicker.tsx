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

import { Select } from '@backstage/core-components';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { Box } from '@material-ui/core';
import capitalize from 'lodash/capitalize';
import sortBy from 'lodash/sortBy';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api';
import { EntityKindFilter } from '../../filters';
import { useEntityList } from '../../hooks';

function useAvailableKinds() {
  const catalogApi = useApi(catalogApiRef);

  const [availableKinds, setAvailableKinds] = useState<string[]>([]);

  const {
    error,
    loading,
    value: facets,
  } = useAsync(async () => {
    const facet = 'kind';
    const items = await catalogApi
      .getEntityFacets({
        facets: [facet],
      })
      .then(response => response.facets[facet] || []);

    return items;
  }, [catalogApi]);

  const facetsRef = useRef(facets);
  useEffect(() => {
    const oldFacets = facetsRef.current;
    facetsRef.current = facets;
    // Delay processing hook until facets load updates have settled to generate list of kinds;
    // This prevents resetting the kind filter due to saved kind value from query params not matching the
    // empty set of kind values while values are still being loaded; also only run this hook on changes
    // to facets
    if (loading || oldFacets === facets || !facets) {
      return;
    }

    const newKinds = [
      ...new Set(
        sortBy(facets, f => f.value).map(f =>
          f.value.toLocaleLowerCase('en-US'),
        ),
      ),
    ];

    setAvailableKinds(newKinds);
  }, [loading, facets, setAvailableKinds]);

  return { loading, error, availableKinds };
}

function useEntityKindFilter(opts: { initialFilter: string }): {
  loading: boolean;
  error?: Error;
  availableKinds: string[];
  selectedKind: string;
  setSelectedKind: (kind: string) => void;
} {
  const {
    filters,
    queryParameters: { kind: kindParameter },
    updateFilters,
  } = useEntityList();

  const flattenedQueryKind = useMemo(
    () => [kindParameter].flat()[0],
    [kindParameter],
  );

  const [selectedKind, setSelectedKind] = useState(
    flattenedQueryKind ?? filters.kind?.value ?? opts.initialFilter,
  );

  // Set selected kinds on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (flattenedQueryKind) {
      setSelectedKind(flattenedQueryKind);
    }
  }, [flattenedQueryKind]);

  // Set selected kind from filters; this happens when the kind filter is
  // updated from another component
  useEffect(() => {
    if (filters.kind?.value) {
      setSelectedKind(filters.kind?.value);
    }
  }, [filters.kind]);

  const { availableKinds, loading, error } = useAvailableKinds();

  useEffect(() => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : undefined,
    });
  }, [selectedKind, updateFilters]);

  return {
    loading,
    error,
    availableKinds,
    selectedKind,
    setSelectedKind,
  };
}

/**
 * Props for {@link EntityKindPicker}.
 *
 * @public
 */
export interface EntityKindPickerProps {
  initialFilter?: string;
  hidden?: boolean;
}

/** @public */
export const EntityKindPicker = (props: EntityKindPickerProps) => {
  const { hidden, initialFilter = 'component' } = props;

  const alertApi = useApi(alertApiRef);

  const { error, availableKinds, selectedKind, setSelectedKind } =
    useEntityKindFilter({
      initialFilter: initialFilter,
    });

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load entity kinds`,
        severity: 'error',
      });
    }
    if (initialFilter) {
      setSelectedKind(initialFilter);
    }
  }, [error, alertApi, initialFilter, setSelectedKind]);

  if (availableKinds?.length === 0 || error) return null;

  const items = [
    ...availableKinds.map((kind: string) => ({
      value: kind,
      label: capitalize(kind),
    })),
  ];

  return hidden ? null : (
    <Box pb={1} pt={1}>
      <Select
        label="Kind"
        items={items}
        selected={selectedKind}
        onChange={value => setSelectedKind(String(value))}
      />
    </Box>
  );
};
