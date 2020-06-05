/*
 * Copyright 2020 Spotify AB
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
import { createStandaloneApplication } from './standaloneApplication';
import { DatabaseEntitiesCatalog } from '../catalog/DatabaseEntitiesCatalog';
import { DatabaseManager } from '../database/DatabaseManager';
import { DatabaseLocationsCatalog } from '../catalog/DatabaseLocationsCatalog';
import { LocationReaders } from '../ingestion/source/LocationReaders';
import { IngestionModels, DescriptorParsers, HigherOrderOperations } from '..';
import { EntityPolicies } from '@backstage/catalog-model';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'catalog-backend' });

  const db = await DatabaseManager.createInMemoryDatabase(logger);

  const entitiesCatalog = new DatabaseEntitiesCatalog(db);
  const locationsCatalog = new DatabaseLocationsCatalog(db);
  const ingestionModel = new IngestionModels(
    new LocationReaders(),
    new DescriptorParsers(),
    new EntityPolicies(),
  );
  const higherOrderOperation = new HigherOrderOperations(
    entitiesCatalog,
    locationsCatalog,
    ingestionModel,
    logger,
  );

  logger.debug('Creating application...');
  const app = await createStandaloneApplication({
    enableCors: options.enableCors,
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    logger,
  });

  logger.debug('Starting application server...');
  return await new Promise((resolve, reject) => {
    const server = app.listen(options.port, (err?: Error) => {
      if (err) {
        reject(err);
        return;
      }

      logger.info(`Listening on port ${options.port}`);
      resolve(server);
    });
  });
}
