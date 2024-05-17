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
  createExtensionPoint,
  createServiceFactory,
  createServiceModuleFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';

type ReaderFactoriesExtensionPointType = {
  addReaderFactory(...factories: ReaderFactory[]): void;
};

const urlReadersFactoriesExtensionPoint =
  createExtensionPoint<ReaderFactoriesExtensionPointType>({
    id: 'urlreaders.factories',
  });

const { createServiceModule: createUrlReaderServiceModule } =
  createServiceModuleFactory<ReaderFactoriesExtensionPointType>({
    register(env) {
      const readerFactories = [] as ReaderFactory[];

      env.registerExtensionPoint(urlReadersFactoriesExtensionPoint, {
        addReaderFactory(...factories: ReaderFactory[]) {
          readerFactories.push(...factories);
        },
      });

      return { readerFactories };
    },
  });

/** @public */
export const urlReaderServiceFactory = createServiceFactory({
  service: coreServices.urlReader,
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.logger,
  },
  extensionPoints: {
    factories: urlReadersFactoriesExtensionPoint,
  },
  async factory({ config, logger, factories }) {
    return UrlReaders.default({
      config,
      logger,
      factories: factories.factories,
    });
  },
});

// export const defaultUrlFactoriesServiceRef = createServiceRef<{
//   getFactories(): ReaderFactory[];
// }>({
//   id: 'core.urlReader.factories',
//   scope: 'plugin',
//   async defaultFactory(service) {
//     return createServiceFactory({
//       service,
//       deps: {},
//       factory() {
//         return {
//           getFactories: () => defaultFactories,
//         };
//       },
//     });
//   },
// });

// export const urlReaderServiceFactory = createServiceFactory({
//   service: coreServices.urlReader,
//   deps: {
//     config: coreServices.rootConfig,
//     logger: coreServices.logger,
//     customizableService: defaultUrlFactoriesServiceRef,
//   },
//   async factory({ config, logger, customizableService }) {
//     console.log('result', customizableService.foo());
//     return UrlReaders.default({
//       config,
//       logger,
//     });
//   },
// });

export { createUrlReaderServiceModule };
