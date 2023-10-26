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

import {
  RootConfigService,
  coreServices,
  createServiceFactory,
  LifecycleService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import express, { RequestHandler, Express } from 'express';
import {
  createHttpServer,
  MiddlewareFactory,
  readHttpServerOptions,
} from '../../../http';
import { DefaultRootHttpRouter } from './DefaultRootHttpRouter';

/**
 * @public
 */
export interface RootHttpRouterConfigureContext {
  app: Express;
  middleware: MiddlewareFactory;
  routes: RequestHandler;
  config: RootConfigService;
  logger: LoggerService;
  lifecycle: LifecycleService;
}

/**
 * @public
 */
export type RootHttpRouterFactoryOptions = {
  /**
   * The path to forward all unmatched requests to. Defaults to '/api/app' if
   * not given. Disables index path behavior if false is given.
   */
  indexPath?: string | false;

  /**
   * Allows you to customize the creation of the express app, by attaching a set
   * of middleware and the given routes in the desired order. If no configure
   * callback is given, a default set of middleware for error handling, logging
   * etc are added around the routes.
   */
  configure?(context: RootHttpRouterConfigureContext): void;
};

function defaultConfigure(context: RootHttpRouterConfigureContext) {
  const { app, routes, middleware } = context;
  app.use(middleware.helmet());
  app.use(middleware.cors());
  app.use(middleware.compression());
  app.use(middleware.logging());
  app.use(routes);
  app.use(middleware.error());
}

/** @public */
export const rootHttpRouterServiceFactory = createServiceFactory(
  (options?: RootHttpRouterFactoryOptions) => ({
    service: coreServices.rootHttpRouter,
    deps: {
      config: coreServices.rootConfig,
      rootLogger: coreServices.rootLogger,
      lifecycle: coreServices.rootLifecycle,
    },
    async factory({ config, rootLogger, lifecycle }) {
      const { indexPath, configure = defaultConfigure } = options ?? {};
      const logger = rootLogger.child({ service: 'rootHttpRouter' });
      const app = express();

      const router = DefaultRootHttpRouter.create({ indexPath });
      const middleware = MiddlewareFactory.create({ config, logger });

      configure({
        app,
        routes: router.handler(),
        middleware,
        config,
        logger,
        lifecycle,
      });

      const server = await createHttpServer(
        app,
        readHttpServerOptions(config.getOptionalConfig('backend')),
        { logger },
      );

      lifecycle.addShutdownHook(() => server.stop());

      await server.start();

      return router;
    },
  }),
);
