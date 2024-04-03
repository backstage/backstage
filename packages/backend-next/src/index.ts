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
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';
import { coreServices } from '@backstage/backend-plugin-api';

const backend = createBackend();

backend.add(
  createBackendPlugin({
    pluginId: 'receiver',
    register(reg) {
      reg.registerInit({
        deps: {
          httpRouter: coreServices.httpRouter,
          httpAuth: coreServices.httpAuth,
        },
        async init({ httpRouter, httpAuth }) {
          const router = Router();
          router.get('/hello', async (req, res) => {
            console.log('Got hello');
            const credentials = await httpAuth.credentials(req);
            console.log('Got credentials', credentials);

            res.json({ hello: 'world' });
          });
          httpRouter.use(router);
        },
      });
    },
  }),
);

backend.add(
  createBackendPlugin({
    pluginId: 'caller',
    register(reg) {
      reg.registerInit({
        deps: {
          rootLifecycle: coreServices.rootLifecycle,
          auth: coreServices.auth,
          discovery: coreServices.discovery,
          // httpRouter: coreServices.httpRouter,
        },
        async init({ rootLifecycle, auth, discovery }) {
          rootLifecycle.addStartupHook(async () => {
            const { token } = await auth.getPluginRequestToken({
              onBehalfOf: await auth.getOwnServiceCredentials(),
              targetPluginId: 'receiver',
            });
            console.log(`DEBUG: token=`, token);
            const res = await fetch(
              `${await discovery.getBaseUrl('receiver')}/hello`,
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              },
            );
            console.log(
              `DEBUG: res ${res.status} ${res.statusText}`,
              await res.json(),
            );
          });
        },
      });
    },
  }),
);

// backend.add(import('@backstage/plugin-auth-backend'));
// backend.add(import('./authModuleGithubProvider'));
// backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));

// backend.add(import('@backstage/plugin-adr-backend'));
// backend.add(import('@backstage/plugin-app-backend/alpha'));
// backend.add(import('@backstage/plugin-azure-devops-backend'));
// backend.add(import('@backstage/plugin-badges-backend'));
// backend.add(import('@backstage/plugin-catalog-backend-module-unprocessed'));
// backend.add(
//   import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
// );
// backend.add(import('@backstage/plugin-catalog-backend/alpha'));
// backend.add(import('@backstage/plugin-devtools-backend'));
// backend.add(import('@backstage/plugin-entity-feedback-backend'));
// backend.add(import('@backstage/plugin-jenkins-backend'));
// backend.add(import('@backstage/plugin-kubernetes-backend/alpha'));
// backend.add(import('@backstage/plugin-lighthouse-backend'));
// backend.add(import('@backstage/plugin-linguist-backend'));
// backend.add(import('@backstage/plugin-playlist-backend'));
// backend.add(import('@backstage/plugin-nomad-backend'));
// backend.add(
//   import('@backstage/plugin-permission-backend-module-allow-all-policy'),
// );
// backend.add(import('@backstage/plugin-permission-backend/alpha'));
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
