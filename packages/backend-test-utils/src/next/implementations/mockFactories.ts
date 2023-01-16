/*
 * Copyright 2023 The Backstage Authors
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
  cacheFactory,
  databaseFactory,
  httpRouterFactory,
  lifecycleFactory,
  loggerFactory,
  permissionsFactory,
  rootLifecycleFactory,
  schedulerFactory,
  urlReaderFactory,
} from '@backstage/backend-app-api';
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { mockServices } from './mockServices';

/**
 * @alpha
 */
export namespace mockFactories {
  export const config = createServiceFactory(
    (options?: mockServices.config.Options) => ({
      service: coreServices.config,
      deps: {},
      async factory() {
        return mockServices.config(options);
      },
    }),
  );

  export const rootLogger = createServiceFactory(
    (options?: mockServices.rootLogger.Options) => ({
      service: coreServices.rootLogger,
      deps: {},
      async factory() {
        return mockServices.rootLogger(options);
      },
    }),
  );

  export const tokenManager = createServiceFactory({
    service: coreServices.tokenManager,
    deps: {},
    async factory() {
      return mockServices.tokenManager();
    },
  });

  export const identity = createServiceFactory({
    service: coreServices.identity,
    deps: {},
    async factory() {
      return mockServices.identity();
    },
  });

  // For all other services, we just use the default implementations
  export const cache = cacheFactory;
  export const database = databaseFactory;
  export const httpRouter = httpRouterFactory;
  export const lifecycle = lifecycleFactory;
  export const logger = loggerFactory;
  export const permissions = permissionsFactory;
  export const rootLifecycle = rootLifecycleFactory;
  export const scheduler = schedulerFactory;
  export const urlReader = urlReaderFactory;
}
