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
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';

const backend = createBackend();

backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('./authModuleGithubProvider'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));

// backend.add(import('@backstage/plugin-adr-backend'));
// backend.add(import('@backstage/plugin-app-backend/alpha'));
// backend.add(import('@backstage/plugin-azure-devops-backend'));
// backend.add(import('@backstage/plugin-badges-backend'));
// backend.add(import('@backstage/plugin-catalog-backend-module-unprocessed'));
// backend.add(
//   import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
// );
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(
  createBackendModule({
    moduleId: 'provider',
    pluginId: 'catalog',
    register({ registerInit }) {
      registerInit({
        deps: {
          processing: catalogProcessingExtensionPoint,
          lifecycle: coreServices.rootLifecycle,
        },
        async init({ processing, lifecycle }) {
          // once this is running you can register a github url with the same entityRef
          // and watch it take over. Then delete the location in the UI, then it becomes unmanaged until re-processing resets
          // the initial provider entity takes over.
          class MockEntityProvider implements EntityProvider {
            connection: EntityProviderConnection | undefined;
            getProviderName(): string {
              return 'MockProvider';
            }
            async connect(connection: EntityProviderConnection): Promise<void> {
              this.connection = connection;
            }

            async run() {
              await this.connection?.applyMutation({
                type: 'full',
                entities: [
                  {
                    entity: {
                      apiVersion: 'backstage.io/v1alpha1',
                      kind: 'Component',
                      metadata: {
                        name: 'test-component',
                        namespace: 'default',
                        annotations: {
                          'backstage.io/managed-by-location':
                            'url:test-location',
                          'backstage.io/managed-by-origin-location':
                            'url:test-origin-location',
                        },
                      },

                      spec: {
                        type: 'service',
                        owner: 'guest',
                        lifecycle: 'production',
                        ownerRelations: [],
                        system: 'backstage',
                        description: 'A mock component',
                        tags: [],
                        providesApis: [],
                        consumesApis: [],
                        dependsOn: [],
                      },
                    },
                  },
                ],
              });
            }
          }

          const provider = new MockEntityProvider();
          processing.addEntityProvider(provider);

          lifecycle.addStartupHook(() => {
            provider.run();
          });
        },
      });
    },
  }),
);
// backend.add(import('@backstage/plugin-devtools-backend'));
// backend.add(import('@backstage/plugin-entity-feedback-backend'));
// backend.add(import('@backstage/plugin-jenkins-backend'));
// backend.add(import('@backstage/plugin-kubernetes-backend/alpha'));
// backend.add(import('@backstage/plugin-lighthouse-backend'));
// backend.add(import('@backstage/plugin-linguist-backend'));
// backend.add(import('@backstage/plugin-playlist-backend'));
// backend.add(import('@backstage/plugin-nomad-backend'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);
backend.add(import('@backstage/plugin-permission-backend/alpha'));
// backend.add(import('@backstage/plugin-proxy-backend/alpha'));
// backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
// backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
// backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
// backend.add(import('@backstage/plugin-search-backend-module-explore/alpha'));
// backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));
// backend.add(
//   import('@backstage/plugin-catalog-backend-module-backstage-openapi'),
// );
// backend.add(import('@backstage/plugin-search-backend/alpha'));
// backend.add(import('@backstage/plugin-techdocs-backend/alpha'));
// backend.add(import('@backstage/plugin-todo-backend'));
// backend.add(import('@backstage/plugin-sonarqube-backend'));
// backend.add(import('@backstage/plugin-signals-backend'));
// backend.add(import('@backstage/plugin-notifications-backend'));

backend.start();
