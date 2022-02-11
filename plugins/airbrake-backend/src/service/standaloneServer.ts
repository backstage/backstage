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
} from '@backstage/backend-common';
import { Server } from 'http';
import { Logger } from 'winston';
import { createRouter } from './router';
import { extractAirbrakeConfig } from '../config';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'airbrake-backend' });
  const config = await loadBackendConfig({ logger, argv: process.argv });
  const airbrakeConfig = extractAirbrakeConfig(config);
  logger.debug('Starting application server...');
  const router = await createRouter({
    logger,
    airbrakeConfig,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/api/airbrake', router);
  if (options.enableCors) {
    logger.info('CORS is enabled, limiting to localhost with port 3000');
    service = service.enableCors({ origin: 'http://localhost:3000' });
  } else {
    logger.info('CORS is disabled, allowing all origins');
    service = service.enableCors({ origin: '*' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
