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
  DockerContainerRunner,
  SingleHostDiscovery,
  UrlReader,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import {
  DirectoryPreparer,
  Preparers,
  TechdocsGenerator,
} from '@backstage/techdocs-common';
import Docker from 'dockerode';
import { Server } from 'http';
import { Logger } from 'winston';
import { createRouter } from './router';
import awilix from 'awilix';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'techdocs-backend' });
  const config = new ConfigReader({
    techdocs: {
      publisher: {
        type: 'local',
      },
    },
  });
  const discovery = SingleHostDiscovery.fromConfig(config);
  const mockUrlReader: jest.Mocked<UrlReader> = {
    read: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  logger.debug('Creating application...');
  const preparers = new Preparers();
  const directoryPreparer = new DirectoryPreparer(
    config,
    logger,
    mockUrlReader,
  );
  preparers.register('dir', directoryPreparer);

  const dockerClient = new Docker();

  /**
   * Awilix example.
   */
  const container = awilix.createContainer();

  const techDocsGeneratorFactory = ({
    containerRunner, // Injected by awilix based on name
  }: {
    containerRunner: DockerContainerRunner;
  }) => {
    return TechdocsGenerator.fromConfig(config, {
      logger,
      containerRunner,
    });
  };

  container.register({
    /**
     *  Registering already instantiated implementation
     */
    dockerClient: awilix.asValue(dockerClient),
    /**
     *  Registering a class directly. Constructor argument object expects 'dockerClient' property, which is injected
     *  automatically based on name
     */
    containerRunner: awilix.asClass(DockerContainerRunner),
    /**
     *  Registering a factory method. Factory args object expects 'containerRunner' property, which is injected
     *  automatically based on name
     */
    techdocsGenerator: awilix.asFunction(techDocsGeneratorFactory),
  });

  logger.debug('Starting application server...');
  const router = await createRouter(
    {
      preparers,
      logger,
      config,
      discovery,
    },
    container,
  );
  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/techdocs', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }
  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
