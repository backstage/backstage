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
import { UnprocessedEntitesModule } from './module';

export const catalogModuleUnprocessedEntities = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'catalogModuleUnprocessedEntities',
  register(env) {
    env.registerInit({
      deps: {
        database: coreServices.database,
        router: coreServices.httpRouter,
        logger: coreServices.logger,
      },
      async init({ database, router, logger }) {
        const module = new UnprocessedEntitesModule(
          await database.getClient(),
          router,
        );

        module.registerRoutes();
        logger.info(
          'registered additional routes for catalogModuleUnprocessedEntities',
        );
      },
    });
  },
});
