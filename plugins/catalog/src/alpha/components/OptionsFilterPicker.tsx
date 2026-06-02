/*
 * Copyright 2025 The Backstage Authors
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

import { useEffect, useMemo, useState } from 'react';
import { useApiHolder } from '@backstage/core-plugin-api';
import { Select } from '@backstage/ui';
import {
  useEntityList,
  type DefaultEntityFilters,
} from '@backstage/plugin-catalog-react';
import type { CatalogOptionsFilterDescriptor } from '@backstage/plugin-catalog-react/alpha';
import type { EntityFilter } from '@backstage/plugin-catalog-react';
import { multiSelectProps } from './multiSelectProps';

type DynamicEntityFilters = DefaultEntityFilters & {
  [key: string]: EntityFilter | undefined;
};

/** @internal */
export function OptionsFilterPicker(
  props: CatalogOptionsFilterDescriptor & { filterKey: string },
) {
  const { label, mode, defaultValue, options, deps, toFilter, filterKey } =
    props;
  const apiHolder = useApiHolder();
  const { updateFilters, queryParameters } =
    useEntityList<DynamicEntityFilters>();

  const resolvedDeps = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(deps).map(([key, ref]) => [key, apiHolder.get(ref)]),
      ),
    [deps, apiHolder],
  );

  const queryParam = useMemo(
    () =>
      [queryParameters[filterKey as keyof typeof queryParameters]]
        .flat()
        .filter(Boolean) as string[],
    [queryParameters, filterKey],
  );

  const initial = useMemo(() => {
    if (queryParam.length) return queryParam;
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  }, [queryParam, defaultValue]);

  const [selected, setSelected] = useState<string[]>(initial);

  useEffect(() => {
    if (queryParam.length) {
      setSelected(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    let cancelled = false;

    if (!selected.length) {
      updateFilters({ [filterKey]: undefined });
      return undefined;
    }

    const applyFilter = (filter: EntityFilter | undefined) => {
      if (cancelled) return;
      if (filter && !filter.toQueryValue) {
        filter.toQueryValue = () => selected;
      }
      updateFilters({ [filterKey]: filter });
    };

    const result = toFilter(selected, resolvedDeps);
    if (result instanceof Promise) {
      result.then(applyFilter, () => {
        if (!cancelled) {
          updateFilters({ [filterKey]: undefined });
        }
      });
    } else {
      applyFilter(result);
    }

    return () => {
      cancelled = true;
    };
  }, [selected, filterKey, toFilter, resolvedDeps, updateFilters]);

  const selectOptions = options.map(o => ({ label: o.label, value: o.value }));

  if (mode === 'single') {
    return (
      <Select
        label={label}
        selectionMode="single"
        options={selectOptions}
        selectedKey={selected[0] ?? null}
        onSelectionChange={key => setSelected(key ? [String(key)] : [])}
      />
    );
  }

  return (
    <Select
      label={label}
      selectionMode="multiple"
      options={selectOptions}
      {...multiSelectProps(selected, setSelected)}
    />
  );
}
