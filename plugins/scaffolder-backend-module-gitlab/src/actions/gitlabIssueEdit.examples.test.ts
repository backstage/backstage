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

import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/core-app-api';
import { ScmIntegrations } from '@backstage/integration';
import { editGitlabIssueAction } from './gitlabIssueEdit';
import { examples } from './gitlabIssueEdit.examples';
import yaml from 'yaml';

const mockGitlabClient = {
  Issues: {
    edit: jest.fn(),
  },
};
jest.mock('@gitbeaker/rest', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('gitlab:issue:edit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({
      now: new Date(1999, 6, 14, 12, 0, 0),
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
          token: 'myIntegrationsToken',
          apiBaseUrl: 'https://gitlab.com/api/v4',
        },
      ],
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);

  const action = editGitlabIssueAction({ integrations });

  it(`Should ${examples[0].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
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

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: input.title,
      issueType: undefined,
      addLabels: undefined,
      removeLabels: undefined,
      description: input.description,
      assigneeIds: [],
      confidential: false,
      discussionLocked: false,
      epicId: undefined,
      labels: undefined,
      updatedAt: new Date().toISOString(),
      dueDate: undefined,
      milestoneId: undefined,
      weight: undefined,
      stateEvent: undefined,
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`Should ${examples[1].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
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

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: input.title,
      issueType: undefined,
      addLabels: undefined,
      removeLabels: undefined,
      description: input.description,
      assigneeIds: [18],
      confidential: false,
      discussionLocked: false,
      epicId: undefined,
      labels: undefined,
      updatedAt: '2024-05-10T18:00:00.000Z',
      dueDate: '2024-09-28',
      milestoneId: undefined,
      weight: undefined,
      stateEvent: undefined,
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`Should ${examples[2].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
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
        epicId: undefined,
      },
    });

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: input.title,
      issueType: undefined,
      addLabels: undefined,
      removeLabels: undefined,
      description: input.description,
      assigneeIds: [18, 15],
      confidential: false,
      discussionLocked: true,
      epicId: undefined,
      labels: 'phase1:label1,phase2:label2',
      updatedAt: '2024-05-10T18:00:00.000Z',
      dueDate: '2024-09-28',
      milestoneId: undefined,
      weight: undefined,
      stateEvent: undefined,
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`Should ${examples[2].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
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
        epicId: undefined,
      },
    });

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: input.title,
      issueType: undefined,
      addLabels: undefined,
      removeLabels: undefined,
      description: input.description,
      assigneeIds: [18, 15],
      confidential: false,
      discussionLocked: true,
      epicId: undefined,
      labels: 'phase1:label1,phase2:label2',
      updatedAt: '2024-05-10T18:00:00.000Z',
      dueDate: '2024-09-28',
      milestoneId: undefined,
      weight: undefined,
      stateEvent: undefined,
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`Should ${examples[3].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
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

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: 'Computer banks to rule the world',
      issueType: undefined,
      addLabels: undefined,
      removeLabels: undefined,
      description: input.description,
      assigneeIds: [],
      confidential: false,
      discussionLocked: false,
      epicId: undefined,
      labels: undefined,
      updatedAt: new Date().toISOString(),
      dueDate: undefined,
      milestoneId: undefined,
      weight: undefined,
      stateEvent: 'close',
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`Should ${examples[4].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    let input;
    try {
      input = yaml.parse(examples[4].example).steps[0].input;
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

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: 'Computer banks to rule the world',
      issueType: undefined,
      addLabels: undefined,
      removeLabels: undefined,
      description: input.description,
      assigneeIds: [],
      confidential: false,
      discussionLocked: false,
      epicId: undefined,
      labels: undefined,
      updatedAt: new Date().toISOString(),
      dueDate: undefined,
      milestoneId: undefined,
      weight: undefined,
      stateEvent: 'reopen',
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`Should ${examples[5].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    let input;
    try {
      input = yaml.parse(examples[5].example).steps[0].input;
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

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: input.title,
      issueType: undefined,
      addLabels: undefined,
      removeLabels: undefined,
      description: input.description,
      assigneeIds: [18, 20],
      confidential: false,
      discussionLocked: false,
      epicId: undefined,
      labels: undefined,
      updatedAt: new Date().toISOString(),
      dueDate: undefined,
      milestoneId: input.milestoneId,
      weight: undefined,
      stateEvent: undefined,
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`Should ${examples[6].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    let input;
    try {
      input = yaml.parse(examples[6].example).steps[0].input;
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

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: input.title,
      issueType: undefined,
      addLabels: undefined,
      removeLabels: undefined,
      description: input.description,
      assigneeIds: [],
      confidential: false,
      discussionLocked: false,
      epicId: undefined,
      labels: input.labels,
      updatedAt: new Date().toISOString(),
      dueDate: undefined,
      milestoneId: input.milestoneId,
      weight: input.weight,
      stateEvent: undefined,
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`Should ${examples[7].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    let input;
    try {
      input = yaml.parse(examples[7].example).steps[0].input;
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

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: input.title,
      issueType: undefined,
      addLabels: undefined,
      removeLabels: undefined,
      description: input.description,
      assigneeIds: [],
      confidential: input.confidential,
      discussionLocked: false,
      epicId: undefined,
      labels: input.labels,
      updatedAt: new Date().toISOString(),
      dueDate: undefined,
      milestoneId: input.milestoneId,
      weight: input.weight,
      stateEvent: undefined,
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`Should ${examples[8].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    let input;
    try {
      input = yaml.parse(examples[8].example).steps[0].input;
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

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: input.title,
      issueType: undefined,
      addLabels: undefined,
      removeLabels: undefined,
      description: input.description,
      assigneeIds: [],
      confidential: false,
      discussionLocked: input.discussionLocked,
      epicId: undefined,
      labels: input.labels,
      updatedAt: new Date().toISOString(),
      dueDate: undefined,
      milestoneId: input.milestoneId,
      weight: input.weight,
      stateEvent: undefined,
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it(`Should ${examples[9].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    let input;
    try {
      input = yaml.parse(examples[9].example).steps[0].input;
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

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: input.title,
      issueType: undefined,
      addLabels: undefined,
      removeLabels: input.removeLabels,
      description: input.description,
      assigneeIds: [],
      confidential: false,
      discussionLocked: false,
      epicId: undefined,
      labels: input.labels,
      updatedAt: new Date().toISOString(),
      dueDate: undefined,
      milestoneId: input.milestoneId,
      weight: input.weight,
      stateEvent: undefined,
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });
  it(`Should ${examples[10].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    let input;
    try {
      input = yaml.parse(examples[10].example).steps[0].input;
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

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: input.title,
      issueType: undefined,
      addLabels: undefined,
      removeLabels: input.removeLabels,
      description: input.description,
      assigneeIds: [],
      confidential: false,
      discussionLocked: false,
      epicId: undefined,
      labels: input.labels,
      updatedAt: new Date().toISOString(),
      dueDate: undefined,
      milestoneId: input.milestoneId,
      weight: input.weight,
      stateEvent: undefined,
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });
  it(`Should ${examples[11].description}`, async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueIid: 42,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.edit.mockResolvedValue({
      id: 123,
      iid: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    let input;
    try {
      input = yaml.parse(examples[11].example).steps[0].input;
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

    expect(mockGitlabClient.Issues.edit).toHaveBeenCalledWith(12, 42, {
      title: input.title,
      issueType: input.issueType,
      addLabels: undefined,
      removeLabels: input.removeLabels,
      description: input.description,
      assigneeIds: [],
      confidential: false,
      discussionLocked: false,
      epicId: undefined,
      labels: input.labels,
      updatedAt: new Date().toISOString(),
      dueDate: undefined,
      milestoneId: input.milestoneId,
      weight: input.weight,
      stateEvent: undefined,
    });

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 123);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });
});
