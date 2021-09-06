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

import { Git, getVoidLogger } from '@backstage/backend-common';
import { initRepoAndPush } from './helpers';

jest.mock('@backstage/backend-common', () => ({
  Git: {
    fromAuth: jest.fn().mockReturnValue({
      init: jest.fn(),
      add: jest.fn(),
      commit: jest.fn(),
      addRemote: jest.fn(),
      push: jest.fn(),
    }),
  },
  getVoidLogger: jest.requireActual('@backstage/backend-common').getVoidLogger,
}));

const mockedGit = Git.fromAuth({
  username: 'test-user',
  password: 'test-password',
  logger: getVoidLogger(),
});

describe('initRepoAndPush', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('with minimal parameters', () => {
    beforeEach(async () => {
      await initRepoAndPush({
        dir: '/test/repo/dir/',
        remoteUrl: 'git@github.com:test/repo.git',
        auth: {
          username: 'test-user',
          password: 'test-password',
        },
        logger: getVoidLogger(),
      });
    });

    it('initializes the repo', () => {
      expect(mockedGit.init).toHaveBeenCalledWith({
        dir: '/test/repo/dir/',
        defaultBranch: 'master',
      });
    });

    it('stages all files in the repo', () => {
      expect(mockedGit.add).toHaveBeenCalledWith({
        dir: '/test/repo/dir/',
        filepath: '.',
      });
    });

    it('creates an initial commit', () => {
      expect(mockedGit.commit).toHaveBeenCalledWith({
        dir: '/test/repo/dir/',
        message: 'Initial commit',
        author: {
          name: 'Scaffolder',
          email: 'scaffolder@backstage.io',
        },
        committer: {
          name: 'Scaffolder',
          email: 'scaffolder@backstage.io',
        },
      });
    });

    it('adds the appropriate remote', () => {
      expect(mockedGit.addRemote).toHaveBeenCalledWith({
        dir: '/test/repo/dir/',
        url: 'git@github.com:test/repo.git',
        remote: 'origin',
      });
    });

    it('pushes to the remote', () => {
      expect(mockedGit.push).toHaveBeenCalledWith({
        dir: '/test/repo/dir/',
        remote: 'origin',
      });
    });
  });

  it('allows overriding the default branch', async () => {
    await initRepoAndPush({
      dir: '/test/repo/dir/',
      defaultBranch: 'trunk',
      remoteUrl: 'git@github.com:test/repo.git',
      auth: {
        username: 'test-user',
        password: 'test-password',
      },
      logger: getVoidLogger(),
    });

    expect(mockedGit.init).toHaveBeenCalledWith({
      dir: '/test/repo/dir/',
      defaultBranch: 'trunk',
    });
  });

  it('allows overriding the author', async () => {
    await initRepoAndPush({
      dir: '/test/repo/dir/',
      gitAuthorInfo: {
        name: 'Custom Scaffolder Author',
        email: 'scaffolder@example.org',
      },
      remoteUrl: 'git@github.com:test/repo.git',
      auth: {
        username: 'test-user',
        password: 'test-password',
      },
      logger: getVoidLogger(),
    });

    expect(mockedGit.commit).toHaveBeenCalledWith({
      dir: '/test/repo/dir/',
      message: 'Initial commit',
      author: {
        name: 'Custom Scaffolder Author',
        email: 'scaffolder@example.org',
      },
      committer: {
        name: 'Custom Scaffolder Author',
        email: 'scaffolder@example.org',
      },
    });
  });
});
