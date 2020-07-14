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
import React, { FC } from 'react';
import { Link, Typography, Box, IconButton } from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Link as RouterLink } from 'react-router-dom';
import {
  StatusError,
  StatusWarning,
  StatusOK,
  StatusPending,
  StatusRunning,
  Table,
  TableColumn,
} from '@backstage/core';
import { useBuilds } from './useBuilds';

export type Build = {
  id: string;
  buildName: string;
  buildUrl?: string;
  source: {
    branchName: string;
    commit: {
      hash: string;
      url: string;
    };
  };
  status: string;
  onRestartClick: () => void;
};

// retried, canceled, infrastructure_fail, timedout, not_run, running, failed, queued, scheduled, not_running, no_tests, fixed, success
const getStatusComponent = (status: string | undefined = '') => {
  switch (status.toLowerCase()) {
    case 'queued':
    case 'scheduled':
      return <StatusPending />;
    case 'running':
      return <StatusRunning />;
    case 'failed':
      return <StatusError />;
    case 'success':
      return <StatusOK />;
    case 'canceled':
    default:
      return <StatusWarning />;
  }
};

const generatedColumns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    type: 'numeric',
    width: '150px',
  },
  {
    title: 'Build',
    field: 'buildName',
    highlight: true,
    render: (row: Partial<Build>) => (
      <Link component={RouterLink} to={`/build/${row.id}`}>
        {row.buildName}
      </Link>
    ),
  },
  {
    title: 'Source',
    render: (row: Partial<Build>) => (
      <>
        <p>{row.source?.branchName}</p>
        <p>{row.source?.commit.hash}</p>
      </>
    ),
  },
  {
    title: 'Status',
    render: (row: Partial<Build>) => (
      <Box display="flex" alignItems="center">
        {getStatusComponent(row.status)}
        <Box mr={1} />
        <Typography variant="button">{row.status}</Typography>
      </Box>
    ),
  },
  {
    title: 'Actions',
    render: (row: Partial<Build>) => (
      <IconButton onClick={row.onRestartClick}>
        <RetryIcon />
      </IconButton>
    ),
    width: '10%',
  },
];

type Props = {
  loading: boolean;
  retry: () => void;
  builds?: Build[];
  projectName: string;
  page: number;
  onChangePage: (page: number) => void;
  total: number;
  pageSize: number;
  onChangePageSize: (pageSize: number) => void;
};

const BuildListTableView: FC<Props> = ({
  projectName,
  loading,
  pageSize,
  page,
  retry,
  builds,
  onChangePage,
  onChangePageSize,
  total,
}) => {
  return (
    <Table
      isLoading={loading}
      options={{ paging: true, pageSize, padding: 'dense' }}
      totalCount={total}
      page={page}
      actions={[
        {
          icon: () => <RetryIcon />,
          tooltip: 'Refresh Data',
          isFreeAction: true,
          onClick: () => retry(),
        },
      ]}
      data={builds ?? []}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangePageSize}
      title={
        <Box display="flex" alignItems="center">
          <GitHubIcon />
          <Box mr={1} />
          <Typography variant="h6">{projectName}</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};

const noop = () => {};

export const BuildListTable = () => {
  const [tableProps] = useBuilds();
  return (
    <BuildListTableView
      {...tableProps}
      retry={noop}
      onChangePageSize={noop}
      onChangePage={noop}
    />
  );
};
