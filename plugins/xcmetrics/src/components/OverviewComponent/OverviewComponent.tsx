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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
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
import { Duration } from 'luxon';
import { Chip } from '@material-ui/core';

const formatStatus = (status: BuildStatus, warningCount: number) => {
  const statusIcons = {
    succeeded: <StatusOK />,
    failed: <StatusError />,
    stopped: <StatusWarning />,
  };

  return (
    <>
      {statusIcons[status]} {status[0].toUpperCase() + status.slice(1)}
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
    render: data => Duration.fromObject({ seconds: data.duration }).toISOTime(),
  },
  {
    title: 'User',
    field: 'userid',
  },
  {
    title: 'Status',
    field: 'buildStatus',
    render: data => formatStatus(data.buildStatus, data.warningCount),
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
        title="Latest Builds"
      />
    </>
  );
};
