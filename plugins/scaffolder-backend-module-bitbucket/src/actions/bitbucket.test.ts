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
import { createPublishBitbucketAction } from './bitbucket';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { initRepoAndPush } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

describe('publish:bitbucket', () => {
  const config = new ConfigReader({
    integrations: {
      bitbucket: [
        {
          host: 'bitbucket.org',
          token: 'tokenlols',
        },
        {
          host: 'hosted.bitbucket.com',
          token: 'thing',
          apiBaseUrl: 'https://hosted.bitbucket.com/rest/api/1.0',
        },
        {
          host: 'notoken.bitbucket.com',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishBitbucketAction({ integrations, config });
  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'bitbucket.org?workspace=workspace&project=project&repo=repo',
      repoVisibility: 'private' as const,
    },
  });
  const server = setupServer();
  registerMswTestHooks(server);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'bitbucket.org?project=project&repo=repo' },
      }),
    ).rejects.toThrow(/missing workspace/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'bitbucket.org?workspace=workspace&repo=repo' },
      }),
    ).rejects.toThrow(/missing project/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'bitbucket.org?workspace=workspace&project=project' },
      }),
    ).rejects.toThrow(/missing repo/);
  });

  it('should throw if there is no integration config provided', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'missing.com?workspace=workspace&project=project&repo=repo',
        },
      }),
    ).rejects.toThrow(/No matching integration configuration/);
  });

  it('should throw if there is no token in the integration config that is returned', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl:
            'notoken.bitbucket.com?workspace=workspace&project=project&repo=repo',
        },
      }),
    ).rejects.toThrow(/Authorization has not been provided for Bitbucket/);
  });

  it('should call the correct APIs when the host is bitbucket cloud', async () => {
    expect.assertions(2);
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer tokenlols');
          expect(req.body).toEqual({
            is_private: true,
            scm: 'git',
            project: { key: 'project' },
          });
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/workspace/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/workspace/repo',
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
        ...mockContext.input,
        repoUrl: 'bitbucket.org?workspace=workspace&project=project&repo=repo',
      },
    });
  });

  it('should call the correct APIs when the host is hosted bitbucket', async () => {
    expect.assertions(2);
    server.use(
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual({ public: false, name: 'repo' });
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
        ...mockContext.input,
        repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
      },
    });
  });

  it('should work if the token is provided through ctx.input', async () => {
    expect.assertions(2);
    server.use(
      rest.post(
        'https://notoken.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer lols');
          expect(req.body).toEqual({ public: false, name: 'repo' });
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
        repoUrl: 'notoken.bitbucket.com?project=project&repo=repo',
        token: 'lols',
      },
    });
  });

  describe('LFS for hosted bitbucket', () => {
    const repoCreationResponse = {
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
    };

    it('should call the correct APIs to enable LFS if requested and the host is hosted bitbucket', async () => {
      expect.assertions(1);
      server.use(
        rest.post(
          'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
          (_, res, ctx) => {
            return res(
              ctx.status(201),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(repoCreationResponse),
            );
          },
        ),
        rest.put(
          'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
          (req, res, ctx) => {
            expect(req.headers.get('Authorization')).toBe('Bearer thing');
            return res(ctx.status(204));
          },
        ),
      );

      await action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
          enableLFS: true,
        },
      });
    });

    it('should report an error if enabling LFS fails', async () => {
      server.use(
        rest.post(
          'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
          (_, res, ctx) => {
            return res(
              ctx.status(201),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(repoCreationResponse),
            );
          },
        ),
        rest.put(
          'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
          (_, res, ctx) => {
            return res(ctx.status(500));
          },
        ),
      );

      await expect(
        action.handler({
          ...mockContext,
          input: {
            ...mockContext.input,
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            enableLFS: true,
          },
        }),
      ).rejects.toThrow(/Failed to enable LFS/);
    });
  });

  it('should call initAndPush with the correct values', async () => {
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/workspace/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/workspace/cloneurl',
                  },
                ],
              },
            }),
          ),
      ),
    );

    await action.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.org/workspace/cloneurl',
      defaultBranch: 'master',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });

  it('should call initAndPush with the correct default branch', async () => {
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/workspace/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/workspace/cloneurl',
                  },
                ],
              },
            }),
          ),
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        defaultBranch: 'main',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.org/workspace/cloneurl',
      defaultBranch: 'main',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });

  it('should call initAndPush with the configured defaultAuthor', async () => {
    const customAuthorConfig = new ConfigReader({
      integrations: {
        bitbucket: [
          {
            host: 'bitbucket.org',
            token: 'tokenlols',
          },
          {
            host: 'hosted.bitbucket.com',
            token: 'thing',
            apiBaseUrl: 'https://hosted.bitbucket.com/rest/api/1.0',
          },
          {
            host: 'notoken.bitbucket.com',
          },
        ],
      },
      scaffolder: {
        defaultAuthor: {
          name: 'Test',
          email: 'example@example.com',
        },
      },
    });

    const customAuthorIntegrations =
      ScmIntegrations.fromConfig(customAuthorConfig);
    const customAuthorAction = createPublishBitbucketAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
    });

    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/workspace/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/workspace/cloneurl',
                  },
                ],
              },
            }),
          ),
      ),
    );

    await customAuthorAction.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.org/workspace/cloneurl',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
      defaultBranch: 'master',
      commitMessage: 'initial commit',
      gitAuthorInfo: { name: 'Test', email: 'example@example.com' },
    });
  });

  it('should call initAndPush with the configured defaultCommitMessage', async () => {
    const customAuthorConfig = new ConfigReader({
      integrations: {
        bitbucket: [
          {
            host: 'bitbucket.org',
            token: 'tokenlols',
          },
          {
            host: 'hosted.bitbucket.com',
            token: 'thing',
            apiBaseUrl: 'https://hosted.bitbucket.com/rest/api/1.0',
          },
          {
            host: 'notoken.bitbucket.com',
          },
        ],
      },
      scaffolder: {
        defaultCommitMessage: 'Test commit message',
      },
    });

    const customAuthorIntegrations =
      ScmIntegrations.fromConfig(customAuthorConfig);
    const customAuthorAction = createPublishBitbucketAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
    });

    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/workspace/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/workspace/cloneurl',
                  },
                ],
              },
            }),
          ),
      ),
    );

    await customAuthorAction.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.org/workspace/cloneurl',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
      defaultBranch: 'master',
      commitMessage: 'initial commit',
      gitAuthorInfo: { email: undefined, name: undefined },
    });
  });

  it('should call outputs with the correct urls', async () => {
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/workspace/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/workspace/cloneurl',
                  },
                ],
              },
            }),
          ),
      ),
    );

    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://bitbucket.org/workspace/cloneurl',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://bitbucket.org/workspace/repo/src/master',
    );
  });

  it('should call outputs with the correct urls with correct default branch', async () => {
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/workspace/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/workspace/cloneurl',
                  },
                ],
              },
            }),
          ),
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        defaultBranch: 'main',
      },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://bitbucket.org/workspace/cloneurl',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://bitbucket.org/workspace/repo/src/main',
    );
  });
});
