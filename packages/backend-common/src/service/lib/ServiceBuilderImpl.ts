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

import { ConfigReader } from '@backstage/config';
import compression from 'compression';
import cors from 'cors';
import express, { Router } from 'express';
import helmet from 'helmet';
import * as http from 'http';
import * as https from 'https';
import stoppable from 'stoppable';
import { Logger } from 'winston';
import { useHotCleanup } from '../../hot';
import { getRootLogger } from '../../logging';
import {
  errorHandler,
  notFoundHandler,
  requestLoggingHandler,
} from '../../middleware';
import { ServiceBuilder } from '../types';
import {
  readBaseOptions,
  readCorsOptions,
  readCertificateOptions,
  CertificateOptions,
} from './config';

const DEFAULT_PROTOCOL = 'https://';
const DEFAULT_PORT = 7000;
const DEFAULT_HOST = 'localhost';
const DEFAULT_BASEURL = `${DEFAULT_PROTOCOL}${DEFAULT_HOST}:${DEFAULT_PORT}`;

export class ServiceBuilderImpl implements ServiceBuilder {
  private port: number | undefined;
  private host: string | undefined;
  private baseUrl: string | undefined;
  private logger: Logger | undefined;
  private corsOptions: cors.CorsOptions | undefined;
  private certificateOptions: CertificateOptions | undefined;
  private routers: [string, Router][];
  // Reference to the module where builder is created - needed for hot module
  // reloading
  private module: NodeModule;

  constructor(module: NodeModule) {
    this.routers = [];
    this.module = module;
  }

  loadConfig(config: ConfigReader): ServiceBuilder {
    const backendConfig = config.getOptionalConfig('backend');
    if (!backendConfig) {
      return this;
    }

    const baseOptions = readBaseOptions(backendConfig);
    if (baseOptions.listenPort) {
      this.port = baseOptions.listenPort;
    }
    if (baseOptions.listenHost) {
      this.host = baseOptions.listenHost;
    }
    if (baseOptions.baseUrl) {
      this.baseUrl = baseOptions.baseUrl;
    }

    const corsOptions = readCorsOptions(backendConfig);
    if (corsOptions) {
      this.corsOptions = corsOptions;
    }

    const certificateOptions = readCertificateOptions(backendConfig);
    if (certificateOptions) {
      this.certificateOptions = certificateOptions;
    }
    return this;
  }

  setBaseUrl(baseUrl: string): ServiceBuilder {
    this.baseUrl = baseUrl;
    return this;
  }

  setPort(port: number): ServiceBuilder {
    this.port = port;
    return this;
  }

  setHost(host: string): ServiceBuilder {
    this.host = host;
    return this;
  }

  setLogger(logger: Logger): ServiceBuilder {
    this.logger = logger;
    return this;
  }

  setCertificateOptions(options: CertificateOptions): ServiceBuilder {
    this.certificateOptions = options;
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

  start(): Promise<http.Server> {
    const app = express();
    const {
      port,
      host,
      logger,
      corsOptions,
      baseUrl,
      certificateOptions,
    } = this.getOptions();

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

      const useHttps = baseUrl.indexOf(DEFAULT_PROTOCOL) > -1;
      let server: http.Server;

      if (useHttps) {
        const certificateAttributes: Array<any> = [];

        Object.getOwnPropertyNames(
          (certificateOptions?.attributes as any).data,
        ).forEach(propertyName => {
          certificateAttributes.push({
            name: propertyName,
            value: (certificateOptions?.attributes as any).data[propertyName],
          });
        });

        // TODO: Create a type def for selfsigned.
        const signatures = require('selfsigned').generate(
          certificateAttributes,
          {
            keySize: (certificateOptions?.key as any).data.size || 2048,
            algorithm:
              (certificateOptions?.key as any).data.algorithm || 'sha256',
            days: (certificateOptions?.key as any).data.days || 30,
          },
        );

        const credentials = { key: signatures.private, cert: signatures.cert };

        server = https.createServer(credentials, app) as http.Server;
      } else {
        server = http.createServer(app);
      }

      const stoppableServer = stoppable(server, 0);

      stoppableServer.listen(port, host);

      useHotCleanup(this.module, () =>
        stoppableServer.stop((e: any) => {
          if (e) console.error(e);
        }),
      );

      resolve(stoppableServer);
    });
  }

  private getOptions(): {
    port: number;
    host: string;
    baseUrl: string;
    logger: Logger;
    corsOptions?: cors.CorsOptions;
    certificateOptions?: CertificateOptions;
  } {
    return {
      port: this.port ?? DEFAULT_PORT,
      host: this.host ?? DEFAULT_HOST,
      baseUrl: this.baseUrl ?? DEFAULT_BASEURL,
      logger: this.logger ?? getRootLogger(),
      corsOptions: this.corsOptions,
      certificateOptions: this.certificateOptions,
    };
  }
}
