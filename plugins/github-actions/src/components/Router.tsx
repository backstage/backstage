/*
 * Copyright 2020 The Backstage Authors
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
import {
  useEntity,
  MissingAnnotationEmptyState,
} from '@backstage/plugin-catalog-react';
import { Routes, Route } from 'react-router-dom';
import { buildRouteRef } from '../routes';
import { WorkflowRunDetails } from './WorkflowRunDetails';
import { WorkflowRunsCard } from './WorkflowRunsCard';
import { WorkflowRunsTable } from './WorkflowRunsTable';
import { GITHUB_ACTIONS_ANNOTATION } from './getProjectNameFromEntity';
import { RouterProps } from '../api/types';

/** @public */
export const isGithubActionsAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[GITHUB_ACTIONS_ANNOTATION]);

/** @public */
export const Router = (props: RouterProps) => {
  const { view = 'table' } = props;
  const { entity } = useEntity();

  if (!isGithubActionsAvailable(entity)) {
    return (
      <MissingAnnotationEmptyState annotation={GITHUB_ACTIONS_ANNOTATION} />
    );
  }

  const workflowRunsComponent =
    view === 'cards' ? (
      <WorkflowRunsCard entity={entity} />
    ) : (
      <WorkflowRunsTable entity={entity} />
    );

  return (
    <Routes>
      <Route path="/" element={workflowRunsComponent} />
      <Route
        path={`${buildRouteRef.path}`}
        element={<WorkflowRunDetails entity={entity} />}
      />
    </Routes>
  );
};
