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
import {
  ContentHeader,
  SupportButton,
  Progress,
  StatusOK,
  StatusError,
  StatusWarning,
  Table,
  TableColumn,
  EmptyState,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { BuildItem, BuildStatus, xcmetricsApiRef } from '../../api';
import { useAsync } from 'react-use';
import { Alert } from '@material-ui/lab';
import { Chip } from '@material-ui/core';
import { StatusMatrixComponent } from '../StatusMatrixComponent';
import { formatDuration, formatStatus } from '../../utils';

const Status = ({
  status,
  warningCount,
}: {
  status: BuildStatus;
  warningCount: number;
}) => {
  const statusIcons = {
    succeeded: <StatusOK />,
    failed: <StatusError />,
    stopped: <StatusWarning />,
  };

  return (
    <>
      {statusIcons[status]} {formatStatus(status)}
      {warningCount > 0 && ` with ${warningCount} warning`}
      {warningCount > 1 && 's'}
    </>
  );
};

const columns: TableColumn<BuildItem>[] = [
  {
    title: 'Project',
    field: 'projectName',
  },
  {
    title: 'Schema',
    field: 'schema',
  },
  {
    title: 'Duration',
    field: 'duration',
    type: 'time',
    searchable: false,
    render: data => formatDuration(data.duration),
  },
  {
    title: 'User',
    field: 'userid',
  },
  {
    title: 'Status',
    field: 'buildStatus',
    render: data => (
      <Status status={data.buildStatus} warningCount={data.warningCount} />
    ),
  },
  {
    field: 'isCI',
    render: data => data.isCi && <Chip label="CI" size="small" />,
    width: '10',
    sorting: false,
  },
];

export const OverviewComponent = () => {
  const client = useApi(xcmetricsApiRef);
  const { value: builds, loading, error } = useAsync(
    async (): Promise<BuildItem[]> => client.getBuilds(),
    [],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!builds || !builds.length) {
    return (
      <EmptyState
        missing="data"
        title="No builds to show"
        description="There are no builds in XCMetrics yet"
      />
    );
  }

  return (
    <>
      <ContentHeader title="XCMetrics Dashboard">
        <SupportButton>Dashboard for XCMetrics</SupportButton>
      </ContentHeader>
      <Table
        options={{ paging: false, search: false }}
        data={builds}
        columns={columns}
        title={
          <>
            Latest Builds
            <StatusMatrixComponent />
          </>
        }
      />
    </>
  );
};
