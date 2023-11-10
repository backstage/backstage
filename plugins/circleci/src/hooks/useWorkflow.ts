/*
 * Copyright 2020 The Backstage Authors
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
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { circleCIApiRef } from '../api';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

export function useWorkflow(workflowId: string) {
  const api = useApi(circleCIApiRef);
  const errorApi = useApi(errorApiRef);

  const {
    loading,
    value: workflow,
    retry,
  } = useAsyncRetry(async () => {
    try {
      const data = await api.getWorkflow(workflowId);
      return data;
    } catch (e) {
      if (e.name !== 'AuthenticationError') {
        errorApi.post(e);
      }
      return e;
    }
  }, [api, errorApi, workflowId]);

  return { loading, workflow, retry };
}
