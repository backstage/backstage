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
import { Grid } from '@material-ui/core';
import { Progress } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { AboutCard } from '@backstage/plugin-catalog';
import { mlFlowClient } from '../../index';
import { Experiment, Run } from '../../MLFlowClient';
import ExperimentInfoCard from './ExperimentInfoCard';

type ExperimentPageProps = {
  experimentId: string;
  entity: Entity;
};

export const ExperimentPage = ({
  experimentId,
  entity,
}: ExperimentPageProps) => {
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
    <Grid container spacing={3}>
      <Grid item md={6}>
        <AboutCard entity={entity} />
      </Grid>
      <Grid item md={6}>
        {experimentInfo.value && (
          <ExperimentInfoCard
            experiment={experimentInfo.value}
            numberOfRuns={(runsInfo.value || []).length}
          />
        )}
      </Grid>
    </Grid>
  );
};
