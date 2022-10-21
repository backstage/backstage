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
import { Alert, AlertResponder } from '../types';

export const useAssignAlert = (alert: Alert | null, open: boolean) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [alertRespondersList, setAlertRespondersList] = React.useState<
    AlertResponder[]
  >([]);
  const [alertResponder, setAlertResponder] =
    React.useState<AlertResponder | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { error, retry } = useAsyncRetry(async () => {
    try {
      if (!alert || !open) {
        return;
      }
      const data = await ilertApi.fetchAlertResponders(alert);
      if (data && Array.isArray(data)) {
        const groups = [
          'SUGGESTED',
          'USER',
          'ESCALATION_POLICY',
          'ON_CALL_SCHEDULE',
        ];
        data.sort((a, b) => groups.indexOf(a.group) - groups.indexOf(b.group));
        setAlertRespondersList(data);
      }
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  }, [alert, open]);

  return [
    {
      alertRespondersList,
      alertResponder,
      error,
      isLoading,
    },
    {
      setAlertRespondersList,
      setAlertResponder,
      setIsLoading,
      retry,
    },
  ] as const;
};
