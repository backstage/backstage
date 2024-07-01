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

import { ConfigReader } from '@backstage/core-app-api';
import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createTriggerGitlabPipelineAction } from './gitlabPipelineTrigger';

const mockGitlabClient = {
  PipelineTriggerTokens: {
    create: jest.fn(),
    trigger: jest.fn(),
    remove: jest.fn(),
  },
};
jest.mock('@gitbeaker/rest', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('gitlab:pipeline:trigger', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.useFakeTimers({
      now: new Date(1988, 5, 3, 12, 0, 0),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const config = new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'gitlab.com',
          token: 'glpat-abcdef',
          apiBaseUrl: 'https://gitlab.com/api/v4',
        },
      ],
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);

  const action = createTriggerGitlabPipelineAction({ integrations });

  it('should return a Pipeline Token Id', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        tokenDescription: 'My cool pipeline token',
        branch: 'main',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.PipelineTriggerTokens.create.mockResolvedValue({
      id: 42,
      description: 'My cool pipeline token',
      createdAt: new Date().toISOString(),
      last_used: null,
      token: 'glptt-abcdef',
      updated_at: new Date().toISOString(),
      owner: null,
    });

    mockGitlabClient.PipelineTriggerTokens.trigger.mockResolvedValue({
      id: 99,
      web_url: 'https://gitlab.com/hangar18-/pipelines/99',
    });

    await action.handler({
      ...mockContext,
    });

    expect(mockGitlabClient.PipelineTriggerTokens.create).toHaveBeenCalledWith(
      123,
      'My cool pipeline token',
    );

    expect(mockGitlabClient.PipelineTriggerTokens.trigger).toHaveBeenCalledWith(
      123,
      'main',
      'glptt-abcdef',
      { variables: undefined },
    );

    expect(mockGitlabClient.PipelineTriggerTokens.remove).toHaveBeenCalledWith(
      123,
      42,
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'pipelineUrl',
      'https://gitlab.com/hangar18-/pipelines/99',
    );
  });

  it('should throw error if pipeline token cannot be created', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        tokenDescription: 'My cool pipeline token',
        branch: 'main',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.PipelineTriggerTokens.create.mockRejectedValue(
      new Error('Failed to create token'),
    );

    await expect(
      action.handler({
        ...mockContext,
      }),
    ).rejects.toThrow('Failed to create token');

    expect(mockGitlabClient.PipelineTriggerTokens.create).toHaveBeenCalledWith(
      123,
      'My cool pipeline token',
    );

    expect(
      mockGitlabClient.PipelineTriggerTokens.trigger,
    ).not.toHaveBeenCalled();

    expect(
      mockGitlabClient.PipelineTriggerTokens.remove,
    ).not.toHaveBeenCalled();
  });

  it('throw error if pipeline cannot be triggered', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        tokenDescription: 'My cool pipeline token',
        branch: 'main',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.PipelineTriggerTokens.create.mockResolvedValue({
      id: 42,
      description: 'My cool pipeline token',
      createdAt: new Date().toISOString(),
      last_used: null,
      token: 'glptt-abcdef',
      updated_at: new Date().toISOString(),
      owner: null,
    });

    mockGitlabClient.PipelineTriggerTokens.trigger.mockRejectedValue(
      new Error('Failed to trigger pipeline'),
    );

    await expect(
      action.handler({
        ...mockContext,
      }),
    ).rejects.toThrow('Failed to trigger pipeline');

    expect(mockGitlabClient.PipelineTriggerTokens.create).toHaveBeenCalledWith(
      123,
      'My cool pipeline token',
    );

    expect(mockGitlabClient.PipelineTriggerTokens.trigger).toHaveBeenCalledWith(
      123,
      'main',
      'glptt-abcdef',
      { variables: undefined },
    );

    expect(mockGitlabClient.PipelineTriggerTokens.remove).toHaveBeenCalledWith(
      123,
      42,
    );
  });

  it('should clean up pipeline token on failure', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        tokenDescription: 'My cool pipeline token',
        branch: 'main',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.PipelineTriggerTokens.create.mockResolvedValue({
      id: 42,
      description: 'My cool pipeline token',
      createdAt: new Date().toISOString(),
      last_used: null,
      token: 'glptt-abcdef',
      updated_at: new Date().toISOString(),
      owner: null,
    });

    mockGitlabClient.PipelineTriggerTokens.trigger.mockRejectedValue(
      new Error('Failed to trigger pipeline'),
    );

    await expect(
      action.handler({
        ...mockContext,
      }),
    ).rejects.toThrow('Failed to trigger pipeline');

    expect(mockGitlabClient.PipelineTriggerTokens.remove).toHaveBeenCalledWith(
      123,
      42,
    );
  });

  it('should succeed trigger and pass variables', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        tokenDescription: 'My cool pipeline token',
        branch: 'main',
        variables: { var_one: 'val1', var_two: 'val2' },
      },
      workspacePath: 'seen2much',
    });

    await expect(
      action.handler({
        ...mockContext,
      }),
    ).rejects.toThrow('Failed to trigger pipeline');

    expect(mockGitlabClient.PipelineTriggerTokens.trigger).toHaveBeenCalledWith(
      123,
      'main',
      'glptt-abcdef',
      { variables: { var_one: 'val1', var_two: 'val2' } },
    );
  });
});
