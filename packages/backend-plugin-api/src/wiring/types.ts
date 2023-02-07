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

import { ServiceRef } from '../services/system/types';

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
  registerInit<Deps extends { [name in string]: unknown }>(options: {
    deps: {
      [name in keyof Deps]: ServiceRef<Deps[name]>;
    };
    init(deps: Deps): Promise<void>;
  }): void;
}

/**
 * The callbacks passed to the `register` method of a backend module.
 *
 * @public
 */
export interface BackendModuleRegistrationPoints {
  registerInit<Deps extends { [name in string]: unknown }>(options: {
    deps: {
      [name in keyof Deps]: ServiceRef<Deps[name]> | ExtensionPoint<Deps[name]>;
    };
    init(deps: Deps): Promise<void>;
  }): void;
}

/** @public */
export interface BackendFeature {
  // NOTE: This type is opaque in order to simplify future API evolution.
  $$type: '@backstage/BackendFeature';
}

/** @internal */
export interface InternalBackendFeature extends BackendFeature {
  version: 'v1';
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
  init: {
    deps: Record<string, ServiceRef<unknown> | ExtensionPoint<unknown>>;
    func(deps: Record<string, unknown>): Promise<void>;
  };
}
