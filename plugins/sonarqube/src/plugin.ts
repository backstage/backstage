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

import { SonarQubeClient } from './api';
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { sonarQubeApiRef } from '@backstage/plugin-sonarqube-react/alpha';

/** @public */
export const sonarQubePlugin = createPlugin({
  id: 'sonarqube',
  apis: [
    createApiFactory({
      api: sonarQubeApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ discoveryApi, identityApi }) =>
        new SonarQubeClient({
          discoveryApi,
          identityApi,
        }),
    }),
  ],
});

/** @public */
export const EntitySonarQubeCard = sonarQubePlugin.provide(
  createComponentExtension({
    name: 'EntitySonarQubeCard',
    component: {
      lazy: () =>
        import('./components/SonarQubeCard').then(m => m.SonarQubeCard),
    },
  }),
);

/** @public */
export const EntitySonarQubeContentPage = sonarQubePlugin.provide(
  createComponentExtension({
    name: 'EntitySonarQubeContentPage',
    component: {
      lazy: () =>
        import('./components/SonarQubeContentPage').then(
          m => m.SonarQubeContentPage,
        ),
    },
  }),
);
