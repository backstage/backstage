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
import { Replay as RetryIcon, GitHub as GithubIcon } from '@material-ui/icons';
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

export type CITableBuildInfo = {
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
  tests?: {
    total: number;
    passed: number;
    skipped: number;
    failed: number;
    testUrl: string; // fixme better name
  };
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
    width: '80px',
  },
  {
    title: 'Build',
    field: 'buildName',
    highlight: true,
    render: (row: Partial<CITableBuildInfo>) => (
      <Link component={RouterLink} to={`/circleci/build/${row.id}`}>
        {row.buildName}
      </Link>
    ),
  },
  {
    title: 'Source',
    render: (row: Partial<CITableBuildInfo>) => (
      <>
        <p>{row.source?.branchName}</p>
        <p>{row.source?.commit.hash}</p>
      </>
    ),
  },
  {
    title: 'Status',
    render: (row: Partial<CITableBuildInfo>) => (
      <Box display="flex" alignItems="center">
        {getStatusComponent(row.status)}
        <Box mr={1} />
        <Typography variant="button">{row.status}</Typography>
      </Box>
    ),
  },
  {
    title: 'Actions',
    render: (row: Partial<CITableBuildInfo>) => (
      <IconButton onClick={row.onRestartClick}>
        <RetryIcon />
      </IconButton>
    ),
    width: '10%',
  },
];
export const CITable: FC<{
  builds: CITableBuildInfo[];
  projectName: string;
}> = React.memo(({ builds = [], projectName }) => {
  return (
    <Table
      options={{ paging: false }}
      data={builds}
      title={
        <Box display="flex" alignItems="center">
          <GithubIcon />
          <Box mr={1} />
          <Typography variant="h6">{projectName}</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
});
