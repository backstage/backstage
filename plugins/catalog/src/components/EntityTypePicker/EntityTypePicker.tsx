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

import React, { useEffect, useMemo, useState } from 'react';
import { capitalize } from 'lodash';
import { useAsync } from 'react-use';
import { Box } from '@material-ui/core';
import { alertApiRef, Select, useApi } from '@backstage/core';
import {
  catalogApiRef,
  DefaultEntityFilters,
  EntityTypeFilter,
  useEntityListProvider,
} from '@backstage/plugin-catalog-react';

export const EntityTypePicker = () => {
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);

  const {
    filters: { kind: kindFilter, type: typeFilter },
    updateFilters,
  } = useEntityListProvider();
  const [types, setTypes] = useState<string[]>([]);

  const kind = useMemo(() => kindFilter?.value, [kindFilter]);

  // Load all valid spec.type values straight from the catalogApi - we want the full set for the
  // selected kinds, not an otherwise filtered set.
  const { error, value: entities } = useAsync(async () => {
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

  useEffect(() => {
    const newTypes = [
      ...new Set(
        (entities ?? []).map(e => e.spec?.type).filter(Boolean) as string[],
      ),
    ].sort();
    setTypes(newTypes);

    updateFilters((oldFilters: DefaultEntityFilters) =>
      oldFilters.type && !newTypes.includes(oldFilters.type.value)
        ? { type: undefined }
        : {},
    );
  }, [updateFilters, entities]);

  if (!types) return null;

  if (error) {
    alertApi.post({
      message: `Failed to load types for ${kind}`,
      severity: 'error',
    });
    return null;
  }

  const items = [
    { value: 'all', label: 'All' },
    ...types.map(type => ({
      value: type,
      label: capitalize(type),
    })),
  ];

  const onChange = (value: any) => {
    updateFilters({ type: new EntityTypeFilter(value) });
  };

  return (
    <Box pb={1} pt={1}>
      <Select
        label="Type"
        items={items}
        selected={typeFilter?.value ?? 'all'}
        onChange={onChange}
      />
    </Box>
  );
};
