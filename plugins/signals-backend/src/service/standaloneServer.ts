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
import { createServiceBuilder } from '@backstage/backend-common';
import { Server } from 'http';
import { Logger } from 'winston';
import { IdentityApi } from '@backstage/plugin-auth-node';
import {
  EventBroker,
  EventParams,
  EventSubscriber,
} from '@backstage/plugin-events-node';
import { SignalsService } from './SignalsService';
import { ConfigReader } from '@backstage/config';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'signals-backend' });
  logger.debug('Starting application server...');

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

  const eventBroker: EventBroker = {
    async publish(_: EventParams) {},
    subscribe(..._: Array<EventSubscriber | Array<EventSubscriber>>) {},
  };

  let service = createServiceBuilder(module).setPort(options.port);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  const config = new ConfigReader({});

  const server = await service.start();
  await SignalsService.create({
    httpServer: server,
    logger,
    identity,
    eventBroker,
    config,
  });

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
