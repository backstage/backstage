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
import { EntityRefLink, EntityRefLinks } from '@backstage/plugin-catalog-react';
import { Chip } from '@material-ui/core';
import { CustomColumn, CustomFilter } from './types';
import { ApiTypeTitle } from '../ApiDefinitionCard';

export const defaultColumns: CustomColumn = {
  name: {
    title: 'Name',
    field: 'resolved.name',
    highlight: true,
    render: ({ entity }) => (
      <EntityRefLink entityRef={entity} defaultKind="API" />
    ),
  },
  system: {
    title: 'System',
    field: 'resolved.partOfSystemRelationTitle',
    render: ({ resolved }) => (
      <EntityRefLinks
        entityRefs={resolved.partOfSystemRelations}
        defaultKind="system"
      />
    ),
  },
  owner: {
    title: 'Owner',
    field: 'resolved.ownedByRelationsTitle',
    render: ({ resolved }) => (
      <EntityRefLinks
        entityRefs={resolved.ownedByRelations}
        defaultKind="group"
      />
    ),
  },
  lifecycle: {
    title: 'Lifecycle',
    field: 'entity.spec.lifecycle',
  },
  type: {
    title: 'Type',
    field: 'entity.spec.type',
    render: ({ entity }) => <ApiTypeTitle apiEntity={entity} />,
  },
  description: {
    title: 'Description',
    field: 'entity.metadata.description',
  },
  tags: {
    title: 'Tags',
    field: 'entity.metadata.tags',
    cellStyle: {
      padding: '0px 16px 0px 20px',
    },
    render: ({ entity }) => (
      <>
        {entity.metadata.tags &&
          entity.metadata.tags.map(t => (
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
  },
};

export const defaultFilters: CustomFilter = {
  owner: {
    column: 'Owner',
    type: 'select',
  },
  type: {
    column: 'Type',
    type: 'multiple-select',
  },
  lifecycle: {
    column: 'Lifecycle',
    type: 'multiple-select',
  },
  tags: {
    column: 'Tags',
    type: 'checkbox-tree',
  },
};
