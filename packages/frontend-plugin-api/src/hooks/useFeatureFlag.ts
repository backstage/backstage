/*
 * Copyright 2025 The Backstage Authors
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

import { useMemo } from 'react';
import useObservable from 'react-use/esm/useObservable';

import { featureFlagsApiRef, useApi } from '../apis';

/**
 * Returns the state of a feature flag.
 *
 * If the strictPresence option is provided, it indicates whether the feature
 * flag must be known to be valid. If true, `undefined` will be returned until
 * the value is resolved.
 *
 * @public
 */
export function useFeatureFlag<StrictPresence extends boolean = false>(
  name: string,
  options: { strictPresence: StrictPresence } = {
    strictPresence: false as StrictPresence,
  },
): StrictPresence extends true ? boolean | undefined : boolean {
  const { strictPresence } = options;

  const featureFlagsApi = useApi(featureFlagsApiRef);

  const observable = useMemo(
    () => featureFlagsApi.observe$(name),
    [featureFlagsApi, name],
  );

  const value = useObservable(observable);

  if (typeof value === 'undefined' && strictPresence) {
    return undefined as boolean | undefined as boolean;
  }
  return value ?? false;
}
