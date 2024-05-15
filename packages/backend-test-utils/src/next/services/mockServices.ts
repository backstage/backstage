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
  RootConfigService,
  coreServices,
  createServiceFactory,
  IdentityService,
  LoggerService,
  ServiceFactory,
  ServiceRef,
  TokenManagerService,
  AuthService,
  DiscoveryService,
  HttpAuthService,
  BackstageCredentials,
  BackstageUserInfo,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import {
  cacheServiceFactory,
  databaseServiceFactory,
  httpRouterServiceFactory,
  lifecycleServiceFactory,
  loggerServiceFactory,
  permissionsServiceFactory,
  rootHttpRouterServiceFactory,
  rootLifecycleServiceFactory,
  schedulerServiceFactory,
  urlReaderServiceFactory,
  discoveryServiceFactory,
  HostDiscovery,
} from '@backstage/backend-app-api';
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { MockIdentityService } from './MockIdentityService';
import { MockRootLoggerService } from './MockRootLoggerService';
import { MockAuthService } from './MockAuthService';
import { MockHttpAuthService } from './MockHttpAuthService';
import { mockCredentials } from './mockCredentials';
import { MockUserInfoService } from './MockUserInfoService';
import {
  eventsServiceFactory,
  eventsServiceRef,
} from '@backstage/plugin-events-node';

/** @internal */
function createLoggerMock() {
  return {
    child: jest.fn().mockImplementation(() => createLoggerMock()),
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}

/** @internal */
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
      })(),
    }) as ServiceMock<TService>;
  };
}

/**
 * @public
 */
export namespace mockServices {
  export function rootConfig(options?: rootConfig.Options): RootConfigService {
    return new ConfigReader(options?.data, 'mock-config');
  }
  export namespace rootConfig {
    export type Options = { data?: JsonObject };

    export const factory = simpleFactory(coreServices.rootConfig, rootConfig);
  }

  export function rootLogger(options?: rootLogger.Options): LoggerService {
    return MockRootLoggerService.create(options);
  }
  export namespace rootLogger {
    export type Options = {
      level?: 'none' | 'error' | 'warn' | 'info' | 'debug';
    };

    export const factory = simpleFactory(coreServices.rootLogger, rootLogger);
    export const mock = simpleMock(coreServices.rootLogger, () => ({
      child: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    }));
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
    export const mock = simpleMock(coreServices.tokenManager, () => ({
      authenticate: jest.fn(),
      getToken: jest.fn(),
    }));
  }

  export function identity(): IdentityService {
    return new MockIdentityService();
  }
  export namespace identity {
    export const factory = simpleFactory(coreServices.identity, identity);
    export const mock = simpleMock(coreServices.identity, () => ({
      getIdentity: jest.fn(),
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
    export const factory = createServiceFactory({
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
    export const factory = discoveryServiceFactory;
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
    export const factory = createServiceFactory(
      (options?: { defaultCredentials?: BackstageCredentials }) => ({
        service: coreServices.httpAuth,
        deps: { plugin: coreServices.pluginMetadata },
        factory: ({ plugin }) =>
          new MockHttpAuthService(
            plugin.getId(),
            options?.defaultCredentials ?? mockCredentials.user(),
          ),
      }),
    );
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
    export const factory = createServiceFactory({
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
    export const factory = cacheServiceFactory;
    export const mock = simpleMock(coreServices.cache, () => ({
      delete: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      withOptions: jest.fn(),
    }));
  }

  export namespace database {
    export const factory = databaseServiceFactory;
    export const mock = simpleMock(coreServices.database, () => ({
      getClient: jest.fn(),
    }));
  }

  export namespace httpRouter {
    export const factory = httpRouterServiceFactory;
    export const mock = simpleMock(coreServices.httpRouter, () => ({
      use: jest.fn(),
      addAuthPolicy: jest.fn(),
    }));
  }

  export namespace rootHttpRouter {
    export const factory = rootHttpRouterServiceFactory;
    export const mock = simpleMock(coreServices.rootHttpRouter, () => ({
      use: jest.fn(),
    }));
  }

  export namespace lifecycle {
    export const factory = lifecycleServiceFactory;
    export const mock = simpleMock(coreServices.lifecycle, () => ({
      addShutdownHook: jest.fn(),
      addStartupHook: jest.fn(),
    }));
  }

  export namespace logger {
    export const factory = loggerServiceFactory;

    export const mock = simpleMock(coreServices.logger, () =>
      createLoggerMock(),
    );
  }

  export namespace permissions {
    export const factory = permissionsServiceFactory;
    export const mock = simpleMock(coreServices.permissions, () => ({
      authorize: jest.fn(),
      authorizeConditional: jest.fn(),
    }));
  }

  export namespace rootLifecycle {
    export const factory = rootLifecycleServiceFactory;
    export const mock = simpleMock(coreServices.rootLifecycle, () => ({
      addShutdownHook: jest.fn(),
      addStartupHook: jest.fn(),
    }));
  }

  export namespace scheduler {
    export const factory = schedulerServiceFactory;
    export const mock = simpleMock(coreServices.scheduler, () => ({
      createScheduledTaskRunner: jest.fn(),
      getScheduledTasks: jest.fn(),
      scheduleTask: jest.fn(),
      triggerTask: jest.fn(),
    }));
  }

  export namespace urlReader {
    export const factory = urlReaderServiceFactory;
    export const mock = simpleMock(coreServices.urlReader, () => ({
      readTree: jest.fn(),
      readUrl: jest.fn(),
      search: jest.fn(),
    }));
  }

  export namespace events {
    export const factory = eventsServiceFactory;
    export const mock = simpleMock(eventsServiceRef, () => ({
      publish: jest.fn(),
      subscribe: jest.fn(),
    }));
  }
}
