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
import {
  Page,
  pageTheme,
  Link,
  Header,
  HeaderLabel,
  Content,
  ContentHeader,
  SupportButton,
  InfoCard,
  Table,
  TableColumn,
  Progress,
  StructuredMetadataTable,
} from '@backstage/core';
import { Grid } from '@material-ui/core';
import MetricsGraph from './MetricsGraph';
import RunTags from './RunTags';

const RunPage = () => {
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

  const noteText: string | undefined = run.data.tags.find(
    tag => tag.key === 'mlflow.note.content',
  )?.value;

  const source = run.data.tags.find(tag => tag.key === 'mlflow.source.name');
  const environment = run.data.tags.find(
    tag => tag.key === 'mlflow.source.type',
  );

  const paramColumns: TableColumn[] = [
    { title: 'Key', field: 'key' },
    { title: 'Value', field: 'value' },
  ];

  const metadataInfo = {
    experiment: (
      <Link to={`/mlflow/experiment/${run.info.experiment_id}`}>
        {run.info.experiment_id}
      </Link>
    ),
    status: run.info.status,
    submittedBy: run.info.user_id,
    startTime: run.info.start_time,
    endTime: run.info.end_time,
    source: source ? source.value : '',
    executionEnvironment: environment ? environment.value : '',
    runNotes: noteText,
  };

  return (
    <Page theme={pageTheme.tool}>
      <Header title="MLFlow Run" subtitle="Extremely WIP">
        <HeaderLabel label="Owner" value="@laiacano" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title={`Info for Run ${run.info.run_id}`}>
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InfoCard title="Run Details">
              <StructuredMetadataTable metadata={metadataInfo} />
            </InfoCard>
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
        </Grid>
      </Content>
    </Page>
  );
};

export default RunPage;
