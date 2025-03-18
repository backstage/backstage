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
import Box from '@material-ui/core/Box';
import React, { useEffect, useMemo, useState } from 'react';
import { EntityKindFilter } from '../../filters';
import { useEntityList } from '../../hooks';
import { filterKinds, useAllKinds } from './kindFilterUtils';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

function useEntityKindFilter(opts: { initialFilter: string }): {
  loading: boolean;
  error?: Error;
  allKinds: Map<string, string>;
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

  const { allKinds, loading, error } = useAllKinds();
  const selectedKindLabel = allKinds.get(selectedKind) || selectedKind;

  useEffect(() => {
    updateFilters({
      kind: selectedKind
        ? new EntityKindFilter(selectedKind, selectedKindLabel)
        : undefined,
    });
  }, [selectedKind, selectedKindLabel, updateFilters]);

  return {
    loading,
    error,
    allKinds,
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
  /**
   * Entity kinds to show in the dropdown; by default all kinds are fetched from the catalog and
   * displayed.
   */
  allowedKinds?: string[];
  initialFilter?: string;
  hidden?: boolean;
}

/** @public */
export const EntityKindPicker = (props: EntityKindPickerProps) => {
  const { allowedKinds, hidden, initialFilter = 'component' } = props;
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const alertApi = useApi(alertApiRef);

  const { error, allKinds, selectedKind, setSelectedKind } =
    useEntityKindFilter({
      initialFilter: initialFilter,
    });

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: t('entityKindPicker.errorMessage'),
        severity: 'error',
      });
    }
  }, [error, alertApi, t]);

  if (error) return null;

  const options = filterKinds(allKinds, allowedKinds, selectedKind);

  const items = [...options.entries()].map(([key, value]) => ({
    label: value,
    value: key,
  }));

  return hidden ? null : (
    <Box pb={1} pt={1}>
      <Select
        label={t('entityKindPicker.title')}
        items={items}
        selected={selectedKind.toLocaleLowerCase('en-US')}
        onChange={value => setSelectedKind(String(value))}
      />
    </Box>
  );
};
