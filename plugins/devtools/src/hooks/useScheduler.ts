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

import { devToolsApiRef } from '../api';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import {
  ConfigInfo,
  SchedulerResponse,
} from '@backstage/plugin-devtools-common';

export function useScheduler(pluginId: string): {
  schedules?: SchedulerResponse;
  loading: boolean;
  error?: Error;
} {
  const discovery = useApi(discoveryApiRef);
  const { value, loading, error } = useAsync(async () => {
    const response = await fetch(
      `${await discovery.getBaseUrl(pluginId)}/.backstage/scheduler/v1/list`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch schedules: ${response.statusText}`);
    }
    return response.json();
  }, [discovery, pluginId]);

  return {
    schedules: value,
    loading,
    error,
  };
}
