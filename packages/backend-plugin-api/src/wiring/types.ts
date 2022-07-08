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

  $$ref: 'extension-point';
};

/** @public */
export function createExtensionPoint<T>(options: {
  id: string;
}): ExtensionPoint<T> {
  return {
    id: options.id,
    get T(): T {
      throw new Error(`tried to read ExtensionPoint.T of ${this}`);
    },
    toString() {
      return `extensionPoint{${options.id}}`;
    },
    $$ref: 'extension-point', // TODO: declare
  };
}

/** @public */
export interface BackendInitRegistry {
  registerExtensionPoint<TExtensionPoint>(
    ref: ServiceRef<TExtensionPoint>,
    impl: TExtensionPoint,
  ): void;
  registerInit<Deps extends { [name in string]: unknown }>(options: {
    deps: { [name in keyof Deps]: ServiceRef<Deps[name]> };
    init: (deps: Deps) => Promise<void>;
  }): void;
}

/** @public */
export interface BackendRegistrable {
  id: string;
  register(reg: BackendInitRegistry): void;
}

/** @public */
export interface BackendPluginConfig<TOptions> {
  id: string;
  register(reg: BackendInitRegistry, options: TOptions): void;
}

// TODO: Make option optional in the returned factory if they are indeed optional
/** @public */
export function createBackendPlugin<TOptions>(
  config: BackendPluginConfig<TOptions>,
): (option: TOptions) => BackendRegistrable {
  return options => ({
    id: config.id,
    register(register) {
      return config.register(register, options);
    },
  });
}

/** @public */
export interface BackendModuleConfig<TOptions> {
  pluginId: string;
  moduleId: string;
  register(
    reg: Omit<BackendInitRegistry, 'registerExtensionPoint'>,
    options: TOptions,
  ): void;
}

// TODO: Make option optional in the returned factory if they are indeed optional
/** @public */
export function createBackendModule<TOptions>(
  config: BackendModuleConfig<TOptions>,
): (option: TOptions) => BackendRegistrable {
  return options => ({
    id: `${config.pluginId}.${config.moduleId}`,
    register(register) {
      // TODO: Hide registerExtensionPoint
      return config.register(register, options);
    },
  });
}
