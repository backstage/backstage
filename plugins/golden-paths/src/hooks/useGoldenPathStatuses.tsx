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
import { useParams } from 'react-router-dom';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import { useApi } from '@backstage/core-plugin-api';
import { goldenPathsApiRef } from '@backstage/plugin-golden-paths-react';

export const useGoldenPathStatuses = () => {
  const { taskId } = useParams();
  const goldenPathsApi = useApi(goldenPathsApiRef);

  return useAsyncFn(
    async () => {
      if (!taskId) throw new Error('No task ID provided!');

      return await goldenPathsApi.getStatuses(taskId);
    },
    [],
    { loading: true },
  );
};
