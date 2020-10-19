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
import React from 'react';
import { useAsync } from 'react-use';
import { useParams } from 'react-router-dom';
import { mlFlowClient } from '../../index';
import { Run } from '../../MLFlowClient';
import { InfoCard, Table, TableColumn, Progress } from '@backstage/core';
import { Grid } from '@material-ui/core';
import MetricsGraph from './MetricsGraph';
import RunMetadata from './RunMetadata';
import RunTags from './RunTags';
import RunArtifacts from './RunArtifacts';

export const RunPage = () => {
  const { runId } = useParams();

  const { value, loading } = useAsync(async (): Promise<Run> => {
    return mlFlowClient.getRun(runId);
  }, []);

  if (loading) {
    return <Progress />;
  }
  if (!value) {
    return <p>No run found!?!?!</p>;
  }

  const run: Run = value;
  const paramColumns: TableColumn[] = [
    { title: 'Key', field: 'key' },
    { title: 'Value', field: 'value' },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <RunMetadata run={run} />
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard title="Parameters and Tags">
          <RunTags runId={run.info.run_id} tags={run.data.tags} />
          <Table
            options={{ search: false, paging: false }}
            columns={paramColumns}
            data={run.data.params}
          />
        </InfoCard>
      </Grid>
      <Grid item xs={12}>
        <MetricsGraph runId={run.info.run_id} metrics={run.data.metrics} />
      </Grid>
      <Grid item xs={12}>
        <RunArtifacts runId={run.info.run_id} />
      </Grid>
    </Grid>
  );
};
