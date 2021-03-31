/*
 * Copyright 2020 Spotify AB
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
import { TableColumn } from '@backstage/core';
import { EntityRefLink, EntityRefLinks } from '@backstage/plugin-catalog-react';
import { Chip } from '@material-ui/core';
import { EntityRow } from './types';
import { ApiTypeTitle } from '../ApiDefinitionCard';

export function createApiEntityRefColumn(): TableColumn<EntityRow> {
  return {
    title: 'Name',
    field: 'resolved.name',
    highlight: true,
    render: ({ entity }) => (
      <EntityRefLink entityRef={entity} defaultKind="API" />
    ),
  };
}

export function createSystemColumn(): TableColumn<EntityRow> {
  return {
    title: 'System',
    field: 'resolved.partOfSystemRelationTitle',
    render: ({ resolved }) => (
      <EntityRefLinks
        entityRefs={resolved.partOfSystemRelations}
        defaultKind="system"
      />
    ),
  };
}

export function createOwnerColumn(): TableColumn<EntityRow> {
  return {
    title: 'Owner',
    field: 'resolved.ownedByRelationsTitle',
    render: ({ resolved }) => (
      <EntityRefLinks
        entityRefs={resolved.ownedByRelations}
        defaultKind="group"
      />
    ),
  };
}

export function createLifecycleColumn(): TableColumn<EntityRow> {
  return {
    title: 'Lifecycle',
    field: 'entity.spec.lifecycle',
  };
}

export function createDescriptionColumn(): TableColumn<EntityRow> {
  return {
    title: 'Description',
    field: 'entity.metadata.description',
  };
}

export function createApiTypeColumn(): TableColumn<EntityRow> {
  return {
    title: 'Type',
    field: 'entity.spec.type',
    render: ({ entity }) => <ApiTypeTitle apiEntity={entity} />,
  };
}

export function createApiTagsColumn(): TableColumn<EntityRow> {
  return {
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
  };
}
