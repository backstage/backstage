/*
 * Copyright 2021 The Backstage Authors
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
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { GithubProfileClient } from './api';
import { githubProfileApiRef } from './api/types';

import { rootRouteRef } from './routes';

export const userProfilesModuleGithubPlugin = createPlugin({
  id: 'user-profiles-module-github',
  apis: [
    createApiFactory({
      api: githubProfileApiRef,
      deps: {
        identityApi: identityApiRef,
        discoveryApi: discoveryApiRef,
      },
      factory({ identityApi, discoveryApi }) {
        return new GithubProfileClient({ identityApi, discoveryApi });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const GithubProfileSettingsCard = userProfilesModuleGithubPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/GithubSettingsCard').then(
          m => m.GithubSettingsCard,
        ),
    },
  }),
);

export const GithubProfileUserEntityCard =
  userProfilesModuleGithubPlugin.provide(
    createComponentExtension({
      component: {
        lazy: () =>
          import('./components/GithubUserEntityCard').then(
            m => m.GithubUserEntityCard,
          ),
      },
    }),
  );
