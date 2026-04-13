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

import { Link, SubvalueCell, TableColumn } from '@backstage/core-components';
import {
  EntityPresentationApi,
  EntityRefLinks,
  entityPresentationSnapshot,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { DocsTableRow } from './types';

function customTitle(
  entity: Entity,
  entityPresentationApi?: EntityPresentationApi,
): string {
  return entityPresentationSnapshot(entity, undefined, entityPresentationApi)
    .primaryTitle;
}

/**
 * Not directly exported, but through DocsTable.columns and EntityListDocsTable.columns
 *
 * @public
 */
export const columnFactories = {
  createTitleColumn(
    options?: { hidden?: boolean },
    entityPresentationApi?: EntityPresentationApi,
  ): TableColumn<DocsTableRow> {
    const nameCol = columnFactories.createNameColumn(entityPresentationApi);
    return {
      ...nameCol,
      field: 'entity.metadata.title',
      hidden: options?.hidden,
    };
  },
  createNameColumn(
    entityPresentationApi?: EntityPresentationApi,
  ): TableColumn<DocsTableRow> {
    return {
      title: 'Document',
      field: 'entity.metadata.name',
      highlight: true,
      searchable: true,
      defaultSort: 'asc',
      customFilterAndSearch: (filter, row) => {
        const title = customTitle(
          row.entity,
          entityPresentationApi,
        ).toLocaleLowerCase();
        return title.includes(filter.toLocaleLowerCase());
      },
      customSort: (row1, row2) => {
        const title1 = customTitle(
          row1.entity,
          entityPresentationApi,
        ).toLocaleLowerCase();
        const title2 = customTitle(
          row2.entity,
          entityPresentationApi,
        ).toLocaleLowerCase();
        return title1.localeCompare(title2);
      },
      render: (row: DocsTableRow) => (
        <SubvalueCell
          value={
            <Link to={row.resolved.docsUrl}>
              {customTitle(row.entity, entityPresentationApi)}
            </Link>
          }
          subvalue={row.entity.metadata.description}
        />
      ),
    };
  },
  createOwnerColumn(): TableColumn<DocsTableRow> {
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
  },
  createKindColumn(): TableColumn<DocsTableRow> {
    return {
      title: 'Kind',
      field: 'entity.kind',
    };
  },
  createTypeColumn(): TableColumn<DocsTableRow> {
    return {
      title: 'Type',
      field: 'entity.spec.type',
    };
  },
};

export const createDefaultColumns = (
  entityPresentationApi?: EntityPresentationApi,
): TableColumn<DocsTableRow>[] => [
  columnFactories.createTitleColumn({ hidden: true }, entityPresentationApi),
  columnFactories.createNameColumn(entityPresentationApi),
  columnFactories.createOwnerColumn(),
  columnFactories.createKindColumn(),
  columnFactories.createTypeColumn(),
];

export const defaultColumns: TableColumn<DocsTableRow>[] =
  createDefaultColumns();
