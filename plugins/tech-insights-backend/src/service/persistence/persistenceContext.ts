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
  getVoidLogger,
  PluginDatabaseManager,
  resolvePackagePath,
} from '@backstage/backend-common';
import { Logger } from 'winston';
import { TechInsightsDatabase } from './TechInsightsDatabase';
import { PersistenceContext } from '@backstage/plugin-tech-insights-node';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-tech-insights-backend',
  'migrations',
);

/**
 * A Container for persistence context initialization options
 *
 * @public
 */
export type PersistenceContextOptions = {
  logger: Logger;
};

const defaultOptions: PersistenceContextOptions = {
  logger: getVoidLogger(),
};

/**
 * A factory function to construct persistence context for running implementation.
 *
 * @public
 */
export const initializePersistenceContext = async (
  database: PluginDatabaseManager,
  options: PersistenceContextOptions = defaultOptions,
): Promise<PersistenceContext> => {
  const client = await database.getClient();

  if (!database.migrations?.skip) {
    await client.migrate.latest({
      directory: migrationsDir,
    });
  }

  return {
    techInsightsStore: new TechInsightsDatabase(client, options.logger),
  };
};
