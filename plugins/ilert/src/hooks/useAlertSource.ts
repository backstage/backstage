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
import { AlertSource } from '../types';

export const useAlertSource = (integrationKey: string) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [alertSource, setAlertSource] = React.useState<AlertSource | null>(
    null,
  );
  const [isAlertSourceLoading, setIsAlertSourceLoading] = React.useState(false);

  const fetchAlertSourceCall = async () => {
    try {
      if (!integrationKey) {
        return;
      }
      setIsAlertSourceLoading(true);
      const data = await ilertApi.fetchAlertSource(integrationKey);
      setAlertSource(data || null);
      setIsAlertSourceLoading(false);
    } catch (e) {
      setIsAlertSourceLoading(false);
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  };

  const { error: alertSourceError, retry: alertSourceRetry } = useAsyncRetry(
    fetchAlertSourceCall,
    [integrationKey],
  );

  const retry = () => alertSourceRetry();

  return [
    {
      alertSource,
      error: alertSourceError,
      isLoading: isAlertSourceLoading,
    },
    {
      retry,
      setIsLoading: setIsAlertSourceLoading,
      refetchAlertSource: fetchAlertSourceCall,
      setAlertSource,
    },
  ] as const;
};
