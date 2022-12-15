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

const backend = createBackend({
  services: [
    createServiceFactory({
      service: coreServices.httpRouter,
      deps: {
        healthcheck: coreServices.healthcheck,
        metrics: coreServices.metrics,
      },
      factory({healthcheck, metrics}) {
        return HttpRouter.create({
          middleware: [
            createHealthcheckMiddleware(healthcheck),
            createMetricsMiddleware(metrics),
          ]
        })
      }
    }),
    httpRouterFactory({
      deps: {
        healthcheck: coreServices.healthcheck,
        metrics: coreServices.metrics,
      },
      factory({healthcheck, metrics}) {
        return RootHttpRouter.create({
          indexPluginId: 'app',
          middleware: [
            createHealthcheckMiddleware(healthcheck),
            createMetricsMiddleware(metrics),
          ]
        })
      }
    }),
    httpRouterFactory({
      middlewareFactories: [{
        deps: {
          metrics: coreServices.metrics,
        },
        factory({healthcheck, metrics}) {
          return createMetricsMiddleware(metrics)
        }
      }]
    })
  ]
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
  add(() => Promise<void>): void;
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
      async init({rootHttpRouter, healthchecks}) {
        rootHttpRouter.use(createHealthcheckMiddleware(healthchecks));
      }
    })
  }
})


backend.add(httpRouterFactory(), {
  deps: {
    healthcheck: coreServices.healthcheck,
    metrics: coreServices.metrics,
  },
  decorate(ext, {healthcheck, metrics}) {
    ext.addMiddleware(createHealthcheckMiddleware(healthcheck));
  }
});

backend.add(healthcheckServiceModule());
backend.add(metricsHandlerServiceModule());

backend.add(catalogPlugin());
backend.add(scaffolderCatalogModule());
backend.add(appPlugin({ appPackageName: 'example-app' }));
backend.start();
