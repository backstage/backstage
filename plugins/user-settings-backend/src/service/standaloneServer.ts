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

import { createServiceBuilder, useHotMemoize } from '@backstage/backend-common';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { Server } from 'http';
import Knex from 'knex';
import { Logger } from 'winston';
import { DatabaseUserSettingsStore } from '../database/DatabaseUserSettingsStore';
import { createRouterInternal } from './router';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'storage-backend' });

  const database = useHotMemoize(module, () => {
    return Knex({
      client: 'better-sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });
  });

  logger.debug('Starting application server...');

  const identityMock: IdentityApi = {
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

  const router = await createRouterInternal({
    userSettingsStore: await DatabaseUserSettingsStore.create({
      database: { getClient: async () => database },
    }),
    identity: identityMock,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/user-settings', router);

  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
