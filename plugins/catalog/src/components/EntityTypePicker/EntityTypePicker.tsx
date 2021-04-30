/*
 * Copyright 2021 Spotify AB
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

import React, { useCallback, useEffect, useState } from 'react';
import { capitalize } from 'lodash';
import { Box } from '@material-ui/core';
import { Select, useApi } from '@backstage/core';
import {
  catalogApiRef,
  EntityTypeFilter,
  useEntityListProvider,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

export const EntityTypePicker = () => {
  const catalogApi = useApi(catalogApiRef);
  const { filters, removeFilter, addFilter } = useEntityListProvider();
  const [types, setTypes] = useState<string[]>([]);

  const kindFilter = filters.find(f => f.id === 'kind');

  // Load all valid spec.type values straight from the catalogApi - we want the full set for the
  // selected kinds, not an otherwise filtered set.
  useEffect(() => {
    async function loadTypesForKinds() {
      removeFilter('type');
      if (kindFilter) {
        const response = await catalogApi.getEntities({
          filter: kindFilter.getCatalogFilters!(),
          fields: ['spec.type'],
        });
        const entities: Entity[] = response.items ?? [];
        setTypes(
          [
            ...new Set(
              entities.map(e => e.spec?.type).filter(Boolean) as string[],
            ),
          ].sort(),
        );
      }
    }
    loadTypesForKinds();
  }, [catalogApi, kindFilter, removeFilter]);

  const all = 'all';
  const onChange = useCallback(
    (value: any) =>
      value === all
        ? removeFilter('type')
        : addFilter(new EntityTypeFilter(value)),
    [removeFilter, addFilter],
  );

  if (!kindFilter) return null;

  const items = [
    { value: all, label: 'All' },
    ...types.map(type => ({
      value: type,
      label: capitalize(type),
    })),
  ];

  return (
    <Box pb={1} pt={1}>
      <Select label="Type" items={items} selected={all} onChange={onChange} />
    </Box>
  );
};
