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

import { Publisher } from './types';
import { Octokit } from '@octokit/rest';

import { JsonValue } from '@backstage/config';
import { RequiredTemplateValues } from '../templater';
import { Repository, Remote, Signature, Cred } from 'nodegit';

export class GithubPublisher implements Publisher {
  private client: Octokit;
  constructor({ client }: { client: Octokit }) {
    this.client = client;
  }

  async publish({
    values,
    directory,
  }: {
    values: RequiredTemplateValues & Record<string, JsonValue>;
    directory: string;
  }): Promise<{ remoteUrl: string }> {
    const remoteUrl = await this.createRemote(values);
    await this.pushToRemote(directory, remoteUrl);

    return { remoteUrl };
  }

  private async createRemote(
    values: RequiredTemplateValues & Record<string, JsonValue>,
  ) {
    const [owner, name] = values.storePath.split('/');

    const repoCreationPromise = values.isOrg
      ? this.client.repos.createInOrg({ name, org: owner })
      : this.client.repos.createForAuthenticatedUser({ name });

    const { data } = await repoCreationPromise;

    return data?.clone_url;
  }

  private async pushToRemote(directory: string, remote: string): Promise<void> {
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
        credentials: () => {
          return Cred.userpassPlaintextNew(
            process.env.GITHUB_ACCESS_TOKEN as string,
            'x-oauth-basic',
          );
        },
      },
    });
  }
}
