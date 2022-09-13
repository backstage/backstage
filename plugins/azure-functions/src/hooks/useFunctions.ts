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

import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { FunctionsListResponse } from '@backstage/plugin-azure-functions-common';
import { azureFunctionsApiRef } from '../api';
import { useCallback } from 'react';

export function useFunctions({ functionsName }: { functionsName: string }) {
  const azureFunctionsApi = useApi(azureFunctionsApiRef);
  const errorApi = useApi(errorApiRef);

  const list = useCallback(
    async () => {
      return await azureFunctionsApi.list({
        functionName: functionsName,
      });
    },
    [functionsName], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const {
    loading,
    value: data,
    error,
    retry,
  } = useAsyncRetry<FunctionsListResponse | null>(async () => {
    try {
      const azureFunction = await list();
      return azureFunction;
    } catch (e) {
      if (e instanceof Error) {
        if (e?.message === 'MissingAzureBackendException') {
          errorApi.post(new Error('Please add azure-functions-backend plugin'));
          return null;
        }
        errorApi.post(e);
      }
      return null;
    }
  }, []);

  return [
    {
      loading,
      data,
      error,
      retry,
    },
  ] as const;
}
