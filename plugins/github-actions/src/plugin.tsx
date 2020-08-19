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
import { createPlugin, createRouteRef } from '@backstage/core';
import { WorkflowRunDetailsPage } from './components/WorkflowRunDetailsPage';
import { WorkflowRunsPage } from './components/WorkflowRunsPage';
import { Route } from 'react-router-dom';

// TODO(freben): This is just a demo route for now
export const rootRouteRef = createRouteRef({
  path: '/',
  title: 'GitHub Actions',
});
export const projectRouteRef = createRouteRef({
  path: '/:kind/:optionalNamespaceAndName/',
  title: 'GitHub Actions for project',
});
export const buildRouteRef = createRouteRef({
  path: '/:id',
  title: 'GitHub Actions Workflow Run',
});

export const plugin = createPlugin({
  id: 'github-actions',
  register({ router }) {
    router.addRoute(rootRouteRef, WorkflowRunsPage);
    router.addRoute(projectRouteRef, WorkflowRunsPage);
    router.addRoute(buildRouteRef, WorkflowRunDetailsPage);
  },
});

export const route = (
  <>
    <Route path="/" element={<WorkflowRunsPage />} />
    <Route path="/:id" element={<WorkflowRunDetailsPage />} />
    <Route path="/:kind/:optionalNamespaceAndName">
      <Route path="/" element={<WorkflowRunsPage />} />
      <Route path="/:id" element={<WorkflowRunDetailsPage />} />
    </Route>
  </>
);
