/*
 * Copyright 2025 The Backstage Authors
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
  createApiFactory,
  createComponentExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import {
  tasksApiRef,
  DefaultTasksApiClient,
} from '@backstage/plugin-tasks-react';

/**
 * @public
 */
export const tasksPlugin = createPlugin({
  id: 'tasks',
  apis: [
    createApiFactory({
      api: tasksApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) => {
        return new DefaultTasksApiClient({
          discoveryApi,
          fetchApi,
        });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});
/**
 * Standalone page component for the tasks plugin
 *
 * @public
 */
export const TasksPage = tasksPlugin.provide(
  createRoutableExtension({
    name: 'TasksPage',
    component: () =>
      import('./components/TasksPage/TasksPage').then(m => m.TasksPage),
    mountPoint: rootRouteRef,
  }),
);
/**
 * Main content component for the tasks plugin
 *
 * @public
 */
export const TasksContent = tasksPlugin.provide(
  createComponentExtension({
    name: 'TasksContent',
    component: {
      lazy: () => import('./components/TasksContent').then(m => m.TasksContent),
    },
  }),
);
