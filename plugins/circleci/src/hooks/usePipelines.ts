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
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import limiterFactory from 'p-limit';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { Pipeline, PipelineInfo, Workflow } from '../types';
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
        if (e.name !== 'AuthenticationError') {
          errorApi.post(e);
        }
        throw e;
      }
    },
    [api, errorApi],
  );

  const transform = (
    pipelinesData: Pipeline[],
    getWorkflowsCall: { (pipelineId: string): Promise<Workflow[]> },
  ): Promise<PipelineInfo[]> => {
    const limiter = limiterFactory(10);

    const pipelinePromises = pipelinesData.map(pipelineData =>
      limiter(async () => {
        const workflows = await getWorkflowsCall(pipelineData.id);
        const tableBuildInfo: PipelineInfo = {
          ...pipelineData,
          workflows,
        };
        return tableBuildInfo;
      }),
    );

    return Promise.all(pipelinePromises);
  };

  const getPipelines = useCallback(async (): Promise<PipelineInfo[]> => {
    if (!projectSlug) {
      throw new Error('Missing project slug');
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
      if (e.name !== 'AuthenticationError') {
        errorApi.post(e);
      }
      throw e;
    }
  }, [projectSlug, pageToken, getWorkflows, api, errorApi]);

  const { value, loading, retry } = useAsyncRetry(
    () => getPipelines(),
    [getPipelines],
  );

  useEffect(() => setPipelines(value || []), [value]);

  const rerunWorkflow = useCallback(
    async (workflowId: string) => {
      try {
        await api.rerunWorkflow(workflowId);
      } catch (e) {
        errorApi.post(e);
        throw e;
      }
    },
    [api, errorApi],
  );

  const fetchMore = useCallback(() => {
    setPageToken(pipelinesPage.current.nextPageToken);
  }, []);

  const reload = useCallback(() => {
    pipelinesPage.current = {};
    setPipelines([]);
    retry();
  }, [retry]);

  const projectName = `${owner}/${repo}`;

  return [
    {
      loading,
      pipelines: pipelines,
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
