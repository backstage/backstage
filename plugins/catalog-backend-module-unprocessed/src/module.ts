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
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { UnprocessedEntitiesModule } from './UnprocessedEntitiesModule';
import { unprocessedEntitiesDeletePermission } from '@backstage/plugin-catalog-unprocessed-entities-common';

/**
 * Catalog Module for Unprocessed Entities
 *
 * @public
 */
export const catalogModuleUnprocessedEntities = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'catalog-module-unprocessed-entities',
  register(env) {
    env.registerInit({
      deps: {
        database: coreServices.database,
        router: coreServices.httpRouter,
        logger: coreServices.logger,
        httpAuth: coreServices.httpAuth,
        discovery: coreServices.discovery,
        permissions: coreServices.permissions,
        permissionsRegistry: coreServices.permissionsRegistry,
      },
      async init({
        database,
        router,
        logger,
        permissions,
        httpAuth,
        discovery,
        permissionsRegistry,
      }) {
        const module = UnprocessedEntitiesModule.create({
          database: await database.getClient(),
          router,
          permissions,
          discovery,
          httpAuth,
        });

        permissionsRegistry.addPermissions([
          unprocessedEntitiesDeletePermission,
        ]);

        module.registerRoutes();

        logger.info(
          'registered additional routes for catalogModuleUnprocessedEntities',
        );
      },
    });
  },
});
