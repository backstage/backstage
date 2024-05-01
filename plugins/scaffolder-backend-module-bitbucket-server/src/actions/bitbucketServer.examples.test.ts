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

import { createPublishBitbucketServerAction } from './bitbucketServer';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import yaml from 'yaml';
import { examples } from './bitbucketServer.examples';
import { initRepoAndPush } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

describe('publish:bitbucketServer', () => {
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
  const action = createPublishBitbucketServerAction({ integrations, config });
  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
      repoVisibility: 'private' as const,
    },
  });
  const server = setupServer();
  setupRequestMockHandlers(server);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it(`should ${examples[0].description}`, async () => {
    expect.assertions(3);
    server.use(
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual({
            public: false,
            name: 'repo',
            defaultBranch: 'master',
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                self: [
                  {
                    href: 'https://bitbucket.mycompany.com/projects/project/repos/repo',
                  },
                ],
                clone: [
                  {
                    name: 'http',
                    href: 'https://bitbucket.mycompany.com/scm/project/repo',
                  },
                ],
              },
            }),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      ...yaml.parse(examples[0].example).steps[0].input,
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      defaultBranch: 'master',
      auth: { token: 'thing' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {
        email: undefined,
        name: undefined,
      },
    });
  });

  it(`should ${examples[1].description}`, async () => {
    expect.assertions(3);
    server.use(
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[1].example).steps[0].input.token}`,
          );
          expect(req.body).toEqual({
            public: false,
            name: 'repo',
            defaultBranch: 'main',
            description: 'This is a test repository',
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                self: [
                  {
                    href: 'https://bitbucket.mycompany.com/projects/project/repos/repo',
                  },
                ],
                clone: [
                  {
                    name: 'http',
                    href: 'https://bitbucket.mycompany.com/scm/project/repo',
                  },
                ],
              },
            }),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
        description: 'This is a test repository',
        repoVisibility: 'private',
        defaultBranch: 'main',
        sourcePath: 'packages/backend',
        enableLFS: false,
        token: 'test-token',
        gitCommitMessage: 'Init check commit',
        gitAuthorName: 'Test User',
        gitAuthorEmail: 'test.user@example.com',
      },
    });

    // Ensure that the initRepoAndPush function was called with the correct remoteUrl and input properties
    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: `${mockContext.workspacePath}/${
        yaml.parse(examples[1].example).steps[0].input.sourcePath
      }`,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      defaultBranch: 'main',
      auth: { token: 'test-token' },
      logger: mockContext.logger,
      commitMessage: 'Init check commit',
      gitAuthorInfo: { name: 'Test User', email: 'test.user@example.com' },
    });
  });

  it(`should ${examples[2].description}`, async () => {
    expect.assertions(3);
    server.use(
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[2].example).steps[0].input.token}`,
          );
          expect(req.body).toEqual({
            public: true,
            name: 'repo',
            defaultBranch: 'main',
            description: 'This is a test repository',
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                self: [
                  {
                    href: 'https://bitbucket.mycompany.com/projects/project/repos/repo',
                  },
                ],
                clone: [
                  {
                    name: 'http',
                    href: 'https://bitbucket.mycompany.com/scm/project/repo',
                  },
                ],
              },
            }),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
        description: 'This is a test repository',
        repoVisibility: 'public',
        defaultBranch: 'main',
        sourcePath: 'packages/backend',
        enableLFS: false,
        token: 'test-token',
        gitCommitMessage: 'Init check commit',
        gitAuthorName: 'Test User',
        gitAuthorEmail: 'test.user@example.com',
      },
    });

    // Ensure that the initRepoAndPush function was called with the correct remoteUrl and input properties
    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: `${mockContext.workspacePath}/${
        yaml.parse(examples[2].example).steps[0].input.sourcePath
      }`,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      defaultBranch: 'main',
      auth: { token: 'test-token' },
      logger: mockContext.logger,
      commitMessage: 'Init check commit',
      gitAuthorInfo: { name: 'Test User', email: 'test.user@example.com' },
    });
  });

  it(`should ${examples[3].description}`, async () => {
    expect.assertions(3);
    server.use(
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[3].example).steps[0].input.token}`,
          );
          expect(req.body).toEqual({
            public: true,
            name: 'repo',
            defaultBranch: 'develop',
            description: 'This is a test repository',
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                self: [
                  {
                    href: 'https://bitbucket.mycompany.com/projects/project/repos/repo',
                  },
                ],
                clone: [
                  {
                    name: 'http',
                    href: 'https://bitbucket.mycompany.com/scm/project/repo',
                  },
                ],
              },
            }),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
        description: 'This is a test repository',
        repoVisibility: 'public',
        defaultBranch: 'develop',
        sourcePath: 'packages/backend',
        enableLFS: false,
        token: 'test-token',
        gitCommitMessage: 'Init check commit',
        gitAuthorName: 'Test User',
        gitAuthorEmail: 'test.user@example.com',
      },
    });

    // Ensure that the initRepoAndPush function was called with the correct remoteUrl and input properties
    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: `${mockContext.workspacePath}/${
        yaml.parse(examples[3].example).steps[0].input.sourcePath
      }`,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      defaultBranch: 'develop',
      auth: { token: 'test-token' },
      logger: mockContext.logger,
      commitMessage: 'Init check commit',
      gitAuthorInfo: { name: 'Test User', email: 'test.user@example.com' },
    });
  });

  it(`should ${examples[4].description}`, async () => {
    expect.assertions(3);
    server.use(
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[4].example).steps[0].input.token}`,
          );
          expect(req.body).toEqual({
            public: true,
            name: 'repo',
            defaultBranch: 'develop',
            description: 'This is a test repository',
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                self: [
                  {
                    href: 'https://bitbucket.mycompany.com/projects/project/repos/repo',
                  },
                ],
                clone: [
                  {
                    name: 'http',
                    href: 'https://bitbucket.mycompany.com/scm/project/repo',
                  },
                ],
              },
            }),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
        description: 'This is a test repository',
        repoVisibility: 'public',
        defaultBranch: 'develop',
        sourcePath: 'packages/api',
        enableLFS: false,
        token: 'test-token',
        gitCommitMessage: 'Init check commit',
        gitAuthorName: 'Test User',
        gitAuthorEmail: 'test.user@example.com',
      },
    });

    // Ensure that the initRepoAndPush function was called with the correct remoteUrl and input properties
    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: `${mockContext.workspacePath}/${
        yaml.parse(examples[4].example).steps[0].input.sourcePath
      }`,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      defaultBranch: 'develop',
      auth: { token: 'test-token' },
      logger: mockContext.logger,
      commitMessage: 'Init check commit',
      gitAuthorInfo: { name: 'Test User', email: 'test.user@example.com' },
    });
  });
});
