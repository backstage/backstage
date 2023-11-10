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

import { act, renderHook, waitFor } from '@testing-library/react';
import { errorApiRef } from '@backstage/core-plugin-api';
import { usePipelines } from './usePipelines';
import { MockErrorApi } from '@backstage/test-utils';
import { circleCIApiRef } from '../api/CircleCIApi';
import { makeWrapper } from '../__testUtils__/testUtils';

const mockPipelineResponse = {
  items: [
    {
      id: 'pipeline 1',
    },
    {
      id: 'pipeline 2',
    },
  ],
  next_page_token: 'page-2',
};

const mockWorkflowResponse = [
  {
    items: [
      {
        pipeline_id: 'pipeline-1',
        id: 'workflow-1',
        name: 'ci',
      },
    ],
    next_page_token: null,
  },
  {
    items: [
      {
        pipeline_id: 'pipeline-2',
        id: 'workflow-2',
        name: 'build',
      },
    ],
    next_page_token: null,
  },
];

describe('usePipelines', () => {
  const mockedCircleCIApi = {
    getPipelinesForProject: jest.fn().mockResolvedValue({ items: [] }),
    getWorkflowsForPipeline: jest.fn().mockResolvedValue({ items: [] }),
    rerunWorkflow: jest.fn(),
  };

  const wrapper = ({ children }: { children: React.ReactElement }) =>
    makeWrapper({
      apis: [
        [circleCIApiRef, mockedCircleCIApi],
        [errorApiRef, new MockErrorApi()],
      ],
    })({ children });

  afterEach(() => jest.resetAllMocks());

  it('should fetch pipelines from api', () => {
    renderHook(() => usePipelines(), { wrapper });

    expect(mockedCircleCIApi.getPipelinesForProject).toHaveBeenCalledWith(
      'github/my-org/dummy',
      undefined,
    );
  });

  it('should return pipelines', async () => {
    mockedCircleCIApi.getPipelinesForProject.mockReturnValue(
      mockPipelineResponse,
    );
    mockedCircleCIApi.getWorkflowsForPipeline
      .mockResolvedValueOnce(mockWorkflowResponse[0])
      .mockResolvedValue(mockWorkflowResponse[1]);
    const { result } = renderHook(() => usePipelines(), { wrapper });
    await waitFor(() => !result.current[0].loading);

    expect(result.current[0].pipelines).toEqual([
      {
        id: 'pipeline 1',
        workflows: [
          {
            pipeline_id: 'pipeline-1',
            id: 'workflow-1',
            name: 'ci',
          },
        ],
      },
      {
        id: 'pipeline 2',
        workflows: [
          {
            pipeline_id: 'pipeline-2',
            id: 'workflow-2',
            name: 'build',
          },
        ],
      },
    ]);
  });

  describe('when fetching more records', () => {
    it('should send next page token', async () => {
      mockedCircleCIApi.getPipelinesForProject.mockReturnValue(
        mockPipelineResponse,
      );
      mockedCircleCIApi.getWorkflowsForPipeline.mockReturnValue({ items: [] });
      const { result } = renderHook(() => usePipelines(), { wrapper });
      const { fetchMore } = result.current[1];
      await waitFor(() => !result.current[0].loading);
      act(() => fetchMore());
      await waitFor(() => !result.current[0].hasMore);

      expect(mockedCircleCIApi.getPipelinesForProject).toHaveBeenCalledWith(
        'github/my-org/dummy',
        'page-2',
      );
    });
  });

  describe('when re-running a workflow', () => {
    it('should invoke api', async () => {
      const { result } = renderHook(() => usePipelines(), { wrapper });
      const { rerunWorkflow } = result.current[1];
      await waitFor(() => !result.current[0].loading);
      await rerunWorkflow('workflow-id');

      expect(mockedCircleCIApi.rerunWorkflow).toHaveBeenCalledWith(
        'workflow-id',
      );
    });
  });

  describe('when reloading a list of workflows', () => {
    it('should reset the page token', async () => {
      mockedCircleCIApi.getPipelinesForProject.mockReturnValueOnce(
        mockPipelineResponse,
      );
      mockedCircleCIApi.getWorkflowsForPipeline.mockReturnValue({ items: [] });
      const { result } = renderHook(() => usePipelines(), { wrapper });
      await waitFor(() => !result.current[0].loading);
      act(() => result.current[1].reload());

      await waitFor(() => {
        expect(mockedCircleCIApi.getPipelinesForProject).toHaveBeenCalledTimes(
          2,
        );
        expect(
          mockedCircleCIApi.getPipelinesForProject,
        ).toHaveBeenLastCalledWith('github/my-org/dummy', undefined);
      });
    });
  });
});
