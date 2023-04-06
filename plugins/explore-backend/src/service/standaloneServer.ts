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

import { createServiceBuilder } from '@backstage/backend-common';
import { GetExploreToolsRequest } from '@backstage/plugin-explore-common';
import { Server } from 'http';
import { Logger } from 'winston';
import { createRouter } from './router';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({
    service: 'explore-backend',
  });

  logger.debug('Starting application server...');

  const router = await createRouter({
    logger,
    toolProvider: {
      getTools: async ({}: GetExploreToolsRequest) => {
        return {
          filter: undefined,
          tools: [
            { title: 'Tool 1', url: 'https://example.com/tool1', image: '' },
            { title: 'Tool 2', url: 'https://example.com/tool2', image: '' },
            { title: 'Tool 3', url: 'https://example.com/tool2', image: '' },
          ],
        };
      },
    },
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/explore-backend', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
