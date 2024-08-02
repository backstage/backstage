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
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import yaml from 'yaml';
import { examples } from './bitbucketServer.examples';
import {
  getRepoSourceDirectory,
  initRepoAndPush,
} from '@backstage/plugin-scaffolder-node';
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
  registerMswTestHooks(server);

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

    const handlers = [
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

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

    const handlers = [
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

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
  it(`should ${examples[5].description}`, async () => {
    expect.assertions(3);

    const handlers = [
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(`Bearer thing`);
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

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

    // Ensure that the initRepoAndPush function was called with the correct remoteUrl and input properties
    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      defaultBranch: 'master',
      auth: { token: 'thing' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {
        name: 'Custom Author',
        email: 'custom.author@example.com',
      },
    });
  });

  it(`should ${examples[6].description}`, async () => {
    expect.assertions(5);

    const handlers = [
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
                  {
                    href: 'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      defaultBranch: 'master',
      auth: { token: 'thing' },
      logger: mockContext.logger,
      commitMessage: 'Initial commit with LFS enabled',
      gitAuthorInfo: {
        email: input.gitAuthorName,
        name: input.gitAuthorEmail,
      },
    });
  });

  it(`should ${examples[7].description}`, async () => {
    expect.assertions(3);

    const handlers = [
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer custom-token');
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
                  {
                    href: 'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: getRepoSourceDirectory(mockContext.workspacePath, input.sourcePath),
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      auth: { token: 'custom-token' },
      defaultBranch: 'master',
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: { name: undefined, email: undefined },
    });
  });

  it(`should ${examples[8].description}`, async () => {
    expect.assertions(3);

    const handlers = [
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
                  {
                    href: 'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      auth: { token: 'thing' },
      defaultBranch: 'master',
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: { name: input.gitAuthorName, email: input.gitAuthorEmail },
    });
  });

  it(`should ${examples[9].description}`, async () => {
    expect.assertions(3);

    const handlers = [
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual({
            public: true,
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
                  {
                    href: 'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      auth: { token: 'thing' },
      defaultBranch: 'master',
      logger: mockContext.logger,
      commitMessage: 'Public repository initial commit',
      gitAuthorInfo: { name: input.gitAuthorName, email: input.gitAuthorEmail },
    });
  });

  it(`should ${examples[10].description}`, async () => {
    expect.assertions(5);

    const handlers = [
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer custom-token');
          expect(req.body).toEqual({
            public: false,
            name: 'repo',
            description: 'A fully customized repository',
            defaultBranch: 'development',
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
                  {
                    href: 'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer custom-token');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: getRepoSourceDirectory(mockContext.workspacePath, input.sourcePath),
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      auth: { token: input.token },
      defaultBranch: input.defaultBranch,
      logger: mockContext.logger,
      commitMessage: input.gitCommitMessage,
      gitAuthorInfo: { name: input.gitAuthorName, email: input.gitAuthorEmail },
    });
  });

  it(`should ${examples[11].description}`, async () => {
    expect.assertions(3);

    const handlers = [
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual({
            public: false,
            name: 'repo',
            defaultBranch: 'main',
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
                  {
                    href: 'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer custom-token');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: input.sourcePath
        ? getRepoSourceDirectory(mockContext.workspacePath, input.sourcePath)
        : mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      auth: { token: input.token ?? 'thing' },
      defaultBranch: input.defaultBranch,
      logger: mockContext.logger,
      commitMessage: input.gitCommitMessage ?? 'initial commit',
      gitAuthorInfo: { name: input.gitAuthorName, email: input.gitAuthorEmail },
    });
  });

  it(`should ${examples[12].description}`, async () => {
    expect.assertions(3);

    const handlers = [
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual({
            public: true,
            name: 'repo',
            defaultBranch: 'master',
            description: 'A public repository with a custom description',
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
                  {
                    href: 'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer custom-token');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

    let input;
    try {
      input = yaml.parse(examples[12].example).steps[0].input;
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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: input.sourcePath
        ? getRepoSourceDirectory(mockContext.workspacePath, input.sourcePath)
        : mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      auth: { token: input.token ?? 'thing' },
      defaultBranch: input.defaultBranch ?? 'master',
      logger: mockContext.logger,
      commitMessage: input.gitCommitMessage ?? 'initial commit',
      gitAuthorInfo: { name: input.gitAuthorName, email: input.gitAuthorEmail },
    });
  });

  it(`should ${examples[13].description}`, async () => {
    expect.assertions(3);

    const handlers = [
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            'Bearer custom-auth-token',
          );
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
                  {
                    href: 'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer custom-token');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

    let input;
    try {
      input = yaml.parse(examples[13].example).steps[0].input;
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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: input.sourcePath
        ? getRepoSourceDirectory(mockContext.workspacePath, input.sourcePath)
        : mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      auth: { token: input.token ?? 'thing' },
      defaultBranch: input.defaultBranch ?? 'master',
      logger: mockContext.logger,
      commitMessage: input.gitCommitMessage ?? 'initial commit',
      gitAuthorInfo: { name: input.gitAuthorName, email: input.gitAuthorEmail },
    });
  });

  it(`should ${examples[14].description}`, async () => {
    expect.assertions(3);

    const handlers = [
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
                  {
                    href: 'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer custom-token');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

    let input;
    try {
      input = yaml.parse(examples[14].example).steps[0].input;
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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: input.sourcePath
        ? getRepoSourceDirectory(mockContext.workspacePath, input.sourcePath)
        : mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      auth: { token: input.token ?? 'thing' },
      defaultBranch: input.defaultBranch ?? 'master',
      logger: mockContext.logger,
      commitMessage: input.gitCommitMessage ?? 'initial commit',
      gitAuthorInfo: { name: input.gitAuthorName, email: input.gitAuthorEmail },
    });
  });

  it(`should ${examples[15].description}`, async () => {
    expect.assertions(5);

    const handlers = [
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
                  {
                    href: 'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
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
      rest.put(
        'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/project/repos/repo/enabled',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual('');
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
    ];

    server.use(...handlers);

    let input;
    try {
      input = yaml.parse(examples[15].example).steps[0].input;
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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: input.sourcePath
        ? getRepoSourceDirectory(mockContext.workspacePath, input.sourcePath)
        : mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
      auth: { token: input.token ?? 'thing' },
      defaultBranch: input.defaultBranch ?? 'master',
      logger: mockContext.logger,
      commitMessage: input.gitCommitMessage ?? 'initial commit',
      gitAuthorInfo: { name: input.gitAuthorName, email: input.gitAuthorEmail },
    });
  });
});
