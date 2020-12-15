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
import { Repository, Remote, Signature, Cred } from 'nodegit';

export async function pushToRemoteCred(
  directory: string,
  remote: string,
  credentialsProvider: () => Cred,
): Promise<void> {
  const repo = await Repository.init(directory, 0);
  const index = await repo.refreshIndex();
  await index.addAll();
  await index.write();
  const oid = await index.writeTree();
  await repo.createCommit(
    'HEAD',
    Signature.now('Scaffolder', 'scaffolder@backstage.io'),
    Signature.now('Scaffolder', 'scaffolder@backstage.io'),
    'initial commit',
    oid,
    [],
  );

  const remoteRepo = await Remote.create(repo, 'origin', remote);

  await remoteRepo.push(['refs/heads/master:refs/heads/master'], {
    callbacks: {
      credentials: credentialsProvider,
    },
  });
}

export async function pushToRemoteUserPass(
  directory: string,
  remote: string,
  username: string,
  password: string,
): Promise<void> {
  return pushToRemoteCred(directory, remote, () =>
    Cred.userpassPlaintextNew(username, password),
  );
}
