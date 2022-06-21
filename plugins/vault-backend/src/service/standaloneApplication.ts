/*
 * Copyright 2020 The Backstage Authors
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
  errorHandler,
  notFoundHandler,
  requestLoggingHandler,
  DatabaseManager,
  getVoidLogger,
} from '@backstage/backend-common';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { Logger } from 'winston';
import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';
import { TestDatabases } from '@backstage/backend-test-utils';
import { TaskScheduler } from '@backstage/backend-tasks';

export interface ApplicationOptions {
  enableCors: boolean;
  logger: Logger;
}

export async function createStandaloneApplication(
  options: ApplicationOptions,
): Promise<express.Application> {
  const { enableCors, logger } = options;
  const config = new ConfigReader({});
  const app = express();

  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });
  const knex = await databases.init('SQLITE_3');
  const databaseManager: Partial<DatabaseManager> = {
    forPlugin: (_: string) => ({
      getClient: async () => knex,
    }),
  };
  const manager = databaseManager as DatabaseManager;
  const scheduler = new TaskScheduler(manager, getVoidLogger()).forPlugin(
    'vault',
  );

  app.use(helmet());
  if (enableCors) {
    app.use(cors());
  }
  app.use(compression());
  app.use(express.json());
  app.use(requestLoggingHandler());
  app.use('/', createRouter({ logger, config, scheduler }));
  app.use(notFoundHandler());
  app.use(errorHandler());

  return app;
}
