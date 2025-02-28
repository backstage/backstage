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
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import {
  ConfigInfo,
  SchedulerResponse,
} from '@backstage/plugin-devtools-common';

export function usePlugins(): {
  plugins?: Array<string>;
  loading: boolean;
  error?: Error;
} {
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async () => {
    const response = await fetch(
      `${config.getString(
        'backend.baseUrl',
      )}/.backstage/instanceMetadata/v1/features/installed/`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch plugins: ${response.statusText}`);
    }
    return ((await response.json()) as any).items
      .filter((e: { type: string }) => e.type === 'plugin')
      .map(e => e.pluginId);
  }, [config]);

  return {
    plugins: value,
    loading,
    error,
  };
}
