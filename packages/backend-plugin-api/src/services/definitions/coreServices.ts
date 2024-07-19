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

import { createServiceRef } from '../system';

/**
 * All core services references
 *
 * @public
 */
export namespace coreServices {
  /**
   * Handles token authentication and credentials management.
   *
   * See {@link AuthService}
   * and {@link https://backstage.io/docs/backend-system/core-services/auth | the service docs}
   * for more information.
   *
   * @public
   */
  export const auth = createServiceRef<import('./AuthService').AuthService>({
    id: 'core.auth',
  });

  /**
   * Authenticated user information retrieval.
   *
   * See {@link UserInfoService}
   * and {@link https://backstage.io/docs/backend-system/core-services/user-info | the service docs}
   * for more information.
   *
   * @public
   */
  export const userInfo = createServiceRef<
    import('./UserInfoService').UserInfoService
  >({
    id: 'core.userInfo',
  });

  /**
   * Key-value store for caching data.
   *
   * See {@link CacheService}
   * and {@link https://backstage.io/docs/backend-system/core-services/cache | the service docs}
   * for more information.
   *
   * @public
   */
  export const cache = createServiceRef<import('./CacheService').CacheService>({
    id: 'core.cache',
  });

  /**
   * Access to static configuration.
   *
   * See {@link RootConfigService}
   * and {@link https://backstage.io/docs/backend-system/core-services/root-config | the service docs}
   * for more information.
   *
   * @public
   */
  export const rootConfig = createServiceRef<
    import('./RootConfigService').RootConfigService
  >({ id: 'core.rootConfig', scope: 'root' });

  /**
   * Database access and management via `knex`.
   *
   * See {@link DatabaseService}
   * and {@link https://backstage.io/docs/backend-system/core-services/database | the service docs}
   * for more information.
   *
   * @public
   */
  export const database = createServiceRef<
    import('./DatabaseService').DatabaseService
  >({ id: 'core.database' });

  /**
   * Service discovery for inter-plugin communication.
   *
   * See {@link DiscoveryService}
   * and {@link https://backstage.io/docs/backend-system/core-services/discovery | the service docs}
   * for more information.
   *
   * @public
   */
  export const discovery = createServiceRef<
    import('./DiscoveryService').DiscoveryService
  >({ id: 'core.discovery' });

  /**
   * The service reference for the plugin scoped {@link RootHealthService}.
   */
  export const rootHealth = createServiceRef<
    import('./RootHealthService').RootHealthService
  >({ id: 'core.rootHealth', scope: 'root' });

  /**
   * Authentication of HTTP requests.
   *
   * See {@link HttpAuthService}
   * and {@link https://backstage.io/docs/backend-system/core-services/http-auth | the service docs}
   * for more information.
   *
   * @public
   */
  export const httpAuth = createServiceRef<
    import('./HttpAuthService').HttpAuthService
  >({ id: 'core.httpAuth' });

  /**
   * HTTP route registration for plugins.
   *
   * See {@link HttpRouterService}
   * and {@link https://backstage.io/docs/backend-system/core-services/http-router | the service docs}
   * for more information.
   *
   * @public
   */
  export const httpRouter = createServiceRef<
    import('./HttpRouterService').HttpRouterService
  >({ id: 'core.httpRouter' });

  /**
   * Registration of plugin startup and shutdown lifecycle hooks.
   *
   * See {@link LifecycleService}
   * and {@link https://backstage.io/docs/backend-system/core-services/lifecycle | the service docs}
   * for more information.
   *
   * @public
   */
  export const lifecycle = createServiceRef<
    import('./LifecycleService').LifecycleService
  >({ id: 'core.lifecycle' });

  /**
   * Plugin-level logging.
   *
   * See {@link LoggerService}
   * and {@link https://backstage.io/docs/backend-system/core-services/logger | the service docs}
   * for more information.
   *
   * @public
   */
  export const logger = createServiceRef<
    import('./LoggerService').LoggerService
  >({ id: 'core.logger' });

  /**
   * Permission system integration for authorization of user actions.
   *
   * See {@link PermissionsService}
   * and {@link https://backstage.io/docs/backend-system/core-services/permissions | the service docs}
   * for more information.
   *
   * @public
   */
  export const permissions = createServiceRef<
    import('./PermissionsService').PermissionsService
  >({ id: 'core.permissions' });

  /**
   * Built-in service for accessing metadata about the current plugin.
   *
   * See {@link PluginMetadataService}
   * and {@link https://backstage.io/docs/backend-system/core-services/plugin-metadata | the service docs}
   * for more information.
   *
   * @public
   */
  export const pluginMetadata = createServiceRef<
    import('./PluginMetadataService').PluginMetadataService
  >({ id: 'core.pluginMetadata' });

  /**
   * The service reference for the root scoped {@link RedactionsService}.
   *
   * @public
   */
  export const redactions = createServiceRef<
    import('./RedactionsService').RedactionsService
  >({ id: 'core.redactions', scope: 'root' });

  /**
   * HTTP route registration for root services.
   *
   * See {@link RootHttpRouterService}
   * and {@link https://backstage.io/docs/backend-system/core-services/root-http-router | the service docs}
   * for more information.
   *
   * @public
   */
  export const rootHttpRouter = createServiceRef<
    import('./RootHttpRouterService').RootHttpRouterService
  >({ id: 'core.rootHttpRouter', scope: 'root' });

  /**
   * Registration of backend startup and shutdown lifecycle hooks.
   *
   * See {@link RootLifecycleService}
   * and {@link https://backstage.io/docs/backend-system/core-services/root-lifecycle | the service docs}
   * for more information.
   *
   * @public
   */
  export const rootLifecycle = createServiceRef<
    import('./RootLifecycleService').RootLifecycleService
  >({ id: 'core.rootLifecycle', scope: 'root' });

  /**
   * Root-level logging.
   *
   * See {@link RootLoggerService}
   * and {@link https://backstage.io/docs/backend-system/core-services/root-logger | the service docs}
   * for more information.
   *
   * @public
   */
  export const rootLogger = createServiceRef<
    import('./RootLoggerService').RootLoggerService
  >({ id: 'core.rootLogger', scope: 'root' });

  /**
   * Scheduling of distributed background tasks.
   *
   * See {@link SchedulerService}
   * and {@link https://backstage.io/docs/backend-system/core-services/scheduler | the service docs}
   * for more information.
   *
   * @public
   */
  export const scheduler = createServiceRef<
    import('./SchedulerService').SchedulerService
  >({ id: 'core.scheduler' });

  /**
   * Deprecated service authentication service, use the `auth` service instead.
   *
   * See {@link TokenManagerService}
   * and {@link https://backstage.io/docs/backend-system/core-services/token-manager | the service docs}
   * for more information.
   *
   * @public
   * @deprecated Please migrate to the new `coreServices.auth`, `coreServices.httpAuth`, and `coreServices.userInfo` services as needed instead
   */
  export const tokenManager = createServiceRef<
    import('./TokenManagerService').TokenManagerService
  >({ id: 'core.tokenManager' });

  /**
   * Reading content from external systems.
   *
   * See {@link UrlReaderService}
   * and {@link https://backstage.io/docs/backend-system/core-services/url-reader | the service docs}
   * for more information.
   *
   * @public
   */
  export const urlReader = createServiceRef<
    import('./UrlReaderService').UrlReaderService
  >({ id: 'core.urlReader' });

  /**
   * Deprecated user authentication service, use the `auth` service instead.
   *
   * See {@link IdentityService}
   * and {@link https://backstage.io/docs/backend-system/core-services/identity | the service docs}
   * for more information.
   *
   * @public
   * @deprecated Please migrate to the new `coreServices.auth`, `coreServices.httpAuth`, and `coreServices.userInfo` services as needed instead
   */
  export const identity = createServiceRef<
    import('./IdentityService').IdentityService
  >({ id: 'core.identity' });
}
