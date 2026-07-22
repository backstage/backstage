/*
 * Copyright 2026 The Backstage Authors
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
import { useApi } from '@backstage/core-plugin-api';
import { goldenPathsApiRef } from '@backstage/plugin-golden-paths-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAsyncFn } from 'react-use';

export const useGoldenPathTask = () => {
  const { taskId } = useParams();
  const goldenPathsApi = useApi(goldenPathsApiRef);

  const [{ loading, error, value: task }, getGoldenPathTask] = useAsyncFn(
    async (taskIdParam?: string) => {
      if (!taskId) throw new Error('No task ID provided!');

      return await goldenPathsApi.getTask(taskIdParam || taskId);
    },
    [],
  );

  useEffect(() => {
    getGoldenPathTask();
  }, [getGoldenPathTask]);

  return { loading, error, task, getGoldenPathTask };
};
