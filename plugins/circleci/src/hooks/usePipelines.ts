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
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pipeline, PipelineInfo, Workflow } from '../types';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { useProjectSlugFromEntity } from './useProjectSlugFromEntity';
import { circleCIApiRef } from '../api';

type PipelinesPage = {
  items?: PipelineInfo[];
  pageToken?: string;
  nextPageToken?: string;
};

export function usePipelines() {
  const { repo, owner, projectSlug } = useProjectSlugFromEntity();
  const api = useApi(circleCIApiRef);
  const errorApi = useApi(errorApiRef);
  const pipelinesPage = useRef<PipelinesPage>({ items: [] });
  const [pageToken, setPageToken] = useState<string>();
  const [pipelines, setPipelines] = useState<PipelineInfo[]>([]);

  const getWorkflows = useCallback(
    async (pipelineId: string) => {
      try {
        const response = await api.getWorkflowsForPipeline(pipelineId);
        return response.items;
      } catch (e) {
        if (!(e instanceof AuthenticationError)) {
          errorApi.post(e);
        }
        return Promise.reject(e);
      }
    },
    [api, errorApi],
  );

  const transform = async (
    pipelinesData: Pipeline[],
    getWorkflowsCall: { (pipelineId: string): Promise<Workflow[]> },
  ): Promise<PipelineInfo[]> => {
    const pipelinePromises = pipelinesData.map(async pipelineData => {
      const workflows = await getWorkflowsCall(pipelineData.id);
      const tableBuildInfo: PipelineInfo = {
        ...pipelineData,
        workflows,
      };
      return tableBuildInfo;
    });

    return Promise.all(pipelinePromises);
  };

  const getPipelines = useCallback(async (): Promise<PipelineInfo[]> => {
    if (!projectSlug) {
      return Promise.reject(new Error('Missing project slug'));
    }

    const { items = [] } = pipelinesPage.current;

    try {
      const response = await api.getPipelinesForProject(projectSlug, pageToken);

      const allPipelines = [
        ...items,
        ...(await transform(response.items ?? [], getWorkflows)),
      ];

      pipelinesPage.current = {
        items: allPipelines,
        nextPageToken: response.next_page_token,
      };

      return allPipelines;
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      return Promise.reject(e);
    }
  }, [projectSlug, pageToken, getWorkflows, api, errorApi]);

  const { value, loading, retry } = useAsyncRetry(() => {
    return getPipelines();
  }, [getPipelines]);

  useEffect(() => setPipelines(value || []), [value]);

  const rerunWorkflow = async (workflowId: string) => {
    try {
      await api.rerunWorkflow(workflowId);
    } catch (e) {
      errorApi.post(e);
    }
  };

  const fetchMore = () => {
    setPageToken(pipelinesPage.current.nextPageToken);
  };

  const reload = () => {
    pipelinesPage.current = {};
    setPipelines([]);
    retry();
  };

  const projectName = `${owner}/${repo}`;

  return [
    {
      loading,
      pipelines: pipelines || [],
      projectName,
      hasMore: !!pipelinesPage.current.nextPageToken,
    },
    {
      fetchMore,
      reload,
      rerunWorkflow,
    },
  ] as const;
}
