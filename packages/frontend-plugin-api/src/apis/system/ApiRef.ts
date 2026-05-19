/*
 * Copyright 2020 The Backstage Authors
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

import { OpaqueApiRef } from '@internal/frontend';
import type { ApiRef } from './types';

/**
 * API reference configuration - holds an ID of the referenced API.
 *
 * @public
 */
export type ApiRefConfig = {
  id: string;
};

type ApiRefBuilderConfig<TId extends string> = {
  id: TId;
  pluginId?: string;
};

function validateId(id: string): void {
  const valid = id
    .split('.')
    .flatMap(part => part.split('-'))
    .every(part => part.match(/^[a-z][a-z0-9]*$/));
  if (!valid) {
    throw new Error(
      `API id must only contain period separated lowercase alphanum tokens with dashes, got '${id}'`,
    );
  }
}

function makeApiRef<T, TId extends string>(
  config: ApiRefBuilderConfig<TId>,
): ApiRef<T, TId> & { readonly $$type: '@backstage/ApiRef' } {
  return OpaqueApiRef.createInstance('v1', {
    id: config.id,
    ...(config.pluginId ? { pluginId: config.pluginId } : {}),
    T: null as unknown as T,
    toString() {
      return `apiRef{${config.id}}`;
    },
  }) as ApiRef<T, TId> & { readonly $$type: '@backstage/ApiRef' };
}

/**
 * Creates a reference to an API.
 *
 * @remarks
 *
 * The `id` is a stable identifier for the API implementation. The frontend
 * system infers the owning plugin for an API from the `id`. When using the
 * builder form, you can instead provide a `pluginId` explicitly. The
 * recommended pattern is `plugin.<plugin-id>.*` (for example,
 * `plugin.catalog.entity-presentation`). This ensures that other plugins can't
 * mistakenly override your API implementation.
 *
 * The recommended way to create an API reference is:
 *
 * ```ts
 * const myApiRef = createApiRef<MyApi>().with({
 *   id: 'my-api',
 *   pluginId: 'my-plugin',
 * });
 * ```
 *
 * The legacy way to create an API reference is:
 *
 * ```ts
 * const myApiRef = createApiRef<MyApi>({ id: 'plugin.my.api' });
 * ```
 *
 * @public
 */
/**
 * Creates a reference to an API.
 *
 * @deprecated Use `createApiRef<T>().with(...)` instead.
 * @public
 */
export function createApiRef<T>(
  config: ApiRefConfig,
): ApiRef<T> & { readonly $$type: '@backstage/ApiRef' };
/**
 * Creates a reference to an API.
 *
 * @remarks
 *
 * Returns a builder with a `.with()` method for providing the API reference
 * configuration.
 *
 * @public
 */
export function createApiRef<T>(): {
  with<const TId extends string>(
    config: ApiRefConfig & { id: TId; pluginId?: string },
  ): ApiRef<T, TId> & {
    readonly $$type: '@backstage/ApiRef';
  };
};
export function createApiRef<T>(config?: ApiRefConfig):
  | (ApiRef<T> & { readonly $$type: '@backstage/ApiRef' })
  | {
      with<const TId extends string>(
        config: ApiRefConfig & { id: TId; pluginId?: string },
      ): ApiRef<T, TId> & {
        readonly $$type: '@backstage/ApiRef';
      };
    } {
  if (config) {
    validateId(config.id);
    return makeApiRef<T, string>(config);
  }
  return {
    with<const TId extends string>(
      withConfig: ApiRefConfig & { id: TId; pluginId?: string },
    ): ApiRef<T, TId> & { readonly $$type: '@backstage/ApiRef' } {
      validateId(withConfig.id);
      return makeApiRef<T, TId>(withConfig);
    },
  };
}
