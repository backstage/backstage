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
import {
  createServiceBuilder,
  HostDiscovery,
  loadBackendConfig,
} from '@backstage/backend-common';
import { Server } from 'http';
import { Logger } from 'winston';
import { createRouter } from './router';
import { DefaultSignalService } from '@backstage/plugin-signals-node';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
import {
  EventBroker,
  EventParams,
  EventSubscriber,
} from '@backstage/plugin-events-node';

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
  const config = await loadBackendConfig({ logger, argv: process.argv });
  const discovery = HostDiscovery.fromConfig(config);

  const identity = DefaultIdentityClient.create({
    discovery,
    issuer: await discovery.getExternalBaseUrl('auth'),
  });

  const mockSubscribers: EventSubscriber[] = [];
  const eventBroker: EventBroker = {
    async publish(params: EventParams): Promise<void> {
      mockSubscribers.forEach(sub => sub.onEvent(params));
    },
    subscribe(...subscribers: EventSubscriber[]) {
      subscribers.flat().forEach(subscriber => {
        mockSubscribers.push(subscriber);
      });
    },
  };

  const signals = DefaultSignalService.create({
    eventBroker,
  });

  const router = await createRouter({
    logger,
    identity,
    eventBroker,
    discovery,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/signals', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  let server: Promise<Server>;
  try {
    server = service.start();

    setInterval(() => {
      signals.publish({
        recipients: null,
        channel: 'test',
        message: { hello: 'world' },
      });
    }, 5000);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
  return server;
}

module.hot?.accept();
