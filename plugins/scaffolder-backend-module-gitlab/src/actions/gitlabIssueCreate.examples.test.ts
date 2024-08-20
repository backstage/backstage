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
import { createGitlabIssueAction } from './gitlabIssueCreate';
import { examples } from './gitlabIssueCreate.examples';
import yaml from 'yaml';

const mockGitlabClient = {
  Issues: {
    create: jest.fn(),
  },
};
jest.mock('@gitbeaker/rest', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('gitlab:issues:create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({
      now: new Date(2005, 6, 4, 11, 0, 0),
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
          token: 'sample-token',
          apiBaseUrl: 'https://gitlab.com/api/v1',
        },
      ],
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);

  const action = createGitlabIssueAction({ integrations });

  it(`should ${examples[0].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[0].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 234,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 12,
      iid: 4,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      12,
      input.title,
      {
        issueType: undefined,
        description: input.description,
        assigneeIds: [],
        confidential: false,
        epicId: undefined,
        labels: '',
        createdAt: new Date().toISOString(),
        dueDate: undefined,
        discussionToResolve: '',
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: undefined,
        weight: undefined,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 12);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 4);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`should ${examples[1].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[1].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 234,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 12,
      iid: 4,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      12,
      input.title,
      {
        issueType: undefined,
        description: input.description,
        assigneeIds: [18],
        confidential: false,
        epicId: undefined,
        labels: '',
        createdAt: input.createdAt,
        dueDate: input.dueDate,
        discussionToResolve: '',
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: undefined,
        weight: undefined,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 12);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 4);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`should ${examples[2].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[2].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 234,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 12,
      iid: 4,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
        epicId: undefined,
      },
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      12,
      input.title,
      {
        issueType: undefined,
        description: input.description,
        assigneeIds: [18, 15],
        confidential: input.confidential,
        epicId: undefined,
        labels: input.labels,
        createdAt: input.createdAt,
        dueDate: input.dueDate,
        discussionToResolve: input.discussionToResolve,
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: undefined,
        weight: undefined,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 12);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 4);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`should ${examples[3].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[3].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 234,
        title: 'Computer banks to rule the world',
        token: 'myAwesomeToken',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 12,
      iid: 4,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      12,
      input.title,
      {
        issueType: undefined,
        description: input.description,
        assigneeIds: [],
        confidential: false,
        epicId: undefined,
        labels: '',
        createdAt: new Date().toISOString(),
        dueDate: undefined,
        discussionToResolve: '',
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: undefined,
        weight: undefined,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 12);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 4);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`should ${examples[4].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[4].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 234,
        title: 'Computer banks to rule the world',
        token: 'myAwesomeToken',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 12,
      iid: 4,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      12,
      input.title,
      {
        issueType: undefined,
        description: input.description,
        assigneeIds: [],
        confidential: false,
        epicId: undefined,
        labels: '',
        createdAt: new Date().toISOString(),
        dueDate: undefined,
        discussionToResolve: '',
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: input.milestoneId,
        weight: input.weight,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 12);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 4);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`should ${examples[5].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[5].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 234,
        title: 'Computer banks to rule the world',
        token: 'myAwesomeToken',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 12,
      iid: 4,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      12,
      input.title,
      {
        issueType: input.issueType,
        description: input.description,
        assigneeIds: [],
        confidential: false,
        epicId: undefined,
        labels: '',
        createdAt: new Date().toISOString(),
        dueDate: undefined,
        discussionToResolve: '',
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: input.milestoneId,
        weight: input.weight,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 12);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 4);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`should ${examples[6].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[6].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 234,
        title: 'Computer banks to rule the world',
        token: 'myAwesomeToken',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 12,
      iid: 4,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      12,
      input.title,
      {
        issueType: input.issueType,
        description: input.description,
        assigneeIds: [],
        confidential: false,
        epicId: undefined,
        labels: '',
        createdAt: new Date().toISOString(),
        dueDate: undefined,
        discussionToResolve: '',
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: input.milestoneId,
        weight: input.weight,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 12);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 4);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`should ${examples[7].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[7].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 234,
        title: 'Computer banks to rule the world',
        token: 'myAwesomeToken',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 12,
      iid: 4,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      12,
      input.title,
      {
        issueType: input.issueType,
        description: input.description,
        assigneeIds: [18, 22],
        confidential: false,
        epicId: undefined,
        labels: '',
        createdAt: new Date().toISOString(),
        dueDate: undefined,
        discussionToResolve: '',
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: input.milestoneId,
        weight: input.weight,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 12);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 4);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`should ${examples[8].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[8].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 234,
        title: 'Computer banks to rule the world',
        token: 'myAwesomeToken',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 12,
      iid: 4,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      12,
      input.title,
      {
        issueType: input.issueType,
        description: input.description,
        assigneeIds: [],
        confidential: false,
        epicId: undefined,
        labels: '',
        createdAt: new Date().toISOString(),
        dueDate: undefined,
        discussionToResolve: '',
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: input.milestoneId,
        weight: input.weight,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 12);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 4);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`should ${examples[9].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[9].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 234,
        title: 'Computer banks to rule the world',
        token: 'myAwesomeToken',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 12,
      iid: 4,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      12,
      input.title,
      {
        issueType: input.issueType,
        description: input.description,
        assigneeIds: [],
        confidential: false,
        epicId: undefined,
        labels: '',
        createdAt: new Date().toISOString(),
        dueDate: undefined,
        discussionToResolve: '',
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: input.milestoneId,
        weight: input.weight,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 12);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 4);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`should ${examples[10].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[10].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 234,
        title: 'Computer banks to rule the world',
        token: 'myAwesomeToken',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 12,
      iid: 4,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      12,
      input.title,
      {
        issueType: input.issueType,
        description: input.description,
        assigneeIds: [],
        confidential: false,
        epicId: undefined,
        labels: '',
        createdAt: new Date().toISOString(),
        dueDate: undefined,
        discussionToResolve: 'abc123',
        mergeRequestToResolveDiscussionsOf:
          input.mergeRequestToResolveDiscussionsOf,
        milestoneId: input.milestoneId,
        weight: input.weight,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 12);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 4);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });
});
