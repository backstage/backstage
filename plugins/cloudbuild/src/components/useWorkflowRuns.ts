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
import { useState } from 'react';
import { useAsyncRetry } from 'react-use';
import { WorkflowRun } from './WorkflowRunsTable/WorkflowRunsTable';
import { cloudbuildApiRef } from '../api/CloudbuildApi';
import { useApi, googleAuthApiRef, errorApiRef } from '@backstage/core';
import { ActionsListWorkflowRunsForRepoResponseData } from '../api/types';

export function useWorkflowRuns({ projectId }: { projectId: string }) {
  const api = useApi(cloudbuildApiRef);
  const auth = useApi(googleAuthApiRef);
  const errorApi = useApi(errorApiRef);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const { loading, value: runs, retry, error } = useAsyncRetry<
    WorkflowRun[]
  >(async () => {
    const token = await auth.getAccessToken([
      'https://www.googleapis.com/auth/cloud-platform',
    ]);
    return api
      .listWorkflowRuns({
        token,
        projectId,
      })
      .then(
        (
          workflowRunsData: ActionsListWorkflowRunsForRepoResponseData,
        ): WorkflowRun[] => {
          setTotal(workflowRunsData.total_count);
          // Transformation here
          return workflowRunsData.workflow_runs.builds.map(run => ({
            message: run.substitutions.REPO_NAME,
            id: `${run.id}`,
            onReRunClick: async () => {
              try {
                await api.reRunWorkflow({
                  token,
                  projectId,
                  runId: run.id,
                });
              } catch (e) {
                errorApi.post(e);
              }
            },
            substitutions: run.substitutions,
            source: {
              branchName: run.substitutions.REPO_NAME,
              commit: {
                hash: run.substitutions.COMMIT_SHA,
                url: run.substitutions.REPO_NAME,
              },
            },
            status: run.status,
            url: run.logUrl,
            googleUrl: run.logUrl,
            org: 'trivago',
            createTime: run.createTime,
          }));
        },
      );
  }, [page, pageSize, projectId]);

  return [
    {
      page,
      pageSize,
      loading,
      runs,
      projectName: `${projectId}`,
      total,
      error,
    },
    {
      runs,
      setPage,
      setPageSize,
      retry,
    },
  ] as const;
}
