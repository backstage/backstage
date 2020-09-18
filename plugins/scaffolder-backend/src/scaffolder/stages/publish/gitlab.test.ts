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

jest.mock('nodegit');
jest.mock('@gitbeaker/node');

import { GitlabPublisher } from './gitlab';
import { Gitlab as GitlabAPI } from '@gitbeaker/core';
import { Gitlab } from '@gitbeaker/node';
import * as NodeGit from 'nodegit';

const { mockGitlabClient } = require('@gitbeaker/node') as {
  mockGitlabClient: {
    Namespaces: jest.Mocked<GitlabAPI['Namespaces']>;
    Projects: jest.Mocked<GitlabAPI['Projects']>;
    Users: jest.Mocked<GitlabAPI['Users']>;
  };
};

const {
  Repository,
  mockRepo,
  mockIndex,
  Signature,
  Remote,
  mockRemote,
  Cred,
} = require('nodegit') as {
  Repository: jest.Mocked<{ init: any }>;
  Signature: jest.Mocked<{ now: any }>;
  Cred: jest.Mocked<{ userpassPlaintextNew: any }>;
  Remote: jest.Mocked<{ create: any }>;

  mockIndex: jest.Mocked<NodeGit.Index>;
  mockRepo: jest.Mocked<NodeGit.Repository>;
  mockRemote: jest.Mocked<NodeGit.Remote>;
};

describe('GitLab Publisher', () => {
  const publisher = new GitlabPublisher(new Gitlab({}), 'fake-token');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('publish: createRemoteInGitLab', () => {
    it('should use gitbeaker to create a repo in a namespace if the namespace property is set', async () => {
      mockGitlabClient.Namespaces.show.mockResolvedValue({
        id: 42,
      } as { id: number });

      await publisher.publish({
        values: {
          isOrg: true,
          storePath: 'blam/test',
          owner: 'bob',
        },
        directory: '/tmp/test',
      });

      expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
        namespace_id: 42,
        name: 'test',
      });
    });

    it('should use gitbeaker to create a repo in the authed user if the namespace property is not set', async () => {
      mockGitlabClient.Namespaces.show.mockResolvedValue({});
      mockGitlabClient.Users.current.mockResolvedValue({
        id: 21,
      } as { id: number });
      mockGitlabClient.Projects.create.mockResolvedValue({
        http_url_to_repo: 'mockclone',
      } as { http_url_to_repo: string });

      await publisher.publish({
        values: {
          storePath: 'blam/test',
          owner: 'bob',
        },
        directory: '/tmp/test',
      });

      expect(mockGitlabClient.Users.current).toHaveBeenCalled();

      expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
        namespace_id: 21,
        name: 'test',
      });
    });
  });

  describe('publish: createGitDirectory', () => {
    const values = {
      isOrg: true,
      storePath: 'blam/test',
      owner: 'lols',
    };

    const mockDir = '/tmp/test/dir';

    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'mockclone',
    } as { http_url_to_repo: string });

    it('should call init on the repo with the directory', async () => {
      await publisher.publish({
        values,
        directory: mockDir,
      });

      expect(Repository.init).toHaveBeenCalledWith(mockDir, 0);
    });

    it('should call refresh index on the index and write the new files', async () => {
      await publisher.publish({
        values,
        directory: mockDir,
      });

      expect(mockRepo.refreshIndex).toHaveBeenCalled();
    });

    it('should call add all files and write', async () => {
      await publisher.publish({
        values,
        directory: mockDir,
      });

      expect(mockIndex.addAll).toHaveBeenCalled();
      expect(mockIndex.write).toHaveBeenCalled();
      expect(mockIndex.writeTree).toHaveBeenCalled();
    });

    it('should create a commit with on head with the right name and commiter', async () => {
      const mockSignature = { mockSignature: 'bloblly' };
      Signature.now.mockReturnValue(mockSignature);

      await publisher.publish({
        values,
        directory: mockDir,
      });

      expect(Signature.now).toHaveBeenCalledTimes(2);
      expect(Signature.now).toHaveBeenCalledWith(
        'Scaffolder',
        'scaffolder@backstage.io',
      );

      expect(mockRepo.createCommit).toHaveBeenCalledWith(
        'HEAD',
        mockSignature,
        mockSignature,
        'initial commit',
        'mockoid',
        [],
      );
    });

    it('creates a remote with the repo and remote', async () => {
      await publisher.publish({
        values,
        directory: mockDir,
      });

      expect(Remote.create).toHaveBeenCalledWith(
        mockRepo,
        'origin',
        'mockclone',
      );
    });

    it('shoud push to the remote repo', async () => {
      await publisher.publish({
        values,
        directory: mockDir,
      });

      const [remotes, { callbacks }] = mockRemote.push.mock
        .calls[0] as NodeGit.PushOptions[];

      expect(remotes).toEqual(['refs/heads/master:refs/heads/master']);

      callbacks?.credentials?.();

      expect(Cred.userpassPlaintextNew).toHaveBeenCalledWith(
        'oauth2',
        'fake-token',
      );
    });
  });
});
