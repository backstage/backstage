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

jest.mock('@backstage/plugin-scaffolder-node', () => {
  return {
    ...jest.requireActual('@backstage/plugin-scaffolder-node'),
    initRepoAndPush: jest.fn().mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
    commitAndPushRepo: jest.fn().mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
  };
});

import { createPublishBitbucketServerPullRequestAction } from './bitbucketServerPullRequest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';

describe('publish:bitbucketServer:pull-request', () => {
  const config = new ConfigReader({
    integrations: {
      bitbucketServer: [
        {
          host: 'hosted.bitbucket.com',
          token: 'thing',
          apiBaseUrl: 'https://hosted.bitbucket.com/rest/api/1.0',
        },
        {
          host: 'basic-auth.bitbucket.com',
          username: 'test-user',
          password: 'test-password',
          apiBaseUrl: 'https://basic-auth.bitbucket.com/rest/api/1.0',
        },
        {
          host: 'no-credentials.bitbucket.com',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishBitbucketServerPullRequestAction({
    integrations,
    config,
  });
  const mockContext = {
    input: {
      repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
      title: 'Add Scaffolder actions for Bitbucket Server',
      description:
        'I just made a Pull Request that Add Scaffolder actions for Bitbucket Server',
      targetBranch: 'master',
      sourceBranch: 'develop',
    },
    workspacePath: 'wsp',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };
  const responseOfBranches = {
    size: 3,
    limit: 25,
    isLastPage: true,
    values: [
      {
        id: 'refs/heads/master',
        displayId: 'master',
        type: 'BRANCH',
        latestCommit: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
        latestChangeset: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
        isDefault: true,
      },
      {
        id: 'refs/heads/develop',
        displayId: 'develop',
        type: 'BRANCH',
        latestCommit: '98e21148205367aeb11c25a52eaca3c2945253fa',
        latestChangeset: '98e21148205367aeb11c25a52eaca3c2945253fa',
        isDefault: false,
      },
      {
        id: 'refs/heads/develop-2',
        displayId: 'develop-2',
        type: 'BRANCH',
        latestCommit: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
        latestChangeset: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
        isDefault: false,
      },
    ],
    start: 0,
  };
  const responseOfPullRequests = {
    id: 19,
    version: 0,
    title: 'Test for bitbucket server pull-requests',
    description: 'Test for bitbucket server pull-requests',
    state: 'OPEN',
    open: true,
    closed: false,
    createdDate: 1684200289521,
    updatedDate: 1684200289521,
    fromRef: {
      id: 'refs/heads/develop',
      displayId: 'develop',
      latestCommit: '98e21148205367aeb11c25a52eaca3c2945253fa',
      type: 'BRANCH',
      repository: {
        slug: 'repo',
        id: 1812,
        name: 'repo',
        description: 'This is a test repo',
        hierarchyId: '1da8822903a9b11a27b8',
        scmId: 'git',
        state: 'AVAILABLE',
        statusMessage: 'Available',
        forkable: true,
        project: {},
        public: false,
        links: {},
      },
    },
    toRef: {
      id: 'refs/heads/master',
      displayId: 'master',
      latestCommit: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
      type: 'BRANCH',
      repository: {
        slug: 'repo',
        id: 1812,
        name: 'repo',
        description: 'This is a test repo',
        hierarchyId: '1da8822903a9b11a27b8',
        scmId: 'git',
        state: 'AVAILABLE',
        statusMessage: 'Available',
        forkable: true,
        project: {},
        public: false,
        links: {},
      },
    },
    locked: false,
    author: {
      user: {
        name: 'test-user',
        emailAddress: 'test-user@sample.com',
        id: 2944,
        displayName: 'test-user',
        active: true,
        slug: 'test-user',
        type: 'NORMAL',
        links: {},
      },
      role: 'AUTHOR',
      approved: false,
      status: 'UNAPPROVED',
    },
    reviewers: [],
    participants: [],
    links: {
      self: [
        {
          href: 'https://hosted.bitbucket.com/projects/project/repos/repo/pull-requests/1',
        },
      ],
    },
  };
  const handlers = [
    rest.get(
      'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos/repo/branches',
      (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.set('Content-Type', 'application/json'),
          ctx.json(responseOfBranches),
        );
      },
    ),
    rest.post(
      'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos/repo/pull-requests',
      (_, res, ctx) => {
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json(responseOfPullRequests),
        );
      },
    ),
  ];

  const server = setupServer();
  setupRequestMockHandlers(server);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          repoUrl: 'hosted.bitbucket.com?repo=repo',
        },
      }),
    ).rejects.toThrow(/missing project/);

    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          repoUrl: 'hosted.bitbucket.com?project=project',
        },
      }),
    ).rejects.toThrow(/missing repo/);
  });

  it('should throw if there is no integration config provided', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          repoUrl: 'missing.com?project=project&repo=repo',
        },
      }),
    ).rejects.toThrow(/No matching integration configuration/);
  });

  it('should throw if there no credentials in the integration config that is returned', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          repoUrl: 'no-credentials.bitbucket.com?project=project&repo=repo',
        },
      }),
    ).rejects.toThrow(
      /Authorization has not been provided for no-credentials.bitbucket.com/,
    );
  });

  it('should call the correct APIs with token', async () => {
    expect.assertions(3);
    server.use(
      rest.get(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos/repo/branches',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfBranches),
          );
        },
      ),
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos/repo/pull-requests',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfPullRequests),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
      },
    });
  });

  it('should call the correct APIs with basic auth', async () => {
    expect.assertions(3);
    server.use(
      rest.get(
        'https://basic-auth.bitbucket.com/rest/api/1.0/projects/project/repos/repo/branches',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
          );
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfBranches),
          );
        },
      ),
      rest.post(
        'https://basic-auth.bitbucket.com/rest/api/1.0/projects/project/repos/repo/pull-requests',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
          );
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfPullRequests),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoUrl: 'basic-auth.bitbucket.com?project=project&repo=repo',
      },
    });
  });

  it('should work if the token is provided through ctx.input', async () => {
    expect.assertions(3);
    const token = 'user-token';
    server.use(
      rest.get(
        'https://no-credentials.bitbucket.com/rest/api/1.0/projects/project/repos/repo/branches',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(`Bearer ${token}`);
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfBranches),
          );
        },
      ),
      rest.post(
        'https://no-credentials.bitbucket.com/rest/api/1.0/projects/project/repos/repo/pull-requests',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(`Bearer ${token}`);
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfPullRequests),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoUrl: 'no-credentials.bitbucket.com?project=project&repo=repo',
        token: token,
      },
    });
  });

  it('should call outputs with the correct urls', async () => {
    server.use(...handlers);

    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith(
      'pullRequestUrl',
      'https://hosted.bitbucket.com/projects/project/repos/repo/pull-requests/1',
    );
  });
});
