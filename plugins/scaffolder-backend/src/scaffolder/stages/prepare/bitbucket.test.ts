/*
 * Copyright 2020 Spotify AB
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

import fs from 'fs-extra';
import { BitbucketPreparer } from './bitbucket';
import { getVoidLogger, Git } from '@backstage/backend-common';

jest.mock('fs-extra');

describe('BitbucketPreparer', () => {
  const logger = getVoidLogger();
  const mockGitClient = {
    clone: jest.fn(),
  };

  jest.spyOn(Git, 'fromAuth').mockReturnValue(mockGitClient as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const preparer = BitbucketPreparer.fromConfig({
    host: 'bitbucket.org',
    username: 'fake-user',
    appPassword: 'fake-password',
  });

  const prepareOptions = {
    url: 'https://bitbucket.org/backstage-project/backstage-repo',
    logger,
    workspacePath: '/tmp',
  };

  it('calls the clone command with the correct arguments for a repository', async () => {
    await preparer.prepare(prepareOptions);
    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url: 'https://bitbucket.org/backstage-project/backstage-repo',
      dir: '/tmp/checkout',
    });
    expect(fs.move).toHaveBeenCalledWith('/tmp/checkout', '/tmp/template');
    expect(fs.rmdir).toHaveBeenCalledWith('/tmp/template/.git');
  });

  it('calls the clone command with the correct arguments if an app password is provided for a repository', async () => {
    const preparer = BitbucketPreparer.fromConfig({
      host: 'bitbucket.org',
      username: 'fake-user',
      appPassword: 'fake-password',
    });
    await preparer.prepare(prepareOptions);

    expect(Git.fromAuth).toHaveBeenCalledWith({
      logger,
      username: 'fake-user',
      password: 'fake-password',
    });
  });

  it('calls the clone command with the correct arguments for a repository when no path is provided', async () => {
    await preparer.prepare(prepareOptions);
    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url: 'https://bitbucket.org/backstage-project/backstage-repo',
      dir: '/tmp/checkout',
    });
  });

  it('moves a template subdirectory to checkout if specified', async () => {
    await preparer.prepare({
      url: 'https://bitbucket.org/foo/bar/src/master/1/2/3',
      logger,
      workspacePath: '/tmp',
    });
    expect(fs.move).toHaveBeenCalledWith(
      '/tmp/checkout/1/2/3',
      '/tmp/template',
    );
  });

  it('calls the clone command with with token for auth method', async () => {
    const preparer = BitbucketPreparer.fromConfig({
      host: 'bitbucket.org',
      token: 'fake-token',
    });

    await preparer.prepare(prepareOptions);

    expect(Git.fromAuth).toHaveBeenCalledWith({
      logger,
      username: 'x-token-auth',
      password: 'fake-token',
    });
  });
});
