/*
 * Copyright 2022 The Backstage Authors
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

import useInterval from 'react-use/lib/useInterval';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { AzureSiteListResponse } from '@backstage/plugin-azure-sites-common';
import { azureSiteApiRef } from '../api';
import { useCallback } from 'react';

const POLLING_INTERVAL = 15000;

export function useSites({ name }: { name: string }) {
  const azureApi = useApi(azureSiteApiRef);
  const errorApi = useApi(errorApiRef);

  const list = useCallback(
    async () => {
      return await azureApi.list({
        name: name,
      });
    },
    [name], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const {
    loading,
    value: data,
    error,
    retry,
  } = useAsyncRetry<AzureSiteListResponse | null>(async () => {
    try {
      const sites = await list();
      return sites;
    } catch (e) {
      if (e instanceof Error) {
        if (e?.message === 'AbortError') {
          errorApi.post(
            new Error(
              'Timeout reaching backend plugin, please add azure-backend plugin',
            ),
          );
        }
        errorApi.post(e);
      }
      return null;
    }
  }, []);

  useInterval(() => retry(), POLLING_INTERVAL);

  return [
    {
      loading,
      data,
      error,
      retry,
    },
  ] as const;
}
