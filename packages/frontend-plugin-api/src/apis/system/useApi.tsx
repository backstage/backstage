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
 * @param apiRef - Reference of the API to use.
 * @public
 */
export function useApi<T>(apiRef: ApiRef<T>): T {
  const apiHolder = useApiHolder();

  const api = apiHolder.get(apiRef);
  if (!api) {
    throw new NotImplementedError(`No implementation available for ${apiRef}`);
  }
  return api;
}
