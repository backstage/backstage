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

import compression from 'compression';
import cors from 'cors';
import express, { Router } from 'express';
import helmet from 'helmet';
import { Server } from 'http';
import { Logger } from 'winston';
import { getRootLogger } from '../logging';
import {
  errorHandler,
  notFoundHandler,
  requestLoggingHandler,
} from '../middleware';
import { ServiceBuilder } from './types';

const DEFAULT_PORT = 7000;

export class ServiceBuilderImpl implements ServiceBuilder {
  private port: number | undefined;
  private logger: Logger | undefined;
  private corsOptions: cors.CorsOptions | undefined;
  private routers: [string, Router][];

  constructor() {
    this.routers = [];
  }

  setPort(port: number): ServiceBuilder {
    this.port = port;
    return this;
  }

  setLogger(logger: Logger): ServiceBuilder {
    this.logger = logger;
    return this;
  }

  enableCors(options: cors.CorsOptions): ServiceBuilder {
    this.corsOptions = options;
    return this;
  }

  addRouter(root: string, router: Router): ServiceBuilder {
    this.routers.push([root, router]);
    return this;
  }

  start(): Promise<Server> {
    const app = express();
    const { port, logger, corsOptions } = this.getOptions();

    app.use(helmet());
    if (corsOptions) {
      app.use(cors(corsOptions));
    }
    app.use(compression());
    app.use(express.json());
    app.use(requestLoggingHandler());
    for (const [root, route] of this.routers) {
      app.use(root, route);
    }
    app.use(notFoundHandler());
    app.use(errorHandler());

    return new Promise((resolve, reject) => {
      app.on('error', e => {
        logger.error(`Failed to start up on port ${port}, ${e}`);
        reject(e);
      });
      const server = app.listen(port, () => {
        logger.info(`Listening on port ${port}`);
      });
      resolve(server);
    });
  }

  private getOptions(): {
    port: number;
    logger: Logger;
    corsOptions?: cors.CorsOptions;
  } {
    let port: number;
    if (this.port !== undefined) {
      port = this.port;
    } else {
      port = parseInt(process.env.PORT ?? '', 10) || DEFAULT_PORT;
    }

    let logger: Logger;
    if (this.logger) {
      logger = this.logger;
    } else {
      logger = getRootLogger();
    }

    return {
      port,
      logger,
      corsOptions: this.corsOptions,
    };
  }
}
