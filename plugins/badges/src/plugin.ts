/*
 * Copyright 2021 Spotify AB
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
  createApiFactory,
  createComponentExtension,
  createPlugin,
  configApiRef,
  discoveryApiRef,
} from '@backstage/core';
import { badgesClientApiRef, BadgesClientApi } from './BadgesClientApi';

export const badgesPlugin = createPlugin({
  id: 'badges',
  apis: [
    createApiFactory({
      api: badgesClientApiRef,
      deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
      factory: ({ configApi, discoveryApi }) =>
        new BadgesClientApi({ configApi, discoveryApi }),
    }),
  ],
});

export const EntityBadgesField = badgesPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/EntityBadgesField').then(m => m.EntityBadgesField),
    },
  }),
);

export const EntityBadgesCard = badgesPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/EntityBadgesCard').then(m => m.EntityBadgesCard),
    },
  }),
);
