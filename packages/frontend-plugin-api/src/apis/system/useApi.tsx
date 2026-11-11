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
  resolvedApiPromise,
  type ResolvedApiPromise,
  createApiPromise,
} from '@internal/frontend';

const emptyApiHolder: ApiHolder = Object.freeze({ get: () => undefined });

type ApiPromiseState =
  | { status: 'pending' }
  | { status: 'fulfilled'; value: unknown }
  | { status: 'rejected'; error: unknown };

// Keep state outside React so retries before the initial mount share it.
const apiPromiseStates = new WeakMap<Promise<unknown>, ApiPromiseState>();

// The v1 context is also provided by the legacy system, whose lookups are synchronous.
type ApiHolderV1 = { get(ref: AnyApiRef): unknown };
const apiHolderAdapters = new WeakMap<ApiHolderV1, ApiHolder>();

function adaptApiHolder(holder: ApiHolderV1): ApiHolder {
  const promises = new Map<
    string,
    | { kind: 'value'; value: unknown; promise: Promise<unknown> }
    | { kind: 'error'; promise: Promise<unknown> }
  >();

  function get<TApi = unknown, TApiRef extends AnyApiRef = ApiRef<TApi>>(
    ref: TApiRef,
  ): ApiLookupResult<TApiRef>;
  function get(ref: AnyApiRef): unknown {
    if (ref.loading !== 'async') {
      return holder.get(ref);
    }
    const existing = promises.get(ref.id);
    // Suspense retries must not rerun a failed legacy factory.
    if (existing?.kind === 'error') {
      return existing.promise;
    }
    try {
      const value = holder.get(ref);
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
      const promise = Promise.reject(error);
      promises.set(ref.id, { kind: 'error', promise });
      return promise;
    }
  }

  return { get };
}

/**
 * React hook for retrieving {@link ApiHolder}, an API catalog.
 * Async lookups are normalized when the context contains a legacy holder.
 * Synchronous lookups are forwarded unchanged.
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

  let api: T | Promise<T> | undefined;
  try {
    api = apiHolder.get(apiRef);
  } catch (error) {
    // Only retry the requested API; synchronous factory dependencies need migration.
    if (
      error instanceof Error &&
      error.name === 'AsyncApiAccessError' &&
      'apiRefId' in error &&
      error.apiRefId === apiRef.id &&
      apiRef.loading !== 'async'
    ) {
      api = apiHolder.get({ ...apiRef, loading: 'async' });
    } else {
      throw error;
    }
  }
  // Handle promises even when the consumer has an older synchronous ref.
  if (api && typeof (api as Promise<unknown>).then === 'function') {
    const promise = api as ResolvedApiPromise<T>;
    let state = apiPromiseStates.get(promise);
    if (!state) {
      const resolved = promise[resolvedApiPromise];
      state = resolved
        ? { status: 'fulfilled', value: resolved.value }
        : { status: 'pending' };
      apiPromiseStates.set(promise, state);
      if (!resolved) {
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
    api = state.value as T | undefined;
  }
  if (api === undefined) {
    throw new NotImplementedError(`No implementation available for ${apiRef}`);
  }
  return api as T;
}
