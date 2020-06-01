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

import {
  errorHandler,
  getRootLogger,
  notFoundHandler,
  requestLoggingHandler,
} from '@backstage/backend-common';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { Server } from 'http';
import { Logger } from 'winston';
import { createRouter } from './service';

export type ServerConfig = {
  port: number;
  logger: Logger;
};

function readConfig() {
  const port = Number(process.env.PLUGIN_PORT) || 3003;
  const logger = getRootLogger().child({ service: 'mock-idp-backend' });
  return { port, logger };
}

async function startStandaloneServer(config: ServerConfig): Promise<Server> {
  const { port, logger } = config;
  logger.debug('Creating application...');

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(requestLoggingHandler());
  app.use(await createRouter({ logger }));
  app.use(notFoundHandler());
  app.use(errorHandler());

  logger.debug('Starting application server...');

  process.on('SIGINT', () => {
    logger.info('CTRL+C pressed; exiting.');
    process.exit(0);
  });

  return await new Promise((resolve, reject) => {
    const server = app.listen(port, (err?: Error) => {
      if (err) {
        reject(err);
        return;
      }

      logger.info(`Listening on port ${port}`);
      resolve(server);
    });
  });
}

startStandaloneServer(readConfig()).catch(err => {
  console.error(err.stack || err);
  process.exit(1);
});
