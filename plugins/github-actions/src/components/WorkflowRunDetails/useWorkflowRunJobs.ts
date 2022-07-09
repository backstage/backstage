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
import useAsync, { AsyncState } from 'react-use/lib/useAsync';
import { githubActionsApiRef, Job, Jobs, Step } from '../../api';
import { buildRouteRef } from '../../routes';
import { useApi, useRouteRefParams } from '@backstage/core-plugin-api';

export const useWorkflowRunJobs = ({
  hostname,
  owner,
  repo,
}: {
  hostname?: string;
  owner: string;
  repo: string;
}): AsyncState<Jobs> => {
  const api = useApi(githubActionsApiRef);
  const { id } = useRouteRefParams(buildRouteRef);

  return useAsync(async () => {
    if (!repo || !owner) {
      throw new Error('No repo/owner provided');
    }

    const jobs = await api.listJobsForWorkflowRun({
      hostname,
      owner,
      repo,
      id: parseInt(id, 10),
    });

    return {
      total_count: jobs.total_count,
      jobs: jobs.jobs.map<Job>(job => ({
        html_url: job.html_url ?? undefined,
        status: job.status,
        conclusion: job.conclusion ?? undefined,
        started_at: job.started_at,
        completed_at: job.completed_at ?? undefined,
        id: job.id,
        name: job.name,
        steps: job.steps?.map<Step>(step => ({
          name: step.name,
          status: step.status,
          conclusion: step.conclusion ?? undefined,
          number: step.number,
          started_at: step.started_at ?? undefined,
          completed_at: step.completed_at ?? undefined,
        })),
      })),
    };
  }, [repo, owner, id]);
};
