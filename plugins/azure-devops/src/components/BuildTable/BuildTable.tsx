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
  BuildRun,
  BuildStatus,
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

import { AzurePipelinesIcon } from '../AzurePipelinesIcon';
import { DateTime } from 'luxon';
import React from 'react';
import { getDurationFromDates } from '../../utils/getDurationFromDates';

export const getBuildResultComponent = (result: number | undefined) => {
  switch (result) {
    case BuildResult.Succeeded:
      return (
        <Typography component="span">
          <StatusOK /> Succeeded
        </Typography>
      );
    case BuildResult.PartiallySucceeded:
      return (
        <Typography component="span">
          <StatusWarning /> Partially Succeeded
        </Typography>
      );
    case BuildResult.Failed:
      return (
        <Typography component="span">
          <StatusError /> Failed
        </Typography>
      );
    case BuildResult.Canceled:
      return (
        <Typography component="span">
          <StatusAborted /> Canceled
        </Typography>
      );
    case BuildResult.None:
    default:
      return (
        <Typography component="span">
          <StatusWarning /> Unknown
        </Typography>
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
        <Typography component="span">
          <StatusRunning /> In Progress
        </Typography>
      );
    case BuildStatus.Completed:
      return getBuildResultComponent(result);
    case BuildStatus.Cancelling:
      return (
        <Typography component="span">
          <StatusAborted /> Cancelling
        </Typography>
      );
    case BuildStatus.Postponed:
      return (
        <Typography component="span">
          <StatusPending /> Postponed
        </Typography>
      );
    case BuildStatus.NotStarted:
      return (
        <Typography component="span">
          <StatusAborted /> Not Started
        </Typography>
      );
    case BuildStatus.None:
    default:
      return (
        <Typography component="span">
          <StatusWarning /> Unknown
        </Typography>
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
    render: (row: Partial<BuildRun>) => (
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
    render: (row: Partial<BuildRun>) => (
      <Box display="flex" alignItems="center">
        <Typography variant="button">
          {getBuildStateComponent(row.status, row.result)}
        </Typography>
      </Box>
    ),
  },
  {
    title: 'Duration',
    field: 'queueTime',
    width: 'auto',
    render: (row: Partial<BuildRun>) => (
      <Box display="flex" alignItems="center">
        <Typography>
          {getDurationFromDates(row.startTime, row.finishTime)}
        </Typography>
      </Box>
    ),
  },
  {
    title: 'Age',
    field: 'queueTime',
    width: 'auto',
    render: (row: Partial<BuildRun>) =>
      (row.queueTime
        ? DateTime.fromISO(row.queueTime)
        : DateTime.now()
      ).toRelative(),
  },
];

type BuildTableProps = {
  items?: BuildRun[];
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
      title={
        <Box display="flex" alignItems="center">
          <AzurePipelinesIcon style={{ fontSize: 30 }} />
          <Box mr={1} />
          Azure Pipelines - Builds ({items ? items.length : 0})
        </Box>
      }
      data={items ?? []}
    />
  );
};
