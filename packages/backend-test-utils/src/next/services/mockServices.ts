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
  coreServices,
  createServiceFactory,
  IdentityService,
  LoggerService,
  ServiceFactory,
  ServiceRef,
  TokenManagerService,
} from '@backstage/backend-plugin-api';
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
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { MockIdentityService } from './MockIdentityService';
import { MockRootLoggerService } from './MockRootLoggerService';

function simpleFactory<TService, TOptions extends [options?: object] = []>(
  ref: ServiceRef<TService>,
  factory: (...options: TOptions) => TService,
): (...options: TOptions) => ServiceFactory<TService> {
  return createServiceFactory((options: unknown) => ({
    service: ref as ServiceRef<TService, any>,
    deps: {},
    async factory() {
      return (factory as any)(options);
    },
  }));
}

/**
 * @alpha
 */
export namespace mockServices {
  export function config(options?: config.Options) {
    return new ConfigReader(options?.data, 'mock-config');
  }
  export namespace config {
    export type Options = { data?: JsonObject };

    export const ref = coreServices.config;
    export const factory = simpleFactory(ref, config);
  }

  export function rootLogger(options?: rootLogger.Options): LoggerService {
    return new MockRootLoggerService(options?.levels ?? false, {});
  }
  export namespace rootLogger {
    export type Options = {
      levels:
        | boolean
        | { error: boolean; warn: boolean; info: boolean; debug: boolean };
    };

    export const ref = coreServices.rootLogger;
    export const factory = simpleFactory(ref, rootLogger);
  }

  export function tokenManager(): TokenManagerService {
    return {
      async getToken(): Promise<{ token: string }> {
        return { token: 'mock-token' };
      },
      async authenticate(token: string): Promise<void> {
        if (token !== 'mock-token') {
          throw new Error('Invalid token');
        }
      },
    };
  }
  export namespace tokenManager {
    export const ref = coreServices.tokenManager;
    export const factory = simpleFactory(ref, tokenManager);
  }

  export function identity(): IdentityService {
    return new MockIdentityService();
  }
  export namespace identity {
    export const ref = coreServices.identity;
    export const factory = simpleFactory(ref, identity);
  }

  // TODO(Rugvip): Not all core services have implementations available here yet.
  //               some may need a bit more refactoring for it to be simpler to
  //               re-implement functioning mock versions here.
  export namespace cache {
    export const ref = coreServices.cache;
    export const factory = cacheFactory;
  }
  export namespace database {
    export const ref = coreServices.database;
    export const factory = databaseFactory;
  }
  export namespace httpRouter {
    export const ref = coreServices.httpRouter;
    export const factory = httpRouterFactory;
  }
  export namespace lifecycle {
    export const ref = coreServices.lifecycle;
    export const factory = lifecycleFactory;
  }
  export namespace logger {
    export const ref = coreServices.logger;
    export const factory = loggerFactory;
  }
  export namespace permissions {
    export const ref = coreServices.permissions;
    export const factory = permissionsFactory;
  }
  export namespace rootLifecycle {
    export const ref = coreServices.rootLifecycle;
    export const factory = rootLifecycleFactory;
  }
  export namespace scheduler {
    export const ref = coreServices.scheduler;
    export const factory = schedulerFactory;
  }
  export namespace urlReader {
    export const ref = coreServices.urlReader;
    export const factory = urlReaderFactory;
  }
}
