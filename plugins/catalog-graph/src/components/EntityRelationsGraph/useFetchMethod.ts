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

import {
  DiscoveryApi,
  discoveryApiRef,
  FetchApi,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';

import useAsync from 'react-use/esm/useAsync';
import { useMemo } from 'react';

export type FetchMethod = 'frontend' | 'backend' | 'none' | 'pending';

// Makes an empty call to the backend to check if it's available
async function checkBackendAvailability(
  discoveryApi: DiscoveryApi,
  fetchApi: FetchApi,
): Promise<boolean> {
  const baseUrl = await discoveryApi.getBaseUrl('catalog-graph');

  const resp = await fetchApi.fetch(`${baseUrl}/graph`);
  if (!resp.ok) {
    return false;
  }

  await resp.json();

  return true;
}

let backendAvailable: Promise<boolean>;

export function useFetchMethod(hasEntitySet: boolean): FetchMethod {
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);

  const backendAvailability = useAsync(async () => {
    if (!backendAvailable) {
      backendAvailable = checkBackendAvailability(discoveryApi, fetchApi).catch(
        () => false,
      );
    }
    return backendAvailable;
  }, [discoveryApi, fetchApi]);

  return useMemo((): FetchMethod => {
    if (hasEntitySet) {
      return 'none';
    } else if (backendAvailability.value === true) {
      return 'backend';
    } else if (backendAvailability.value === false) {
      return 'frontend';
    }
    return 'pending'; // Not yet settled whether backend is available or not
  }, [hasEntitySet, backendAvailability.value]);
}
