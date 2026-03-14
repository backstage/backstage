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
import { useEffect, useMemo, useState } from 'react';
import { EntityKindFilter } from '../../filters';
import { useEntityList } from '../../hooks';
import { filterKinds, useAllKinds } from './kindFilterUtils';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

function useEntityKindFilter(opts: {
  initialFilter: string;
  allFilterEnabled?: boolean;
}): {
  loading: boolean;
  error?: Error;
  allKinds: Map<string, string>;
  selectedKind?: string;
  setSelectedKind: (kind?: string) => void;
} {
  const {
    filters,
    queryParameters: { kind: kindParameter },
    updateFilters,
  } = useEntityList();

  const queryParamKindRaw = useMemo(
    () => [kindParameter].flat()[0],
    [kindParameter],
  );

  const queryParamKind =
    opts.allFilterEnabled && queryParamKindRaw === 'all'
      ? undefined
      : queryParamKindRaw;

  const [selectedKind, setSelectedKind] = useState<string | undefined>(
    queryParamKind ??
      filters.kind?.value ??
      (opts.allFilterEnabled && opts.initialFilter === 'all'
        ? undefined
        : opts.initialFilter),
  );

  // Set selected kinds on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamKind !== undefined) {
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
  const selectedKindLabel =
    selectedKind ? allKinds.get(selectedKind) || selectedKind : '';

  useEffect(() => {
    updateFilters({
      kind:
        selectedKind && (!opts.allFilterEnabled || selectedKind !== 'all')
          ? new EntityKindFilter(selectedKind, selectedKindLabel)
          : undefined,
    });
  }, [selectedKind, selectedKindLabel, opts.allFilterEnabled, updateFilters]);

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
  /**
   * If provided, the picker will start with this value selected. When
   * `allFilterEnabled` is `true`, the special value `'all'` can be used to
   * indicate that no kind filter should be applied. The default is
   * `'component'`.
   */
  initialFilter?: string;
  /**
   * Hide the picker completely (useful when the filter is controlled
   * externally).
   */
  hidden?: boolean;
  /**
   * When true, the dropdown will include an “all” option. Selecting it will
   * clear the kind filter (the underlying `EntityKindFilter` becomes
   * `undefined` and the `kind` query parameter is removed). This is a
   * non-breaking opt‑in feature; the default is `false` so existing callers
   * are unaffected.
   */
  allFilterEnabled?: boolean;
}

/** @public */
export const EntityKindPicker = (props: EntityKindPickerProps) => {
  const { allowedKinds, hidden, initialFilter = 'component', allFilterEnabled = false } = props;
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const alertApi = useApi(alertApiRef);

  const { error, allKinds, selectedKind, setSelectedKind } =
    useEntityKindFilter({
      initialFilter,
      allFilterEnabled,
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

  if (allFilterEnabled) {
    items.unshift({ value: 'all', label: t('entityKindPicker.optionAllTitle') });
  }

  return hidden ? null : (
    <Box pb={1} pt={1}>
      <Select
        label={t('entityKindPicker.title')}
        items={items}
        selected={
          (selectedKind ? selectedKind.toLocaleLowerCase('en-US') : 'all')
        }
        onChange={value =>
          setSelectedKind(
            allFilterEnabled && String(value) === 'all'
              ? undefined
              : String(value),
          )
        }
      />
    </Box>
  );
};
