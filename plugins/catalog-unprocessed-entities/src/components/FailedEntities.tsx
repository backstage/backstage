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
import React from 'react';

import {
  ErrorPanel,
  MarkdownContent,
  Progress,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { BackstageThemeOptions } from '@backstage/theme';
import { Box, Typography, makeStyles } from '@material-ui/core';

import { UnprocessedEntity } from '../types';
import { EntityDialog } from './EntityDialog';
import { catalogUnprocessedEntitiesApiRef } from '../api';
import useAsync from 'react-use/lib/useAsync';

const useStyles = makeStyles((theme: BackstageThemeOptions) => ({
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
          {rowData.unprocessed_entity.metadata.tags?.map(t => (
            <li>{t}</li>
          ))}
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

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ErrorPanel error={error} />;
  }

  const columns: TableColumn[] = [
    {
      title: <Typography>entityRef</Typography>,
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).entity_ref,
    },
    {
      title: <Typography>Kind</Typography>,
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).unprocessed_entity.kind,
    },
    {
      title: <Typography>Owner</Typography>,
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).unprocessed_entity.spec?.owner ||
        'unknown',
    },
    {
      title: <Typography>Raw</Typography>,
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
          <Typography className={classes.successMessage}>
            No failed entities found
          </Typography>
        }
        detailPanel={({ rowData }) => {
          const errors = (rowData as UnprocessedEntity).errors;
          return (
            <>
              {errors?.map(e => {
                return (
                  <Box className={classes.errorBox}>
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
    </>
  );
};
