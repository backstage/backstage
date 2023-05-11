/*
 * Copyright 2021 The Backstage Authors
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
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import React from 'react';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { ilertApiRef } from '../api';
import { Alert, AlertAction } from '../types';

export const useAlertActions = (alert: Alert | null, open: boolean) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [alertActionsList, setAlertActionsList] = React.useState<AlertAction[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const { error, retry } = useAsyncRetry(async () => {
    try {
      if (!alert || !open) {
        return;
      }
      const data = await ilertApi.fetchAlertActions(alert);
      setAlertActionsList(data);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  }, [alert, open]);

  return [
    {
      alertActions: alertActionsList,
      error,
      isLoading,
    },
    {
      setAlertActionsList,
      setIsLoading,
      retry,
    },
  ] as const;
};
