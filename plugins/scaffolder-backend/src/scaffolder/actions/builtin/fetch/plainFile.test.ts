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
  const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
  return { ...actual, fetchFile: jest.fn() };
});

import { resolve as resolvePath } from 'node:path';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { fetchFile } from '@backstage/plugin-scaffolder-node';
import { createFetchPlainFileAction } from './plainFile';
import { UrlReaderService } from '@backstage/backend-plugin-api';

describe('fetch:plain:file', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );
  const reader: UrlReaderService = {
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const action = createFetchPlainFileAction({ integrations, reader });
  const mockContext = createMockActionContext();

  it('should disallow a target path outside working directory', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
          targetPath: '/foobar',
        },
      }),
    ).rejects.toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );
  });

  it('should disallow a target path within a .git directory', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
          targetPath: '.git/HEAD',
        },
      }),
    ).rejects.toThrow('targetPath must not be within a .git directory');

    // matched case-insensitively, for file systems that treat any casing of
    // the name as the same directory
    await expect(
      action.handler({
        ...mockContext,
        input: {
          url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
          targetPath: '.GIT/HEAD',
        },
      }),
    ).rejects.toThrow('targetPath must not be within a .git directory');

    expect(fetchFile).not.toHaveBeenCalled();
  });

  it('passed through the token to fetchFile', async () => {
    await action.handler({
      ...mockContext,
      input: {
        url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
        token: 'mockToken',
        targetPath: 'lol',
      },
    });

    expect(fetchFile).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'mockToken' }),
    );
  });

  it('should fetch plain', async () => {
    await action.handler({
      ...mockContext,
      input: {
        url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
        targetPath: 'lol',
      },
    });
    expect(fetchFile).toHaveBeenCalledWith(
      expect.objectContaining({
        outputPath: resolvePath(mockContext.workspacePath, 'lol'),
        fetchUrl:
          'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
      }),
    );
  });

  it('requires an explicit token for SCM reads when configured', async () => {
    const requiredAction = createFetchPlainFileAction({
      integrations,
      reader,
      requireScmUserCredentials: true,
    });

    await expect(
      requiredAction.handler({
        ...mockContext,
        input: {
          url: 'https://github.com/backstage/community/blob/main/README.md',
          targetPath: 'README.md',
        },
      }),
    ).rejects.toThrow(
      'No user credentials provided for host github.com, but scaffolder.requireScmUserCredentials is enabled',
    );
    expect(fetchFile).not.toHaveBeenCalled();
  });

  it('checks the host that relative fetch URLs resolve to when configured', async () => {
    const giteaAndGithubIntegrations = ScmIntegrations.fromConfig(
      new ConfigReader({
        integrations: {
          gitea: [{ host: 'gitea.example.com' }],
          github: [{ host: 'github.example.com', token: 'token' }],
        },
      }),
    );
    const requiredAction = createFetchPlainFileAction({
      integrations: giteaAndGithubIntegrations,
      reader,
      requireScmUserCredentials: true,
    });

    await expect(
      requiredAction.handler({
        ...mockContext,
        input: {
          url: ' //github.example.com/owner/repo/raw/main/secret.txt',
          targetPath: 'secret.txt',
        },
        templateInfo: {
          baseUrl:
            'https://gitea.example.com/owner/repo/src/branch/main/template.yaml',
          entityRef: 'template:default/test-template',
        },
      }),
    ).rejects.toThrow(
      'No user credentials provided for host github.example.com, but scaffolder.requireScmUserCredentials is enabled',
    );
    expect(fetchFile).not.toHaveBeenCalled();
  });
});
