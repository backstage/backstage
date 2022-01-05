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
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import useInterval from 'react-use/lib/useInterval';

import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
import { azureDevOpsApiRef } from '../api';
import { useCallback } from 'react';

const POLLING_INTERVAL = 10000;

export function useDashboardPullRequests(
  project?: string,
  pollingInterval: number = POLLING_INTERVAL,
): {
  pullRequests?: DashboardPullRequest[];
  loading: boolean;
  error?: Error;
} {
  const api = useApi(azureDevOpsApiRef);
  const errorApi = useApi(errorApiRef);

  const getDashboardPullRequests = useCallback(async (): Promise<
    DashboardPullRequest[]
  > => {
    if (!project) {
      return Promise.reject(new Error('Missing project name'));
    }

    try {
      return await api.getDashboardPullRequests(project);
    } catch (error) {
      if (error instanceof Error) {
        errorApi.post(error);
      }

      return Promise.reject(error);
    }
  }, [project, api, errorApi]);

  const {
    value: pullRequests,
    loading,
    error,
    retry,
  } = useAsyncRetry(
    () => getDashboardPullRequests(),
    [getDashboardPullRequests],
  );

  useInterval(() => retry(), pollingInterval);

  return {
    pullRequests,
    loading,
    error,
  };
}
