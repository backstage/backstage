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
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { createPublishGiteaAction } from './gitea';
import {
  getRepoSourceDirectory,
  initRepoAndPush,
} from '@backstage/plugin-scaffolder-node';
import { http, HttpResponse } from 'msw';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { setupServer } from 'msw/node';
import { examples } from './gitea.examples';
import yaml from 'yaml';

jest.mock('@backstage/plugin-scaffolder-node', () => {
  return {
    ...jest.requireActual('@backstage/plugin-scaffolder-node'),
    initRepoAndPush: jest.fn().mockResolvedValue({
      commitHash: '431f19cc36b551763d157f1b5e4a4b446165dbn2',
    }),
  };
});

describe('publish:gitea', () => {
  const config = new ConfigReader({
    integrations: {
      gitea: [
        {
          host: 'gitea.com',
          username: 'sample_user',
          password: 'password_token',
        },
      ],
    },
  });

  const description = 'gitea description';
  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishGiteaAction({ integrations, config });
  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'gitea.com?repo=repo&owner=owner',
      description,
    },
  });

  const server = setupServer();
  registerMswTestHooks(server);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it(`should ${examples[0].description}`, async () => {
    server.use(
      http.get('https://gitea.com/api/v1/orgs/org1', () => {
        return HttpResponse.json(
          {
            id: 1,
            name: 'org1',
            visibility: 'public',
            repo_admin_change_team_access: false,
            username: 'org1',
          },
          { status: 200 },
        );
      }),
      http.get('https://gitea.com/org1/repo/src/branch/main', () => {
        return HttpResponse.json({}, { status: 200 });
      }),
      http.post(
        'https://gitea.com/api/v1/orgs/org1/repos',
        async ({ request }) => {
          // Basic auth must match the user and password defined part of the config
          expect(request.headers.get('Authorization')).toBe(
            'basic c2FtcGxlX3VzZXI6cGFzc3dvcmRfdG9rZW4=',
          );
          const body = await request.json();
          expect(body).toEqual({
            name: 'repo',
            private: false,
            description,
          });
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

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
        repoUrl: 'gitea.com?repo=repo&owner=org1',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gitea.com/org1/repo.git',
      defaultBranch: 'main',
      auth: { username: 'sample_user', password: 'password_token' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {
        email: undefined,
        name: undefined,
      },
    });
  });

  it(`should ${examples[1].description}`, async () => {
    server.use(
      http.get('https://gitea.com/api/v1/orgs/org1', () => {
        return HttpResponse.json(
          {
            id: 1,
            name: 'org1',
            visibility: 'public',
            repo_admin_change_team_access: false,
            username: 'org1',
          },
          { status: 200 },
        );
      }),
      http.get('https://gitea.com/org1/repo/src/branch/main', () => {
        return HttpResponse.json({}, { status: 200 });
      }),
      http.post(
        'https://gitea.com/api/v1/orgs/org1/repos',
        async ({ request }) => {
          // Basic auth must match the user and password defined part of the config
          expect(request.headers.get('Authorization')).toBe(
            'basic c2FtcGxlX3VzZXI6cGFzc3dvcmRfdG9rZW4=',
          );
          const body = await request.json();
          expect(body).toEqual({
            name: 'repo',
            private: false,
            description: 'Initialize a gitea repository',
          });
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

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
        repoUrl: 'gitea.com?repo=repo&owner=org1',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gitea.com/org1/repo.git',
      defaultBranch: 'main',
      auth: { username: 'sample_user', password: 'password_token' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {
        email: undefined,
        name: undefined,
      },
    });
  });

  it(`should ${examples[2].description}`, async () => {
    server.use(
      http.get('https://gitea.com/api/v1/orgs/org1', () => {
        return HttpResponse.json(
          {
            id: 1,
            name: 'org1',
            visibility: 'public',
            repo_admin_change_team_access: false,
            username: 'org1',
          },
          { status: 200 },
        );
      }),
      http.get('https://gitea.com/org1/repo/src/branch/main', () => {
        return HttpResponse.json({}, { status: 200 });
      }),
      http.post(
        'https://gitea.com/api/v1/orgs/org1/repos',
        async ({ request }) => {
          // Basic auth must match the user and password defined part of the config
          expect(request.headers.get('Authorization')).toBe(
            'basic c2FtcGxlX3VzZXI6cGFzc3dvcmRfdG9rZW4=',
          );
          const body = await request.json();
          expect(body).toEqual({
            name: 'repo',
            private: true,
            description,
          });
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

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
        repoUrl: 'gitea.com?repo=repo&owner=org1',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gitea.com/org1/repo.git',
      defaultBranch: 'main',
      auth: { username: 'sample_user', password: 'password_token' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {
        email: undefined,
        name: undefined,
      },
    });
  });

  it(`should ${examples[3].description}`, async () => {
    server.use(
      http.get('https://gitea.com/api/v1/orgs/org1', () => {
        return HttpResponse.json(
          {
            id: 1,
            name: 'org1',
            visibility: 'public',
            repo_admin_change_team_access: false,
            username: 'org1',
          },
          { status: 200 },
        );
      }),
      http.get('https://gitea.com/org1/repo/src/branch/staging', () => {
        return HttpResponse.json({}, { status: 200 });
      }),
      http.post(
        'https://gitea.com/api/v1/orgs/org1/repos',
        async ({ request }) => {
          // Basic auth must match the user and password defined part of the config
          expect(request.headers.get('Authorization')).toBe(
            'basic c2FtcGxlX3VzZXI6cGFzc3dvcmRfdG9rZW4=',
          );
          const body = await request.json();
          expect(body).toEqual({
            name: 'repo',
            private: false,
            description,
          });
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

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
        repoUrl: 'gitea.com?repo=repo&owner=org1',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gitea.com/org1/repo.git',
      defaultBranch: 'staging',
      auth: { username: 'sample_user', password: 'password_token' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {
        email: undefined,
        name: undefined,
      },
    });
  });

  it(`should ${examples[4].description}`, async () => {
    server.use(
      http.get('https://gitea.com/api/v1/orgs/org1', () => {
        return HttpResponse.json(
          {
            id: 1,
            name: 'org1',
            visibility: 'public',
            repo_admin_change_team_access: false,
            username: 'org1',
          },
          { status: 200 },
        );
      }),
      http.get('https://gitea.com/org1/repo/src/branch/main', () => {
        return HttpResponse.json({}, { status: 200 });
      }),
      http.post(
        'https://gitea.com/api/v1/orgs/org1/repos',
        async ({ request }) => {
          // Basic auth must match the user and password defined part of the config
          expect(request.headers.get('Authorization')).toBe(
            'basic c2FtcGxlX3VzZXI6cGFzc3dvcmRfdG9rZW4=',
          );
          const body = await request.json();
          expect(body).toEqual({
            name: 'repo',
            private: false,
            description,
          });
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

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
        repoUrl: 'gitea.com?repo=repo&owner=org1',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gitea.com/org1/repo.git',
      defaultBranch: 'main',
      auth: { username: 'sample_user', password: 'password_token' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining(
        'Initial Commit Message\n\nChange-Id:',
      ),
      gitAuthorInfo: {
        email: undefined,
        name: undefined,
      },
    });
  });

  it(`should ${examples[5].description}`, async () => {
    server.use(
      http.get('https://gitea.com/api/v1/orgs/org1', () => {
        return HttpResponse.json(
          {
            id: 1,
            name: 'org1',
            visibility: 'public',
            repo_admin_change_team_access: false,
            username: 'org1',
          },
          { status: 200 },
        );
      }),
      http.get('https://gitea.com/org1/repo/src/branch/main', () => {
        return HttpResponse.json({}, { status: 200 });
      }),
      http.post(
        'https://gitea.com/api/v1/orgs/org1/repos',
        async ({ request }) => {
          // Basic auth must match the user and password defined part of the config
          expect(request.headers.get('Authorization')).toBe(
            'basic c2FtcGxlX3VzZXI6cGFzc3dvcmRfdG9rZW4=',
          );
          const body = await request.json();
          expect(body).toEqual({
            name: 'repo',
            private: false,
            description,
          });
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

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
        repoUrl: 'gitea.com?repo=repo&owner=org1',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gitea.com/org1/repo.git',
      defaultBranch: 'main',
      auth: { username: 'sample_user', password: 'password_token' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {
        email: undefined,
        name: 'John Doe',
      },
    });
  });

  it(`should ${examples[6].description}`, async () => {
    server.use(
      http.get('https://gitea.com/api/v1/orgs/org1', () => {
        return HttpResponse.json(
          {
            id: 1,
            name: 'org1',
            visibility: 'public',
            repo_admin_change_team_access: false,
            username: 'org1',
          },
          { status: 200 },
        );
      }),
      http.get('https://gitea.com/org1/repo/src/branch/main', () => {
        return HttpResponse.json({}, { status: 200 });
      }),
      http.post(
        'https://gitea.com/api/v1/orgs/org1/repos',
        async ({ request }) => {
          // Basic auth must match the user and password defined part of the config
          expect(request.headers.get('Authorization')).toBe(
            'basic c2FtcGxlX3VzZXI6cGFzc3dvcmRfdG9rZW4=',
          );
          const body = await request.json();
          expect(body).toEqual({
            name: 'repo',
            private: false,
            description,
          });
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

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
        repoUrl: 'gitea.com?repo=repo&owner=org1',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gitea.com/org1/repo.git',
      defaultBranch: 'main',
      auth: { username: 'sample_user', password: 'password_token' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {
        email: 'johndoe@email.com',
        name: undefined,
      },
    });
  });

  it(`should ${examples[7].description}`, async () => {
    server.use(
      http.get('https://gitea.com/api/v1/orgs/org1', () => {
        return HttpResponse.json(
          {
            id: 1,
            name: 'org1',
            visibility: 'public',
            repo_admin_change_team_access: false,
            username: 'org1',
          },
          { status: 200 },
        );
      }),
      http.get('https://gitea.com/org1/repo/src/branch/main', () => {
        return HttpResponse.json({}, { status: 200 });
      }),
      http.post(
        'https://gitea.com/api/v1/orgs/org1/repos',
        async ({ request }) => {
          // Basic auth must match the user and password defined part of the config
          expect(request.headers.get('Authorization')).toBe(
            'basic c2FtcGxlX3VzZXI6cGFzc3dvcmRfdG9rZW4=',
          );
          const body = await request.json();
          expect(body).toEqual({
            name: 'repo',
            private: false,
            description,
          });
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

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
        repoUrl: 'gitea.com?repo=repo&owner=org1',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: getRepoSourceDirectory(mockContext.workspacePath, 'repository/'),
      remoteUrl: 'https://gitea.com/org1/repo.git',
      defaultBranch: 'main',
      auth: { username: 'sample_user', password: 'password_token' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {
        email: undefined,
        name: undefined,
      },
    });
  });

  it(`should ${examples[8].description}`, async () => {
    server.use(
      http.get('https://gitea.com/api/v1/orgs/org1', () => {
        return HttpResponse.json(
          {
            id: 1,
            name: 'org1',
            visibility: 'public',
            repo_admin_change_team_access: false,
            username: 'org1',
          },
          { status: 200 },
        );
      }),
      http.get('https://gitea.com/org1/repo/src/branch/staging', () => {
        return HttpResponse.json({}, { status: 200 });
      }),
      http.post(
        'https://gitea.com/api/v1/orgs/org1/repos',
        async ({ request }) => {
          // Basic auth must match the user and password defined part of the config
          expect(request.headers.get('Authorization')).toBe(
            'basic c2FtcGxlX3VzZXI6cGFzc3dvcmRfdG9rZW4=',
          );
          const body = await request.json();
          expect(body).toEqual({
            name: 'repo',
            private: false,
            description: 'Initialize a gitea repository',
          });
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

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
        repoUrl: 'gitea.com?repo=repo&owner=org1',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: getRepoSourceDirectory(mockContext.workspacePath, 'repository/'),
      remoteUrl: 'https://gitea.com/org1/repo.git',
      defaultBranch: 'staging',
      auth: { username: 'sample_user', password: 'password_token' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining(
        'Initial Commit Message\n\nChange-Id:',
      ),
      gitAuthorInfo: {
        email: 'johndoe@email.com',
        name: 'John Doe',
      },
    });
  });

  it(`should ${examples[0].description}`, async () => {
    server.use(
      http.get('https://gitea.com/api/v1/orgs/org1', () => {
        return HttpResponse.json(
          {
            id: 1,
            name: 'org1',
            visibility: 'public',
            repo_admin_change_team_access: false,
            username: 'org1',
          },
          { status: 200 },
        );
      }),
      http.get('https://gitea.com/org1/repo/src/branch/main', () => {
        return HttpResponse.json({}, { status: 200 });
      }),
      http.post(
        'https://gitea.com/api/v1/orgs/org1/repos',
        async ({ request }) => {
          // Basic auth must match the user and password defined part of the config
          expect(request.headers.get('Authorization')).toBe(
            'basic c2FtcGxlX3VzZXI6cGFzc3dvcmRfdG9rZW4=',
          );
          const body = await request.json();
          expect(body).toEqual({
            name: 'repo',
            private: false,
            description,
          });
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

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
        repoUrl: 'gitea.com?repo=repo&owner=org1',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gitea.com/org1/repo.git',
      defaultBranch: 'main',
      auth: { username: 'sample_user', password: 'password_token' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {
        email: undefined,
        name: undefined,
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
