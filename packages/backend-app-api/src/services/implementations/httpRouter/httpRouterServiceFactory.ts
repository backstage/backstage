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
  LifecycleService,
  LoggerService,
  RootConfigService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { Handler, RequestHandler, Router } from 'express';
import PromiseRouter from 'express-promise-router';
import { MiddlewareFactory } from '../../../http';
import { createLifecycleMiddleware } from './createLifecycleMiddleware';

/**
 * @public
 */
export interface HttpRouterConfigureContext {
  pluginRouter: Router;
  middleware: MiddlewareFactory;
  routes: RequestHandler;
  rootConfig: RootConfigService;
  logger: LoggerService;
  lifecycle: LifecycleService;
}

function defaultConfigure(context: HttpRouterConfigureContext): void {
  const { pluginRouter, routes, middleware, lifecycle } = context;
  pluginRouter.use(createLifecycleMiddleware({ lifecycle }));
  pluginRouter.use(routes);
  pluginRouter.use(middleware.notFound());
}

/**
 * @public
 */
export interface HttpRouterFactoryOptions {
  /**
   * The base path under which plugins are installed, defaults to `/api`.
   */
  basePath?: string;

  /**
   * A callback used to generate the path for each plugin, defaults to
   * `${basePath}/{pluginId}`. This is a power user option and normally you'll
   * do well to just add a base path or leave them both unset.
   */
  getPath?(pluginId: string): string;

  /**
   * Allows you to customize the creation of the plugin router, by attaching a
   * set of middleware and the given routes in the desired order. If no
   * configure callback is given, a default set of middleware are added around
   * the routes, e.g. for 404 handling.
   */
  configure?(context: HttpRouterConfigureContext): void;
}

/** @public */
export const httpRouterServiceFactory = createServiceFactory(
  (options?: HttpRouterFactoryOptions) => ({
    service: coreServices.httpRouter,
    deps: {
      config: coreServices.rootConfig,
      logger: coreServices.rootLogger,
      plugin: coreServices.pluginMetadata,
      lifecycle: coreServices.lifecycle,
      rootHttpRouter: coreServices.rootHttpRouter,
    },
    createRootContext({ config, logger, rootHttpRouter }) {
      const { notFoundHandlerPath } = getOptions(options);
      const middleware = MiddlewareFactory.create({ config, logger });

      const pluginsRouter = PromiseRouter();
      rootHttpRouter.use('', pluginsRouter);

      if (notFoundHandlerPath) {
        rootHttpRouter.use(notFoundHandlerPath, middleware.notFound());
      }

      return {
        pluginsRouter,
        middleware,
      };
    },
    async factory(
      { config, logger, plugin, lifecycle },
      { pluginsRouter, middleware },
    ) {
      const { getPath, configure } = getOptions(options);

      const path = getPath(plugin.getId());
      const pluginRouter = PromiseRouter();
      const routes = PromiseRouter();

      pluginsRouter.use(path, pluginRouter);

      configure({
        pluginRouter,
        middleware,
        routes,
        rootConfig: config,
        logger,
        lifecycle,
      });

      return {
        use(handler: Handler) {
          routes.use(handler);
        },
      };
    },
  }),
);

function getOptions(options?: HttpRouterFactoryOptions): {
  notFoundHandlerPath?: string;
  getPath(pluginId: string): string;
  configure(context: HttpRouterConfigureContext): void;
} {
  let basePath = options?.basePath;
  if (basePath !== undefined) {
    basePath = adjustSlashes(basePath);
  }

  // Specifically if the user passed in a getPath but no base path, we cannot be
  // sure on what path to place a notFound handler since in theory
  const notFoundHandlerPath: string | undefined =
    !basePath && options?.getPath ? undefined : basePath ?? '/api';

  const getPath =
    options?.getPath ??
    ((pluginId: string) => `${basePath ?? '/api'}/${pluginId}`);

  const configure = options?.configure ?? defaultConfigure;

  return {
    notFoundHandlerPath,
    getPath,
    configure,
  };
}

function adjustSlashes(path: string): string {
  let result = path;

  if (result !== '/' && result.endsWith('/')) {
    result = result.slice(0, -1);
  }
  if (!result.startsWith('/')) {
    result = `/${result}`;
  }

  return result;
}
