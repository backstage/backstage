/*
 * Copyright 2020 The Backstage Authors
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
jest.mock('isomorphic-git');
jest.mock('isomorphic-git/http/node');
jest.mock('fs-extra');

import * as isomorphic from 'isomorphic-git';
import { Git } from './git';
import http from 'isomorphic-git/http/node';
import fs from 'fs-extra';

describe('Git', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('add', () => {
    it('should call isomorphic-git add with the correct arguments', async () => {
      const git = Git.fromAuth({});
      const dir = 'mockdirectory';
      const filepath = 'mockfile/path';

      await git.add({ dir, filepath });

      expect(isomorphic.add).toHaveBeenCalledWith({
        fs,
        dir,
        filepath,
      });
    });
  });

  describe('addRemote', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const git = Git.fromAuth({});
      const dir = 'mockdirectory';
      const remote = 'origin';
      const url = 'git@github.com/something/sads';
      const force = true;

      await git.addRemote({ dir, remote, url, force });

      expect(isomorphic.addRemote).toHaveBeenCalledWith({
        fs,
        dir,
        remote,
        url,
        force,
      });
    });
  });

  describe('remove', () => {
    it('should call isomorphic-git remove with the correct arguments', async () => {
      const git = Git.fromAuth({});
      const dir = 'mockdirectory';
      const filepath = 'mockfile/path';

      await git.remove({ dir, filepath });

      expect(isomorphic.remove).toHaveBeenCalledWith({
        fs,
        dir,
        filepath,
      });
    });
  });

  describe('deleteRemote', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const git = Git.fromAuth({});
      const dir = 'mockdirectory';
      const remote = 'origin';

      await git.deleteRemote({ dir, remote });

      expect(isomorphic.deleteRemote).toHaveBeenCalledWith({
        fs,
        dir,
        remote,
      });
    });
  });

  describe('checkout', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const git = Git.fromAuth({});
      const dir = 'mockdirectory';
      const ref = 'master';

      await git.checkout({ dir, ref });

      expect(isomorphic.checkout).toHaveBeenCalledWith({
        fs,
        dir,
        ref,
      });
    });
  });

  describe('branch', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const git = Git.fromAuth({});
      const dir = 'mockdirectory';
      const ref = 'master';

      await git.branch({ dir, ref });

      expect(isomorphic.branch).toHaveBeenCalledWith({
        fs,
        dir,
        ref,
      });
    });
  });

  describe('commit', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const git = Git.fromAuth({});
      const dir = 'mockdirectory';
      const message = 'Inital Commit';
      const author = {
        name: 'author',
        email: 'test@backstage.io',
      };
      const committer = {
        name: 'comitter',
        email: 'test@backstage.io',
      };

      await git.commit({ dir, message, author, committer });

      expect(isomorphic.commit).toHaveBeenCalledWith({
        fs,
        dir,
        message,
        author,
        committer,
      });
    });
  });

  describe('clone', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const url = 'http://github.com/some/repo';
      const dir = '/some/mock/dir';
      const auth = {
        username: 'blob',
        password: 'hunter2',
      };
      const git = Git.fromAuth(auth);

      await git.clone({ url, dir });

      expect(isomorphic.clone).toHaveBeenCalledWith({
        fs,
        http,
        url,
        dir,
        singleBranch: true,
        depth: 1,
        onProgress: expect.any(Function),
        headers: {
          'user-agent': 'git/@isomorphic-git',
        },
        onAuth: expect.any(Function),
      });
    });

    it('should call isomorphic-git with the correct arguments (Bearer)', async () => {
      const url = 'http://github.com/some/repo';
      const dir = '/some/mock/dir';
      const auth = {
        token: 'test',
      };
      const git = Git.fromAuth(auth);

      await git.clone({ url, dir });

      expect(isomorphic.clone).toHaveBeenCalledWith({
        fs,
        http,
        url,
        dir,
        singleBranch: true,
        depth: 1,
        onProgress: expect.any(Function),
        headers: {
          Authorization: 'Bearer test',
          'user-agent': 'git/@isomorphic-git',
        },
        onAuth: expect.any(Function),
      });
    });

    it('should pass a function that returns the authorization as the onAuth handler when username and password are specified', async () => {
      const url = 'http://github.com/some/repo';
      const dir = '/some/mock/dir';
      const auth = {
        username: 'blob',
        password: 'hunter2',
      };
      const git = Git.fromAuth(auth);

      await git.clone({ url, dir });

      const { onAuth } = (
        isomorphic.clone as unknown as jest.Mock<(typeof isomorphic)['clone']>
      ).mock.calls[0][0]!;

      expect(onAuth()).toEqual(auth);
    });

    it('should pass the provided callback as the onAuth handler when on auth is specified', async () => {
      const url = 'http://github.com/some/repo';
      const dir = '/some/mock/dir';
      const auth = {
        username: 'from',
        password: 'callback',
      };

      const git = Git.fromAuth({ onAuth: () => auth });

      await git.clone({ url, dir });

      const { onAuth } = (
        isomorphic.clone as unknown as jest.Mock<(typeof isomorphic)['clone']>
      ).mock.calls[0][0]!;

      expect(onAuth()).toEqual(auth);
    });

    it('should propagate the data from the error handler', async () => {
      const url = 'http://github.com/some/repo';
      const dir = '/some/mock/dir';
      const auth = {
        username: 'blob',
        password: 'hunter2',
      };
      const git = Git.fromAuth(auth);

      (isomorphic.clone as jest.Mock).mockImplementation(() => {
        const error: Error & { data?: unknown } = new Error('mock error');
        error.data = { some: 'more information here' };

        throw error;
      });

      await expect(git.clone({ url, dir })).rejects.toThrow(
        'more information here',
      );
    });
  });

  describe('currentBranch', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const dir = '/some/mock/dir';
      const fullName = true;
      const git = Git.fromAuth({});

      await git.currentBranch({ dir, fullName });

      expect(isomorphic.currentBranch).toHaveBeenCalledWith({
        fs,
        dir,
        fullname: true,
      });

      await git.currentBranch({ dir });

      expect(isomorphic.currentBranch).toHaveBeenCalledWith({
        fs,
        dir,
        fullname: false,
      });
    });
  });

  describe('fetch', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const remote = 'http://github.com/some/repo';
      const dir = '/some/mock/dir';
      const auth = {
        username: 'blob',
        password: 'hunter2',
      };
      const git = Git.fromAuth(auth);

      await git.fetch({ remote, dir, tags: true });

      expect(isomorphic.fetch).toHaveBeenCalledWith({
        fs,
        http,
        remote,
        dir,
        tags: true,
        onProgress: expect.any(Function),
        headers: {
          'user-agent': 'git/@isomorphic-git',
        },
        onAuth: expect.any(Function),
      });
    });

    it('should call isomorphic-git with the correct arguments (Bearer)', async () => {
      const remote = 'http://github.com/some/repo';
      const dir = '/some/mock/dir';
      const auth = {
        token: 'test',
      };
      const git = Git.fromAuth(auth);

      await git.fetch({ remote, dir });

      expect(isomorphic.fetch).toHaveBeenCalledWith({
        fs,
        http,
        remote,
        dir,
        tags: false,
        onProgress: expect.any(Function),
        headers: {
          Authorization: 'Bearer test',
          'user-agent': 'git/@isomorphic-git',
        },
        onAuth: expect.any(Function),
      });
    });

    it('should pass a function that returns the authorization as the onAuth handler', async () => {
      const remote = 'http://github.com/some/repo';
      const dir = '/some/mock/dir';
      const auth = {
        username: 'blob',
        password: 'hunter2',
      };
      const git = Git.fromAuth(auth);

      await git.fetch({ remote, dir });

      const { onAuth } = (
        isomorphic.fetch as unknown as jest.Mock<(typeof isomorphic)['fetch']>
      ).mock.calls[0][0]!;

      expect(onAuth()).toEqual(auth);
    });

    it('should propagate the data from the error handler', async () => {
      const remote = 'http://github.com/some/repo';
      const dir = '/some/mock/dir';
      const auth = {
        username: 'blob',
        password: 'hunter2',
      };
      const git = Git.fromAuth(auth);

      (isomorphic.fetch as jest.Mock).mockImplementation(() => {
        const error: Error & { data?: unknown } = new Error('mock error');
        error.data = { some: 'more information here' };

        throw error;
      });

      await expect(git.fetch({ remote, dir })).rejects.toThrow(
        'more information here',
      );
    });
  });

  describe('init', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const dir = '/some/mock/dir';
      const defaultBranch = 'master';

      const git = Git.fromAuth({});

      await git.init({ dir, defaultBranch });

      expect(isomorphic.init).toHaveBeenCalledWith({
        fs,
        dir,
        defaultBranch,
      });
    });
  });

  describe('merge', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const dir = '/some/mock/dir';
      const author = {
        name: 'author',
        email: 'test@backstage.io',
      };
      const committer = {
        name: 'comitter',
        email: 'test@backstage.io',
      };
      const theirs = 'master';
      const ours = 'production';

      const git = Git.fromAuth({});

      await git.merge({ dir, theirs, ours, author, committer });

      expect(isomorphic.merge).toHaveBeenCalledWith({
        fs,
        dir,
        ours,
        theirs,
        author,
        committer,
      });
    });
  });

  describe('push', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const remote = 'origin';
      const dir = '/some/mock/dir';
      const auth = {
        username: 'blob',
        password: 'hunter2',
      };
      const git = Git.fromAuth(auth);
      const remoteRef = 'master';
      const force = true;

      await git.push({ dir, remote, remoteRef, force });

      expect(isomorphic.push).toHaveBeenCalledWith({
        fs,
        http,
        remote,
        dir,
        remoteRef,
        force,
        onProgress: expect.any(Function),
        headers: {
          'user-agent': 'git/@isomorphic-git',
        },
        onAuth: expect.any(Function),
        corsProxy: '',
        url: undefined,
      });
    });

    it('should call isomorphic-git with the correct arguments (Bearer)', async () => {
      const remote = 'origin';
      const dir = '/some/mock/dir';
      const auth = {
        token: 'test',
      };
      const git = Git.fromAuth(auth);
      const remoteRef = 'master';
      const force = true;

      await git.push({ dir, remote, remoteRef, force });

      expect(isomorphic.push).toHaveBeenCalledWith({
        fs,
        http,
        remote,
        dir,
        remoteRef,
        force,
        onProgress: expect.any(Function),
        headers: {
          Authorization: 'Bearer test',
          'user-agent': 'git/@isomorphic-git',
        },
        onAuth: expect.any(Function),
        corsProxy: '',
        url: undefined,
      });
    });

    it('should call isomorphic-git with remoteRef parameter', async () => {
      const remote = 'origin';
      const remoteRef = 'refs/for/master';
      const dir = '/some/mock/dir';
      const auth = {
        username: 'blob',
        password: 'hunter2',
      };
      const git = Git.fromAuth(auth);

      await git.push({ dir, remote, remoteRef });

      expect(isomorphic.push).toHaveBeenCalledWith({
        fs,
        http,
        remote,
        remoteRef,
        dir,
        onProgress: expect.any(Function),
        headers: {
          'user-agent': 'git/@isomorphic-git',
        },
        onAuth: expect.any(Function),
        corsProxy: '',
        url: undefined,
      });
    });

    it('should pass a function that returns the authorization as the onAuth handler', async () => {
      const remote = 'origin';
      const dir = '/some/mock/dir';
      const auth = {
        username: 'blob',
        password: 'hunter2',
      };
      const git = Git.fromAuth(auth);
      const remoteRef = 'master';
      const force = true;

      await git.push({ remote, dir, remoteRef, force });

      const { onAuth } = (
        isomorphic.push as unknown as jest.Mock<(typeof isomorphic)['push']>
      ).mock.calls[0][0]!;

      expect(onAuth()).toEqual(auth);
    });

    it('should propagate the data from the error handler', async () => {
      const remote = 'origin';
      const dir = '/some/mock/dir';
      const auth = {
        username: 'blob',
        password: 'hunter2',
      };
      const git = Git.fromAuth(auth);
      const remoteRef = 'master';
      const force = true;

      (isomorphic.push as jest.Mock).mockImplementation(() => {
        const error: Error & { data?: unknown } = new Error('mock error');
        error.data = { some: 'more information here' };

        throw error;
      });

      await expect(git.push({ remote, dir, remoteRef, force })).rejects.toThrow(
        'more information here',
      );
    });
  });

  describe('readCommit', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const dir = '/some/mock/dir';
      const sha = 'as43bd7';

      const git = Git.fromAuth({});

      await git.readCommit({ dir, sha });

      expect(isomorphic.readCommit).toHaveBeenCalledWith({
        fs,
        dir,
        oid: sha,
      });
    });
  });

  describe('resolveRef', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const dir = '/some/mock/dir';
      const ref = 'as43bd7';

      const git = Git.fromAuth({});

      await git.resolveRef({ dir, ref });

      expect(isomorphic.resolveRef).toHaveBeenCalledWith({
        fs,
        dir,
        ref,
      });
    });
  });

  describe('log', () => {
    it('should call isomorphic-git with the correct arguments', async () => {
      const dir = '/some/mock/dir';
      const ref = 'as43bd7';

      const git = Git.fromAuth({});

      await git.log({ dir, ref });

      expect(isomorphic.log).toHaveBeenCalledWith({
        fs,
        dir,
        ref,
      });
    });
  });
});
