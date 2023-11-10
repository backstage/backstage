/*
 * Copyright 2021 The Backstage Authors
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

import { MockFetchApi, setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { UrlPatternDiscovery } from '@backstage/core-app-api';
import { CircleCIClient } from './CircleCIClient';
import { Pipeline, Workflow } from '../types';

const server = setupServer();

describe('CircleCIClient', () => {
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api/proxy';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  const fetchApi = new MockFetchApi();

  let client: CircleCIClient;

  beforeEach(() => {
    client = new CircleCIClient({ discoveryApi, fetchApi });
  });

  describe('rerunWorkflow', () => {
    it('should return workflow ID', async () => {
      server.use(
        rest.post(
          `${mockBaseUrl}/circleci/api/v2/workflow/workflow-1/rerun`,
          (_req, res, ctx) => {
            return res(
              ctx.json({
                workflow_id: 'workflow-1',
              }),
            );
          },
        ),
      );

      const response = await client.rerunWorkflow('workflow-1');

      expect(response).toBeDefined();
      expect(response.workflow_id).toBe('workflow-1');
    });
  });

  describe('getPipelinesForProject', () => {
    it('should get all pipelines for a given project', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/circleci/api/v2/project/slug-1/pipeline`,
          (_req, res, ctx) => {
            return res(
              ctx.json({
                items: [
                  { id: 'pipeline-1', state: Pipeline.StateEnum.Created },
                  { id: 'pipeline-2', state: Pipeline.StateEnum.Errored },
                ],
                next_page_token: 'next-page',
              }),
            );
          },
        ),
      );

      const pipelines = await client.getPipelinesForProject('slug-1');

      expect(pipelines).toBeDefined();
      expect(pipelines.items.length).toBe(2);
    });
  });

  describe('getWorkflowsForPipeline', () => {
    it('should get all workflows for a given pipeline', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/circleci/api/v2/pipeline/pipeline-1/workflow`,
          (_req, res, ctx) => {
            return res(
              ctx.json({
                items: [
                  {
                    pipeline_id: 'pipeline-1',
                    id: 'workflow-1',
                    status: Workflow.StatusEnum.Running,
                  },
                  {
                    pipeline_id: 'pipeline-1',
                    id: 'workflow-2',
                    status: Workflow.StatusEnum.Success,
                  },
                  {
                    pipeline_id: 'pipeline-1',
                    id: 'workflow-3',
                    status: Workflow.StatusEnum.Running,
                  },
                ],
                next_page_token: 'next-page',
              }),
            );
          },
        ),
      );

      const workflows = await client.getWorkflowsForPipeline('pipeline-1');

      expect(workflows).toBeDefined();
      expect(workflows.items.length).toBe(3);
      expect(workflows.items[0].id).toBe('workflow-1');
      expect(workflows.items[1].id).toBe('workflow-2');
      expect(workflows.items[2].id).toBe('workflow-3');
    });
  });

  describe('getWorkflow', () => {
    it('should get workflow', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/circleci/api/v2/workflow/workflow-1`,
          (_req, res, ctx) => {
            return res(
              ctx.json({
                pipeline_id: 'pipeline-1',
                id: 'workflow-1',
                status: Workflow.StatusEnum.Running,
              }),
            );
          },
        ),
      );

      const workflow = await client.getWorkflow('workflow-1');

      expect(workflow).toBeDefined();
      expect(workflow).toEqual({
        pipeline_id: 'pipeline-1',
        id: 'workflow-1',
        status: Workflow.StatusEnum.Running,
      });
    });
  });

  describe('getBuild', () => {
    it('should get build', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/circleci/api/v1.1/project/slug-1/123`,
          (_req, res, ctx) => {
            return res(
              ctx.json({
                build_num: 123,
                steps: [{ name: 'step-1' }, { name: 'step-2' }],
              }),
            );
          },
        ),
      );

      const workflow = await client.getBuild('slug-1', 123);

      expect(workflow).toBeDefined();
      expect(workflow).toEqual({
        build_num: 123,
        steps: [{ name: 'step-1' }, { name: 'step-2' }],
      });
    });
  });

  describe('getStepOutput', () => {
    it('should get step output', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/circleci/api/private/output/raw/slug-1/1234/output/0/99`,
          (_req, res, ctx) => {
            return res(ctx.text('This is the step output'));
          },
        ),
      );

      const step = await client.getStepOutput({
        projectSlug: 'slug-1',
        buildNumber: 1234,
        index: 0,
        step: 99,
      });

      expect(step).toBeDefined();
      expect(step).toEqual('This is the step output');
    });
  });
});
