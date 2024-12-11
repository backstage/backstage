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

import { cacheServiceFactory } from '@backstage/backend-defaults/cache';
import { databaseServiceFactory } from '@backstage/backend-defaults/database';
import { HostDiscovery } from '@backstage/backend-defaults/discovery';
import { httpRouterServiceFactory } from '@backstage/backend-defaults/httpRouter';
import { lifecycleServiceFactory } from '@backstage/backend-defaults/lifecycle';
import { loggerServiceFactory } from '@backstage/backend-defaults/logger';
import { permissionsServiceFactory } from '@backstage/backend-defaults/permissions';
import { rootHealthServiceFactory } from '@backstage/backend-defaults/rootHealth';
import { rootHttpRouterServiceFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { rootLifecycleServiceFactory } from '@backstage/backend-defaults/rootLifecycle';
import { schedulerServiceFactory } from '@backstage/backend-defaults/scheduler';
import { urlReaderServiceFactory } from '@backstage/backend-defaults/urlReader';
import {
  AuthService,
  BackstageCredentials,
  BackstageUserInfo,
  DatabaseService,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
  RootConfigService,
  ServiceFactory,
  ServiceRef,
  UserInfoService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import {
  eventsServiceFactory,
  eventsServiceRef,
} from '@backstage/plugin-events-node';
import { JsonObject } from '@backstage/types';
import { MockAuthService } from './MockAuthService';
import { MockHttpAuthService } from './MockHttpAuthService';
import { MockRootLoggerService } from './MockRootLoggerService';
import { MockUserInfoService } from './MockUserInfoService';
import { mockCredentials } from './mockCredentials';
import { Knex } from 'knex';

/** @internal */
function createLoggerMock() {
  return {
    child: jest.fn().mockImplementation(createLoggerMock),
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}

/** @internal */
function simpleFactoryWithOptions<
  TService,
  TScope extends 'root' | 'plugin',
  TOptions extends [options?: object] = [],
>(
  ref: ServiceRef<TService, TScope>,
  factory: (...options: TOptions) => TService,
): (...options: TOptions) => ServiceFactory<TService, TScope> {
  const factoryWithOptions = (...options: TOptions) =>
    createServiceFactory({
      service: ref as ServiceRef<TService, any>,
      deps: {},
      async factory() {
        return factory(...options);
      },
    });
  return Object.assign(
    factoryWithOptions,
    factoryWithOptions(...([undefined] as unknown as TOptions)),
  ) as ServiceFactory<TService, TScope> &
    ((...options: TOptions) => ServiceFactory<TService, TScope>);
}

/** @public */
export type ServiceMock<TService> = {
  factory: ServiceFactory<TService>;
} & {
  [Key in keyof TService]: TService[Key] extends (
    ...args: infer Args
  ) => infer Return
    ? TService[Key] & jest.MockInstance<Return, Args>
    : TService[Key];
};

/** @internal */
function simpleMock<TService>(
  ref: ServiceRef<TService, any>,
  mockFactory: () => jest.Mocked<TService>,
): (partialImpl?: Partial<TService>) => ServiceMock<TService> {
  return partialImpl => {
    const mock = mockFactory();
    if (partialImpl) {
      for (const [key, impl] of Object.entries(partialImpl)) {
        if (typeof impl === 'function') {
          (mock as any)[key].mockImplementation(impl);
        } else {
          (mock as any)[key] = impl;
        }
      }
    }
    return Object.assign(mock, {
      factory: createServiceFactory({
        service: ref,
        deps: {},
        factory: () => mock,
      }),
    }) as ServiceMock<TService>;
  };
}

/**
 * Mock implementations of the core services, to be used in tests.
 *
 * @public
 * @remarks
 *
 * There are some variations among the services depending on what needs tests
 * might have, but overall there are three main usage patterns:
 *
 * 1. Creating an actual fake service instance, often with a simplified version
 * of functionality, by calling the mock service itself as a function.
 *
 * ```ts
 * // The function often accepts parameters that control its behavior
 * const foo = mockServices.foo();
 * ```
 *
 * 2. Creating a mock service, where all methods are replaced with jest mocks, by
 * calling the service's `mock` function.
 *
 * ```ts
 * // You can optionally supply a subset of its methods to implement
 * const foo = mockServices.foo.mock({
 *   someMethod: () => 'mocked result',
 * });
 * // After exercising your test, you can make assertions on the mock:
 * expect(foo.someMethod).toHaveBeenCalledTimes(2);
 * expect(foo.otherMethod).toHaveBeenCalledWith(testData);
 * ```
 *
 * 3. Creating a service factory that behaves similarly to the mock as per above.
 *
 * ```ts
 * await startTestBackend({
 *   features: [
 *     mockServices.foo.factory({
 *       someMethod: () => 'mocked result',
 *     })
 *   ],
 * });
 * ```
 */
export namespace mockServices {
  export function rootConfig(options?: rootConfig.Options): RootConfigService {
    return new ConfigReader(options?.data, 'mock-config');
  }
  export namespace rootConfig {
    export type Options = { data?: JsonObject };

    export const factory = simpleFactoryWithOptions(
      coreServices.rootConfig,
      rootConfig,
    );
    export const mock = simpleMock(coreServices.rootConfig, () => ({
      get: jest.fn(),
      getBoolean: jest.fn(),
      getConfig: jest.fn(),
      getConfigArray: jest.fn(),
      getNumber: jest.fn(),
      getOptional: jest.fn(),
      getOptionalBoolean: jest.fn(),
      getOptionalConfig: jest.fn(),
      getOptionalConfigArray: jest.fn(),
      getOptionalNumber: jest.fn(),
      getOptionalString: jest.fn(),
      getOptionalStringArray: jest.fn(),
      getString: jest.fn(),
      getStringArray: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
    }));
  }

  export function rootLogger(options?: rootLogger.Options): LoggerService {
    return MockRootLoggerService.create(options);
  }
  export namespace rootLogger {
    export type Options = {
      level?: 'none' | 'error' | 'warn' | 'info' | 'debug';
    };

    export const factory = simpleFactoryWithOptions(
      coreServices.rootLogger,
      rootLogger,
    );
    export const mock = simpleMock(coreServices.rootLogger, () => ({
      child: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    }));
  }

  export function auth(options?: {
    pluginId?: string;
    disableDefaultAuthPolicy?: boolean;
  }): AuthService {
    return new MockAuthService({
      pluginId: options?.pluginId ?? 'test',
      disableDefaultAuthPolicy: Boolean(options?.disableDefaultAuthPolicy),
    });
  }
  export namespace auth {
    export const factory = () =>
      createServiceFactory({
        service: coreServices.auth,
        deps: {
          plugin: coreServices.pluginMetadata,
          config: coreServices.rootConfig,
        },
        factory({ plugin, config }) {
          const disableDefaultAuthPolicy = Boolean(
            config.getOptionalBoolean(
              'backend.auth.dangerouslyDisableDefaultAuthPolicy',
            ),
          );
          return new MockAuthService({
            pluginId: plugin.getId(),
            disableDefaultAuthPolicy,
          });
        },
      });
    export const mock = simpleMock(coreServices.auth, () => ({
      authenticate: jest.fn(),
      getNoneCredentials: jest.fn(),
      getOwnServiceCredentials: jest.fn(),
      isPrincipal: jest.fn() as any,
      getPluginRequestToken: jest.fn(),
      getLimitedUserToken: jest.fn(),
      listPublicServiceKeys: jest.fn(),
    }));
  }

  export function discovery(): DiscoveryService {
    return HostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          // Invalid port to make sure that requests are always mocked
          baseUrl: 'http://localhost:0',
          listen: { port: 0 },
        },
      }),
    );
  }
  export namespace discovery {
    export const factory = () =>
      createServiceFactory({
        service: coreServices.discovery,
        deps: {},
        factory: () => discovery(),
      });
    export const mock = simpleMock(coreServices.discovery, () => ({
      getBaseUrl: jest.fn(),
      getExternalBaseUrl: jest.fn(),
    }));
  }

  /**
   * Creates a mock implementation of the `HttpAuthService`.
   *
   * By default all requests without credentials are treated as requests from
   * the default mock user principal. This behavior can be configured with the
   * `defaultCredentials` option.
   */
  export function httpAuth(options?: {
    pluginId?: string;
    /**
     * The default credentials to use if there are no credentials present in the
     * incoming request.
     *
     * By default all requests without credentials are treated as authenticated
     * as the default mock user as returned from `mockCredentials.user()`.
     */
    defaultCredentials?: BackstageCredentials;
  }): HttpAuthService {
    return new MockHttpAuthService(
      options?.pluginId ?? 'test',
      options?.defaultCredentials ?? mockCredentials.user(),
    );
  }
  export namespace httpAuth {
    /**
     * Creates a mock service factory for the `HttpAuthService`.
     *
     * By default all requests without credentials are treated as requests from
     * the default mock user principal. This behavior can be configured with the
     * `defaultCredentials` option.
     */
    export const factory = (options?: {
      defaultCredentials?: BackstageCredentials;
    }) =>
      createServiceFactory({
        service: coreServices.httpAuth,
        deps: { plugin: coreServices.pluginMetadata },
        factory: ({ plugin }) =>
          new MockHttpAuthService(
            plugin.getId(),
            options?.defaultCredentials ?? mockCredentials.user(),
          ),
      });
    export const mock = simpleMock(coreServices.httpAuth, () => ({
      credentials: jest.fn(),
      issueUserCookie: jest.fn(),
    }));
  }

  /**
   * Creates a mock implementation of the `UserInfoService`.
   *
   * By default it extracts the user's entity ref from a user principal and
   * returns that as the only ownership entity ref, but this can be overridden
   * by passing in a custom set of user info.
   */
  export function userInfo(
    customInfo?: Partial<BackstageUserInfo>,
  ): UserInfoService {
    return new MockUserInfoService(customInfo);
  }
  export namespace userInfo {
    /**
     * Creates a mock service factory for the `UserInfoService`.
     *
     * By default it extracts the user's entity ref from a user principal and
     * returns that as the only ownership entity ref.
     */
    export const factory = () =>
      createServiceFactory({
        service: coreServices.userInfo,
        deps: {},
        factory() {
          return new MockUserInfoService();
        },
      });
    export const mock = simpleMock(coreServices.userInfo, () => ({
      getUserInfo: jest.fn(),
    }));
  }

  // TODO(Rugvip): Not all core services have implementations available here yet.
  //               some may need a bit more refactoring for it to be simpler to
  //               re-implement functioning mock versions here.
  export namespace cache {
    export const factory = () => cacheServiceFactory;
    export const mock = simpleMock(coreServices.cache, () => ({
      delete: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      withOptions: jest.fn(),
    }));
  }

  /**
   * Creates a mock implementation of the
   * {@link @backstage/backend-plugin-api#coreServices.database}. Just returns
   * the given `knex` instance, which is useful in combination with the
   * {@link TestDatabases} facility.
   */
  export function database(options: {
    knex: Knex;
    migrations?: { skip?: boolean };
  }): DatabaseService {
    return {
      getClient: async () => options.knex,
      migrations: options.migrations,
    };
  }
  export namespace database {
    /**
     * Creates a mock factory for the
     * {@link @backstage/backend-plugin-api#coreServices.database}. Just returns
     * the given `knex` instance if you supply one, which is useful in
     * combination with the {@link TestDatabases} facility. Otherwise, it
     * returns the regular default database factory which reads config settings.
     */
    export const factory = (options?: {
      knex: Knex;
      migrations?: { skip?: boolean };
    }) =>
      options
        ? createServiceFactory({
            service: coreServices.database,
            deps: {},
            factory: () => database(options),
          })
        : databaseServiceFactory;
    /**
     * Creates a mock of the
     * {@link @backstage/backend-plugin-api#coreServices.database}, optionally
     * with some given method implementations.
     */
    export const mock = simpleMock(coreServices.database, () => ({
      getClient: jest.fn(),
    }));
  }

  export namespace rootHealth {
    export const factory = () => rootHealthServiceFactory;
    export const mock = simpleMock(coreServices.rootHealth, () => ({
      getLiveness: jest.fn(),
      getReadiness: jest.fn(),
    }));
  }

  export namespace httpRouter {
    export const factory = () => httpRouterServiceFactory;
    export const mock = simpleMock(coreServices.httpRouter, () => ({
      use: jest.fn(),
      addAuthPolicy: jest.fn(),
    }));
  }

  export namespace rootHttpRouter {
    export const factory = () => rootHttpRouterServiceFactory();
    export const mock = simpleMock(coreServices.rootHttpRouter, () => ({
      use: jest.fn(),
    }));
  }

  export namespace lifecycle {
    export const factory = () => lifecycleServiceFactory;
    export const mock = simpleMock(coreServices.lifecycle, () => ({
      addShutdownHook: jest.fn(),
      addStartupHook: jest.fn(),
    }));
  }

  export namespace logger {
    export const factory = () => loggerServiceFactory;
    export const mock = simpleMock(coreServices.logger, () =>
      createLoggerMock(),
    );
  }

  export namespace permissions {
    export const factory = () => permissionsServiceFactory;
    export const mock = simpleMock(coreServices.permissions, () => ({
      authorize: jest.fn(),
      authorizeConditional: jest.fn(),
    }));
  }

  export namespace rootLifecycle {
    export const factory = () => rootLifecycleServiceFactory;
    export const mock = simpleMock(coreServices.rootLifecycle, () => ({
      addShutdownHook: jest.fn(),
      addBeforeShutdownHook: jest.fn(),
      addStartupHook: jest.fn(),
    }));
  }

  export namespace scheduler {
    export const factory = () => schedulerServiceFactory;
    export const mock = simpleMock(coreServices.scheduler, () => ({
      createScheduledTaskRunner: jest.fn(),
      getScheduledTasks: jest.fn(),
      scheduleTask: jest.fn(),
      triggerTask: jest.fn(),
    }));
  }

  export namespace urlReader {
    export const factory = () => urlReaderServiceFactory;
    export const mock = simpleMock(coreServices.urlReader, () => ({
      readTree: jest.fn(),
      readUrl: jest.fn(),
      search: jest.fn(),
    }));
  }

  export namespace events {
    export const factory = () => eventsServiceFactory;
    export const mock = simpleMock(eventsServiceRef, () => ({
      publish: jest.fn(),
      subscribe: jest.fn(),
    }));
  }
}
