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
import { Entity } from '@backstage/catalog-model';
import { Routes, Route } from 'react-router';
import { rootRouteRef, buildRouteRef } from './plugin';
import { WorkflowRunDetails } from './components/WorkflowRunDetails';
import { WorkflowRunsTable } from './components/WorkflowRunsTable';
import { GITHUB_ACTIONS_ANNOTATION } from './components/useProjectName';
import { WarningPanel } from '@backstage/core';

const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity?.metadata?.annotations?.[GITHUB_ACTIONS_ANNOTATION]) &&
  entity?.metadata?.annotations?.[GITHUB_ACTIONS_ANNOTATION] !== '';

export const GitHubActionsPage = ({ entity }: { entity: Entity }) =>
  !isPluginApplicableToEntity(entity) ? (
    <WarningPanel title=" GitHubActions plugin:">
      `entity.metadata.annotations['
      {GITHUB_ACTIONS_ANNOTATION}']` key is missing on the entity.{' '}
    </WarningPanel>
  ) : (
    <Routes>
      <Route
        path={`/${rootRouteRef.path}`}
        element={<WorkflowRunsTable entity={entity} />}
      />
      <Route
        path={`/${buildRouteRef.path}`}
        element={<WorkflowRunDetails entity={entity} />}
      />
      )
    </Routes>
  );
