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
import React, { useState } from 'react';

import {
  ErrorPanel,
  Progress,
  TableColumn,
  Table,
} from '@backstage/core-components';
import Typography from '@material-ui/core/Typography';
import { Theme, makeStyles } from '@material-ui/core/styles';

import { UnprocessedEntity } from '../types';

import { EntityDialog } from './EntityDialog';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { catalogUnprocessedEntitiesApiRef } from '../api';

const useStyles = makeStyles((theme: Theme) => ({
  successMessage: {
    background: theme.palette.infoBackground,
    color: theme.palette.infoText,
    padding: theme.spacing(2),
  },
}));

export const PendingEntities = () => {
  const classes = useStyles();
  const unprocessedApi = useApi(catalogUnprocessedEntitiesApiRef);
  const {
    loading,
    error,
    value: data,
  } = useAsync(async () => await unprocessedApi.pending());
  const [, setSelectedSearchTerm] = useState<string>('');

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ErrorPanel error={error} />;
  }

  const columns: TableColumn[] = [
    {
      title: <Typography>entityRef</Typography>,
      sorting: true,
      field: 'entity_ref',
      customFilterAndSearch: (query, row: any) =>
        row.entity_ref
          .toLocaleUpperCase('en-US')
          .includes(query.toLocaleUpperCase('en-US')),
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).entity_ref,
    },
    {
      title: <Typography>Kind</Typography>,
      sorting: true,
      field: 'kind',
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).unprocessed_entity.kind,
    },
    {
      title: <Typography>Owner</Typography>,
      sorting: true,
      field: 'unprocessed_entity.spec.owner',
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).unprocessed_entity.spec?.owner ||
        'unknown',
    },
    {
      title: <Typography>Raw</Typography>,
      sorting: false,
      render: (rowData: UnprocessedEntity | {}) => (
        <EntityDialog entity={rowData as UnprocessedEntity} />
      ),
    },
  ];
  return (
    <>
      <Table
        options={{ pageSize: 20 }}
        columns={columns}
        data={data?.entities || []}
        onSearchChange={(searchTerm: string) =>
          setSelectedSearchTerm(searchTerm)
        }
        emptyContent={
          <Typography className={classes.successMessage}>
            No pending entities found
          </Typography>
        }
      />
    </>
  );
};
