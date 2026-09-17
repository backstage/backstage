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
import { createBackend } from '@backstage/backend-defaults';
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { mockServices } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

const backend = createBackend();

backend.add(mockServices.auth.factory());
backend.add(mockServices.httpAuth.factory());

// TEMPLATE NOTE:
// Rather than using a real catalog you can use a mock with a fixed set of entities.
backend.add(
  catalogServiceMock.factory({
    entities: [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'sample',
          title: 'Sample Component',
        },
        spec: {
          type: 'service',
        },
      },
    ],
  }),
);

backend.add(
  createBackendPlugin({
    pluginId: 'local',
    register({ registerInit }) {
      registerInit({
        deps: {
          actionsRegistry: actionsRegistryServiceRef,
        },
        async init({ actionsRegistry }) {
          actionsRegistry.register({
            name: 'make-greeting',
            title: 'Test Action',
            description: 'Test Action',
            schema: {
              input: z =>
                z.object({
                  name: z.string(),
                }),
              output: z =>
                z.object({
                  greeting: z.string(),
                }),
            },
            action: async ({ input }) => ({
              output: {
                greeting: `Hello ${input.name}!`,
              },
            }),
          });
        },
      });
    },
  }),
);

backend.add(import('../src'));

backend.start();
