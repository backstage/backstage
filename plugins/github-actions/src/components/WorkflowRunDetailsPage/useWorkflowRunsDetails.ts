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
import { useApi, githubAuthApiRef } from '@backstage/core';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { githubActionsApiRef } from '../../api';

export const useWorkflowRunsDetails = (repo: string, owner: string) => {
  const api = useApi(githubActionsApiRef);
  const auth = useApi(githubAuthApiRef);
  const { id } = useParams();
  const details = useAsync(async () => {
    const token = await auth.getAccessToken(['repo']);
    return api.getWorkflowRun({
      token,
      owner,
      repo,
      id: parseInt(id, 10),
    });
  }, [repo, owner, id]);
  return details;
};
