/*
 * Copyright 2023 The Backstage Authors
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
  ErrorPanel,
  Progress,
  TableColumn,
  Table,
} from '@backstage/core-components';
import { Alert, Text } from '@backstage/ui';

import { entityRefFilterAndSearch } from './filterEntities';
import { EntityDialog } from './EntityDialog';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { catalogUnprocessedEntitiesApiRef } from '../api';
import { UnprocessedEntity } from '@backstage/plugin-catalog-unprocessed-entities-common';

export const PendingEntities = () => {
  const unprocessedApi = useApi(catalogUnprocessedEntitiesApiRef);
  const {
    loading,
    error,
    value: data,
  } = useAsync(async () => await unprocessedApi.pending());

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ErrorPanel error={error} />;
  }

  const columns: TableColumn[] = [
    {
      title: <Text>entityRef</Text>,
      sorting: true,
      field: 'entity_ref',
      customFilterAndSearch: (query, row) =>
        entityRefFilterAndSearch(query, row),
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).entity_ref || '-',
    },
    {
      title: <Text>Kind</Text>,
      sorting: true,
      field: 'unprocessed_entity.kind',
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).unprocessed_entity.kind || '-',
    },
    {
      title: <Text>Owner</Text>,
      sorting: true,
      field: 'unprocessed_entity.spec.owner',
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).unprocessed_entity.spec?.owner ||
        'unknown',
    },
    {
      title: <Text>Raw</Text>,
      sorting: false,
      render: (rowData: UnprocessedEntity | {}) => (
        <EntityDialog entity={rowData as UnprocessedEntity} />
      ),
    },
  ];
  return (
    <>
      <Table
        options={{ pageSize: 20, search: true }}
        columns={columns}
        data={data?.entities || []}
        emptyContent={
          <Alert
            status="info"
            title="No pending entities found"
            style={{ placeSelf: 'center', margin: 'var(--bui-space-4)' }}
          />
        }
      />
    </>
  );
};
