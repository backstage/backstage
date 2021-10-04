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

import React, { useEffect } from 'react';
import capitalize from 'lodash/capitalize';
import { Box } from '@material-ui/core';
import { useEntityTypeFilter } from '../../hooks/useEntityTypeFilter';

import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { Select } from '@backstage/core-components';

export const EntityTypePicker = () => {
  const alertApi = useApi(alertApiRef);
  const { error, availableTypes, selectedTypes, setSelectedTypes } =
    useEntityTypeFilter();

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load entity types`,
        severity: 'error',
      });
    }
  }, [error, alertApi]);

  if (availableTypes.length === 0 || error) return null;

  const items = [
    { value: 'all', label: 'All' },
    ...availableTypes.map((type: string) => ({
      value: type,
      label: capitalize(type),
    })),
  ];

  return (
    <Box pb={1} pt={1}>
      <Select
        label="Type"
        items={items}
        selected={(items.length > 1 ? selectedTypes[0] : undefined) ?? 'all'}
        onChange={value =>
          setSelectedTypes(value === 'all' ? [] : [String(value)])
        }
      />
    </Box>
  );
};
