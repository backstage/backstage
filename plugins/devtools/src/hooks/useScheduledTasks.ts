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
import { devToolsApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';

export const useScheduledTasks = (plugin: string) => {
  const api = useApi(devToolsApiRef);

  const {
    value,
    loading,
    error: asyncError,
  } = useAsync(async () => {
    return api.getScheduledTasksByPlugin(plugin);
  }, [api, plugin]);

  if (asyncError) {
    return {
      scheduledTasks: undefined,
      loading: false,
      error: asyncError.message,
    };
  }

  return {
    scheduledTasks: value?.scheduledTasks,
    loading,
    error: value?.error,
  };
};
