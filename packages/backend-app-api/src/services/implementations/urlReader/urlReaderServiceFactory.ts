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
  ReaderFactory,
  UrlReaders,
  defaultFactories,
} from '@backstage/backend-common';
import {
  ServiceRef,
  coreServices,
  createBackendModule,
  createExtensionPoint,
  createServiceFactory,
  createServiceModuleFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';

/* 

Open questions:
 - Should service factories/modules define their own ID for debugging/logging?

*/

type ReaderFactoriesExtensionPointType = {
  addReaderFactory(...factories: ReaderFactory[]): void;
};

export const urlReadersFactoriesExtensionPoint =
  createExtensionPoint<ReaderFactoriesExtensionPointType>({
    id: `${coreServices.urlReader.id}.factories`,
  });

// export const urlReadersFactoriesExtensionPoint =
//   createServiceExtensionPoint<ReaderFactoriesExtensionPointType>({
//     service: coreServices.urlReader,
//     id: 'factories',
//   });

// @backstage/backend-service-url-reader
// @backstage/backend-defaults/url-reader
export const urlReaderServiceFactory = createServiceFactory({
  // moduleId: 'urlReaderServiceFactory',
  register(reg) {
    const factories = new Array<ReaderFactory>();

    reg.registerExtensionPoint(urlReadersFactoriesExtensionPoint, {
      addReaderFactory(factory: ReaderFactory) {
        factories.push(factory);
      },
    });

    reg.registerServiceFactory({
      service: coreServices.urlReader,
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
      },
      async factory({ config, logger, plugin }) {
        return UrlReaders.default({
          config,
          logger,
          factories,
        });
      },
    });
  },
});

export const urlReaderServiceFactory = createServiceDerp({
  // moduleId: 'urlReaderServiceFactory',
  register(reg) {
    // This is borked, we need to have extension point implementations per plugin instead of shared for all plugins 🤯
    const factories = new Array<ReaderFactory>();

    reg.registerExtensionPoint(urlReadersFactoriesExtensionPoint, {
      addReaderFactory(factory: ReaderFactory) {
        factories.push(factory);
      },
    });

    reg.registerServiceFactory(
      createServiceFactory({
        service: coreServices.urlReader,
        deps: {
          config: coreServices.rootConfig,
          logger: coreServices.logger,
          __moduleDep1: coreServices.rootLogger,
        },
        createRootContext() {
          // TODO: should we be able to access extension points here? probably not
        },
        async factory({ config, logger, __moduleDep1, plugin }) {
          await myUrlReaderModule.init({ factories, rootLogger: __moduleDep1 });
          return UrlReaders.default({
            config,
            logger,
            factories,
          });
        },
      }),
    );
  },
});

import { urlReadersFactoriesExtensionPoint } from '@backstage/backend-defaults/url-reader';

// @backstage/backend-service-url-reader-module-my-reader
export const urlReaderServiceModule = createServiceModule({
  // pluginId: '',
  moduleId: 'myUrlReaderModule',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.rootLogger,
        factories: urlReadersFactoriesExtensionPoint,
      },
      async init({ factories, logger }) {
        factories.addReaderFactory(MyUrlReader.factory({ logger }));
      },
    });
  },
});

import { middlewareConfigurationExtensionPoint } from '@backstage/backend-defaults/root-http-router';

// @backstage/backend-service-url-reader-module-my-reader
backend.add(
  createServiceModule({
    moduleId: 'myMiddlewareConfiguration',
    register(reg) {
      reg.registerInit({
        deps: {
          httpRouter: middlewareConfigurationExtensionPoint,
        },
        async init({ httpRouter }) {
          httpRouter.configure(({ app, middleware, routes }) => {
            app.use(middleware.helmet());
            app.use(middleware.cors());
            app.use(middleware.compression());
            app.use(middleware.logging());
            app.use(routes);
            app.use(middleware.notFound());
            app.use(middleware.error());
          });
        },
      });
    },
  }),
);
