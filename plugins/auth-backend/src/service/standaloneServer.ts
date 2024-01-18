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
  createServiceBuilder,
  loadBackendConfig,
  ServerTokenManager,
  HostDiscovery,
  DatabaseManager,
} from '@backstage/backend-common';
import { Server } from 'http';
import { LoggerService } from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';

export interface ServerOptions {
  logger: LoggerService;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'auth-backend' });
  const config = await loadBackendConfig({ logger, argv: process.argv });
  const discovery = HostDiscovery.fromConfig(config);

  const manager = DatabaseManager.fromConfig(
    new ConfigReader({
      backend: {
        database: { client: 'better-sqlite3', connection: ':memory:' },
      },
    }),
  );
  const database = manager.forPlugin('auth');

  logger.debug('Starting application server...');
  const router = await createRouter({
    logger,
    config,
    database,
    discovery,
    tokenManager: ServerTokenManager.noop(),
  });

  const service = createServiceBuilder(module)
    .enableCors({ origin: 'http://localhost:3000', credentials: true })
    .addRouter('/auth', router);

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}
