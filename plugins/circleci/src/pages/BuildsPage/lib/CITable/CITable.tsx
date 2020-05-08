import React, { FC } from 'react';
import { Link, Typography, Box, IconButton } from '@material-ui/core';
import { Replay as RetryIcon, GitHub as GithubIcon } from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import {
  StatusFailed,
  StatusOK,
  StatusPending,
  StatusNA,
  StatusRunning,
  Table,
} from '@backstage/core';
import type { TableColumn } from '@backstage/core/src/components/Table';

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
    testUrl: string; //fixme better name
  };
  onRetryClick: () => void;
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
      return <StatusFailed />;
    case 'success':
      return <StatusOK />;
    case 'canceled':
    default:
      return <StatusNA />;
  }
};

const generatedColumns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    type: 'numeric',
    // @ts-ignore
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
        {row.source?.branchName}
        <br />
        {row.source?.commit.hash}
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
      <IconButton onClick={row.onRetryClick}>
        <RetryIcon />
      </IconButton>
    ),
    // @ts-ignore
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
