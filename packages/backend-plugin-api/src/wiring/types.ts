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

import { InternalServiceFactory, ServiceRef } from '../services/system/types';
import { BackendFeature } from '../types';

/**
 * TODO
 *
 * @public
 */
export type ExtensionPoint<T> = {
  id: string;

  /**
   * Utility for getting the type of the extension point, using `typeof extensionPoint.T`.
   * Attempting to actually read this value will result in an exception.
   */
  T: T;

  toString(): string;

  $$type: '@backstage/ExtensionPoint';
};

/** @ignore */
type DepsToInstances<
  TDeps extends {
    [key in string]: ServiceRef<unknown> | ExtensionPoint<unknown>;
  },
> = {
  [key in keyof TDeps]: TDeps[key] extends ServiceRef<unknown, any, 'multiton'>
    ? Array<TDeps[key]['T']>
    : TDeps[key]['T'];
};

/**
 * The callbacks passed to the `register` method of a backend plugin.
 *
 * @public
 */
export interface BackendPluginRegistrationPoints {
  registerExtensionPoint<TExtensionPoint>(
    ref: ExtensionPoint<TExtensionPoint>,
    impl: TExtensionPoint,
  ): void;
  registerInit<
    TDeps extends {
      [name in string]: ServiceRef<unknown>;
    },
  >(options: {
    deps: TDeps;
    init(deps: DepsToInstances<TDeps>): Promise<void>;
  }): void;
}

/**
 * The callbacks passed to the `register` method of a backend module.
 *
 * @public
 */
export interface BackendModuleRegistrationPoints {
  registerExtensionPoint<TExtensionPoint>(
    ref: ExtensionPoint<TExtensionPoint>,
    impl: TExtensionPoint,
  ): void;
  registerInit<
    TDeps extends {
      [name in string]: ServiceRef<unknown> | ExtensionPoint<unknown>;
    },
  >(options: {
    deps: TDeps;
    init(deps: DepsToInstances<TDeps>): Promise<void>;
  }): void;
}

/** @internal */
export interface InternalBackendRegistrations extends BackendFeature {
  version: 'v1';
  featureType: 'registrations';
  getRegistrations(): Array<
    InternalBackendPluginRegistration | InternalBackendModuleRegistration
  >;
}

/** @internal */
export interface InternalBackendPluginRegistration {
  pluginId: string;
  type: 'plugin';
  extensionPoints: Array<readonly [ExtensionPoint<unknown>, unknown]>;
  init: {
    deps: Record<string, ServiceRef<unknown>>;
    func(deps: Record<string, unknown>): Promise<void>;
  };
}

/** @internal */
export interface InternalBackendModuleRegistration {
  pluginId: string;
  moduleId: string;
  type: 'module';
  extensionPoints: Array<readonly [ExtensionPoint<unknown>, unknown]>;
  init: {
    deps: Record<string, ServiceRef<unknown> | ExtensionPoint<unknown>>;
    func(deps: Record<string, unknown>): Promise<void>;
  };
}

/**
 * @public
 */
export interface InternalBackendFeatureLoader extends BackendFeature {
  version: 'v1';
  featureType: 'loader';
  description: string;
  deps: Record<string, ServiceRef<unknown>>;
  loader(deps: Record<string, unknown>): Promise<BackendFeature[]>;
}

/** @internal */
export type InternalBackendFeature =
  | InternalBackendRegistrations
  | InternalBackendFeatureLoader
  | InternalServiceFactory;
