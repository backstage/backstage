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
import { rootRouteRef, buildRouteRef } from '../plugin';
import { WorkflowRunDetails } from './WorkflowRunDetails';
import { WorkflowRunsTable } from './WorkflowRunsTable';
import { GITHUB_ACTIONS_ANNOTATION } from './useProjectName';
import { EmptyState } from '@backstage/core';
import { Button } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[GITHUB_ACTIONS_ANNOTATION]);

const ActionButton = ({ entity }: { entity: Entity }) => {
  const [type, target] =
    entity.metadata.annotations?.['backstage.io/managed-by-location'].split(
      /:(.+)/,
    ) || [];

  return type === 'github' ? (
    <Button
      variant="contained"
      color="primary"
      href={target.replace('blob', 'edit')}
      startIcon={<PostAddIcon />}
    >
      Add annotation
    </Button>
  ) : (
    <Button
      variant="contained"
      color="primary"
      href="https://backstage.io/docs/features/software-catalog/well-known-annotations"
    >
      Read more
    </Button>
  );
};

export const Router = ({ entity }: { entity: Entity }) =>
  !isPluginApplicableToEntity(entity) ? (
    <EmptyState
      missing="field"
      title="Missing Annotation"
      description={`The "${GITHUB_ACTIONS_ANNOTATION}" annotation is missing on "${entity.metadata.name}". You need to add the annotation to your component if you want to enable Github Actions for it.`}
      action={<ActionButton entity={entity} />}
    />
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
