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

import { createServiceRef, ServiceRef } from '../system';

/**
 * The type of {@link coreServices}, with references to all core services.
 *
 * @public
 */
export interface CoreServices {
  /**
   * Handles token authentication and credentials management.
   *
   * See {@link AuthService}
   * and {@link https://backstage.io/docs/backend-system/core-services/auth | the service docs}
   * for more information.
   *
   * @public
   */
  readonly auth: ServiceRef<
    import('./AuthService').AuthService,
    'plugin',
    'singleton'
  >;

  /**
   * Authenticated user information retrieval.
   *
   * See {@link UserInfoService}
   * and {@link https://backstage.io/docs/backend-system/core-services/user-info | the service docs}
   * for more information.
   *
   * @public
   */
  readonly userInfo: ServiceRef<
    import('./UserInfoService').UserInfoService,
    'plugin',
    'singleton'
  >;

  /**
   * Key-value store for caching data.
   *
   * See {@link CacheService}
   * and {@link https://backstage.io/docs/backend-system/core-services/cache | the service docs}
   * for more information.
   *
   * @public
   */
  readonly cache: ServiceRef<
    import('./CacheService').CacheService,
    'plugin',
    'singleton'
  >;

  /**
   * Access to static configuration.
   *
   * See {@link RootConfigService}
   * and {@link https://backstage.io/docs/backend-system/core-services/root-config | the service docs}
   * for more information.
   *
   * @public
   */
  readonly rootConfig: ServiceRef<
    import('./RootConfigService').RootConfigService,
    'root',
    'singleton'
  >;

  /**
   * Database access and management via `knex`.
   *
   * See {@link DatabaseService}
   * and {@link https://backstage.io/docs/backend-system/core-services/database | the service docs}
   * for more information.
   *
   * @public
   */
  readonly database: ServiceRef<
    import('./DatabaseService').DatabaseService,
    'plugin',
    'singleton'
  >;

  /**
   * Service discovery for inter-plugin communication.
   *
   * See {@link DiscoveryService}
   * and {@link https://backstage.io/docs/backend-system/core-services/discovery | the service docs}
   * for more information.
   *
   * @public
   */
  readonly discovery: ServiceRef<
    import('./DiscoveryService').DiscoveryService,
    'plugin',
    'singleton'
  >;

  /**
   * The service reference for the plugin scoped {@link RootHealthService}.
   */
  readonly rootHealth: ServiceRef<
    import('./RootHealthService').RootHealthService,
    'root',
    'singleton'
  >;

  /**
   * Authentication of HTTP requests.
   *
   * See {@link HttpAuthService}
   * and {@link https://backstage.io/docs/backend-system/core-services/http-auth | the service docs}
   * for more information.
   *
   * @public
   */
  readonly httpAuth: ServiceRef<
    import('./HttpAuthService').HttpAuthService,
    'plugin',
    'singleton'
  >;

  /**
   * HTTP route registration for plugins.
   *
   * See {@link HttpRouterService}
   * and {@link https://backstage.io/docs/backend-system/core-services/http-router | the service docs}
   * for more information.
   *
   * @public
   */
  readonly httpRouter: ServiceRef<
    import('./HttpRouterService').HttpRouterService,
    'plugin',
    'singleton'
  >;

  /**
   * Registration of plugin startup and shutdown lifecycle hooks.
   *
   * See {@link LifecycleService}
   * and {@link https://backstage.io/docs/backend-system/core-services/lifecycle | the service docs}
   * for more information.
   *
   * @public
   */
  readonly lifecycle: ServiceRef<
    import('./LifecycleService').LifecycleService,
    'plugin',
    'singleton'
  >;

  /**
   * Plugin-level logging.
   *
   * See {@link LoggerService}
   * and {@link https://backstage.io/docs/backend-system/core-services/logger | the service docs}
   * for more information.
   *
   * @public
   */
  readonly logger: ServiceRef<
    import('./LoggerService').LoggerService,
    'plugin',
    'singleton'
  >;

  /**
   * Plugin-level auditing.
   *
   * See {@link AuditorService}
   * and {@link https://backstage.io/docs/backend-system/core-services/auditor | the service docs}
   * for more information.
   *
   * @public
   */
  readonly auditor: ServiceRef<
    import('./AuditorService').AuditorService,
    'plugin',
    'singleton'
  >;

  /**
   * Permission system integration for authorization of user actions.
   *
   * See {@link PermissionsService}
   * and {@link https://backstage.io/docs/backend-system/core-services/permissions | the service docs}
   * for more information.
   *
   * @public
   */
  readonly permissions: ServiceRef<
    import('./PermissionsService').PermissionsService,
    'plugin',
    'singleton'
  >;

  /**
   * Permission system integration for registering resources and permissions.
   *
   * See {@link PermissionsRegistryService}
   * and {@link https://backstage.io/docs/backend-system/core-services/permission-integrations | the service docs}
   * for more information.
   *
   * @public
   */
  readonly permissionsRegistry: ServiceRef<
    import('./PermissionsRegistryService').PermissionsRegistryService,
    'plugin',
    'singleton'
  >;

  /**
   * Built-in service for accessing metadata about the current plugin.
   *
   * See {@link PluginMetadataService}
   * and {@link https://backstage.io/docs/backend-system/core-services/plugin-metadata | the service docs}
   * for more information.
   *
   * @public
   */
  readonly pluginMetadata: ServiceRef<
    import('./PluginMetadataService').PluginMetadataService,
    'plugin',
    'singleton'
  >;

  /**
   * HTTP route registration for root services.
   *
   * See {@link RootHttpRouterService}
   * and {@link https://backstage.io/docs/backend-system/core-services/root-http-router | the service docs}
   * for more information.
   *
   * @public
   */
  readonly rootHttpRouter: ServiceRef<
    import('./RootHttpRouterService').RootHttpRouterService,
    'root',
    'singleton'
  >;

  /**
   * Registration of backend startup and shutdown lifecycle hooks.
   *
   * See {@link RootLifecycleService}
   * and {@link https://backstage.io/docs/backend-system/core-services/root-lifecycle | the service docs}
   * for more information.
   *
   * @public
   */
  readonly rootLifecycle: ServiceRef<
    import('./RootLifecycleService').RootLifecycleService,
    'root',
    'singleton'
  >;

  /**
   * Root-level logging.
   *
   * See {@link RootLoggerService}
   * and {@link https://backstage.io/docs/backend-system/core-services/root-logger | the service docs}
   * for more information.
   *
   * @public
   */
  readonly rootLogger: ServiceRef<
    import('./RootLoggerService').RootLoggerService,
    'root',
    'singleton'
  >;

  /**
   * Scheduling of distributed background tasks.
   *
   * See {@link SchedulerService}
   * and {@link https://backstage.io/docs/backend-system/core-services/scheduler | the service docs}
   * for more information.
   *
   * @public
   */
  readonly scheduler: ServiceRef<
    import('./SchedulerService').SchedulerService,
    'plugin',
    'singleton'
  >;

  /**
   * Reading content from external systems.
   *
   * See {@link UrlReaderService}
   * and {@link https://backstage.io/docs/backend-system/core-services/url-reader | the service docs}
   * for more information.
   *
   * @public
   */
  readonly urlReader: ServiceRef<
    import('./UrlReaderService').UrlReaderService,
    'plugin',
    'singleton'
  >;

  /**
   * Information about the current Backstage instance.
   *
   * @public
   */
  readonly rootInstanceMetadata: ServiceRef<
    import('./RootInstanceMetadataService').RootInstanceMetadataService,
    'root',
    'singleton'
  >;

  /**
   * Information about the current Backstage system, a collection of Backstage instances.
   *
   * @public
   */
  readonly rootSystemMetadata: ServiceRef<
    import('./RootSystemMetadataService').RootSystemMetadataService,
    'root',
    'singleton'
  >;
}

/**
 * All core services references
 *
 * @public
 */
export const coreServices: CoreServices = Object.freeze({
  auth: createServiceRef<import('./AuthService').AuthService>({
    id: 'core.auth',
  }),
  userInfo: createServiceRef<import('./UserInfoService').UserInfoService>({
    id: 'core.userInfo',
  }),
  cache: createServiceRef<import('./CacheService').CacheService>({
    id: 'core.cache',
  }),
  rootConfig: createServiceRef<import('./RootConfigService').RootConfigService>(
    { id: 'core.rootConfig', scope: 'root' },
  ),
  database: createServiceRef<import('./DatabaseService').DatabaseService>({
    id: 'core.database',
  }),
  discovery: createServiceRef<import('./DiscoveryService').DiscoveryService>({
    id: 'core.discovery',
  }),
  rootHealth: createServiceRef<import('./RootHealthService').RootHealthService>(
    { id: 'core.rootHealth', scope: 'root' },
  ),
  httpAuth: createServiceRef<import('./HttpAuthService').HttpAuthService>({
    id: 'core.httpAuth',
  }),
  httpRouter: createServiceRef<import('./HttpRouterService').HttpRouterService>(
    { id: 'core.httpRouter' },
  ),
  lifecycle: createServiceRef<import('./LifecycleService').LifecycleService>({
    id: 'core.lifecycle',
  }),
  logger: createServiceRef<import('./LoggerService').LoggerService>({
    id: 'core.logger',
  }),
  auditor: createServiceRef<import('./AuditorService').AuditorService>({
    id: 'core.auditor',
  }),
  permissions: createServiceRef<
    import('./PermissionsService').PermissionsService
  >({ id: 'core.permissions' }),
  permissionsRegistry: createServiceRef<
    import('./PermissionsRegistryService').PermissionsRegistryService
  >({ id: 'core.permissionsRegistry' }),
  pluginMetadata: createServiceRef<
    import('./PluginMetadataService').PluginMetadataService
  >({ id: 'core.pluginMetadata' }),
  rootHttpRouter: createServiceRef<
    import('./RootHttpRouterService').RootHttpRouterService
  >({ id: 'core.rootHttpRouter', scope: 'root' }),
  rootLifecycle: createServiceRef<
    import('./RootLifecycleService').RootLifecycleService
  >({ id: 'core.rootLifecycle', scope: 'root' }),
  rootLogger: createServiceRef<import('./RootLoggerService').RootLoggerService>(
    { id: 'core.rootLogger', scope: 'root' },
  ),
  scheduler: createServiceRef<import('./SchedulerService').SchedulerService>({
    id: 'core.scheduler',
  }),
  urlReader: createServiceRef<import('./UrlReaderService').UrlReaderService>({
    id: 'core.urlReader',
  }),
  rootInstanceMetadata: createServiceRef<
    import('./RootInstanceMetadataService').RootInstanceMetadataService
  >({ id: 'core.rootInstanceMetadata', scope: 'root' }),
  rootSystemMetadata: createServiceRef<
    import('./RootSystemMetadataService').RootSystemMetadataService
  >({ id: 'core.rootSystemMetadata', scope: 'root' }),
});
