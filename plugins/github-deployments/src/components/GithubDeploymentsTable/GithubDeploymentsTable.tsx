/*
 * Copyright 2021 Spotify AB
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
  StatusPending,
  StatusRunning,
  StatusOK,
  Table,
  TableColumn,
  StatusAborted,
  StatusError,
} from '@backstage/core';
import { GithubDeployment } from '../../api';
import { DateTime } from 'luxon';
import { Box, Typography, Link, makeStyles } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const statusIndicator = (value: string): React.ReactNode => {
  switch (value) {
    case 'PENDING':
      return <StatusPending />;
    case 'IN_PROGRESS':
      return <StatusRunning />;
    case 'ACTIVE':
      return <StatusOK />;
    case 'ERROR':
    case 'FAILURE':
      return <StatusError />;
    default:
      return <StatusAborted />;
  }
};

const columns: TableColumn<GithubDeployment>[] = [
  {
    title: 'Environment',
    field: 'environment',
    highlight: true,
  },
  {
    title: 'Status',
    render: (row: GithubDeployment): React.ReactNode => (
      <Box display="flex" alignItems="center">
        {statusIndicator(row.state)}
        <Typography variant="caption">{row.state}</Typography>
      </Box>
    ),
  },
  {
    title: 'Commit',
    render: (row: GithubDeployment): React.ReactNode => (
      <Link href={row.commit.commitUrl} target="_blank" rel="noopener">
        {row.commit.abbreviatedOid}
      </Link>
    ),
  },
  {
    title: 'Last Updated',
    render: (row: GithubDeployment): React.ReactNode =>
      DateTime.fromISO(row.updatedAt).toRelative({ locale: 'en' }),
  },
];

type GithubDeploymentsTableProps = {
  deployments: GithubDeployment[];
  isLoading: boolean;
  reload: () => void;
  extraColumns: TableColumn<GithubDeployment>[];
};

const GithubDeploymentsTable = ({
  deployments,
  isLoading,
  reload,
  extraColumns,
}: GithubDeploymentsTableProps) => {
  const classes = useStyles();

  return (
    <Table
      columns={[...columns, ...extraColumns]}
      options={{ padding: 'dense', paging: true, search: false, pageSize: 5 }}
      title="GitHub Deployments"
      data={deployments}
      isLoading={isLoading}
      actions={[
        {
          icon: () => <SyncIcon />,
          tooltip: 'Reload',
          isFreeAction: true,
          onClick: () => reload(),
        },
      ]}
      emptyContent={
        <div className={classes.empty}>
          <Typography variant="body1">
            No deployments found for this entity.
          </Typography>
        </div>
      }
    />
  );
};

export default GithubDeploymentsTable;
