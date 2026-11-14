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

import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Select } from '@backstage/ui';
import { useCallback, useEffect, useMemo } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { catalogGraphTranslationRef } from '../../translation';

/**
 * @public
 * @deprecated The filter is styled with CSS modules and no longer reads theme
 * overrides, so this type has no effect and will be removed.
 */
export type SelectedKindsFilterClassKey = 'formControl';

export type Props = {
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
};

export const SelectedKindsFilter = ({ value, onChange }: Props) => {
  const alertApi = useApi(alertApiRef);
  const catalogApi = useApi(catalogApiRef);
  const { t } = useTranslationRef(catalogGraphTranslationRef);

  const { error, value: kinds } = useAsync(async () => {
    return await catalogApi
      .getEntityFacets({ facets: ['kind'] })
      .then(response => response.facets.kind?.map(f => f.value).sort() || []);
  });

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load entity kinds`,
        severity: 'error',
      });
    }
  }, [error, alertApi]);

  const options = useMemo(
    () => kinds?.map(k => ({ value: k.toLowerCase(), label: k })),
    [kinds],
  );

  // Selecting everything, or nothing, is the same as not filtering by kind
  const handleChange = useCallback(
    (selection: unknown) => {
      const selected = selection as string[];
      onChange(
        !selected.length ||
          (options && options.every(o => selected.includes(o.value)))
          ? undefined
          : selected,
      );
    },
    [options, onChange],
  );

  if (!options?.length || error) {
    return <></>;
  }

  return (
    <Select
      selectionMode="multiple"
      search
      label={t('catalogGraphPage.selectedKindsFilter.title')}
      options={options}
      value={value ?? options.map(o => o.value)}
      onChange={handleChange}
    />
  );
};
