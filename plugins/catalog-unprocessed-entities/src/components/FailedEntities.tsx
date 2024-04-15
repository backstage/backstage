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
  MarkdownContent,
  Progress,
  Table,
  TableColumn,
} from '@backstage/core-components';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

import { UnprocessedEntity } from '../types';
import { EntityDialog } from './EntityDialog';
import { catalogUnprocessedEntitiesApiRef } from '../api';
import useAsync from 'react-use/esm/useAsync';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme: Theme) => ({
  errorBox: {
    color: theme.palette.status.error,
    backgroundColor: theme.palette.errorBackground,
    padding: '1em',
    margin: '1em',
    border: `1px solid ${theme.palette.status.error}`,
  },
  errorTitle: {
    width: '100%',
    fontWeight: 'bold',
  },
  successMessage: {
    background: theme.palette.infoBackground,
    color: theme.palette.infoText,
    padding: theme.spacing(2),
  },
}));

const RenderErrorContext = ({
  error,
  rowData,
}: {
  error: { message: string };
  rowData: UnprocessedEntity;
}) => {
  if (error.message.includes('tags.')) {
    return (
      <>
        <Typography>Tags</Typography>
        <ul>
          {rowData.unprocessed_entity.metadata.tags?.map(t => <li>{t}</li>)}
        </ul>
      </>
    );
  }

  if (error.message.includes('metadata.name')) {
    return (
      <>
        <Typography>Name</Typography>
        <Typography variant="caption">
          {rowData.unprocessed_entity.metadata.name}
        </Typography>
      </>
    );
  }

  return null;
};

export const FailedEntities = () => {
  const classes = useStyles();
  const unprocessedApi = useApi(catalogUnprocessedEntitiesApiRef);
  const {
    loading,
    error,
    value: data,
  } = useAsync(async () => await unprocessedApi.failed());
  const [, setSelectedSearchTerm] = useState<string>('');
  const unprocessedEntityApi = useApi(catalogUnprocessedEntitiesApiRef);
  const alertApi = useApi(alertApiRef);

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ErrorPanel error={error} />;
  }

  const handleDelete = async ({
    entityId,
    entityRef,
  }: {
    entityId: string;
    entityRef: string;
  }) => {
    try {
      await unprocessedEntityApi.delete(entityId);
      alertApi.post({
        message: `Entity ${entityRef} has been deleted`,
        severity: 'success',
      });
    } catch (e) {
      alertApi.post({
        message: `Ran into an issue when deleting ${entityRef}. Please try again later.`,
        severity: 'error',
      });
    }
  };

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
    {
      title: <Typography>Actions</Typography>,
      render: (rowData: UnprocessedEntity | {}) => {
        const { entity_id, entity_ref } = rowData as UnprocessedEntity;

        return (
          <IconButton
            aria-label="delete"
            onClick={async () =>
              await handleDelete({
                entityId: entity_id,
                entityRef: entity_ref,
              })
            }
          >
            <DeleteIcon fontSize="small" data-testid="delete-icon" />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Table
      options={{ pageSize: 20, search: true }}
      columns={columns}
      data={data?.entities ?? []}
      emptyContent={
        <Typography className={classes.successMessage}>
          No failed entities found
        </Typography>
      }
      onSearchChange={(searchTerm: string) => setSelectedSearchTerm(searchTerm)}
      detailPanel={({ rowData }) => {
        const errors = (rowData as UnprocessedEntity).errors;
        return (
          <>
            {errors?.map((e, idx) => {
              return (
                <Box key={idx} className={classes.errorBox}>
                  <Typography className={classes.errorTitle}>
                    {e.name}
                  </Typography>
                  <MarkdownContent content={e.message} />
                  <RenderErrorContext
                    error={e}
                    rowData={rowData as UnprocessedEntity}
                  />
                </Box>
              );
            })}
          </>
        );
      }}
    />
  );
};
