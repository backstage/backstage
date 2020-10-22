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
import { Route, Routes } from 'react-router';
import { Entity } from '@backstage/catalog-model';
import { WarningPanel } from '@backstage/core';
import { ExperimentPage } from './ExperimentPage';
import { RunTablePage } from './RunTablePage';
import { RunPage } from './RunPage';

const MLFLOW_ANNOTATION = 'mlflow.org/experiment';
export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[MLFLOW_ANNOTATION]);

const warningDisplay = (
  <WarningPanel title="MLFlow plugin:">
    <pre>entity.metadata.annotations['{MLFLOW_ANNOTATION}']</pre>
    key is missing on the entity. This tells backstage which MLFlow Experiment
    is associated with this Component.
  </WarningPanel>
);

export const ExperimentOverviewRouter = ({ entity }: { entity: Entity }) => {
  return !isPluginApplicableToEntity(entity) ? (
    warningDisplay
  ) : (
    <Routes>
      <Route
        path="/"
        element={
          <ExperimentPage
            experimentId={
              entity.metadata.annotations?.[MLFLOW_ANNOTATION] || '-1'
            }
            entity={entity}
          />
        }
      />
    </Routes>
  );
};

export const RunTableRouter = ({ entity }: { entity: Entity }) => {
  return !isPluginApplicableToEntity(entity) ? (
    warningDisplay
  ) : (
    <Routes>
      <Route
        path="/"
        element={
          <RunTablePage
            showTrend={false}
            experimentId={
              entity.metadata.annotations?.[MLFLOW_ANNOTATION] || '-1'
            }
          />
        }
      />
      <Route path="/:runId" element={<RunPage />} />
    </Routes>
  );
};

export const RunTrendRouter = ({ entity }: { entity: Entity }) => {
  return !isPluginApplicableToEntity(entity) ? (
    warningDisplay
  ) : (
    <Routes>
      <Route
        path="/"
        element={
          <RunTablePage
            showTrend
            experimentId={
              entity.metadata.annotations?.[MLFLOW_ANNOTATION] || '-1'
            }
          />
        }
      />
    </Routes>
  );
};
