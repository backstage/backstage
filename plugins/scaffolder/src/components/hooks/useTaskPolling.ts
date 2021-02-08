/*
 * Copyright 2020 Spotify AB
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
import { useEffect, useState } from 'react';
import { ScaffolderV2Task } from '../../types';
import { useApi } from '@backstage/core';
import { scaffolderApiRef } from '../../api';
import { useInterval } from 'react-use';

const DEFAULT_POLLING_INTERVAL = 1000;

export const useTaskPolling = (
  taskId: string | null,
  onFinish?: (t: ScaffolderV2Task) => void,
  pollingInterval = DEFAULT_POLLING_INTERVAL,
) => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const [currentTask, setCurrentTask] = useState<ScaffolderV2Task | null>(null);

  useInterval(async () => {
    if (taskId) {
      setCurrentTask(await scaffolderApi.getTask(taskId));
    }
  }, pollingInterval);

  useEffect(() => {
    switch (currentTask?.status) {
      case 'failed':
      case 'cancelled':
      case 'completed':
        return onFinish?.(currentTask);
      default:
        return undefined;
    }
  }, [currentTask, onFinish]);

  return currentTask;
};
