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
import { commitAndPushRepo, initRepoAndPush } from './helpers';

jest.mock('@backstage/backend-common', () => ({
  Git: {
    fromAuth: jest.fn().mockReturnValue({
      init: jest.fn(),
      add: jest.fn(),
      checkout: jest.fn(),
      commit: jest.fn(),
      fetch: jest.fn(),
      addRemote: jest.fn(),
      push: jest.fn(),
    }),
  },
  getVoidLogger: jest.requireActual('@backstage/backend-common').getVoidLogger,
}));

const mockedGit = Git.fromAuth({
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

  it('with token', async () => {
    await initRepoAndPush({
      dir: '/test/repo/dir/',
      remoteUrl: 'git@github.com:test/repo.git',
      auth: {
        token: 'test-token',
      },
      logger: getVoidLogger(),
    });

    expect(mockedGit.init).toHaveBeenCalledWith({
      dir: '/test/repo/dir/',
      defaultBranch: 'master',
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

describe('commitAndPushRepo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('with minimal parameters', () => {
    beforeEach(async () => {
      await commitAndPushRepo({
        dir: '/test/repo/dir/',
        auth: {
          username: 'test-user',
          password: 'test-password',
        },
        logger: getVoidLogger(),
        commitMessage: 'commit message',
      });
    });

    it('fetches commits', () => {
      expect(mockedGit.fetch).toHaveBeenCalledWith({
        dir: '/test/repo/dir/',
      });
    });

    it('checkouts to master', () => {
      expect(mockedGit.checkout).toHaveBeenCalledWith({
        dir: '/test/repo/dir/',
        ref: 'master',
      });
    });

    it('stages all files in the repo', () => {
      expect(mockedGit.add).toHaveBeenCalledWith({
        dir: '/test/repo/dir/',
        filepath: '.',
      });
    });

    it('creates a commit', () => {
      expect(mockedGit.commit).toHaveBeenCalledWith({
        dir: '/test/repo/dir/',
        message: 'commit message',
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

    it('pushes to the remote', () => {
      expect(mockedGit.push).toHaveBeenCalledWith({
        dir: '/test/repo/dir/',
        remote: 'origin',
        remoteRef: 'refs/heads/master',
      });
    });
  });

  it('allows overriding the default branch', async () => {
    await commitAndPushRepo({
      dir: '/test/repo/dir/',
      auth: {
        username: 'test-user',
        password: 'test-password',
      },
      logger: getVoidLogger(),
      commitMessage: 'commit message',
      branch: 'otherbranch',
    });

    expect(mockedGit.checkout).toHaveBeenCalledWith({
      dir: '/test/repo/dir/',
      ref: 'otherbranch',
    });
    expect(mockedGit.push).toHaveBeenCalledWith({
      dir: '/test/repo/dir/',
      remote: 'origin',
      remoteRef: 'refs/heads/otherbranch',
    });
  });

  it('allows overriding the remote ref', async () => {
    await commitAndPushRepo({
      dir: '/test/repo/dir/',
      auth: {
        username: 'test-user',
        password: 'test-password',
      },
      logger: getVoidLogger(),
      commitMessage: 'commit message',
      remoteRef: 'refs/for/master',
    });

    expect(mockedGit.checkout).toHaveBeenCalledWith({
      dir: '/test/repo/dir/',
      ref: 'master',
    });
    expect(mockedGit.push).toHaveBeenCalledWith({
      dir: '/test/repo/dir/',
      remote: 'origin',
      remoteRef: 'refs/for/master',
    });
  });

  it('allows overriding the author', async () => {
    await commitAndPushRepo({
      dir: '/test/repo/dir/',
      commitMessage: 'commit message',
      gitAuthorInfo: {
        name: 'Custom Scaffolder Author',
        email: 'scaffolder@example.org',
      },
      auth: {
        username: 'test-user',
        password: 'test-password',
      },
      logger: getVoidLogger(),
      branch: 'master',
    });

    expect(mockedGit.commit).toHaveBeenCalledWith({
      dir: '/test/repo/dir/',
      message: 'commit message',
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
