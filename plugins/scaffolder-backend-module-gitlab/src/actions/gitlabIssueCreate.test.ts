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
import { IssueType } from '../commonGitlabConfig';
import { createGitlabIssueAction } from './gitlabIssueCreate';

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
          token: 'myIntegrationsToken',
          apiBaseUrl: 'https://gitlab.com/api/v4',
        },
      ],
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);

  const action = createGitlabIssueAction({ integrations });

  it('should return a Gitlab issue when called with minimal input params', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        title: 'Computer banks to rule the world',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 42,
      iid: 1,
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
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 1);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it('should return a Gitlab issue when called with oAuth Token', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        title: 'Computer banks to rule the world',
        token: 'myAwesomeToken',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 42,
      iid: 1,
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
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 1);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });

  it('should return a Gitlab issue when called with several input params', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 123,
        issueType: IssueType.INCIDENT,
        title: 'Computer banks to rule the world',
        description:
          'this issue should kickstart research on instruments to sight the stars',
        dueDate: '1990-08-20T23:59:59Z',
        token: 'myAwesomeToken',
        assignees: [3, 14, 15],
        labels: 'operation:mindcrime',
      },
      workspacePath: 'seen2much',
    });

    mockGitlabClient.Issues.create.mockResolvedValue({
      id: 42,
      iid: 1,
      web_url: 'https://gitlab.com/hangar18-/issues/42',
    });

    await action.handler({
      ...mockContext,
    });

    expect(mockGitlabClient.Issues.create).toHaveBeenCalledWith(
      123,
      'Computer banks to rule the world',
      {
        issueType: 'incident',
        description:
          'this issue should kickstart research on instruments to sight the stars',
        assigneeIds: [3, 14, 15],
        confidential: false,
        epicId: undefined,
        labels: 'operation:mindcrime',
        createdAt: new Date().toISOString(),
        dueDate: '1990-08-20T23:59:59.000Z',
        discussionToResolve: '',
        mergeRequestToResolveDiscussionsOf: undefined,
        milestoneId: undefined,
        weight: undefined,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('issueId', 42);
    expect(mockContext.output).toHaveBeenCalledWith('issueIid', 1);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://gitlab.com/hangar18-/issues/42',
    );
  });
});
