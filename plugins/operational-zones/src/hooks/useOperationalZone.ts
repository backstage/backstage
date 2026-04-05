/*
 * Copyright 2024 The Backstage Authors
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

import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { Zone } from '@backstage/plugin-operational-zones-common';
import { operationalZoneApiRef } from '../api';

/**
 * React hook that resolves a single operational zone by ID.
 *
 * @param operationId - The operation ID to resolve
 * @returns The zone state, loading flag, and any error
 *
 * @public
 */
export function useOperationalZone(operationId: string): {
  zone: Zone | undefined;
  loading: boolean;
  error: Error | undefined;
} {
  const api = useApi(operationalZoneApiRef);
  const { value, loading, error } = useAsync(
    () => api.getZone(operationId),
    [operationId],
  );
  return { zone: value, loading, error };
}
