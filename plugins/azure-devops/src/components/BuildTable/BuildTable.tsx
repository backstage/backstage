/*
 * Copyright 2021 The Backstage Authors
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

import { Box, Typography } from '@material-ui/core';
import {
  BuildResult,
  BuildStatus,
  RepoBuild,
} from '@backstage/plugin-azure-devops-common';
import {
  Link,
  ResponseErrorPanel,
  StatusAborted,
  StatusError,
  StatusOK,
  StatusPending,
  StatusRunning,
  StatusWarning,
  Table,
  TableColumn,
} from '@backstage/core-components';

import { DateTime } from 'luxon';
import React from 'react';

export const getBuildResultComponent = (result: number | undefined) => {
  switch (result) {
    case BuildResult.Succeeded:
      return (
        <span>
          <StatusOK /> Succeeded
        </span>
      );
    case BuildResult.PartiallySucceeded:
      return (
        <span>
          <StatusWarning /> Partially Succeeded
        </span>
      );
    case BuildResult.Failed:
      return (
        <span>
          <StatusError /> Failed
        </span>
      );
    case BuildResult.Canceled:
      return (
        <span>
          <StatusAborted /> Canceled
        </span>
      );
    case BuildResult.None:
    default:
      return (
        <span>
          <StatusWarning /> Unknown
        </span>
      );
  }
};

export const getBuildStateComponent = (
  status: number | undefined,
  result: number | undefined,
) => {
  switch (status) {
    case BuildStatus.InProgress:
      return (
        <span>
          <StatusRunning /> In Progress
        </span>
      );
    case BuildStatus.Completed:
      return getBuildResultComponent(result);
    case BuildStatus.Cancelling:
      return (
        <span>
          <StatusAborted /> Cancelling
        </span>
      );
    case BuildStatus.Postponed:
      return (
        <span>
          <StatusPending /> Postponed
        </span>
      );
    case BuildStatus.NotStarted:
      return (
        <span>
          <StatusAborted /> Not Started
        </span>
      );
    case BuildStatus.None:
    default:
      return (
        <span>
          <StatusWarning /> Unknown
        </span>
      );
  }
};

const columns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    highlight: false,
    width: 'auto',
  },
  {
    title: 'Build',
    field: 'title',
    width: 'auto',
    render: (row: Partial<RepoBuild>) => (
      <Link to={row.link || ''}>{row.title}</Link>
    ),
  },
  {
    title: 'Source',
    field: 'source',
    width: 'auto',
  },
  {
    title: 'State',
    width: 'auto',
    render: (row: Partial<RepoBuild>) => (
      <Box display="flex" alignItems="center">
        <Typography variant="button">
          {getBuildStateComponent(row.status, row.result)}
        </Typography>
      </Box>
    ),
  },
  {
    title: 'Age',
    field: 'queueTime',
    width: 'auto',
    render: (row: Partial<RepoBuild>) =>
      (row.queueTime
        ? DateTime.fromISO(row.queueTime)
        : DateTime.now()
      ).toRelative(),
  },
];

type BuildTableProps = {
  items?: RepoBuild[];
  loading: boolean;
  error?: Error;
};

export const BuildTable = ({ items, loading, error }: BuildTableProps) => {
  if (error) {
    return (
      <div>
        <ResponseErrorPanel error={error} />
      </div>
    );
  }

  return (
    <Table
      isLoading={loading}
      columns={columns}
      options={{
        search: true,
        paging: true,
        pageSize: 5,
        showEmptyDataSourceMessage: !loading,
      }}
      title={`Builds (${items ? items.length : 0})`}
      data={items ?? []}
    />
  );
};
