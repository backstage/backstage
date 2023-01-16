/*
 * Copyright 2023 The Backstage Authors
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

import { ServiceFactory, ServiceFactoryOrFunction } from '../services';

/** @public */
export interface SharedBackendEnvironmentConfig {
  services?: ServiceFactoryOrFunction[];
}

// This type is opaque in order to allow for future API evolution without
// cluttering the external API. For example we might want to add support
// for more powerful callback based backend modifications.
//
// By making this opaque we also ensure that the type doesn't become an input
// type that we need to care about, as it would otherwise be possible to pass
// a custom environment definition to `createBackend`, which we don't want.
/**
 * @public
 */
export interface SharedBackendEnvironment {
  $$type: 'SharedBackendEnvironment';
}

/**
 * This type is NOT supposed to be used by anyone except internally by the backend-app-api package.
 * @internal */
export interface InternalSharedBackendEnvironment {
  version: 'v1';
  services?: ServiceFactory[];
}

/**
 * Creates a shared backend environment which can be used to create multiple backends
 * @public
 */
export function createSharedEnvironment<
  TOptions extends [options?: object] = [],
>(
  config:
    | SharedBackendEnvironmentConfig
    | ((...params: TOptions) => SharedBackendEnvironmentConfig),
): (...options: TOptions) => SharedBackendEnvironment {
  const configCallback = typeof config === 'function' ? config : () => config;

  return (...options) => {
    const actualConfig = configCallback(...options);
    const services = actualConfig?.services?.map(sf =>
      typeof sf === 'function' ? sf() : sf,
    );

    const exists = new Set<string>();
    const duplicates = new Set<string>();
    for (const { service } of services ?? []) {
      if (exists.has(service.id)) {
        duplicates.add(service.id);
      } else {
        exists.add(service.id);
      }
    }

    if (duplicates.size > 0) {
      const dupStr = [...duplicates].map(id => `'${id}'`).join(', ');
      throw new Error(
        `Duplicate service implementations provided in shared environment for ${dupStr}`,
      );
    }

    // Here to ensure type safety in this internal implementation.
    const env: SharedBackendEnvironment & InternalSharedBackendEnvironment = {
      $$type: 'SharedBackendEnvironment',
      version: 'v1',
      services,
    };
    return env;
  };
}
