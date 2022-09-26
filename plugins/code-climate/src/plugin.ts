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

import { ProductionCodeClimateApi, codeClimateApiRef } from './api';
import {
  createApiFactory,
  createPlugin,
  createRouteRef,
  discoveryApiRef,
  fetchApiRef,
  createComponentExtension,
} from '@backstage/core-plugin-api';

export const CODECLIMATE_REPO_ID_ANNOTATION = 'codeclimate.com/repo-id';

export const rootRouteRef = createRouteRef({
  id: 'code-climate',
});

/** @public */
export const codeClimatePlugin = createPlugin({
  id: 'code-climate',
  apis: [
    createApiFactory({
      api: codeClimateApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new ProductionCodeClimateApi({ discoveryApi, fetchApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/** @public */
export const EntityCodeClimateCard = codeClimatePlugin.provide(
  createComponentExtension({
    name: 'EntityCodeClimateCard',
    component: {
      lazy: () =>
        import('./components/CodeClimateCard').then(m => m.CodeClimateCard),
    },
  }),
);
