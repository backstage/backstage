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
import * as NodeGit from 'nodegit';
import { pushToRemoteCred } from './helpers';

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

describe('pushToRemoteCred', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const directory = '/tmp/test/dir';
  const remote = 'mockclone';
  const credentialsProvider = () =>
    NodeGit.Cred.userpassPlaintextNew('username', 'password');

  it('should call init on the repo with the directory', async () => {
    await pushToRemoteCred(directory, remote, credentialsProvider);

    expect(Repository.init).toHaveBeenCalledWith(directory, 0);
  });

  it('should call refresh index on the index and write the new files', async () => {
    await pushToRemoteCred(directory, remote, credentialsProvider);

    expect(mockRepo.refreshIndex).toHaveBeenCalled();
  });

  it('should call add all files and write', async () => {
    await pushToRemoteCred(directory, remote, credentialsProvider);

    expect(mockIndex.addAll).toHaveBeenCalled();
    expect(mockIndex.write).toHaveBeenCalled();
    expect(mockIndex.writeTree).toHaveBeenCalled();
  });

  it('should create a commit with on head with the right name and commiter', async () => {
    const mockSignature = { mockSignature: 'bloblly' };
    Signature.now.mockReturnValue(mockSignature);

    await pushToRemoteCred(directory, remote, credentialsProvider);

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
    await pushToRemoteCred(directory, remote, credentialsProvider);

    expect(Remote.create).toHaveBeenCalledWith(mockRepo, 'origin', 'mockclone');
  });

  it('shoud push to the remote repo', async () => {
    await pushToRemoteCred(directory, remote, credentialsProvider);

    const [remotes, { callbacks }] = mockRemote.push.mock
      .calls[0] as NodeGit.PushOptions[];

    expect(remotes).toEqual(['refs/heads/master:refs/heads/master']);

    callbacks?.credentials?.();

    expect(Cred.userpassPlaintextNew).toHaveBeenCalledWith(
      'username',
      'password',
    );
  });
});
