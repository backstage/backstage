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

import React from 'react';
import { Link, SubvalueCell, TableColumn } from '@backstage/core-components';
import { EntityRefLinks } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { DocsTableRow } from './types';

function customTitle(entity: Entity): string {
  return entity.metadata.title || entity.metadata.name;
}

export function createNameColumn(): TableColumn<DocsTableRow> {
  return {
    title: 'Document',
    field: 'entity.metadata.name',
    highlight: true,
    render: (row: DocsTableRow) => (
      <SubvalueCell
        value={<Link to={row.resolved.docsUrl}>{customTitle(row.entity)}</Link>}
        subvalue={row.entity.metadata.description}
      />
    ),
  };
}

export function createOwnerColumn(): TableColumn<DocsTableRow> {
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

export function createTypeColumn(): TableColumn<DocsTableRow> {
  return {
    title: 'Type',
    field: 'entity.spec.type',
  };
}
