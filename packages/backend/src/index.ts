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

import { createBackend } from '@backstage/backend-defaults';
import {
  createBackendFeatureLoader,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

const backend = createBackend();

// An example of how to group together and load multiple features. You can also
// access root-scoped services by adding `deps`.
const searchLoader = createBackendFeatureLoader({
  *loader() {
    yield import('@backstage/plugin-search-backend');
    yield import('@backstage/plugin-search-backend-module-catalog');
    yield import('@backstage/plugin-search-backend-module-explore');
    yield import('@backstage/plugin-search-backend-module-techdocs');
  },
});

backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('./authModuleGithubProvider'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-catalog-backend-module-unprocessed'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  createBackendModule({
    moduleId: 'test',
    pluginId: 'catalog',
    register({ registerInit }) {
      registerInit({
        deps: {
          providers: catalogProcessingExtensionPoint,
        },
        async init({ providers }) {
          class Prov implements EntityProvider {
            getProviderName(): string {
              return 'testprovider';
            }
            async connect(connection: EntityProviderConnection): Promise<void> {
              setInterval(() => {
                console.log('running connect!');

                connection.applyMutation({
                  type: 'full',
                  entities: [
                    {
                      entity: {
                        apiVersion: 'backstage.io/v1alpha1',
                        kind: 'Component',
                        metadata: {
                          name: 'petstore',
                          annotations: {
                            'backstage.io/managed-by-location': 'url:test',
                            'backstage.io/managed-by-origin-location':
                              'url:test',
                          },
                        },
                        spec: {
                          lifecycle: 'production',
                          owner: 'me',
                          type: 'website',
                        },
                      },
                      locationKey: 'sysmodel',
                    },
                  ],
                });
              }, 5000);
            }
          }
          providers.addEntityProvider(new Prov());
        },
      });
    },
  }),
);
backend.add(import('@backstage/plugin-events-backend'));
backend.add(import('@backstage/plugin-devtools-backend'));
backend.add(import('@backstage/plugin-kubernetes-backend'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-notifications'),
);
backend.add(
  import('@backstage/plugin-catalog-backend-module-backstage-openapi'),
);
backend.add(searchLoader);
backend.add(import('@backstage/plugin-techdocs-backend'));
backend.add(import('@backstage/plugin-signals-backend'));
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('./instanceMetadata'));

backend.start();
