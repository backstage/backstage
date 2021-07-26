/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createServiceBuilder } from '@backstage/backend-common';
import { Server } from 'http';
import { Logger } from 'winston';
import { createRouter } from './router';
import { EntityRef } from '@backstage/catalog-model';
import { JenkinsInfo } from './jenkinsInfoProvider';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'jenkins-backend' });
  logger.debug('Starting application server...');
  const router = await createRouter({
    logger,
    jenkinsInfoProvider: {
      async getInstance(_: { entityRef: EntityRef }): Promise<JenkinsInfo> {
        return { baseUrl: 'https://example.com/', jobFullName: 'build-foo' };
      },
    },
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/jenkins', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
