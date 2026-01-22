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

import { resolvePackagePath } from '@backstage/backend-plugin-api';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { scaffolderWorkspaceProviderExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { DatabaseWorkspaceProvider } from './provider';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-scaffolder-backend-module-workspace-database',
  'migrations',
);

/**
 * @public
 * Database workspace provider module for the Scaffolder Backend.
 *
 * This module is intended for development use only. In production,
 * use an external storage provider like GCS.
 */
export const workspaceDatabaseModule = createBackendModule({
  moduleId: 'workspace-database',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderWorkspaceProviders: scaffolderWorkspaceProviderExtensionPoint,
        database: coreServices.database,
        logger: coreServices.logger,
      },
      async init({ database, logger, scaffolderWorkspaceProviders }) {
        const db = await database.getClient();

        // Run migrations for our table
        if (!database.migrations?.skip) {
          await db.migrate.latest({
            directory: migrationsDir,
          });
        }

        scaffolderWorkspaceProviders.addProviders({
          database: DatabaseWorkspaceProvider.create({
            db,
            logger,
          }),
        });
      },
    });
  },
});
