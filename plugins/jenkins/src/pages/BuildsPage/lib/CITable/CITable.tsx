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
import { Table, TableColumn } from '@backstage/core';
import { JenkinsRunStatus } from '../Status';

export type CITableBuildInfo = {
  id: string;
  buildName: string;
  buildUrl?: string;
  source: {
    branchName: string;
    url: string;
    displayName: string;
    commit: {
      hash: string;
    };
  };
  status: string;
  tests?: {
    total: number;
    passed: number;
    skipped: number;
    failed: number;
    testUrl: string;
  };
  onRestartClick: () => void;
};

const generatedColumns: TableColumn[] = [
  {
    title: 'Build',
    field: 'buildName',
    highlight: true,
    render: (row: Partial<CITableBuildInfo>) => (
      <Link component={RouterLink} to={`/jenkins/job?url=${row.id}`}>
        {row.buildName}
      </Link>
    ),
  },
  {
    title: 'Source',
    render: (row: Partial<CITableBuildInfo>) => (
      <>
        <p>
          <Link href={row.source?.url || ''} target="_blank">
            {row.source?.branchName}
          </Link>
        </p>
        <p>{row.source?.commit?.hash}</p>
      </>
    ),
  },
  {
    title: 'Status',
    render: (row: Partial<CITableBuildInfo>) => {
      return (
        <Box display="flex" alignItems="center">
          <JenkinsRunStatus status={row.status} />
        </Box>
      );
    },
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

type Props = {
  loading: boolean;
  retry: () => void;
  builds: CITableBuildInfo[];
  projectName: string;
  page: number;
  onChangePage: (page: number) => void;
  total: number;
  pageSize: number;
  onChangePageSize: (pageSize: number) => void;
};
export const CITable: FC<Props> = ({
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
      options={{ paging: true, pageSize }}
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
      data={builds}
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
