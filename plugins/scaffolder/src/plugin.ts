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

import {
  createPlugin,
  createApiFactory,
  discoveryApiRef,
  identityApiRef,
  createRoutableExtension,
} from '@backstage/core';
import {
  templateIndexRouteRef,
  templateRouteRef,
  taskRouteRef,
} from './routes';
import { scaffolderApiRef, ScaffolderClient } from './api';

export const scaffolderPlugin = createPlugin({
  id: 'scaffolder',
  apis: [
    createApiFactory({
      api: scaffolderApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) =>
        new ScaffolderClient({ discoveryApi, identityApi }),
    }),
  ],
  routes: {
    templateIndex: templateIndexRouteRef,
    template: templateRouteRef,
    task: taskRouteRef,
  },
});

export const TemplateIndexPage = scaffolderPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/ScaffolderPage').then(m => m.ScaffolderPage),
    mountPoint: templateIndexRouteRef,
  }),
);

export const TemplatePage = scaffolderPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/TemplatePage').then(m => m.TemplatePage),
    mountPoint: templateRouteRef,
  }),
);

export const TaskPage = scaffolderPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/TaskPage').then(m => m.TaskPage),
    mountPoint: taskRouteRef,
  }),
);
