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
import React, { FC } from 'react';
import { useAsync } from 'react-use';
import { useParams } from 'react-router-dom';
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
import RunTable from '../ExperimentPage/RunTable';
import ExperimentInfoCard from './ExperimentInfoCard';

const ExperimentPage: FC<{}> = _ => {
  const { experimentId } = useParams();

  // Load runs for the experiment
  const experimentInfo = useAsync(async (): Promise<Experiment> => {
    return mlFlowClient.getExperiment(experimentId);
  }, []);

  const runsInfo = useAsync(async (): Promise<Run[]> => {
    return mlFlowClient.searchRuns([experimentId]);
  }, []);

  if (experimentInfo.loading || runsInfo.loading) {
    return <Progress />;
  }

  return (
    <Page theme={pageTheme.tool}>
      <Header title="MLFlow Experiment" subtitle="Extremely WIP">
        <HeaderLabel label="Owner" value="@laiacano" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader
          title={experimentInfo.value ? experimentInfo.value.name : ''}
        >
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container direction="column">
          <Grid item>
            {experimentInfo.value && (
              <ExperimentInfoCard
                experiment={experimentInfo.value}
                numberOfRuns={(runsInfo.value || []).length}
              />
            )}
          </Grid>
          <Grid item>
            <RunTable runs={runsInfo.value || []} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export default ExperimentPage;
