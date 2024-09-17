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

import { BackendFeature } from '../../types';

/**
 * A reference to a backend service. You can use these references to mark
 * dependencies on services and having their implementations injected
 * automatically.
 *
 * @public
 */
export type ServiceRef<
  TService,
  TScope extends 'root' | 'plugin' = 'root' | 'plugin',
  TInstances extends 'singleton' | 'multiton' = 'singleton' | 'multiton',
> = {
  id: string;

  /**
   * This determines the scope at which this service is available.
   *
   * Root scoped services are available to all other services but
   * may only depend on other root scoped services.
   *
   * Plugin scoped services are only available to other plugin scoped
   * services but may depend on all other services.
   */
  scope: TScope;

  /**
   * Marks whether the service is a multiton or not. Multiton services the
   * opposite of singletons - they can be provided many times, and when depended
   * on, you receive an array of all provided instances.
   */
  multiton?: TInstances extends 'multiton' ? true : false;

  /**
   * Utility for getting the type of the service, using `typeof serviceRef.T`.
   * Attempting to actually read this value will result in an exception.
   */
  T: TService;

  $$type: '@backstage/ServiceRef';
};

/** @public */
export interface ServiceFactory<
  TService = unknown,
  TScope extends 'plugin' | 'root' = 'plugin' | 'root',
  TInstances extends 'singleton' | 'multiton' = 'singleton' | 'multiton',
> extends BackendFeature {
  service: ServiceRef<TService, TScope, TInstances>;
}

/** @internal */
export interface InternalServiceFactory<
  TService = unknown,
  TScope extends 'plugin' | 'root' = 'plugin' | 'root',
  TInstances extends 'singleton' | 'multiton' = 'singleton' | 'multiton',
> extends ServiceFactory<TService, TScope, TInstances> {
  version: 'v1';
  featureType: 'service';
  initialization?: 'always' | 'lazy';
  deps: { [key in string]: ServiceRef<unknown> };
  createRootContext?(deps: { [key in string]: unknown }): Promise<unknown>;
  factory(
    deps: { [key in string]: unknown },
    context: unknown,
  ): Promise<TService>;
}

/** @public */
export interface ServiceRefOptions<
  TService,
  TScope extends 'root' | 'plugin',
  TInstances extends 'singleton' | 'multiton',
> {
  id: string;
  scope?: TScope;
  multiton?: TInstances extends 'multiton' ? true : false;
  defaultFactory?(
    service: ServiceRef<TService, TScope>,
  ): Promise<ServiceFactory>;
}

/**
 * Creates a new service definition. This overload is used to create plugin scoped services.
 *
 * @public
 */
export function createServiceRef<TService>(
  options: ServiceRefOptions<TService, 'plugin', 'singleton'>,
): ServiceRef<TService, 'plugin', 'singleton'>;

/**
 * Creates a new service definition. This overload is used to create root scoped services.
 *
 * @public
 */
export function createServiceRef<TService>(
  options: ServiceRefOptions<TService, 'root', 'singleton'>,
): ServiceRef<TService, 'root', 'singleton'>;

/**
 * Creates a new service definition. This overload is used to create plugin scoped services.
 *
 * @public
 */
export function createServiceRef<TService>(
  options: ServiceRefOptions<TService, 'plugin', 'multiton'>,
): ServiceRef<TService, 'plugin', 'multiton'>;

/**
 * Creates a new service definition. This overload is used to create root scoped services.
 *
 * @public
 */
export function createServiceRef<TService>(
  options: ServiceRefOptions<TService, 'root', 'multiton'>,
): ServiceRef<TService, 'root', 'multiton'>;
export function createServiceRef<
  TService,
  TInstances extends 'singleton' | 'multiton',
>(
  options: ServiceRefOptions<TService, any, TInstances>,
): ServiceRef<TService, any, TInstances> {
  const { id, scope = 'plugin', multiton = false, defaultFactory } = options;
  return {
    id,
    scope,
    multiton,
    get T(): TService {
      throw new Error(`tried to read ServiceRef.T of ${this}`);
    },
    toString() {
      return `serviceRef{${options.id}}`;
    },
    toJSON() {
      // This avoids accidental calls to T happening e.g. in tests
      return {
        $$type: '@backstage/ServiceRef',
        id,
        scope,
        multiton,
      };
    },
    $$type: '@backstage/ServiceRef',
    __defaultFactory: defaultFactory,
  } as ServiceRef<TService, typeof scope, TInstances> & {
    __defaultFactory?: (
      service: ServiceRef<TService>,
    ) => Promise<ServiceFactory<TService>>;
  };
}

/** @ignore */
type ServiceRefsToInstances<
  T extends { [key in string]: ServiceRef<unknown> },
  TScope extends 'root' | 'plugin' = 'root' | 'plugin',
> = {
  [key in keyof T as T[key]['scope'] extends TScope
    ? key
    : never]: T[key]['multiton'] extends true | undefined
    ? Array<T[key]['T']>
    : T[key]['T'];
};

/** @public */
export interface RootServiceFactoryOptions<
  TService,
  TInstances extends 'singleton' | 'multiton',
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
> {
  /**
   * The initialization strategy for the service factory. This service is root scoped and will use `always` by default.
   *
   * @remarks
   *
   * - `always` - The service will always be initialized regardless if it is used or not.
   * - `lazy` - The service will only be initialized if it is depended on by a different service or feature.
   *
   * Service factories for root scoped services use `always` as the default, while plugin scoped services use `lazy`.
   */
  initialization?: 'always' | 'lazy';
  service: ServiceRef<TService, 'root', TInstances>;
  deps: TDeps;
  factory(deps: ServiceRefsToInstances<TDeps, 'root'>): TImpl | Promise<TImpl>;
}

/** @public */
export interface PluginServiceFactoryOptions<
  TService,
  TInstances extends 'singleton' | 'multiton',
  TContext,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
> {
  /**
   * The initialization strategy for the service factory. This service is plugin scoped and will use `lazy` by default.
   *
   * @remarks
   *
   * - `always` - The service will always be initialized regardless if it is used or not.
   * - `lazy` - The service will only be initialized if it is depended on by a different service or feature.
   *
   * Service factories for root scoped services use `always` as the default, while plugin scoped services use `lazy`.
   */
  initialization?: 'always' | 'lazy';
  service: ServiceRef<TService, 'plugin', TInstances>;
  deps: TDeps;
  createRootContext?(
    deps: ServiceRefsToInstances<TDeps, 'root'>,
  ): TContext | Promise<TContext>;
  factory(
    deps: ServiceRefsToInstances<TDeps>,
    context: TContext,
  ): TImpl | Promise<TImpl>;
}

/**
 * Creates a root scoped service factory without options.
 *
 * @public
 * @param options - The service factory configuration.
 */
export function createServiceFactory<
  TService,
  TInstances extends 'singleton' | 'multiton',
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown, 'root'> },
>(
  options: RootServiceFactoryOptions<TService, TInstances, TImpl, TDeps>,
): ServiceFactory<TService, 'root', TInstances>;
/**
 * Creates a plugin scoped service factory without options.
 *
 * @public
 * @param options - The service factory configuration.
 */
export function createServiceFactory<
  TService,
  TInstances extends 'singleton' | 'multiton',
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TContext = undefined,
>(
  options: PluginServiceFactoryOptions<
    TService,
    TInstances,
    TContext,
    TImpl,
    TDeps
  >,
): ServiceFactory<TService, 'plugin', TInstances>;
export function createServiceFactory<
  TService,
  TInstances extends 'singleton' | 'multiton',
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TContext,
>(
  options:
    | RootServiceFactoryOptions<TService, TInstances, TImpl, TDeps>
    | PluginServiceFactoryOptions<TService, TInstances, TContext, TImpl, TDeps>,
): ServiceFactory<TService, 'root' | 'plugin', 'singleton' | 'multiton'> {
  if (options.service.scope === 'root') {
    const c = options as RootServiceFactoryOptions<
      TService,
      TInstances,
      TImpl,
      TDeps
    >;
    return {
      $$type: '@backstage/BackendFeature',
      version: 'v1',
      featureType: 'service',
      service: c.service,
      initialization: c.initialization,
      deps: options.deps,
      factory: async (deps: ServiceRefsToInstances<TDeps, 'root'>) =>
        c.factory(deps),
    } as InternalServiceFactory<TService, 'root', TInstances>;
  }
  const c = options as PluginServiceFactoryOptions<
    TService,
    TInstances,
    TContext,
    TImpl,
    TDeps
  >;
  return {
    $$type: '@backstage/BackendFeature',
    version: 'v1',
    featureType: 'service',
    service: c.service,
    initialization: c.initialization,
    ...('createRootContext' in options
      ? {
          createRootContext: async (
            deps: ServiceRefsToInstances<TDeps, 'root'>,
          ) => c?.createRootContext?.(deps),
        }
      : {}),
    deps: options.deps,
    factory: async (deps: ServiceRefsToInstances<TDeps>, ctx: TContext) =>
      c.factory(deps, ctx),
  } as InternalServiceFactory<TService, 'plugin', TInstances>;
}
