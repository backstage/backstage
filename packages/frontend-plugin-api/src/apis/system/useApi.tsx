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

import { ApiRef, ApiHolder } from './types';
import { useVersionedContext } from '@backstage/version-bridge';
import { NotImplementedError } from '@backstage/errors';

const emptyApiHolder: ApiHolder = Object.freeze({ get: () => undefined });

type ApiPromiseState =
  | { status: 'pending'; promise: Promise<unknown> }
  | { status: 'fulfilled'; value: unknown }
  | { status: 'rejected'; error: unknown };

// Keep state outside React so retries before the initial mount share it.
const apiPromiseStates = new WeakMap<object, ApiPromiseState>();

/**
 * React hook for retrieving {@link ApiHolder}, an API catalog.
 *
 * @public
 */
export function useApiHolder(): ApiHolder {
  const versionedHolder = useVersionedContext<{ 1: ApiHolder }>('api-context');
  if (!versionedHolder) {
    return emptyApiHolder;
  }

  const apiHolder = versionedHolder.atVersion(1);
  if (!apiHolder) {
    throw new NotImplementedError('ApiContext v1 not available');
  }
  return apiHolder;
}

/**
 * React hook for retrieving APIs.
 *
 * Promise-valued APIs are unwrapped. The hook suspends while the promise is
 * pending and throws its rejection reason if it fails. Render consumers of
 * promise-valued APIs inside a Suspense boundary.
 *
 * Direct holder lookups and factory dependencies retain the declared API value.
 *
 * @param apiRef - Reference of the API to use.
 * @public
 */
export function useApi<T>(apiRef: ApiRef<T>): Awaited<T> {
  const apiHolder = useApiHolder();
  const api: unknown = apiHolder.get(apiRef);
  if (api === undefined) {
    throw new NotImplementedError(`No implementation available for ${apiRef}`);
  }

  if (
    api !== null &&
    (typeof api === 'object' || typeof api === 'function') &&
    'then' in api &&
    typeof api.then === 'function'
  ) {
    let state = apiPromiseStates.get(api);
    if (!state) {
      const promise = Promise.resolve(api);
      state = { status: 'pending', promise };
      apiPromiseStates.set(api, state);
      promise.then(
        value => apiPromiseStates.set(api, { status: 'fulfilled', value }),
        error => apiPromiseStates.set(api, { status: 'rejected', error }),
      );
    }
    if (state.status === 'pending') {
      throw state.promise;
    }
    if (state.status === 'rejected') {
      throw state.error;
    }
    return state.value as Awaited<T>;
  }
  return api as Awaited<T>;
}
