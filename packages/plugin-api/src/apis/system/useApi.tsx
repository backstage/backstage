/*
 * Copyright 2020 Spotify AB
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
import { useVersionedContext } from '../../lib/versionedValues';

export function useApiHolder(): ApiHolder {
  const versionedHolder = useVersionedContext<{ 1: ApiHolder }>('api-context');

  const apiHolder = versionedHolder.atVersion(1);
  if (!apiHolder) {
    throw new Error('ApiContext v1 not available');
  }
  return apiHolder;
}

export function useApi<T>(apiRef: ApiRef<T>): T {
  const apiHolder = useApiHolder();

  const api = apiHolder.get(apiRef);
  if (!api) {
    throw new Error(`No implementation available for ${apiRef}`);
  }
  return api;
}
