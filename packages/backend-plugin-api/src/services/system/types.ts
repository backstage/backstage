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
 * TODO
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

/**
 * @public
 * @deprecated This type exists only as a helper for old code that relied on `createServiceFactory` to return `() => ServiceFactory` instead of `ServiceFactory`. You should remove the `()` parentheses at the end of your usages. This type will be removed in a future release.
 */
export interface ServiceFactoryCompat<
  TService = unknown,
  TScope extends 'plugin' | 'root' = 'plugin' | 'root',
  TInstances extends 'singleton' | 'multiton' = 'singleton' | 'multiton',
  TOpts extends object | undefined = undefined,
> extends ServiceFactory<TService, TScope, TInstances> {
  /**
   * @deprecated Callable service factories will be removed in a future release, please re-implement the service factory using the available APIs instead. If no options are being passed, you can simply remove the trailing `()`.
   */
  (
    ...options: undefined extends TOpts ? [] : [options?: TOpts]
  ): ServiceFactory<TService, TScope, TInstances>;
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

/**
 * Represents either a {@link ServiceFactory} or a function that returns one.
 *
 * @deprecated The support for service factory functions is deprecated and will be removed.
 * @public
 */
export type ServiceFactoryOrFunction = ServiceFactory | (() => ServiceFactory);

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
  /**
   * @deprecated The defaultFactory must return a plain `ServiceFactory` object, support for returning a function will be removed.
   */
  defaultFactory?(
    service: ServiceRef<TService, TScope>,
  ): Promise<() => ServiceFactory>;
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
    $$type: '@backstage/ServiceRef',
    __defaultFactory: defaultFactory,
  } as ServiceRef<TService, typeof scope, TInstances> & {
    __defaultFactory?: (
      service: ServiceRef<TService>,
    ) => Promise<ServiceFactory<TService> | (() => ServiceFactory<TService>)>;
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
  TService, // TODO(Rugvip): Can we forward the entire service ref type here instead of forwarding each type arg once the callback form is gone?
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
  TOpts extends object | undefined = undefined,
>(
  options: RootServiceFactoryOptions<TService, TInstances, TImpl, TDeps>,
): ServiceFactoryCompat<TService, 'root', TInstances>;
/**
 * Creates a root scoped service factory with optional options.
 *
 * @deprecated The ability to define options for service factories is deprecated
 * and will be removed. Please use the non-callback form of createServiceFactory
 * and provide an API that allows for a simple re-implementation of the service
 * factory instead.
 * @public
 * @param options - The service factory configuration.
 */
export function createServiceFactory<
  TService,
  TInstances extends 'singleton' | 'multiton',
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown, 'root'> },
  TOpts extends object | undefined = undefined,
>(
  options: (
    options?: TOpts,
  ) => RootServiceFactoryOptions<TService, TInstances, TImpl, TDeps>,
): ServiceFactoryCompat<TService, 'root', TInstances, TOpts>;
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
  TOpts extends object | undefined = undefined,
>(
  options: PluginServiceFactoryOptions<
    TService,
    TInstances,
    TContext,
    TImpl,
    TDeps
  >,
): ServiceFactoryCompat<TService, 'plugin', TInstances>;
/**
 * Creates a plugin scoped service factory with optional options.
 *
 * @deprecated The ability to define options for service factories is deprecated
 * and will be removed. Please use the non-callback form of createServiceFactory
 * and provide an API that allows for a simple re-implementation of the service
 * factory instead.
 * @public
 * @param options - The service factory configuration.
 */
export function createServiceFactory<
  TService,
  TInstances extends 'singleton' | 'multiton',
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TContext = undefined,
  TOpts extends object | undefined = undefined,
>(
  options: (
    options?: TOpts,
  ) => PluginServiceFactoryOptions<
    TService,
    TInstances,
    TContext,
    TImpl,
    TDeps
  >,
): ServiceFactoryCompat<TService, 'plugin', TInstances, TOpts>;
export function createServiceFactory<
  TService,
  TInstances extends 'singleton' | 'multiton',
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TContext,
  TOpts extends object | undefined = undefined,
>(
  options:
    | RootServiceFactoryOptions<TService, TInstances, TImpl, TDeps>
    | PluginServiceFactoryOptions<TService, TInstances, TContext, TImpl, TDeps>
    | ((
        options: TOpts,
      ) => RootServiceFactoryOptions<TService, TInstances, TImpl, TDeps>)
    | ((
        options: TOpts,
      ) => PluginServiceFactoryOptions<
        TService,
        TInstances,
        TContext,
        TImpl,
        TDeps
      >)
    | (() => RootServiceFactoryOptions<TService, TInstances, TImpl, TDeps>)
    | (() => PluginServiceFactoryOptions<
        TService,
        TInstances,
        TContext,
        TImpl,
        TDeps
      >),
): ServiceFactoryCompat<
  TService,
  'root' | 'plugin',
  'singleton' | 'multiton',
  TOpts
> {
  const configCallback =
    typeof options === 'function' ? options : () => options;
  const factory = (
    o?: TOpts,
  ): InternalServiceFactory<TService, 'plugin' | 'root'> => {
    const anyConf = configCallback(o!);
    if (anyConf.service.scope === 'root') {
      const c = anyConf as RootServiceFactoryOptions<
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
        deps: c.deps,
        factory: async (deps: ServiceRefsToInstances<TDeps, 'root'>) =>
          c.factory(deps),
      };
    }
    const c = anyConf as PluginServiceFactoryOptions<
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
      ...('createRootContext' in c
        ? {
            createRootContext: async (
              deps: ServiceRefsToInstances<TDeps, 'root'>,
            ) => c?.createRootContext?.(deps),
          }
        : {}),
      deps: c.deps,
      factory: async (deps: ServiceRefsToInstances<TDeps>, ctx: TContext) =>
        c.factory(deps, ctx),
    };
  };

  // This constructs the `ServiceFactoryCompat` type, which is both a plain
  // factory object as well as a function that can be called to construct a
  // factory, potentially with options. In the future only the plain factory
  // form will be supported, but for now we need to allow callers to call the
  // factory too.
  return Object.assign(factory, factory(undefined as TOpts));
}
