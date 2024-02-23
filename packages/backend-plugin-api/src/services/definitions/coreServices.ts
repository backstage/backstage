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
   * The service reference for the plugin scoped {@link AuthService}.
   *
   * @public
   */
  export const auth = createServiceRef<import('./AuthService').AuthService>({
    id: 'core.auth',
  });

  /**
   * The service reference for the plugin scoped {@link UserInfoService}.
   *
   * @public
   */
  export const userInfo = createServiceRef<
    import('./UserInfoService').UserInfoService
  >({
    id: 'core.userInfo',
  });

  /**
   * The service reference for the plugin scoped {@link CacheService}.
   *
   * @public
   */
  export const cache = createServiceRef<import('./CacheService').CacheService>({
    id: 'core.cache',
  });

  /**
   * The service reference for the root scoped {@link RootConfigService}.
   *
   * @public
   */
  export const rootConfig = createServiceRef<
    import('./RootConfigService').RootConfigService
  >({ id: 'core.rootConfig', scope: 'root' });

  /**
   * The service reference for the plugin scoped {@link DatabaseService}.
   *
   * @public
   */
  export const database = createServiceRef<
    import('./DatabaseService').DatabaseService
  >({ id: 'core.database' });

  /**
   * The service reference for the plugin scoped {@link DiscoveryService}.
   *
   * @public
   */
  export const discovery = createServiceRef<
    import('./DiscoveryService').DiscoveryService
  >({ id: 'core.discovery' });

  /**
   * The service reference for the plugin scoped {@link HttpAuthService}.
   *
   * @public
   */
  export const httpAuth = createServiceRef<
    import('./HttpAuthService').HttpAuthService
  >({ id: 'core.httpAuth' });

  /**
   * The service reference for the plugin scoped {@link HttpRouterService}.
   *
   * @public
   */
  export const httpRouter = createServiceRef<
    import('./HttpRouterService').HttpRouterService
  >({ id: 'core.httpRouter' });

  /**
   * The service reference for the plugin scoped {@link LifecycleService}.
   *
   * @public
   */
  export const lifecycle = createServiceRef<
    import('./LifecycleService').LifecycleService
  >({ id: 'core.lifecycle' });

  /**
   * The service reference for the plugin scoped {@link LoggerService}.
   *
   * @public
   */
  export const logger = createServiceRef<
    import('./LoggerService').LoggerService
  >({ id: 'core.logger' });

  /**
   * The service reference for the plugin scoped {@link PermissionsService}.
   *
   * @public
   */
  export const permissions = createServiceRef<
    import('./PermissionsService').PermissionsService
  >({ id: 'core.permissions' });

  /**
   * The service reference for the plugin scoped {@link PluginMetadataService}.
   *
   * @public
   */
  export const pluginMetadata = createServiceRef<
    import('./PluginMetadataService').PluginMetadataService
  >({ id: 'core.pluginMetadata' });

  /**
   * The service reference for the root scoped {@link RootHttpRouterService}.
   *
   * @public
   */
  export const rootHttpRouter = createServiceRef<
    import('./RootHttpRouterService').RootHttpRouterService
  >({ id: 'core.rootHttpRouter', scope: 'root' });

  /**
   * The service reference for the root scoped {@link RootLifecycleService}.
   *
   * @public
   */
  export const rootLifecycle = createServiceRef<
    import('./RootLifecycleService').RootLifecycleService
  >({ id: 'core.rootLifecycle', scope: 'root' });

  /**
   * The service reference for the root scoped {@link RootLoggerService}.
   *
   * @public
   */
  export const rootLogger = createServiceRef<
    import('./RootLoggerService').RootLoggerService
  >({ id: 'core.rootLogger', scope: 'root' });

  /**
   * The service reference for the plugin scoped {@link SchedulerService}.
   *
   * @public
   */
  export const scheduler = createServiceRef<
    import('./SchedulerService').SchedulerService
  >({ id: 'core.scheduler' });

  /**
   * The service reference for the plugin scoped {@link TokenManagerService}.
   *
   * @public
   */
  export const tokenManager = createServiceRef<
    import('./TokenManagerService').TokenManagerService
  >({ id: 'core.tokenManager' });

  /**
   * The service reference for the plugin scoped {@link UrlReaderService}.
   *
   * @public
   */
  export const urlReader = createServiceRef<
    import('./UrlReaderService').UrlReaderService
  >({ id: 'core.urlReader' });

  /**
   * The service reference for the plugin scoped {@link IdentityService}.
   *
   * @public
   */
  export const identity = createServiceRef<
    import('./IdentityService').IdentityService
  >({ id: 'core.identity' });
}
