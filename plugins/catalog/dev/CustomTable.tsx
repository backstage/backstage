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
import { useAsync } from 'react-use';
import { Chip } from '@material-ui/core';
import {
  catalogApiRef,
  EntityRefLink,
  EntityRefLinks,
  formatEntityRefTitle,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { RELATION_OWNED_BY, RELATION_PART_OF } from '@backstage/catalog-model';
import {
  CodeSnippet,
  OverflowTooltip,
  Table,
  TableColumn,
  TableFilter,
  useApi,
  WarningPanel,
} from '@backstage/core';
import { EntityRow } from '../src/components/CatalogTable/types';
import {CatalogBaseTableProps} from '../src/components/CatalogPage/CatalogPageBase';

const columns: TableColumn<EntityRow>[] = [
  {
    title: 'Name',
    field: 'resolved.name',
    highlight: true,
    render: ({ entity }) => (
      <EntityRefLink entityRef={entity} defaultKind="Component" />
    ),
  },
  {
    title: 'Owner',
    field: 'resolved.ownedByRelationsTitle',
    render: ({ resolved }) => (
      <EntityRefLinks
        entityRefs={resolved.ownedByRelations}
        defaultKind="group"
      />
    ),
  },
  {
    title: 'Lifecycle',
    field: 'entity.spec.lifecycle',
  },
  {
    title: 'Description',
    field: 'entity.metadata.description',
    render: ({ entity }) => (
      <OverflowTooltip
        text={entity.metadata.description}
        placement="bottom-start"
      />
    ),
    width: 'auto',
  },
  {
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
];
const filters: TableFilter[] = [
  {
    column: 'Owner',
    type: 'select',
  },
  {
    column: 'Type',
    type: 'multiple-select',
  },
  {
    column: 'Lifecycle',
    type: 'multiple-select',
  },
  {
    column: 'Tags',
    type: 'checkbox-tree',
  },
];

type CustomTableProps = CatalogBaseTableProps & { useBuiltInFilters?: boolean };

export const CustomTable = ({ useBuiltInFilters = true }: CustomTableProps) => {
  const catalogApi = useApi(catalogApiRef);
  const { loading, error, value: matchingEntities } = useAsync(() => {
    return catalogApi.getEntities({ filter: { kind: 'Component' } });
  }, [catalogApi]);

  if (error) {
    <WarningPanel severity="error" title="Could not fetch catalog entities.">
      <CodeSnippet language="text" text={error.toString()} />
    </WarningPanel>;
  }

  const rows =
    matchingEntities?.items.map(entity => {
      const partOfSystemRelations = getEntityRelations(
        entity,
        RELATION_PART_OF,
        {
          kind: 'system',
        },
      );
      const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

      return {
        entity,
        resolved: {
          name: formatEntityRefTitle(entity, {
            defaultKind: 'Component',
          }),
          ownedByRelationsTitle: ownedByRelations
            .map(r => formatEntityRefTitle(r, { defaultKind: 'group' }))
            .join(', '),
          ownedByRelations,
          partOfSystemRelationTitle: partOfSystemRelations
            .map(r =>
              formatEntityRefTitle(r, {
                defaultKind: 'system',
              }),
            )
            .join(', '),
          partOfSystemRelations,
        },
      };
    }) ?? [];

  return (
    <Table<EntityRow>
      isLoading={loading}
      options={{
        paging: false,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        showEmptyDataSourceMessage: !loading,
        padding: 'dense',
      }}
      data={rows}
      columns={columns}
      filters={useBuiltInFilters ? filters : undefined}
    />
  );
};
