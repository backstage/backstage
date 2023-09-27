/*
 * Copyright 2023 The Backstage Authors
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
import {
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  createApiFactory,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { Entity } from '@backstage/catalog-model';
import { PROJECT_KEY_ANNOTATION } from '@backstage/plugin-jira-dashboard-common';
import { JiraDashboardClient, jiraDashboardApiRef } from './api';

/**
 * Checks if the entity has a jira.com project-key annotation.
 * @public
 * @param entity - The entity to check for the jira.com project-key annotation.
 */
export const isJiraDashboardAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[PROJECT_KEY_ANNOTATION]);

/** @public */
export const jiraDashboardPlugin = createPlugin({
  id: 'jira-dashboard',
  apis: [
    createApiFactory({
      api: jiraDashboardApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new JiraDashboardClient({ discoveryApi, fetchApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/** @public */
export const EntityJiraDashboardContent = jiraDashboardPlugin.provide(
  createRoutableExtension({
    name: 'EntityJiraDashboardContent',
    component: () =>
      import('./components/JiraDashboardContent').then(
        m => m.JiraDashboardContent,
      ),
    mountPoint: rootRouteRef,
  }),
);
