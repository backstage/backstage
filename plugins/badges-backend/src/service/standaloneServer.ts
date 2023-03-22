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

import { Server } from 'http';
import { Logger } from 'winston';
import {
  createServiceBuilder,
  loadBackendConfig,
  ServerTokenManager,
  SingleHostDiscovery,
} from '@backstage/backend-common';
import { createRouter } from './router';
import { IdentityApi } from '@backstage/plugin-auth-node';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'badges-backend' });
  const config = await loadBackendConfig({ logger, argv: process.argv });
  const discovery = SingleHostDiscovery.fromConfig(config);

  logger.debug('Creating application...');

  const tokenManager = ServerTokenManager.noop();
  const identity: IdentityApi = {
    async getIdentity({ request }) {
      const token = request.headers.authorization?.split(' ')[1];
      return {
        identity: {
          type: 'user',
          ownershipEntityRefs: [],
          userEntityRef: token || 'user:default/john_doe',
        },
        token: token || 'no-token',
      };
    },
  };
  const router = await createRouter({
    config,
    discovery,
    tokenManager,
    logger,
    identity,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/badges', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}
