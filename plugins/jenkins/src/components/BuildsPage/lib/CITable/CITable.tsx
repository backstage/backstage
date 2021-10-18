/*
 * Copyright 2020 The Backstage Authors
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
import { Box, IconButton, Link, Typography, Tooltip } from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import JenkinsLogo from '../../../../assets/JenkinsLogo.svg';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { JenkinsRunStatus } from '../Status';
import { useBuilds } from '../../../useBuilds';
import { buildRouteRef } from '../../../../plugin';
import { Table, TableColumn } from '@backstage/core-components';
import { Project } from '../../../../api/JenkinsApi';

const FailCount = ({ count }: { count: number }): JSX.Element | null => {
  if (count !== 0) {
    return <>{count} failed</>;
  }
  return null;
};

const SkippedCount = ({ count }: { count: number }): JSX.Element | null => {
  if (count !== 0) {
    return <>{count} skipped</>;
  }
  return null;
};

const FailSkippedWidget = ({
  skipped,
  failed,
}: {
  skipped: number;
  failed: number;
}): JSX.Element | null => {
  if (skipped === 0 && failed === 0) {
    return null;
  }

  if (skipped !== 0 && failed !== 0) {
    return (
      <>
        {' '}
        (<FailCount count={failed} />, <SkippedCount count={skipped} />)
      </>
    );
  }

  if (failed !== 0) {
    return (
      <>
        {' '}
        (<FailCount count={failed} />)
      </>
    );
  }

  if (skipped !== 0) {
    return (
      <>
        {' '}
        (<SkippedCount count={skipped} />)
      </>
    );
  }

  return null;
};

const generatedColumns: TableColumn[] = [
  {
    title: 'Timestamp',
    defaultSort: 'desc',
    hidden: true,
    field: 'lastBuild.timestamp',
  },
  {
    title: 'Build',
    field: 'fullName',
    highlight: true,
    render: (row: Partial<Project>) => {
      if (!row.fullName || !row.lastBuild?.number) {
        return (
          <>
            {row.fullName ||
              row.fullDisplayName ||
              row.displayName ||
              'Unknown'}
          </>
        );
      }

      return (
        <Link
          component={RouterLink}
          to={generatePath(buildRouteRef.path, {
            jobFullName: encodeURIComponent(row.fullName),
            buildNumber: String(row.lastBuild?.number),
          })}
        >
          {row.fullDisplayName}
        </Link>
      );
    },
  },
  {
    title: 'Source',
    field: 'lastBuild.source.branchName',
    render: (row: Partial<Project>) => (
      <>
        <p>
          <Link href={row.lastBuild?.source?.url || ''} target="_blank">
            {row.lastBuild?.source?.branchName}
          </Link>
        </p>
        <p>{row.lastBuild?.source?.commit?.hash}</p>
      </>
    ),
  },
  {
    title: 'Status',
    field: 'status',
    render: (row: Partial<Project>) => {
      return (
        <Box display="flex" alignItems="center">
          <JenkinsRunStatus status={row.status} />
        </Box>
      );
    },
  },
  {
    title: 'Tests',
    sorting: false,
    render: (row: Partial<Project>) => {
      return (
        <>
          <p>
            {row.lastBuild?.tests && (
              <Link href={row.lastBuild?.tests.testUrl || ''} target="_blank">
                {row.lastBuild?.tests.passed} / {row.lastBuild?.tests.total}{' '}
                passed
                <FailSkippedWidget
                  skipped={row.lastBuild?.tests.skipped}
                  failed={row.lastBuild?.tests.failed}
                />
              </Link>
            )}

            {!row.lastBuild?.tests && 'n/a'}
          </p>
        </>
      );
    },
  },
  {
    title: 'Actions',
    sorting: false,
    render: (row: Partial<Project>) => (
      <Tooltip title="Rerun build">
        <IconButton onClick={row.onRestartClick}>
          <RetryIcon />
        </IconButton>
      </Tooltip>
    ),
    width: '10%',
  },
];

type Props = {
  loading: boolean;
  retry: () => void;
  projects?: Project[];
  page: number;
  onChangePage: (page: number) => void;
  total: number;
  pageSize: number;
  onChangePageSize: (pageSize: number) => void;
};

export const CITableView = ({
  loading,
  pageSize,
  page,
  retry,
  projects,
  onChangePage,
  onChangePageSize,
  total,
}: Props) => {
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
      data={projects ?? []}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangePageSize}
      title={
        <Box display="flex" alignItems="center">
          <img src={JenkinsLogo} alt="Jenkins logo" height="50px" />
          <Box mr={2} />
          <Typography variant="h6">Projects</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};

export const CITable = () => {
  const [tableProps, { setPage, retry, setPageSize }] = useBuilds();

  return (
    <CITableView
      {...tableProps}
      retry={retry}
      onChangePageSize={setPageSize}
      onChangePage={setPage}
    />
  );
};
