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

/**
 * TODO
 *
 * @public
 */
export type ServiceRef<
  TService,
  TScope extends 'root' | 'plugin' = 'root' | 'plugin',
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
   * Utility for getting the type of the service, using `typeof serviceRef.T`.
   * Attempting to actually read this value will result in an exception.
   */
  T: TService;

  toString(): string;

  $$ref: 'service';
};

/** @public */
export type TypesToServiceRef<T> = { [key in keyof T]: ServiceRef<T[key]> };

/** @public */
export type ServiceFactory<TService = unknown> =
  | {
      // This scope prop is needed in addition to the service ref, as TypeScript
      // can't properly discriminate the two factory types otherwise.
      scope: 'root';
      service: ServiceRef<TService, 'root'>;
      deps: { [key in string]: ServiceRef<unknown> };
      factory(deps: { [key in string]: unknown }): Promise<TService>;
    }
  | {
      scope: 'plugin';
      service: ServiceRef<TService, 'plugin'>;
      deps: { [key in string]: ServiceRef<unknown> };
      createRootContext?(deps: { [key in string]: unknown }): Promise<unknown>;
      factory(
        deps: { [key in string]: unknown },
        context: unknown,
      ): Promise<TService>;
    };

/**
 * Represents either a {@link ServiceFactory} or a function that returns one.
 *
 * @public
 */
export type ServiceFactoryOrFunction<TService = unknown> =
  | ServiceFactory<TService>
  | (() => ServiceFactory<TService>);

/** @public */
export interface ServiceRefConfig<TService, TScope extends 'root' | 'plugin'> {
  id: string;
  scope?: TScope;
  defaultFactory?: (
    service: ServiceRef<TService, TScope>,
  ) => Promise<ServiceFactoryOrFunction<TService>>;
}

/**
 * Creates a new service definition. This overload is used to create plugin scoped services.
 *
 * @public
 */
export function createServiceRef<TService>(
  config: ServiceRefConfig<TService, 'plugin'>,
): ServiceRef<TService, 'plugin'>;

/**
 * Creates a new service definition. This overload is used to create root scoped services.
 *
 * @public
 */
export function createServiceRef<TService>(
  config: ServiceRefConfig<TService, 'root'>,
): ServiceRef<TService, 'root'>;
export function createServiceRef<TService>(
  config: ServiceRefConfig<TService, any>,
): ServiceRef<TService, any> {
  const { id, scope = 'plugin', defaultFactory } = config;
  return {
    id,
    scope,
    get T(): TService {
      throw new Error(`tried to read ServiceRef.T of ${this}`);
    },
    toString() {
      return `serviceRef{${config.id}}`;
    },
    $$ref: 'service', // TODO: declare
    __defaultFactory: defaultFactory,
  } as ServiceRef<TService, typeof scope> & {
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
  [key in keyof T as T[key]['scope'] extends TScope ? key : never]: T[key]['T'];
};

/** @public */
export interface RootServiceFactoryConfig<
  TService,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
> {
  service: ServiceRef<TService, 'root'>;
  deps: TDeps;
  factory(deps: ServiceRefsToInstances<TDeps, 'root'>): TImpl | Promise<TImpl>;
}

/** @public */
export interface PluginServiceFactoryConfig<
  TService,
  TContext,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
> {
  service: ServiceRef<TService, 'plugin'>;
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
 * @param config - The service factory configuration.
 */
export function createServiceFactory<
  TService,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TOpts extends object | undefined = undefined,
>(
  config: RootServiceFactoryConfig<TService, TImpl, TDeps>,
): () => ServiceFactory<TService>;
/**
 * Creates a root scoped service factory with optional options.
 *
 * @public
 * @param config - The service factory configuration.
 */
export function createServiceFactory<
  TService,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TOpts extends object | undefined = undefined,
>(
  config: (options?: TOpts) => RootServiceFactoryConfig<TService, TImpl, TDeps>,
): (options?: TOpts) => ServiceFactory<TService>;
/**
 * Creates a root scoped service factory with required options.
 *
 * @public
 * @param config - The service factory configuration.
 */
export function createServiceFactory<
  TService,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TOpts extends object | undefined = undefined,
>(
  config: (options: TOpts) => RootServiceFactoryConfig<TService, TImpl, TDeps>,
): (options: TOpts) => ServiceFactory<TService>;
/**
 * Creates a plugin scoped service factory without options.
 *
 * @public
 * @param config - The service factory configuration.
 */
export function createServiceFactory<
  TService,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TContext = undefined,
  TOpts extends object | undefined = undefined,
>(
  config: PluginServiceFactoryConfig<TService, TContext, TImpl, TDeps>,
): () => ServiceFactory<TService>;
/**
 * Creates a plugin scoped service factory with optional options.
 *
 * @public
 * @param config - The service factory configuration.
 */
export function createServiceFactory<
  TService,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TContext = undefined,
  TOpts extends object | undefined = undefined,
>(
  config: (
    options?: TOpts,
  ) => PluginServiceFactoryConfig<TService, TContext, TImpl, TDeps>,
): (options?: TOpts) => ServiceFactory<TService>;
/**
 * Creates a plugin scoped service factory with required options.
 *
 * @public
 * @param config - The service factory configuration.
 */
export function createServiceFactory<
  TService,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TContext = undefined,
  TOpts extends object | undefined = undefined,
>(
  config:
    | PluginServiceFactoryConfig<TService, TContext, TImpl, TDeps>
    | ((
        options: TOpts,
      ) => PluginServiceFactoryConfig<TService, TContext, TImpl, TDeps>),
): (options: TOpts) => ServiceFactory<TService>;
export function createServiceFactory<
  TService,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TContext,
  TOpts extends object | undefined = undefined,
>(
  config:
    | RootServiceFactoryConfig<TService, TImpl, TDeps>
    | PluginServiceFactoryConfig<TService, TContext, TImpl, TDeps>
    | ((options: TOpts) => RootServiceFactoryConfig<TService, TImpl, TDeps>)
    | ((
        options: TOpts,
      ) => PluginServiceFactoryConfig<TService, TContext, TImpl, TDeps>)
    | (() => RootServiceFactoryConfig<TService, TImpl, TDeps>)
    | (() => PluginServiceFactoryConfig<TService, TContext, TImpl, TDeps>),
): (options: TOpts) => ServiceFactory<TService> {
  const configCallback = typeof config === 'function' ? config : () => config;
  return (options: TOpts) => {
    const c = configCallback(options);
    return {
      ...c,
      ...('createRootContext' in c
        ? {
            createRootContext: async (deps: TDeps) =>
              c?.createRootContext?.(deps),
          }
        : {}),
      factory: async (deps: TDeps, ctx: TContext) => c.factory(deps, ctx),
      scope: c.service.scope,
    } as ServiceFactory<TService>;
  };
}
