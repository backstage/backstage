/*
 * Copyright 2023 The Backstage Authors
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
import yaml from 'yaml';
import { sep } from 'path';
import { examples } from './bitbucket.examples';
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

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.org/workspace/cloneurl',
      defaultBranch: 'master',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: { email: undefined, name: undefined },
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
      input: yaml.parse(examples[3].example).steps[0].input,
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.org/workspace/cloneurl',
      defaultBranch: 'main',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: { email: undefined, name: undefined },
    });
  });

  it('should call initAndPush with the specified source path', async () => {
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
      input: yaml.parse(examples[4].example).steps[0].input,
    });
    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: `${mockContext.workspacePath}${sep}repoRoot`,
      remoteUrl: 'https://bitbucket.org/workspace/cloneurl',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
      defaultBranch: 'master',
      commitMessage: 'initial commit',
      gitAuthorInfo: { email: undefined, name: undefined },
    });
  });

  it('should call initAndPush with the authentication token', async () => {
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
      input: yaml.parse(examples[6].example).steps[0].input,
    });
    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.org/workspace/cloneurl',
      auth: { username: 'x-token-auth', password: 'your-auth-token' },
      logger: mockContext.logger,
      defaultBranch: 'master',
      commitMessage: 'initial commit',
      gitAuthorInfo: {
        email: undefined,
        name: undefined,
      },
    });
  });

  it('should call initAndPush with the custom commit message', async () => {
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
      input: yaml.parse(examples[7].example).steps[0].input,
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.org/workspace/cloneurl',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
      defaultBranch: 'master',
      commitMessage: 'Initial commit with custom message',
      gitAuthorInfo: { email: undefined, name: undefined },
    });
  });

  it('should call initAndPush with the custom author name and email for the commit.', async () => {
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
      input: yaml.parse(examples[8].example).steps[0].input,
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.org/workspace/cloneurl',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
      defaultBranch: 'master',
      commitMessage: 'initial commit',
      gitAuthorInfo: { email: 'your.email@example.com', name: 'Your Name' },
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
        input: yaml.parse(examples[5].example).steps[0].input,
      });
    });
  });
});
