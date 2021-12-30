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
  SingleHostDiscovery,
} from '@backstage/backend-common';
import { createRouter } from './router';
import { Container, interfaces } from 'inversify';
import { injectables } from '../types';
import { BadgeBuilder, DefaultBadgeBuilder } from '../lib';
import { CatalogClient } from '@backstage/catalog-client';

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

  const standaloneContainer = new Container();

  /**
   * Using without the need to modify existing subpackages immediately
   */
  standaloneContainer
    .bind<CatalogClient>(injectables.CatalogClient)
    .toFactory<CatalogClient>(
      (
        /* Already existing application context */ _context: interfaces.Context,
      ) => {
        return () => {
          return new CatalogClient({ discoveryApi: discovery });
        };
      },
    );

  /**
   * Adding @injectable decoration to a concrete implementation. See {@link DefaultBadgeBuilder}
   */
  standaloneContainer
    .bind<BadgeBuilder>(injectables.BadgeBuilder)
    .to(DefaultBadgeBuilder);

  logger.debug('Creating application...');

  const router = await createRouter({
    config,
    discovery,
    container: standaloneContainer,
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
