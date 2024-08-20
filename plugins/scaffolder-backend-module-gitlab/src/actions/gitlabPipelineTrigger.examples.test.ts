/*
 * Copyright 2024 The Backstage Authors
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
import { examples } from './gitlabPipelineTrigger.examples';
import yaml from 'yaml';

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

  it(`should ${examples[0].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        tokenDescription: 'Gitlab sample pipeline',
        branch: 'main',
      },
      workspacePath: 'repository',
    });

    mockGitlabClient.PipelineTriggerTokens.create.mockResolvedValue({
      id: 42,
      description: 'Gitlab sample pipeline',
      createdAt: new Date().toISOString(),
      last_used: null,
      token: 'abcdd-ghijkl',
      updated_at: new Date().toISOString(),
      owner: null,
    });

    mockGitlabClient.PipelineTriggerTokens.trigger.mockResolvedValue({
      id: 99,
      web_url: 'https://gitlab.com/hangar18-/pipelines/99',
    });

    let input;
    try {
      input = yaml.parse(examples[0].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.PipelineTriggerTokens.create).toHaveBeenCalledWith(
      input.projectId,
      input.tokenDescription,
    );

    expect(mockGitlabClient.PipelineTriggerTokens.trigger).toHaveBeenCalledWith(
      input.projectId,
      'main',
      'abcdd-ghijkl',
      { variables: input.variables },
    );

    expect(mockGitlabClient.PipelineTriggerTokens.remove).toHaveBeenCalledWith(
      input.projectId,
      42,
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'pipelineUrl',
      'https://gitlab.com/hangar18-/pipelines/99',
    );
  });

  it(`should ${examples[1].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        tokenDescription: 'Gitlab sample pipeline',
        branch: 'main',
      },
      workspacePath: 'repository',
    });

    mockGitlabClient.PipelineTriggerTokens.create.mockResolvedValue({
      id: 42,
      description: 'Gitlab sample pipeline',
      createdAt: new Date().toISOString(),
      last_used: null,
      token: 'abcdd-ghijkl',
      updated_at: new Date().toISOString(),
      owner: null,
    });

    mockGitlabClient.PipelineTriggerTokens.trigger.mockResolvedValue({
      id: 99,
      web_url: 'https://gitlab.com/hangar18-/pipelines/99',
    });

    let input;
    try {
      input = yaml.parse(examples[1].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.PipelineTriggerTokens.create).toHaveBeenCalledWith(
      input.projectId,
      input.tokenDescription,
    );

    expect(mockGitlabClient.PipelineTriggerTokens.trigger).toHaveBeenCalledWith(
      input.projectId,
      'main',
      'abcdd-ghijkl',
      { variables: input.variables },
    );

    expect(mockGitlabClient.PipelineTriggerTokens.remove).toHaveBeenCalledWith(
      input.projectId,
      42,
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'pipelineUrl',
      'https://gitlab.com/hangar18-/pipelines/99',
    );
  });
  it(`should ${examples[2].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        tokenDescription: 'Gitlab sample pipeline',
        branch: 'main',
      },
      workspacePath: 'repository',
    });

    mockGitlabClient.PipelineTriggerTokens.create.mockResolvedValue({
      id: 42,
      description: 'Gitlab sample pipeline',
      createdAt: new Date().toISOString(),
      last_used: null,
      token: 'abcdd-ghijkl',
      updated_at: new Date().toISOString(),
      owner: null,
    });

    mockGitlabClient.PipelineTriggerTokens.trigger.mockResolvedValue({
      id: 99,
      web_url: 'https://gitlab.com/hangar18-/pipelines/99',
    });

    let input;
    try {
      input = yaml.parse(examples[2].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.PipelineTriggerTokens.create).toHaveBeenCalledWith(
      input.projectId,
      input.tokenDescription,
    );

    expect(mockGitlabClient.PipelineTriggerTokens.trigger).toHaveBeenCalledWith(
      input.projectId,
      'main',
      'abcdd-ghijkl',
      { variables: input.variables },
    );

    expect(mockGitlabClient.PipelineTriggerTokens.remove).toHaveBeenCalledWith(
      input.projectId,
      42,
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'pipelineUrl',
      'https://gitlab.com/hangar18-/pipelines/99',
    );
  });
  it(`should ${examples[3].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        tokenDescription: 'Gitlab sample pipeline',
        branch: 'main',
      },
      workspacePath: 'repository',
    });

    mockGitlabClient.PipelineTriggerTokens.create.mockResolvedValue({
      id: 42,
      description: 'Gitlab sample pipeline',
      createdAt: new Date().toISOString(),
      last_used: null,
      token: 'abcdd-ghijkl',
      updated_at: new Date().toISOString(),
      owner: null,
    });

    mockGitlabClient.PipelineTriggerTokens.trigger.mockResolvedValue({
      id: 99,
      web_url: 'https://gitlab.com/hangar18-/pipelines/99',
    });

    let input;
    try {
      input = yaml.parse(examples[3].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.PipelineTriggerTokens.create).toHaveBeenCalledWith(
      input.projectId,
      input.tokenDescription,
    );

    expect(mockGitlabClient.PipelineTriggerTokens.trigger).toHaveBeenCalledWith(
      input.projectId,
      'main',
      'abcdd-ghijkl',
      { variables: input.variables },
    );

    expect(mockGitlabClient.PipelineTriggerTokens.remove).toHaveBeenCalledWith(
      input.projectId,
      42,
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'pipelineUrl',
      'https://gitlab.com/hangar18-/pipelines/99',
    );
  });
});
