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
  createApiFactory,
  createComponentExtension,
  createPlugin,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { IncidentApi, IncidentApiRef } from './api/client';

export const incidentPlugin = createPlugin({
  id: 'incident',
  apis: [
    createApiFactory({
      api: IncidentApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => {
        return new IncidentApi({
          discoveryApi: discoveryApi,
          identityApi: identityApi,
        });
      },
    }),
  ],
});

export const EntityIncidentCard = incidentPlugin.provide(
  createComponentExtension({
    name: 'EntityIncidentCard',
    component: {
      lazy: () =>
        import('./components/EntityIncidentCard').then(
          m => m.EntityIncidentCard,
        ),
    },
  }),
);
