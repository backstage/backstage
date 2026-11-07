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
import type { AuditorService } from './AuditorService';
import type { AuthService } from './AuthService';
import type { CacheService } from './CacheService';
import type { DatabaseService } from './DatabaseService';
import type { DiscoveryService } from './DiscoveryService';
import type { HttpAuthService } from './HttpAuthService';
import type { HttpRouterService } from './HttpRouterService';
import type { LifecycleService } from './LifecycleService';
import type { LoggerService } from './LoggerService';
import type { PermissionsRegistryService } from './PermissionsRegistryService';
import type { PermissionsService } from './PermissionsService';
import type { PluginMetadataService } from './PluginMetadataService';
import type { RootConfigService } from './RootConfigService';
import type { RootHealthService } from './RootHealthService';
import type { RootHttpRouterService } from './RootHttpRouterService';
import type { RootInstanceMetadataService } from './RootInstanceMetadataService';
import type { RootLifecycleService } from './RootLifecycleService';
import type { RootLoggerService } from './RootLoggerService';
import type { RootSystemMetadataService } from './RootSystemMetadataService';
import type { SchedulerService } from './SchedulerService';
import type { UrlReaderService } from './UrlReaderService';
import type { UserInfoService } from './UserInfoService';

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
  readonly auth: ServiceRef<AuthService, 'plugin', 'singleton'>;

  /**
   * Authenticated user information retrieval.
   *
   * See {@link UserInfoService}
   * and {@link https://backstage.io/docs/backend-system/core-services/user-info | the service docs}
   * for more information.
   *
   * @public
   */
  readonly userInfo: ServiceRef<UserInfoService, 'plugin', 'singleton'>;

  /**
   * Key-value store for caching data.
   *
   * See {@link CacheService}
   * and {@link https://backstage.io/docs/backend-system/core-services/cache | the service docs}
   * for more information.
   *
   * @public
   */
  readonly cache: ServiceRef<CacheService, 'plugin', 'singleton'>;

  /**
   * Access to static configuration.
   *
   * See {@link RootConfigService}
   * and {@link https://backstage.io/docs/backend-system/core-services/root-config | the service docs}
   * for more information.
   *
   * @public
   */
  readonly rootConfig: ServiceRef<RootConfigService, 'root', 'singleton'>;

  /**
   * Database access and management via `knex`.
   *
   * See {@link DatabaseService}
   * and {@link https://backstage.io/docs/backend-system/core-services/database | the service docs}
   * for more information.
   *
   * @public
   */
  readonly database: ServiceRef<DatabaseService, 'plugin', 'singleton'>;

  /**
   * Service discovery for inter-plugin communication.
   *
   * See {@link DiscoveryService}
   * and {@link https://backstage.io/docs/backend-system/core-services/discovery | the service docs}
   * for more information.
   *
   * @public
   */
  readonly discovery: ServiceRef<DiscoveryService, 'plugin', 'singleton'>;

  /**
   * The service reference for the plugin scoped {@link RootHealthService}.
   */
  readonly rootHealth: ServiceRef<RootHealthService, 'root', 'singleton'>;

  /**
   * Authentication of HTTP requests.
   *
   * See {@link HttpAuthService}
   * and {@link https://backstage.io/docs/backend-system/core-services/http-auth | the service docs}
   * for more information.
   *
   * @public
   */
  readonly httpAuth: ServiceRef<HttpAuthService, 'plugin', 'singleton'>;

  /**
   * HTTP route registration for plugins.
   *
   * See {@link HttpRouterService}
   * and {@link https://backstage.io/docs/backend-system/core-services/http-router | the service docs}
   * for more information.
   *
   * @public
   */
  readonly httpRouter: ServiceRef<HttpRouterService, 'plugin', 'singleton'>;

  /**
   * Registration of plugin startup and shutdown lifecycle hooks.
   *
   * See {@link LifecycleService}
   * and {@link https://backstage.io/docs/backend-system/core-services/lifecycle | the service docs}
   * for more information.
   *
   * @public
   */
  readonly lifecycle: ServiceRef<LifecycleService, 'plugin', 'singleton'>;

  /**
   * Plugin-level logging.
   *
   * See {@link LoggerService}
   * and {@link https://backstage.io/docs/backend-system/core-services/logger | the service docs}
   * for more information.
   *
   * @public
   */
  readonly logger: ServiceRef<LoggerService, 'plugin', 'singleton'>;

  /**
   * Plugin-level auditing.
   *
   * See {@link AuditorService}
   * and {@link https://backstage.io/docs/backend-system/core-services/auditor | the service docs}
   * for more information.
   *
   * @public
   */
  readonly auditor: ServiceRef<AuditorService, 'plugin', 'singleton'>;

  /**
   * Permission system integration for authorization of user actions.
   *
   * See {@link PermissionsService}
   * and {@link https://backstage.io/docs/backend-system/core-services/permissions | the service docs}
   * for more information.
   *
   * @public
   */
  readonly permissions: ServiceRef<PermissionsService, 'plugin', 'singleton'>;

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
    PermissionsRegistryService,
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
    PluginMetadataService,
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
    RootHttpRouterService,
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
  readonly rootLifecycle: ServiceRef<RootLifecycleService, 'root', 'singleton'>;

  /**
   * Root-level logging.
   *
   * See {@link RootLoggerService}
   * and {@link https://backstage.io/docs/backend-system/core-services/root-logger | the service docs}
   * for more information.
   *
   * @public
   */
  readonly rootLogger: ServiceRef<RootLoggerService, 'root', 'singleton'>;

  /**
   * Scheduling of distributed background tasks.
   *
   * See {@link SchedulerService}
   * and {@link https://backstage.io/docs/backend-system/core-services/scheduler | the service docs}
   * for more information.
   *
   * @public
   */
  readonly scheduler: ServiceRef<SchedulerService, 'plugin', 'singleton'>;

  /**
   * Reading content from external systems.
   *
   * See {@link UrlReaderService}
   * and {@link https://backstage.io/docs/backend-system/core-services/url-reader | the service docs}
   * for more information.
   *
   * @public
   */
  readonly urlReader: ServiceRef<UrlReaderService, 'plugin', 'singleton'>;

  /**
   * Information about the current Backstage instance.
   *
   * @public
   */
  readonly rootInstanceMetadata: ServiceRef<
    RootInstanceMetadataService,
    'root',
    'singleton'
  >;

  /**
   * Information about the current Backstage system, a collection of Backstage instances.
   *
   * @public
   */
  readonly rootSystemMetadata: ServiceRef<
    RootSystemMetadataService,
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
  auth: createServiceRef<AuthService>({
    id: 'core.auth',
  }),
  userInfo: createServiceRef<UserInfoService>({
    id: 'core.userInfo',
  }),
  cache: createServiceRef<CacheService>({
    id: 'core.cache',
  }),
  rootConfig: createServiceRef<RootConfigService>({
    id: 'core.rootConfig',
    scope: 'root',
  }),
  database: createServiceRef<DatabaseService>({
    id: 'core.database',
  }),
  discovery: createServiceRef<DiscoveryService>({
    id: 'core.discovery',
  }),
  rootHealth: createServiceRef<RootHealthService>({
    id: 'core.rootHealth',
    scope: 'root',
  }),
  httpAuth: createServiceRef<HttpAuthService>({
    id: 'core.httpAuth',
  }),
  httpRouter: createServiceRef<HttpRouterService>({ id: 'core.httpRouter' }),
  lifecycle: createServiceRef<LifecycleService>({
    id: 'core.lifecycle',
  }),
  logger: createServiceRef<LoggerService>({
    id: 'core.logger',
  }),
  auditor: createServiceRef<AuditorService>({
    id: 'core.auditor',
  }),
  permissions: createServiceRef<PermissionsService>({ id: 'core.permissions' }),
  permissionsRegistry: createServiceRef<PermissionsRegistryService>({
    id: 'core.permissionsRegistry',
  }),
  pluginMetadata: createServiceRef<PluginMetadataService>({
    id: 'core.pluginMetadata',
  }),
  rootHttpRouter: createServiceRef<RootHttpRouterService>({
    id: 'core.rootHttpRouter',
    scope: 'root',
  }),
  rootLifecycle: createServiceRef<RootLifecycleService>({
    id: 'core.rootLifecycle',
    scope: 'root',
  }),
  rootLogger: createServiceRef<RootLoggerService>({
    id: 'core.rootLogger',
    scope: 'root',
  }),
  scheduler: createServiceRef<SchedulerService>({
    id: 'core.scheduler',
  }),
  urlReader: createServiceRef<UrlReaderService>({
    id: 'core.urlReader',
  }),
  rootInstanceMetadata: createServiceRef<RootInstanceMetadataService>({
    id: 'core.rootInstanceMetadata',
    scope: 'root',
  }),
  rootSystemMetadata: createServiceRef<RootSystemMetadataService>({
    id: 'core.rootSystemMetadata',
    scope: 'root',
  }),
});
