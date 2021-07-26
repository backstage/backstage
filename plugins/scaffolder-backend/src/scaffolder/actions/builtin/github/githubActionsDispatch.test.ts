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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

jest.mock('@octokit/rest');

import { createGithubActionsDispatchAction } from './githubActionsDispatch';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';

describe('github:actions:dispatch', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createGithubActionsDispatchAction({ integrations });

  const mockContext = {
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      workflowId: 'a-workflow-id',
      branchOrTagName: 'main',
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  const { mockGithubClient } = require('@octokit/rest');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'github.com?repo=bob' },
      }),
    ).rejects.toThrow(/missing owner/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'github.com?owner=owner' },
      }),
    ).rejects.toThrow(/missing repo/);
  });

  it('should throw if there is no integration config provided', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'missing.com?repo=bob&owner=owner' },
      }),
    ).rejects.toThrow(/No matching integration configuration/);
  });

  it('should throw if there is no token in the integration config that is returned', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'ghe.github.com?repo=bob&owner=owner',
        },
      }),
    ).rejects.toThrow(/No token available for host/);
  });

  it('should call the githubApis for creating WorkflowDispatch', async () => {
    mockGithubClient.rest.actions.createWorkflowDispatch.mockResolvedValue({
      data: {
        foo: 'bar',
      },
    });

    const repoUrl = 'github.com?repo=repo&owner=owner';
    const workflowId = 'dispatch_workflow';
    const branchOrTagName = 'main';
    const ctx = Object.assign({}, mockContext, {
      input: { repoUrl, workflowId, branchOrTagName },
    });
    await action.handler(ctx);

    expect(
      mockGithubClient.rest.actions.createWorkflowDispatch,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      workflow_id: workflowId,
      ref: branchOrTagName,
    });
  });
});
