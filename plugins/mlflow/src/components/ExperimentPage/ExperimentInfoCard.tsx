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
import { StructuredMetadataTable, InfoCard } from '@backstage/core';
import { Experiment } from '../../MLFlowClient';

type ExperimentInfoCardProps = {
  experiment: Experiment;
  numberOfRuns?: number;
};

const ExperimentInfoCard = ({
  experiment,
  numberOfRuns,
}: ExperimentInfoCardProps) => {
  return (
    <>
      <InfoCard title="Experiment details">
        <StructuredMetadataTable
          metadata={{
            lifecycle: experiment.lifecycle_stage,
            numberOfRuns: numberOfRuns || 0,
            artifactLocation: experiment.artifact_location,
          }}
          dense
        />
      </InfoCard>
    </>
  );
};

export default ExperimentInfoCard;
