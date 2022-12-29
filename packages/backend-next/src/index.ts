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

import { catalogPlugin } from '@backstage/plugin-catalog-backend';
import { scaffolderCatalogModule } from '@backstage/plugin-scaffolder-backend';
import { createBackend } from '@backstage/backend-defaults';
import { appPlugin } from '@backstage/plugin-app-backend';
import { createServiceBuilder } from '@backstage/backend-common';
import {
  coreServices,
  createServiceFactory,
  ServiceRef,
} from '@backstage/backend-plugin-api';
import { Handler } from 'express';
import Router from 'express-promise-router';

/*

export function createServiceFactory<
  TService,
  TScope extends 'root' | 'plugin',
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TOpts extends object | undefined = undefined,
>(config: {
  service: ServiceRef<TService, TScope>;
  deps: TDeps;
  factory(
    deps: ServiceRefsToInstances<TDeps, 'root'>,
    options: TOpts,
  ): TScope extends 'root'
    ? Promise<TImpl>
    : Promise<(deps: ServiceRefsToInstances<TDeps>) => Promise<TImpl>>;
}): undefined extends TOpts
  ? (options?: TOpts) => ServiceFactory<TService>
  : (options: TOpts) => ServiceFactory<TService> {

*/

/*

Things that could need root versions:
 - logger
 - healthcheck
 - httpRouter
 - metrics
 - tracing

*/

// What a root + plugins scoped health check service could look like
interface RootHeathcheckService {
  setHealth(pluginId: string, health: string): void;
  getHealth(): Map<string, string>;
}

// This root service is very much boilerplate and clutters the API surface :(
createServiceFactory({
  service: coreServices.rootHealthcheck,
  deps: {
    logger: coreServices.rootLogger,
  },
  factory({ logger }) {
    return RootHealthchecker.create({ logger });
  },
});

interface HeathcheckService {
  setHealth(health: string): void;
}

createServiceFactory({
  service: coreServices.healthcheck,
  deps: {
    rootHttpService: coreServices.rootHttpService,
    plugin: coreServices.pluginMetadata,
  },
  factory({ rootHealthcheck }) {
    // root scope
    const manager = new HealthcheckManager();
    // It's waaaaaaaay nicer if we can just do this instead of any of the solutions explored below.
    // Let's try to find workarounds for the root middleware instead, rather than making it the default pattern.
    rootHttpService.use('/healthcheck', manager.createRouter());

    return ({ plugin }) => {
      return manager.createPluginInstance(plugin);
    };
  },
});

// Note: this doesn't work yet, but it what it could kind of look like
export type HttpRouterFactoryOptions<
  TDeps extends { [name in string]: ServiceRef<unknown> },
> = {
  /**
   * The plugin ID used for the index route. Defaults to 'app'
   */
  indexPlugin?: string;

  middlewareFactory: {
    deps: TDeps;
    factory(
      deps: ServiceRefsToInstances<TDeps, 'root'>,
    ): Promise<(deps: ServiceRefsToInstances<TDeps>) => Promise<Handler[]>>;
  };
};

// attempted implementation of the meta factory pattern, gets pretty ugly, doesn't work as is
export const httpRouterFactory = <
  TDeps extends { [key in string]: ServiceRef<unknown> },
>(
  options: HttpRouterFactoryOptions<TDeps>,
) =>
  createServiceFactory({
    service: coreServices.httpRouter,
    deps: {
      ...options.middlewareFactory.deps,

      config: coreServices.config,
      plugin: coreServices.pluginMetadata,
    },
    async factory(deps) {
      const { config, plugin } = deps;

      const defaultPluginId = options?.indexPlugin ?? 'app';

      const apiRouter = Router();
      const rootRouter = Router();

      // Only root scoped services available here, so we need to extract root variants
      // of a lot of the built-in services if we want to do this.
      const middleware = await options.middlewareFactory.factory(deps);

      const service = createServiceBuilder(module)
        .loadConfig(config)
        .addRouter('/api', apiRouter)
        .addRouter('', rootRouter);

      await service.start();

      return async ({ plugin }) => {
        const pluginId = plugin.getId();
        return {
          use(handler: Handler) {
            if (pluginId === defaultPluginId) {
              rootRouter.use(handler);
            } else {
              apiRouter.use(`/${pluginId}`, handler);
            }
          },
        };
      };
    },
  });

const backend = createBackend({
  services: [
    // Meta factory pattern, doesn't work, it's alright-ish
    httpRouterFactory({
      middlewareFactory: {
        deps: {
          logger: coreServices.rootLogger,
          metrics: coreServices.rootMetrics,
        },
        async factory({ logger, metrics }) {
          return [
            createLoggerMiddleware(logger),
            createMetricsMiddleware(metrics),
          ];
        },
      },
    }),

    // This seems a lot simpler, just have only the metrics be installed as a root middleware
    // The healthecheck we can install via the httpRootService directly
    httpRouterFactory({
      middleware: [middlewares.cors(), middlewares.harden(), metrics()],
    }),
  ],
});

backend.add(catalogPlugin());
backend.add(scaffolderCatalogModule());
backend.add(appPlugin({ appPackageName: 'example-app' }));
backend.start();

const backend = createBackend({
  services: [
    createServiceFactory({
      service: coreServices.httpRouter,
      deps: {
        healthcheck: coreServices.healthcheck,
        metrics: coreServices.metrics,
        config: coreServices.config,
        logger: coreServices.logger,
      },
      factory({ healthcheck, metrics, config, logger }) {
        return HttpRouter.fromConfig(config, {
          logger,
          middleware: [
            createHealthcheckMiddleware(healthcheck),
            createMetricsMiddleware(metrics),
          ],
        });
      },
    }),
    httpRouterFactory({
      middlewareFactory: {
        deps: {
          healthcheck: coreServices.healthcheck,
          metrics: coreServices.metrics,
        },
        factory({ healthcheck, metrics }) {
          return RootHttpRouter.create({
            indexPluginId: 'app',
            middleware: [
              createHealthcheckMiddleware(healthcheck),
              createMetricsMiddleware(metrics),
            ],
          });
        },
      },
    }),
    httpRouterFactory({
      middlewareFactories: [
        {
          deps: {
            metrics: coreServices.metrics,
          },
          factory({ healthcheck, metrics }) {
            return createMetricsMiddleware(metrics);
          },
        },
      ],
    }),
    httpRouterFactory({
      middlewareFactories: [MetricsMiddleware.factory({})],
    }),
  ],
});

export const healthcheckServiceModule = createBackendServiceModule({
  moduleId: 'derp',
  service: coreServices.httpRouter,
  register(env) {
    env.registerInit({
      deps: {
        rootHttpRouter: coreServiceExtensions.rootHttpRouter,
      },
      async init({ rootHttpRouter }) {
        rootHttpRouter.use(createHealthcheckMiddleware(healthcheck));
      },
    });
  },
});

interface HealthChecksService {
  add(cb: () => Promise<void>): void;
  check(): Promise<void>;
}
export const healthcheckPlugin = createBackendPlugin({
  pluginId: 'healthcheck',
  register(env) {
    env.registerInit({
      deps: {
        rootHttpRouter: coreServices.rootHttpRouter,
        healthchecks: coreServices.healthchecks,
      },
      async init({ rootHttpRouter, healthchecks }) {
        rootHttpRouter.use(createHealthcheckMiddleware(healthchecks));
      },
    });
  },
});

backend.add(httpRouterFactory(), {
  deps: {
    healthcheck: coreServices.healthcheck,
    metrics: coreServices.metrics,
  },
  decorate(ext, { healthcheck, metrics }) {
    ext.addMiddleware(createHealthcheckMiddleware(healthcheck));
  },
});

backend.add(healthcheckServiceModule());
backend.add(metricsHandlerServiceModule());

backend.add(catalogPlugin());
backend.add(scaffolderCatalogModule());
backend.add(appPlugin({ appPackageName: 'example-app' }));
backend.start();
