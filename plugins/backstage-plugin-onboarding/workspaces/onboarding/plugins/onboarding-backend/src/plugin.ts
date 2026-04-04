/*
 * Copyright 2026 Estehsan Tariq
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
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from './service/router';
import { DatabaseOnboardingStore } from './service/OnboardingStore';
import { seedDemoData } from './service/seedDemoData';

/**
 * Backstage backend plugin for the onboarding checklist.
 * Registers the HTTP router and initialises the database store.
 *
 * @public
 */
export const onboardingPlugin = createBackendPlugin({
  pluginId: 'onboarding',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        database: coreServices.database,
        permissions: coreServices.permissions,
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
        auth: coreServices.auth,
        discovery: coreServices.discovery,
      },
      async init({
        config,
        logger,
        database,
        permissions,
        httpRouter,
        httpAuth,
        auth,
        discovery,
      }) {
        const store = await DatabaseOnboardingStore.create({ database });
        const catalogApi = new CatalogClient({
          discoveryApi: discovery,
          fetchApi: {
            fetch: async (input, init) => {
              const { token } = await auth.getPluginRequestToken({
                onBehalfOf: await auth.getOwnServiceCredentials(),
                targetPluginId: 'catalog',
              });
              const headers = new Headers(init?.headers);
              headers.set('Authorization', `Bearer ${token}`);
              return globalThis.fetch(input, { ...init, headers });
            },
          },
        });

        httpRouter.use(
          await createRouter({
            logger,
            config,
            store,
            permissions,
            httpAuth,
            catalogApi,
          }),
        );

        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });

        // Seed demo data in development
        if (config.getOptionalBoolean('onboarding.seedDemoData')) {
          await seedDemoData({ store, logger });
        }
      },
    });
  },
});
