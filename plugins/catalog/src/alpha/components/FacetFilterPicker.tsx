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
import { useApi } from '@backstage/core-plugin-api';
import { Select } from '@backstage/ui';
import useAsync from 'react-use/esm/useAsync';
import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  useEntityList,
  type DefaultEntityFilters,
} from '@backstage/plugin-catalog-react';
import type { CatalogFacetFilterDescriptor } from '@backstage/plugin-catalog-react/alpha';
import type { EntityFilter } from '@backstage/plugin-catalog-react';
import { multiSelectProps } from './multiSelectProps';

type DynamicEntityFilters = DefaultEntityFilters & {
  [key: string]: EntityFilter | undefined;
};

class FacetEntityFilter implements EntityFilter {
  readonly value: string;
  readonly label: string;

  constructor(readonly path: string, readonly values: string[]) {
    this.value = values[0];
    this.label = values[0];
  }

  getCatalogFilters(): Record<string, string | string[]> {
    return { [this.path]: this.values };
  }

  filterEntity(entity: Entity): boolean {
    const resolved = this.resolve(entity, this.path);
    if (Array.isArray(resolved)) {
      return this.values.every(v => resolved.includes(v));
    }
    if (resolved === null || resolved === undefined) return false;
    return this.values.includes(String(resolved));
  }

  toQueryValue(): string | string[] {
    return this.values.length === 1 ? this.values[0] : this.values;
  }

  private resolve(obj: any, path: string): unknown {
    return path.split('.').reduce((o, key) => o?.[key], obj);
  }
}

/** @internal */
export function FacetFilterPicker(props: CatalogFacetFilterDescriptor) {
  const { label, filterKey, path, mode, defaultValue } = props;
  const catalogApi = useApi(catalogApiRef);
  const { updateFilters, queryParameters } =
    useEntityList<DynamicEntityFilters>();

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

  const { value: availableValues = [] } = useAsync(async () => {
    const { facets } = await catalogApi.getEntityFacets({
      facets: [path],
    });
    return (facets[path] ?? [])
      .map(f => f.value)
      .sort((a, b) =>
        a
          .toLocaleLowerCase('en-US')
          .localeCompare(b.toLocaleLowerCase('en-US')),
      );
  }, [path, catalogApi]);

  useEffect(() => {
    updateFilters({
      [filterKey]: selected.length
        ? new FacetEntityFilter(path, selected)
        : undefined,
    });
    return () => {
      updateFilters({ [filterKey]: undefined });
    };
  }, [selected, filterKey, path, updateFilters]);

  const options = availableValues.map(v => ({ label: v, value: v }));

  if (mode === 'single') {
    return (
      <Select
        label={label}
        selectionMode="single"
        searchable={options.length > 10}
        options={options}
        selectedKey={selected[0] ?? null}
        onSelectionChange={key => setSelected(key ? [String(key)] : [])}
      />
    );
  }

  return (
    <Select
      label={label}
      selectionMode="multiple"
      searchable
      options={options}
      {...multiSelectProps(selected, setSelected)}
    />
  );
}
