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

import React from 'react';
import { Chip } from '@material-ui/core';
import { EntityRow } from '../src/components/ApiExplorerTable/defaults';
import { TableFilter } from '@backstage/core';

const domainColumn = { title: 'Domain', field: 'entity.metadata.domain' };
const capabilitiesColumn = {
  title: 'Capabilities',
  field: 'entity.metadata.capabilities',
  cellStyle: {
    padding: '0px 16px 0px 20px',
  },
  render: ({ entity }: EntityRow) => (
    <>
      {entity.metadata.capabilities &&
        (entity.metadata.capabilities as string[]).map(t => (
          <Chip
            key={t}
            label={t}
            size="small"
            variant="outlined"
            style={{ marginBottom: '0px' }}
          />
        ))}
    </>
  ),
};

export const customColumns = [
  'Name',
  'Description',
  'Owner',
  'Lifecycle',
  'Type',
  domainColumn,
  capabilitiesColumn,
];
export const customFilters = [
  'Owner',
  'Type',
  'Lifecycle',
  { column: 'Domain', type: 'select' } as TableFilter,
];

