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

import { AnyApiRef, ApiHolder, ApiRef, ApiLookupResult } from './types';
import { useVersionedContext } from '@backstage/version-bridge';
import { NotImplementedError } from '@backstage/errors';
import {
  apiHolderSupportsAsync,
  apiPromiseState,
  type ApiPromise,
  createApiPromise,
  createRejectedApiPromise,
} from '@internal/frontend';

const emptyApiHolder: ApiHolder = Object.freeze({ get: () => undefined });

type ApiPromiseState =
  | { status: 'pending' }
  | { status: 'fulfilled'; value: unknown }
  | { status: 'rejected'; error: unknown };

// Keep state outside React so retries before the initial mount share it.
const apiPromiseStates = new WeakMap<Promise<unknown>, ApiPromiseState>();

// The v1 context is also provided by the legacy system, whose lookups are synchronous.
type ApiHolderV1 = {
  get(ref: AnyApiRef): unknown;
  readonly [apiHolderSupportsAsync]?: true;
};
const apiHolderAdapters = new WeakMap<ApiHolderV1, ApiHolder>();

function adaptApiHolder(holder: ApiHolderV1): ApiHolder {
  const promises = new Map<
    string,
    | { kind: 'value'; value: unknown; promise: Promise<unknown> }
    | { kind: 'error'; promise: Promise<unknown> }
  >();

  function get<
    TApi = unknown,
    TApiRef extends AnyApiRef = ApiRef<TApi>,
    TAsync extends boolean = false,
  >(
    ref: TApiRef,
    options?: { async?: TAsync },
  ): ApiLookupResult<TApiRef, TAsync>;
  function get(ref: AnyApiRef, options?: { async?: boolean }): unknown {
    if (!options?.async && ref.loading !== 'async') {
      return holder.get(ref);
    }
    const existing = promises.get(ref.id);
    // Suspense retries must not rerun a failed legacy factory.
    if (existing?.kind === 'error') {
      return existing.promise;
    }
    try {
      // Legacy aggregators forward refs but do not forward lookup options.
      const value = holder.get(
        ref.loading === 'async' ? ref : { ...ref, loading: 'async' },
      );
      if (value === undefined) {
        promises.delete(ref.id);
        return undefined;
      }
      if (value && typeof (value as Promise<unknown>).then === 'function') {
        // Native async holders own their promise identity and invalidation.
        promises.delete(ref.id);
        return value;
      }
      if (existing?.kind === 'value' && Object.is(existing.value, value)) {
        return existing.promise;
      }
      const promise = createApiPromise(value);
      promises.set(ref.id, { kind: 'value', value, promise });
      return promise;
    } catch (error) {
      const promise = createRejectedApiPromise(error);
      promises.set(ref.id, { kind: 'error', promise });
      return promise;
    }
  }

  return { get };
}

/**
 * React hook for retrieving {@link ApiHolder}, an API catalog.
 * Async lookups are normalized when the context contains a legacy holder.
 * Synchronous lookups are forwarded unchanged. Native async holders are returned
 * unchanged.
 *
 * @public
 */
export function useApiHolder(): ApiHolder {
  const versionedHolder = useVersionedContext<{ 1: ApiHolderV1 }>(
    'api-context',
  );
  if (!versionedHolder) {
    return emptyApiHolder;
  }

  const apiHolder = versionedHolder.atVersion(1);
  if (!apiHolder) {
    throw new NotImplementedError('ApiContext v1 not available');
  }
  if (apiHolder[apiHolderSupportsAsync]) {
    return apiHolder as ApiHolder;
  }
  let adapter = apiHolderAdapters.get(apiHolder);
  if (!adapter) {
    adapter = adaptApiHolder(apiHolder);
    apiHolderAdapters.set(apiHolder, adapter);
  }
  return adapter;
}

/**
 * React hook for retrieving APIs.
 *
 * Suspends while an async-capable API is being initialized, and throws if its
 * factory fails. Older synchronous refs can access migrated async APIs through
 * this hook too. Render consumers inside a Suspense boundary.
 *
 * @param apiRef - Reference of the API to use.
 * @public
 */
export function useApi<T>(apiRef: AnyApiRef<T>): T {
  const apiHolder = useApiHolder();

  let api: unknown = apiHolder.get(apiRef, { async: true });
  // Handle promises even when the consumer has an older synchronous ref.
  if (api && typeof (api as Promise<unknown>).then === 'function') {
    const promise = api as ApiPromise<T>;
    let state = apiPromiseStates.get(promise);
    if (!state) {
      const settled = promise[apiPromiseState];
      state = settled ?? { status: 'pending' };
      apiPromiseStates.set(promise, state);
      if (!settled) {
        promise.then(
          value =>
            apiPromiseStates.set(promise, { status: 'fulfilled', value }),
          error => apiPromiseStates.set(promise, { status: 'rejected', error }),
        );
      }
    }
    if (state.status === 'pending') {
      throw promise;
    }
    if (state.status === 'rejected') {
      throw state.error;
    }
    api = state.value;
  }
  if (api === undefined) {
    throw new NotImplementedError(`No implementation available for ${apiRef}`);
  }
  return api as T;
}
