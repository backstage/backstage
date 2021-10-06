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

import React from 'react';
import moment from 'moment';
import {
  Table,
  TableColumn,
  StatusError,
  StatusOK,
  StatusWarning,
  StatusAborted,
} from '@backstage/core-components';
import { Link, Box, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { RepoBuild } from '../../api/types';
import {
  BuildResult,
  BuildStatus,
} from 'azure-devops-node-api/interfaces/BuildInterfaces';

const getBuildResultComponent = (result: number | undefined = 0) => {
  switch (result) {
    case 0: // None
      return <StatusError />;
    case 2: // Succeeded
      return <StatusOK />;
    case 4: // PartiallySucceeded
      return <StatusWarning />;
    case 8: // Failed
      return <StatusError />;
    case 32: // Canceled
      return <StatusAborted />;
    default:
      return <StatusWarning />;
  }
};

const columns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    highlight: false,
    width: '80px',
  },
  {
    title: 'Build',
    field: 'title',
    render: (row: Partial<RepoBuild>) => (
      <Link href={row.link} target="_blank">
        {row.title}
      </Link>
    ),
  },
  {
    title: 'Source',
    field: 'source',
  },
  {
    title: 'Status',
    field: 'status',
    render: (row: Partial<RepoBuild>) => (
      <Box display="flex" alignItems="center">
        <Box mr={1} />
        <Typography variant="button">{BuildStatus[row.status || 0]}</Typography>
      </Box>
    ),
  },
  {
    title: 'Result',
    field: 'result',
    render: (row: Partial<RepoBuild>) => (
      <Box display="flex" alignItems="center">
        {getBuildResultComponent(row.result)}
        <Box mr={1} />
        <Typography variant="button">{BuildResult[row.result || 0]}</Typography>
      </Box>
    ),
  },
  {
    title: 'Date',
    field: 'queueTime',
    render: (row: Partial<RepoBuild>) => moment(row.queueTime).fromNow(),
  },
];

type Props = {
  items: RepoBuild[];
  loading: boolean;
  error?: any;
};

export const BuildTable = ({ items, loading, error }: Props) => {
  if (error) {
    return (
      <div>
        <Alert severity="error">
          Error encountered while fetching Azure DevOps builds.{' '}
          {error.toString()}
        </Alert>
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
      title={`Builds (${(items && items.length) || 0})`}
      data={items}
    />
  );
};
