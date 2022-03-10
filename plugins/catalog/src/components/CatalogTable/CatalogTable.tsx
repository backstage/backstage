/*
 * Copyright 2020 The Backstage Authors
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
  Entity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  humanizeEntityRef,
  getEntityRelations,
  useEntityList,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { capitalize } from 'lodash';
import React, { useMemo } from 'react';
import { columnFactories } from './columns';
import { CatalogTableRow } from './types';
import { Table, TableColumn, TableProps } from '@backstage/core-components';
import { useDefaultCatalogTableActions } from '../defaultActions';
import { CatalogError } from '../CatalogError';

/**
 * Props for {@link CatalogTable}.
 *
 * @public
 */
export interface CatalogTableProps {
  columns?: TableColumn<CatalogTableRow>[];
  actions?: TableProps<CatalogTableRow>['actions'];
}

export const entityTransformer = (entity: Entity) => {
  const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'system',
  });
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

  return {
    entity,
    resolved: {
      name: humanizeEntityRef(entity, {
        defaultKind: 'Component',
      }),
      ownedByRelationsTitle: ownedByRelations
        .map(r => humanizeEntityRef(r, { defaultKind: 'group' }))
        .join(', '),
      ownedByRelations,
      partOfSystemRelationTitle: partOfSystemRelations
        .map(r =>
          humanizeEntityRef(r, {
            defaultKind: 'system',
          }),
        )
        .join(', '),
      partOfSystemRelations,
    },
  };
};

/** @public */
export const CatalogTable = (props: CatalogTableProps) => {
  const { columns, actions } = props;
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const { loading, error, entities, filters } = useEntityList();
  const { defaultActions } = useDefaultCatalogTableActions<CatalogTableRow>({
    isStarredEntity,
    toggleStarredEntity,
  });

  const defaultColumns: TableColumn<CatalogTableRow>[] = useMemo(
    () => [
      columnFactories.createNameColumn({ defaultKind: filters.kind?.value }),
      columnFactories.createSystemColumn(),
      columnFactories.createOwnerColumn(),
      columnFactories.createSpecTypeColumn(),
      columnFactories.createSpecLifecycleColumn(),
      columnFactories.createMetadataDescriptionColumn(),
      columnFactories.createTagsColumn(),
    ],
    [filters.kind?.value],
  );

  const showTypeColumn = filters.type === undefined;
  // TODO(timbonicus): remove the title from the CatalogTable once using EntitySearchBar
  const titlePreamble = capitalize(filters.user?.value ?? 'all');

  if (error) {
    return <CatalogError error={error} />;
  }

  const rows = entities.map(entityTransformer);

  const typeColumn = (columns || defaultColumns).find(c => c.title === 'Type');
  if (typeColumn) {
    typeColumn.hidden = !showTypeColumn;
  }
  const showPagination = rows.length > 20;

  return (
    <Table<CatalogTableRow>
      isLoading={loading}
      columns={columns || defaultColumns}
      options={{
        paging: showPagination,
        pageSize: 20,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        showEmptyDataSourceMessage: !loading,
        padding: 'dense',
        pageSizeOptions: [20, 50, 100],
      }}
      title={`${titlePreamble} (${entities.length})`}
      data={rows}
      actions={actions || defaultActions}
    />
  );
};

CatalogTable.columns = columnFactories;
