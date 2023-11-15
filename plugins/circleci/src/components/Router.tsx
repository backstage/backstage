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

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  circleCIRouteRef,
  circleCIWorkflowRouteRef,
  legacyCircleCIBuildRouteRef,
} from '../route-refs';
import { PipelinesPage } from './PipelinesPage';
import { CIRCLECI_ANNOTATION } from '../constants';
import { Entity } from '@backstage/catalog-model';
import {
  useEntity,
  MissingAnnotationEmptyState,
} from '@backstage/plugin-catalog-react';
import { WorkflowWithJobsPage } from './WorkflowWithJobsPage';
import { useRouteRef } from '@backstage/core-plugin-api';

/**
 * This component can be deleted once the old route have been deprecated.
 */
const RedirectingComponent = () => {
  const rootLink = useRouteRef(circleCIRouteRef);
  useEffect(
    () =>
      // eslint-disable-next-line no-console
      console.warn(
        'The route /:buildId is deprecated, please use the new /workflows/:workflowId route instead',
      ),
    [],
  );
  return <Navigate to={rootLink()} />;
};

/** @public */
export const isCircleCIAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[CIRCLECI_ANNOTATION]);

/** @public */
export const Router = () => {
  const { entity } = useEntity();

  if (!isCircleCIAvailable(entity)) {
    return <MissingAnnotationEmptyState annotation={CIRCLECI_ANNOTATION} />;
  }

  return (
    <Routes>
      <Route path="/" element={<PipelinesPage />} />
      <Route
        path={`${circleCIWorkflowRouteRef.path}`}
        element={<WorkflowWithJobsPage />}
      />
      <Route
        path={`${legacyCircleCIBuildRouteRef.path}`}
        element={<RedirectingComponent />}
      />
    </Routes>
  );
};
