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

import {
  Link,
  SubvalueCell,
  type TableColumn,
} from '@backstage/core-components';
import {
  EntityDisplayName,
  type EntityPresentationApi,
  entityPresentationApiRef,
  entityPresentationSnapshot,
  EntityRefLinks,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { techdocsTranslationRef } from '../../../translation';
import { DocsTableRow } from './types';
import type { ApiHolder } from '@backstage/core-plugin-api';

function customTitle(
  entity: Entity,
  presentationApi?: EntityPresentationApi,
): string {
  return entityPresentationSnapshot(entity, undefined, presentationApi)
    .primaryTitle;
}

/**
 * Component for translating table column titles
 * @alpha
 */
const TableColumnTitle = ({
  translationKey,
}: {
  translationKey: 'document' | 'owner' | 'kind' | 'type';
}) => {
  const { t } = useTranslationRef(techdocsTranslationRef);
  return <>{t(`table.columns.${translationKey}`)}</>;
};

/**
 * Not directly exported, but through DocsTable.columns and EntityListDocsTable.columns
 *
 * @public
 */
export const columnFactories = {
  createTitleColumn(options?: {
    hidden?: boolean;
    apis?: ApiHolder;
  }): TableColumn<DocsTableRow> {
    const nameCol = columnFactories.createNameColumn({ apis: options?.apis });
    return {
      ...nameCol,
      field: 'entity.metadata.title',
      hidden: options?.hidden,
    };
  },

  createNameColumn(options?: { apis?: ApiHolder }): TableColumn<DocsTableRow> {
    const presentationApi = options?.apis?.get(entityPresentationApiRef);
    return {
      title: <TableColumnTitle translationKey="document" />,
      field: 'entity.metadata.name',
      highlight: true,
      searchable: true,
      defaultSort: 'asc',
      customSort: (row1, row2) => {
        const title1 = customTitle(
          row1.entity,
          presentationApi,
        ).toLocaleLowerCase();
        const title2 = customTitle(
          row2.entity,
          presentationApi,
        ).toLocaleLowerCase();
        return title1.localeCompare(title2);
      },
      customFilterAndSearch: (filter, row) =>
        customTitle(row.entity, presentationApi)
          .toLocaleLowerCase()
          .includes(filter.toLocaleLowerCase()),
      render: (row: DocsTableRow) => (
        <SubvalueCell
          value={
            <Link to={row.resolved.docsUrl}>
              <EntityDisplayName entityRef={row.entity} />
            </Link>
          }
          subvalue={row.entity.metadata.description}
        />
      ),
    };
  },
  createOwnerColumn(): TableColumn<DocsTableRow> {
    return {
      title: <TableColumnTitle translationKey="owner" />,
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
      title: <TableColumnTitle translationKey="kind" />,
      field: 'entity.kind',
    };
  },
  createTypeColumn(): TableColumn<DocsTableRow> {
    return {
      title: <TableColumnTitle translationKey="type" />,
      field: 'entity.spec.type',
    };
  },
};

export const defaultColumns: TableColumn<DocsTableRow>[] = [
  columnFactories.createTitleColumn({ hidden: true }),
  columnFactories.createNameColumn(),
  columnFactories.createOwnerColumn(),
  columnFactories.createKindColumn(),
  columnFactories.createTypeColumn(),
];
