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

import { PassThrough } from 'stream';
import { getVoidLogger } from '@backstage/backend-common';
import { createGitlabIssueAction } from './createGitlabIssueAction';
import { ConfigReader } from '@backstage/core-app-api';
import { ScmIntegrations } from '@backstage/integration';
import { advanceTo, clear } from 'jest-date-mock';

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
    advanceTo(new Date(1990, 9, 24, 12, 0, 0)); // Set the desired date and time
  });

  afterEach(() => {
    clear(); // Reset the date mock after each test
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

  const action = createGitlabIssueAction({ integrations });

  it('should return a Gitlab issue when called with minimal input params', async () => {
    const mockContext = {
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        title: 'Computer banks to rule the world',
        // token: 'myAwesomeToken',
      },
      workspacePath: 'lol',
      logger: getVoidLogger(),
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory: jest.fn(),
    };

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      123,
      'Computer banks to rule the world',
      {
        issueType: undefined,
        description: '',
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

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it('should return a Gitlab issue when called with oAuth Token', async () => {
    const mockContext = {
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        title: 'Computer banks to rule the world',
        token: 'myAwesomeToken',
      },
      workspacePath: 'lol',
      logger: getVoidLogger(),
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory: jest.fn(),
    };

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      123,
      'Computer banks to rule the world',
      {
        issueType: undefined,
        description: '',
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

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it('should return a Gitlab issue when called with an epic id', async () => {
    const mockContext = {
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        title: 'Instruments to sight the stars',
        token: 'myAwesomeToken',
        epicId: 1234,
      },
      workspacePath: 'lol',
      logger: getVoidLogger(),
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory: jest.fn(),
    };

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 42,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      123,
      'Computer banks to rule the world',
      {
        issueType: undefined,
        description: '',
        assigneeIds: [],
        confidential: false,
        epicId: 1234,
        labels: '',
        createdAt: new Date().toISOString(),
        dueDate: undefined,
        discussionToResolve: '',
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: undefined,
        weight: undefined,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 42);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });
});
