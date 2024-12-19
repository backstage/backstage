/*
 * Copyright 2024 The Backstage Authors
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

import { CliFeature } from '../features/types';

export interface ServiceFactory<
  TService = unknown,
  TScope extends 'plugin' | 'root' = 'plugin' | 'root',
> extends CliFeature {
  service: ServiceRef<TService, TScope>;
}

/** @internal */
export interface InternalServiceFactory<
  TService = unknown,
  TScope extends 'plugin' | 'root' = 'plugin' | 'root',
> extends ServiceFactory<TService, TScope> {
  version: 'v1';
  featureType: 'service';
  initialization?: 'always' | 'lazy';
  deps: { [key in string]: ServiceRef<unknown> };
  createRootContext?(deps: { [key in string]: unknown }): Promise<unknown>;
  factory(deps: { [key in string]: unknown }): Promise<TService>;
}

export interface ServiceRef<
  TModule,
  TScope extends 'root' | 'plugin' = 'root' | 'plugin',
> {
  id: string;
  T: TModule;
  scope: TScope;
}

/** @ignore */
type ServiceRefsToInstances<
  T extends { [key in string]: ServiceRef<unknown> },
  TScope extends 'root' | 'plugin' = 'root' | 'plugin',
> = {
  [key in keyof T as T[key]['scope'] extends TScope ? key : never]: T[key]['T'];
};

export interface RootServiceFactoryOptions<
  TService,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
> {
  service: ServiceRef<TService, 'root'>;
  deps: TDeps;
  factory(deps: ServiceRefsToInstances<TDeps, 'root'>): TImpl | Promise<TImpl>;
}

export function createServiceFactory<
  TService,
  TImpl extends TService,
  TDeps extends { [name in string]: ServiceRef<unknown> },
>(
  options: RootServiceFactoryOptions<TService, TImpl, TDeps>,
): ServiceFactory<TService, 'root' | 'plugin'> {
  const c = options as RootServiceFactoryOptions<TService, TImpl, TDeps>;
  return {
    $$type: '@backstage/CliFeature',
    version: 'v1',
    featureType: 'service',
    service: c.service,
    deps: options.deps,
    factory: async (deps: ServiceRefsToInstances<TDeps, 'root'>) =>
      c.factory(deps),
  } as InternalServiceFactory<TService, 'root'>;
}

export interface ServiceRefOptions<TService, TScope extends 'root' | 'plugin'> {
  id: string;
  scope?: TScope;
  defaultFactory?(
    service: ServiceRef<TService, TScope>,
  ): Promise<ServiceFactory>;
}

export function createServiceRef<TService>(
  options: ServiceRefOptions<TService, 'root'>,
): ServiceRef<TService, 'root'>;
export function createServiceRef<TService>(
  options: ServiceRefOptions<TService, any>,
): ServiceRef<TService, any> {
  const { id, scope = 'plugin', defaultFactory } = options;
  return {
    id,
    scope,
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
      };
    },
    $$type: '@backstage/ServiceRef',
    __defaultFactory: defaultFactory,
  } as ServiceRef<TService, typeof scope> & {
    __defaultFactory?: (
      service: ServiceRef<TService>,
    ) => Promise<ServiceFactory<TService>>;
  };
}
