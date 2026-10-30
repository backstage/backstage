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

import { auditorServiceFactory } from '@backstage/backend-defaults/auditor';
import { cacheServiceFactory } from '@backstage/backend-defaults/cache';
import { databaseServiceFactory } from '@backstage/backend-defaults/database';
import { HostDiscovery } from '@backstage/backend-defaults/discovery';
import { httpRouterServiceFactory } from '@backstage/backend-defaults/httpRouter';
import { lifecycleServiceFactory } from '@backstage/backend-defaults/lifecycle';
import { loggerServiceFactory } from '@backstage/backend-defaults/logger';
import { permissionsServiceFactory } from '@backstage/backend-defaults/permissions';
import { permissionsRegistryServiceFactory } from '@backstage/backend-defaults/permissionsRegistry';
import { rootHealthServiceFactory } from '@backstage/backend-defaults/rootHealth';
import { rootHttpRouterServiceFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { rootLifecycleServiceFactory } from '@backstage/backend-defaults/rootLifecycle';
import { urlReaderServiceFactory } from '@backstage/backend-defaults/urlReader';
import {
  AuthService,
  BackstageCredentials,
  BackstageUserInfo,
  DatabaseService,
  DiscoveryService,
  HttpAuthService,
  RootInstanceMetadataService,
  RootSystemMetadataService,
  PermissionsService,
  RootConfigService,
  SchedulerService,
  ServiceFactory,
  ServiceRef,
  UserInfoService,
  coreServices,
  createServiceFactory,
  RootLoggerService,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import { EventsService, eventsServiceRef } from '@backstage/plugin-events-node';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { JsonObject } from '@backstage/types';
import { Knex } from 'knex';
import { MockAuthService } from './MockAuthService';
import { MockHttpAuthService } from './MockHttpAuthService';
import { MockRootLoggerService } from './MockRootLoggerService';
import { MockUserInfoService } from './MockUserInfoService';
import { mockCredentials } from './mockCredentials';
import { MockEventsService } from './MockEventsService';
import { MockPermissionsService } from './MockPermissionsService';
import { createServiceMock } from './createServiceMock';
import { MockSchedulerService } from './MockSchedulerService';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ObservableConfigProxy } from '../../../config-loader/src/sources/ObservableConfigProxy';

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
  TInstances extends 'singleton' | 'multiton',
  TOptions extends [options?: object] = [],
>(
  ref: ServiceRef<TService, TScope, TInstances>,
  factory: (...options: TOptions) => TService,
): (...options: TOptions) => ServiceFactory<TService, TScope, TInstances> {
  const factoryWithOptions = (...options: TOptions) =>
    createServiceFactory({
      service: ref as ServiceRef<TService, any, any>,
      deps: {},
      async factory() {
        return factory(...options);
      },
    });
  return Object.assign(
    factoryWithOptions,
    factoryWithOptions(...([undefined] as unknown as TOptions)),
  ) as ServiceFactory<TService, TScope, TInstances> &
    ((...options: TOptions) => ServiceFactory<TService, TScope, TInstances>);
}

const mockRootConfig = (
  options?: mockServices.rootConfig.Options,
): RootConfigService & { update(options: { data: JsonObject }): void } => {
  const config = ObservableConfigProxy.create(new AbortController());
  config.setConfig(new ConfigReader(options?.data ?? {}, 'mock-config'));
  return Object.assign(config, {
    update({ data }: { data: JsonObject }): void {
      config.setConfig(new ConfigReader(data, 'mock-config'));
    },
  });
};

const mockRootLogger = (
  options?: mockServices.rootLogger.Options,
): RootLoggerService => MockRootLoggerService.create(options);

const mockAuth = (options?: {
  pluginId?: string;
  disableDefaultAuthPolicy?: boolean;
}): AuthService =>
  new MockAuthService({
    pluginId: options?.pluginId ?? 'test',
    disableDefaultAuthPolicy: Boolean(options?.disableDefaultAuthPolicy),
  });

const mockDiscovery = (): DiscoveryService =>
  HostDiscovery.fromConfig(
    new ConfigReader({
      backend: {
        // Invalid port to make sure that requests are always mocked
        baseUrl: 'http://localhost:0',
        listen: { port: 0 },
      },
    }),
  );

const mockHttpAuth = (options?: {
  pluginId?: string;
  /**
   * The default credentials to use if there are no credentials present in the
   * incoming request.
   *
   * By default all requests without credentials are treated as authenticated
   * as the default mock user as returned from `mockCredentials.user()`.
   */
  defaultCredentials?: BackstageCredentials;
}): HttpAuthService =>
  new MockHttpAuthService(
    options?.pluginId ?? 'test',
    options?.defaultCredentials ?? mockCredentials.user(),
  );

const mockUserInfo = (
  customInfo?: Partial<BackstageUserInfo>,
): UserInfoService => new MockUserInfoService(customInfo);

const mockDatabase = (options: {
  knex: Knex;
  migrations?: { skip?: boolean };
}): DatabaseService => ({
  getClient: async () => options.knex,
  migrations: options.migrations,
});

const mockPermissions = (options?: {
  result: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
}): PermissionsService => new MockPermissionsService(options);

const mockScheduler = (): SchedulerService => new MockSchedulerService();

const mockEvents = (): EventsService => new MockEventsService();

const mockRootInstanceMetadata = (): RootInstanceMetadataService => ({
  getId: () => 'mock',
  getInstalledPlugins: () => Promise.resolve([]),
});

const mockRootSystemMetadata = (): RootSystemMetadataService => ({
  getInstalledPlugins: () => Promise.resolve([]),
});

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
export const mockServices = Object.freeze({
  rootConfig: Object.freeze(
    Object.assign(mockRootConfig, {
      factory: simpleFactoryWithOptions(
        coreServices.rootConfig,
        mockRootConfig,
      ),
      mock: createServiceMock(coreServices.rootConfig, () => ({
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
      })),
    }),
  ),

  rootLogger: Object.freeze(
    Object.assign(mockRootLogger, {
      factory: simpleFactoryWithOptions(
        coreServices.rootLogger,
        mockRootLogger,
      ),
      mock: createServiceMock(coreServices.rootLogger, () => ({
        child: jest.fn(),
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
      })),
    }),
  ),

  auditor: Object.freeze({
    factory: () => auditorServiceFactory,
    mock: createServiceMock(coreServices.auditor, () => ({
      createEvent: jest.fn(async _ => {
        return {
          success: jest.fn(),
          fail: jest.fn(),
        };
      }),
    })),
  }),

  auth: Object.freeze(
    Object.assign(mockAuth, {
      factory: () =>
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
        }),
      mock: createServiceMock(coreServices.auth, () => ({
        authenticate: jest.fn(),
        getNoneCredentials: jest.fn(),
        getOwnServiceCredentials: jest.fn(),
        isPrincipal: jest.fn() as any,
        getPluginRequestToken: jest.fn(),
        getLimitedUserToken: jest.fn(),
        listPublicServiceKeys: jest.fn(),
      })),
    }),
  ),

  discovery: Object.freeze(
    Object.assign(mockDiscovery, {
      factory: () =>
        createServiceFactory({
          service: coreServices.discovery,
          deps: {},
          factory: () => mockDiscovery(),
        }),
      mock: createServiceMock(coreServices.discovery, () => ({
        getBaseUrl: jest.fn(),
        getExternalBaseUrl: jest.fn(),
      })),
    }),
  ),

  /**
   * Creates a mock implementation of the `HttpAuthService`.
   *
   * By default all requests without credentials are treated as requests from
   * the default mock user principal. This behavior can be configured with the
   * `defaultCredentials` option.
   */
  httpAuth: Object.freeze(
    Object.assign(mockHttpAuth, {
      /**
       * Creates a mock service factory for the `HttpAuthService`.
       *
       * By default all requests without credentials are treated as requests from
       * the default mock user principal. This behavior can be configured with the
       * `defaultCredentials` option.
       */
      factory: (options?: { defaultCredentials?: BackstageCredentials }) =>
        createServiceFactory({
          service: coreServices.httpAuth,
          deps: { plugin: coreServices.pluginMetadata },
          factory: ({ plugin }) =>
            new MockHttpAuthService(
              plugin.getId(),
              options?.defaultCredentials ?? mockCredentials.user(),
            ),
        }),
      mock: createServiceMock(coreServices.httpAuth, () => ({
        credentials: jest.fn(),
        issueUserCookie: jest.fn(),
      })),
    }),
  ),

  /**
   * Creates a mock implementation of the `UserInfoService`.
   *
   * By default it extracts the user's entity ref from a user principal and
   * returns that as the only ownership entity ref, but this can be overridden
   * by passing in a custom set of user info.
   */
  userInfo: Object.freeze(
    Object.assign(mockUserInfo, {
      /**
       * Creates a mock service factory for the `UserInfoService`.
       *
       * By default it extracts the user's entity ref from a user principal and
       * returns that as the only ownership entity ref.
       */
      factory: () =>
        createServiceFactory({
          service: coreServices.userInfo,
          deps: {},
          factory() {
            return new MockUserInfoService();
          },
        }),
      mock: createServiceMock(coreServices.userInfo, () => ({
        getUserInfo: jest.fn(),
      })),
    }),
  ),

  // TODO(Rugvip): Not all core services have implementations available here yet.
  //               some may need a bit more refactoring for it to be simpler to
  //               re-implement functioning mock versions here.
  cache: Object.freeze({
    factory: () => cacheServiceFactory,
    mock: createServiceMock(coreServices.cache, () => ({
      delete: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      withOptions: jest.fn(),
    })),
  }),

  /**
   * Creates a mock implementation of the
   * {@link @backstage/backend-plugin-api#coreServices}.database. Just returns
   * the given `knex` instance, which is useful in combination with the
   * {@link TestDatabases} facility.
   */
  database: Object.freeze(
    Object.assign(mockDatabase, {
      /**
       * Creates a mock factory for the
       * {@link @backstage/backend-plugin-api#coreServices}.database. Just returns
       * the given `knex` instance if you supply one, which is useful in
       * combination with the {@link TestDatabases} facility. Otherwise, it
       * returns the regular default database factory which reads config settings.
       */
      factory: (options?: { knex: Knex; migrations?: { skip?: boolean } }) =>
        options
          ? createServiceFactory({
              service: coreServices.database,
              deps: {},
              factory: () => mockDatabase(options),
            })
          : databaseServiceFactory,
      /**
       * Creates a mock of the
       * {@link @backstage/backend-plugin-api#coreServices}.database, optionally
       * with some given method implementations.
       */
      mock: createServiceMock(coreServices.database, () => ({
        getClient: jest.fn(),
      })),
    }),
  ),

  rootHealth: Object.freeze({
    factory: () => rootHealthServiceFactory,
    mock: createServiceMock(coreServices.rootHealth, () => ({
      getLiveness: jest.fn(),
      getReadiness: jest.fn(),
    })),
  }),

  httpRouter: Object.freeze({
    factory: () => httpRouterServiceFactory,
    mock: createServiceMock(coreServices.httpRouter, () => ({
      use: jest.fn(),
      addAuthPolicy: jest.fn(),
    })),
  }),

  rootHttpRouter: Object.freeze({
    factory: () => rootHttpRouterServiceFactory(),
    mock: createServiceMock(coreServices.rootHttpRouter, () => ({
      use: jest.fn(),
    })),
  }),

  lifecycle: Object.freeze({
    factory: () => lifecycleServiceFactory,
    mock: createServiceMock(coreServices.lifecycle, () => ({
      addShutdownHook: jest.fn(),
      addStartupHook: jest.fn(),
    })),
  }),

  logger: Object.freeze({
    factory: () => loggerServiceFactory,
    mock: createServiceMock(coreServices.logger, () => createLoggerMock()),
  }),

  /**
   * Creates a functional mock implementation of the
   * {@link @backstage/backend-plugin-api#PermissionsService}.
   */
  permissions: Object.freeze(
    Object.assign(mockPermissions, {
      /**
       * Creates a mock factory for the
       * {@link @backstage/backend-plugin-api#coreServices}.permissions. Just
       * returns the given `result` if you supply one. Otherwise, it returns the
       * regular default permissions factory.
       */
      factory: (options?: {
        result: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
      }) =>
        options?.result
          ? createServiceFactory({
              service: coreServices.permissions,
              deps: {},
              factory: () => new MockPermissionsService(options),
            })
          : permissionsServiceFactory,
      /**
       * Creates a mock of the
       * {@link @backstage/backend-plugin-api#coreServices}.permissions,
       * optionally with some given method implementations.
       */
      mock: createServiceMock(coreServices.permissions, () => ({
        authorize: jest.fn(),
        authorizeConditional: jest.fn(),
      })),
    }),
  ),

  permissionsRegistry: Object.freeze({
    factory: () => permissionsRegistryServiceFactory,
    mock: createServiceMock(coreServices.permissionsRegistry, () => ({
      addPermissionRules: jest.fn(),
      addPermissions: jest.fn(),
      addResourceType: jest.fn(),
      getPermissionRuleset: jest.fn(),
    })),
  }),

  rootLifecycle: Object.freeze({
    factory: () => rootLifecycleServiceFactory,
    mock: createServiceMock(coreServices.rootLifecycle, () => ({
      addShutdownHook: jest.fn(),
      addBeforeShutdownHook: jest.fn(),
      addStartupHook: jest.fn(),
    })),
  }),

  scheduler: Object.freeze(
    Object.assign(mockScheduler, {
      factory: (options?: {
        skipTaskRunOnStartup?: boolean;
        includeManualTasksOnStartup?: boolean;
        includeInitialDelayedTasksOnStartup?: boolean;
      }) => new MockSchedulerService().factory(options),
      mock: createServiceMock(coreServices.scheduler, () => ({
        createScheduledTaskRunner: jest.fn(),
        getScheduledTasks: jest.fn(),
        scheduleTask: jest.fn(),
        triggerTask: jest.fn(),
        cancelTask: jest.fn(),
      })),
    }),
  ),

  urlReader: Object.freeze({
    factory: () => urlReaderServiceFactory,
    mock: createServiceMock(coreServices.urlReader, () => ({
      readTree: jest.fn(),
      readUrl: jest.fn(),
      search: jest.fn(),
    })),
  }),

  /**
   * Creates a functional mock implementation of the
   * {@link @backstage/backend-events-node#eventsServiceRef}.
   */
  events: Object.freeze(
    Object.assign(mockEvents, {
      /**
       * Creates a functional mock factory for the
       * {@link @backstage/backend-events-node#eventsServiceRef}.
       */
      factory: simpleFactoryWithOptions(eventsServiceRef, mockEvents),
      /**
       * Creates a mock of the
       * {@link @backstage/backend-events-node#eventsServiceRef}, optionally
       * with some given method implementations.
       */
      mock: createServiceMock(eventsServiceRef, () => ({
        publish: jest.fn(),
        subscribe: jest.fn(),
      })),
    }),
  ),

  rootInstanceMetadata: Object.freeze(
    Object.assign(mockRootInstanceMetadata, {
      mock: createServiceMock(coreServices.rootInstanceMetadata, () => ({
        getId: jest.fn().mockReturnValue('mock'),
        getInstalledPlugins: jest.fn(),
      })),
      factory: simpleFactoryWithOptions(
        coreServices.rootInstanceMetadata,
        mockRootInstanceMetadata,
      ),
    }),
  ),

  rootSystemMetadata: Object.freeze(
    Object.assign(mockRootSystemMetadata, {
      mock: createServiceMock(coreServices.rootSystemMetadata, () => ({
        getInstalledPlugins: jest.fn(),
      })),
      factory: simpleFactoryWithOptions(
        coreServices.rootSystemMetadata,
        mockRootSystemMetadata,
      ),
    }),
  ),
});

/**
 * Types for the options of the `mockServices` implementations.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare -- types-only namespace that merges with the object above
export declare namespace mockServices {
  namespace rootConfig {
    type Options = { data?: JsonObject };
  }
  namespace rootLogger {
    type Options = {
      level?: 'none' | 'error' | 'warn' | 'info' | 'debug';
    };
  }
}
