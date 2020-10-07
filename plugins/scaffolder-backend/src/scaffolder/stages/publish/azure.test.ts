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
jest.mock('azure-devops-node-api/GitApi');
jest.mock('azure-devops-node-api/interfaces/GitInterfaces');

import { AzurePublisher } from './azure';
import { GitApi } from 'azure-devops-node-api/GitApi';
import * as NodeGit from 'nodegit';

const { mockGitApi } = require('azure-devops-node-api/GitApi') as {
  mockGitApi: {
    createRepository: jest.MockedFunction<GitApi['createRepository']>;
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

describe('Azure Publisher', () => {
  const publisher = new AzurePublisher(new GitApi('', []), 'fake-token');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('publish: createRemoteInAzure', () => {
    it('should use azure-devops-node-api to create a repo in the given project', async () => {
      mockGitApi.createRepository.mockResolvedValue({
        remoteUrl: 'mockclone',
      } as { remoteUrl: string });

      await publisher.publish({
        values: {
          storePath: 'project/repo',
          owner: 'bob',
        },
        directory: '/tmp/test',
      });

      expect(mockGitApi.createRepository).toHaveBeenCalledWith(
        {
          name: 'repo',
        },
        'project',
      );
    });
  });

  describe('publish: createGitDirectory', () => {
    const values = {
      isOrg: true,
      storePath: 'blam/test',
      owner: 'lols',
    };

    const mockDir = '/tmp/test/dir';

    mockGitApi.createRepository.mockResolvedValue({
      remoteUrl: 'mockclone',
    } as { remoteUrl: string });

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
        'notempty',
        'fake-token',
      );
    });
  });
});
