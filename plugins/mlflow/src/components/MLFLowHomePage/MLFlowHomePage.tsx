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
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  Progress,
} from '@backstage/core';

import { mlFlowClient } from '../../index';
import { Experiment, Run } from '../../MLFlowClient';
import { useAsync } from 'react-use';
import ExperimentTable from './ExperimentTable';
import { RunTable } from '../ExperimentPage/RunTable';

export const MLFlowHomePage = () => {
  const { value, loading } = useAsync(async (): Promise<Experiment[]> => {
    return mlFlowClient.listExperiments();
  }, []);

  if (loading) {
    return <Progress />;
  }

  return (
    <Page theme={pageTheme.tool}>
      <Header
        title="Welcome to MLflow experiment tracking!"
        subtitle="Extremely WIP"
      >
        <HeaderLabel label="Owner" value="@laiacano" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="MLFlow tracking example">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <ExperimentTable experiments={value || []} />
          </Grid>
          {value && value[0] && <RunsForExperiment experiment={value[0]} />}
        </Grid>
      </Content>
    </Page>
  );
};

type RunsForExperimentProps = { experiment: Experiment };

const RunsForExperiment = ({ experiment }: RunsForExperimentProps) => {
  const { value, loading } = useAsync(async (): Promise<Run[]> => {
    return mlFlowClient.searchRuns([experiment.experiment_id]);
  }, []);

  if (loading) {
    return <Progress />;
  }

  return (
    <>
      <Grid item>
        <RunTable runs={value || []} />
      </Grid>
    </>
  );
};
