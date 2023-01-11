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

import { FactoryFunctionWithOptions, MaybeOptions } from '../../types';

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
      factory(deps: { [key in string]: unknown }): Promise<
        (deps: { [key in string]: unknown }) => Promise<TService>
      >;
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
  [name in {
    [key in keyof T]: T[key] extends ServiceRef<unknown, TScope> ? key : never;
  }[keyof T]]: T[name] extends ServiceRef<infer TImpl> ? TImpl : never;
};

/** @public */
export interface ServiceFactoryConfig<
  TService,
  TScope extends 'root' | 'plugin',
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TOpts extends MaybeOptions = undefined,
> {
  service: ServiceRef<TService, TScope>;
  deps: TDeps;
  factory(
    deps: ServiceRefsToInstances<TDeps, 'root'>,
    options: TOpts,
  ): TScope extends 'root'
    ? Promise<TImpl>
    : Promise<(deps: ServiceRefsToInstances<TDeps>) => Promise<TImpl>>;
}

/**
 * @public
 */
export function createServiceFactory<
  TService,
  TScope extends 'root' | 'plugin',
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TOpts extends MaybeOptions = undefined,
>(
  config: ServiceFactoryConfig<TService, TScope, TImpl, TDeps, TOpts>,
): FactoryFunctionWithOptions<ServiceFactory<TService>, TOpts> {
  return (options?: TOpts) =>
    ({
      scope: config.service.scope,
      service: config.service,
      deps: config.deps,
      factory(deps: ServiceRefsToInstances<TDeps, 'root'>) {
        return config.factory(deps, options!);
      },
    } as ServiceFactory<TService>);
}
