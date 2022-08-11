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

import {
  BackendInitRegistry,
  BackendRegistrable,
  ExtensionPoint,
} from './types';

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
export interface BackendPluginConfig<TOptions> {
  id: string;
  register(reg: BackendInitRegistry, options: TOptions): void;
}

/** @public */
export function createBackendPlugin<TOptions>(
  config: BackendPluginConfig<TOptions>,
): undefined extends TOptions
  ? (options?: TOptions) => BackendRegistrable
  : (options: TOptions) => BackendRegistrable {
  return (options?: TOptions) => ({
    id: config.id,
    register(register: BackendInitRegistry) {
      return config.register(register, options!);
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

/** @public */
export function createBackendModule<TOptions>(
  config: BackendModuleConfig<TOptions>,
): undefined extends TOptions
  ? (options?: TOptions) => BackendRegistrable
  : (options: TOptions) => BackendRegistrable {
  return (options?: TOptions) => ({
    id: `${config.pluginId}.${config.moduleId}`,
    register(register: BackendInitRegistry) {
      // TODO: Hide registerExtensionPoint
      return config.register(register, options!);
    },
  });
}
