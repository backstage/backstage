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

import { Config } from '@backstage/config';
import compression from 'compression';
import cors from 'cors';
import express, { Router, ErrorRequestHandler } from 'express';
import helmet, { HelmetOptions } from 'helmet';
import { ContentSecurityPolicyOptions } from 'helmet/dist/types/middlewares/content-security-policy';
import * as http from 'http';
import { LoggerService } from '@backstage/backend-plugin-api';
import { useHotCleanup } from '../../hot';
import { getRootLogger } from '../../logging';
import {
  errorHandler as defaultErrorHandler,
  notFoundHandler,
  requestLoggingHandler as defaultRequestLoggingHandler,
} from '../../middleware';
import { RequestLoggingHandlerFactory, ServiceBuilder } from '../types';
import {
  readCorsOptions,
  readHelmetOptions,
  readHttpServerOptions,
  HttpServerOptions,
  createHttpServer,
} from '@backstage/backend-app-api';

export type CspOptions = Record<string, string[]>;

export class ServiceBuilderImpl implements ServiceBuilder {
  private logger: LoggerService | undefined;
  private serverOptions: HttpServerOptions;
  private helmetOptions: HelmetOptions;
  private corsOptions: cors.CorsOptions;
  private routers: [string, Router][];
  private requestLoggingHandler: RequestLoggingHandlerFactory | undefined;
  private errorHandler: ErrorRequestHandler | undefined;
  private useDefaultErrorHandler: boolean;
  // Reference to the module where builder is created - needed for hot module
  // reloading
  private module: NodeModule;

  constructor(moduleRef: NodeModule) {
    this.routers = [];
    this.module = moduleRef;
    this.useDefaultErrorHandler = true;

    this.serverOptions = readHttpServerOptions();
    this.corsOptions = readCorsOptions();
    this.helmetOptions = readHelmetOptions();
  }

  loadConfig(config: Config): ServiceBuilder {
    const backendConfig = config.getOptionalConfig('backend');

    this.serverOptions = readHttpServerOptions(backendConfig);
    this.corsOptions = readCorsOptions(backendConfig);
    this.helmetOptions = readHelmetOptions(backendConfig);

    return this;
  }

  setPort(port: number): ServiceBuilder {
    this.serverOptions.listen.port = port;
    return this;
  }

  setHost(host: string): ServiceBuilder {
    this.serverOptions.listen.host = host;
    return this;
  }

  setLogger(logger: LoggerService): ServiceBuilder {
    this.logger = logger;
    return this;
  }

  setHttpsSettings(settings: {
    certificate: { key: string; cert: string } | { hostname: string };
  }): ServiceBuilder {
    if ('hostname' in settings.certificate) {
      this.serverOptions.https = {
        certificate: {
          ...settings.certificate,
          type: 'generated',
        },
      };
    } else {
      this.serverOptions.https = {
        certificate: {
          ...settings.certificate,
          type: 'plain',
        },
      };
    }
    return this;
  }

  enableCors(options: cors.CorsOptions): ServiceBuilder {
    this.corsOptions = options;
    return this;
  }

  setCsp(options: CspOptions): ServiceBuilder {
    const csp = this.helmetOptions.contentSecurityPolicy;
    this.helmetOptions.contentSecurityPolicy = {
      ...(typeof csp === 'object' ? csp : {}),
      directives: applyCspDirectives(options),
    };
    return this;
  }

  addRouter(root: string, router: Router): ServiceBuilder {
    this.routers.push([root, router]);
    return this;
  }

  setRequestLoggingHandler(
    requestLoggingHandler: RequestLoggingHandlerFactory,
  ) {
    this.requestLoggingHandler = requestLoggingHandler;
    return this;
  }

  setErrorHandler(errorHandler: ErrorRequestHandler) {
    this.errorHandler = errorHandler;
    return this;
  }

  disableDefaultErrorHandler() {
    this.useDefaultErrorHandler = false;
    return this;
  }

  async start(): Promise<http.Server> {
    const app = express();
    const logger = this.logger ?? getRootLogger();

    app.use(helmet(this.helmetOptions));
    app.use(cors(this.corsOptions));
    app.use(compression());
    app.use(
      (this.requestLoggingHandler ?? defaultRequestLoggingHandler)(logger),
    );
    for (const [root, route] of this.routers) {
      app.use(root, route);
    }
    app.use(notFoundHandler());

    if (this.errorHandler) {
      app.use(this.errorHandler);
    }

    if (this.useDefaultErrorHandler) {
      app.use(defaultErrorHandler());
    }

    const server = await createHttpServer(app, this.serverOptions, { logger });

    useHotCleanup(this.module, () =>
      server.stop().catch(error => {
        console.error(error);
      }),
    );

    await server.start();

    return server;
  }
}

// TODO(Rugvip): This is a duplicate of the same logic over in backend-app-api.
//               It's needed as we don't want to export this helper from there, but need
//               It to implement the setCsp method here.
export function applyCspDirectives(
  directives: Record<string, string[] | false> | undefined,
): ContentSecurityPolicyOptions['directives'] {
  const result: ContentSecurityPolicyOptions['directives'] =
    helmet.contentSecurityPolicy.getDefaultDirectives();

  // TODO(Rugvip): We currently use non-precompiled AJV for validation in the frontend, which uses eval.
  //               It should be replaced by any other solution that doesn't require unsafe-eval.
  result['script-src'] = ["'self'", "'unsafe-eval'"];

  // TODO(Rugvip): This is removed so that we maintained backwards compatibility
  //               when bumping to helmet v5, we could remove this as well as
  //               skip setting `useDefaults: false` in the future.
  delete result['form-action'];

  if (directives) {
    for (const [key, value] of Object.entries(directives)) {
      if (value === false) {
        delete result[key];
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}
