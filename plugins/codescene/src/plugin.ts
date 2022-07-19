/*
 * Copyright 2022 The Backstage Authors
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
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { codesceneApiRef, CodeSceneClient } from './api/api';
import { rootRouteRef, projectDetailsRouteRef } from './routes';

/**
 * @public
 */
export const codescenePlugin = createPlugin({
  id: 'codescene',
  apis: [
    createApiFactory({
      api: codesceneApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new CodeSceneClient({ discoveryApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
    projectPage: projectDetailsRouteRef,
  },
});

/**
 * @public
 */
export const CodeScenePage = codescenePlugin.provide(
  createRoutableExtension({
    name: 'CodeScenePage',
    component: () =>
      import('./components/CodeScenePageComponent').then(
        m => m.CodeScenePageComponent,
      ),
    mountPoint: rootRouteRef,
  }),
);

/**
 * @public
 */
export const CodeSceneProjectDetailsPage = codescenePlugin.provide(
  createRoutableExtension({
    name: 'CodeSceneProjectDetailsPage',
    component: () =>
      import('./components/CodeSceneProjectDetailsPage').then(
        m => m.CodeSceneProjectDetailsPage,
      ),
    mountPoint: projectDetailsRouteRef,
  }),
);
