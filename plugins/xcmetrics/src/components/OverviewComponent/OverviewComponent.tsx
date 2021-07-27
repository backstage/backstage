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
import React, { ReactChild } from 'react';
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
  InfoCard,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Build, BuildStatus, xcmetricsApiRef } from '../../api';
import { useAsync } from 'react-use';
import { Alert } from '@material-ui/lab';
import { StatusMatrixComponent } from '../StatusMatrixComponent';
import { formatDuration, formatTime } from '../../utils';
import { Chip, Grid } from '@material-ui/core';
import { OverviewTrendsComponent } from '../OverviewTrendsComponent';

const STATUS_ICONS: { [key in BuildStatus]: ReactChild } = {
  succeeded: <StatusOK />,
  failed: <StatusError />,
  stopped: <StatusWarning />,
};

const columns: TableColumn<Build>[] = [
  {
    field: 'buildStatus',
    render: data => STATUS_ICONS[data.buildStatus],
  },
  {
    title: 'Project',
    field: 'projectName',
  },
  {
    title: 'Schema',
    field: 'schema',
  },
  {
    title: 'Started',
    field: 'startedAt',
    searchable: false,
    render: data => formatTime(data.startTimestamp),
  },
  {
    title: 'Duration',
    field: 'duration',
    render: data => formatDuration(data.duration),
  },
  {
    title: 'User',
    field: 'userid',
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
    async () => client.getBuilds(),
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
      <Grid container spacing={3} direction="row">
        <Grid item xs={12} md={8} lg={8} xl={9}>
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
        </Grid>
        <Grid item xs={12} md={4} lg={4} xl={3}>
          <InfoCard>
            <OverviewTrendsComponent />
          </InfoCard>
        </Grid>
      </Grid>
    </>
  );
};
