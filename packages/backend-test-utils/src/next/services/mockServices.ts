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
  ConfigService,
  coreServices,
  createServiceFactory,
  IdentityService,
  LoggerService,
  ServiceFactory,
  ServiceRef,
  TokenManagerService,
} from '@backstage/backend-plugin-api';
import {
  cacheServiceFactory,
  databaseServiceFactory,
  httpRouterServiceFactory,
  lifecycleServiceFactory,
  loggerServiceFactory,
  permissionsServiceFactory,
  rootLifecycleServiceFactory,
  schedulerServiceFactory,
  urlReaderServiceFactory,
} from '@backstage/backend-app-api';
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { MockIdentityService } from './MockIdentityService';
import { MockRootLoggerService } from './MockRootLoggerService';

function simpleFactory<
  TService,
  TScope extends 'root' | 'plugin',
  TOptions extends [options?: object] = [],
>(
  ref: ServiceRef<TService, TScope>,
  factory: (...options: TOptions) => TService,
): (...options: TOptions) => ServiceFactory<TService, TScope> {
  return createServiceFactory((options: unknown) => ({
    service: ref as ServiceRef<TService, any>,
    deps: {},
    async factory() {
      return (factory as any)(options);
    },
  })) as (...options: TOptions) => ServiceFactory<TService, any>;
}

/**
 * @public
 */
export namespace mockServices {
  export function config(options?: config.Options): ConfigService {
    return new ConfigReader(options?.data, 'mock-config');
  }
  export namespace config {
    export type Options = { data?: JsonObject };

    export const factory = simpleFactory(coreServices.config, config);
  }

  export function rootLogger(options?: rootLogger.Options): LoggerService {
    return MockRootLoggerService.create(options);
  }
  export namespace rootLogger {
    export type Options = {
      level?: 'none' | 'error' | 'warn' | 'info' | 'debug';
    };

    export const factory = simpleFactory(coreServices.rootLogger, rootLogger);
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
    export const factory = simpleFactory(
      coreServices.tokenManager,
      tokenManager,
    );
  }

  export function identity(): IdentityService {
    return new MockIdentityService();
  }
  export namespace identity {
    export const factory = simpleFactory(coreServices.identity, identity);
  }

  // TODO(Rugvip): Not all core services have implementations available here yet.
  //               some may need a bit more refactoring for it to be simpler to
  //               re-implement functioning mock versions here.
  export namespace cache {
    export const factory = cacheServiceFactory;
  }
  export namespace database {
    export const factory = databaseServiceFactory;
  }
  export namespace httpRouter {
    export const factory = httpRouterServiceFactory;
  }
  export namespace lifecycle {
    export const factory = lifecycleServiceFactory;
  }
  export namespace logger {
    export const factory = loggerServiceFactory;
  }
  export namespace permissions {
    export const factory = permissionsServiceFactory;
  }
  export namespace rootLifecycle {
    export const factory = rootLifecycleServiceFactory;
  }
  export namespace scheduler {
    export const factory = schedulerServiceFactory;
  }
  export namespace urlReader {
    export const factory = urlReaderServiceFactory;
  }
}
