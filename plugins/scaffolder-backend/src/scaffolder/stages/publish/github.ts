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

import { PublisherBase } from './types';
import { Octokit } from '@octokit/rest';

import { JsonValue } from '@backstage/config';
import { RequiredTemplateValues } from '../templater';
import { Repository, Remote, Signature, Cred } from 'nodegit';

export type RepoVisilityOptions = 'private' | 'internal' | 'public';

interface GithubPublisherParams {
  client: Octokit;
  token: string;
  repoVisibility: RepoVisilityOptions;
}

export class GithubPublisher implements PublisherBase {
  private client: Octokit;
  private repoVisibility: RepoVisilityOptions = 'internal';

  constructor({ client, repoVisibility = 'internal' }: GithubPublisherParams) {
    this.client = client;
    this.repoVisibility = repoVisibility;
  }

  async publish({
    values,
    directory,
    token,
  }: {
    values: RequiredTemplateValues & Record<string, JsonValue>;
    directory: string;
    token: string;
  }): Promise<{ remoteUrl: string }> {
    console.log('Inside Publish function..');
    const remoteUrl = await this.createRemote(values, token);
    console.log('Remote Url created: ', remoteUrl);
    console.log('Push to remote token: ', token);
    await this.pushToRemote(directory, remoteUrl, token);

    return { remoteUrl };
  }

  private async createRemote(
    values: RequiredTemplateValues & Record<string, JsonValue>,
    token: string,
  ) {
    console.log('Inside createRemote... Token: ', token);
    const [owner, name] = values.storePath.split('/');
    console.log('Owner:', owner, 'Name: ', name);
    const description = values.description as string;
    console.log('Description: ', description);

    const user = await this.client.users.getByUsername({ username: owner });
    console.log('User data type:', user.data.type);
    const repoCreationPromise =
      user.data.type === 'Organization'
        ? this.client.repos.createInOrg({
            name,
            org: owner,
            headers: {
              Accept: `application/vnd.github.nebula-preview+json`,
              authorization: `Bearer ${token}`,
            },
            visibility: this.repoVisibility,
          })
        : this.client.repos.createForAuthenticatedUser({ name });

    console.log('repoCreationPromise: ', repoCreationPromise);
    const { data } = await repoCreationPromise;

    const access = values.access as string;
    if (access?.startsWith(`${owner}/`)) {
      console.log('access starts with ${owner}/', access);
      const [, team] = access.split('/');
      await this.client.teams.addOrUpdateRepoPermissionsInOrg({
        org: owner,
        team_slug: team,
        owner,
        repo: name,
        permission: 'admin',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      // no need to add access if it's the person who own's the personal account
    } else if (access && access !== owner) {
      await this.client.repos.addCollaborator({
        owner,
        repo: name,
        username: access,
        permission: 'admin',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    }

    return data?.clone_url;
  }

  private async pushToRemote(
    directory: string,
    remote: string,
    token: string,
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
        credentials: () => {
          return Cred.userpassPlaintextNew(token as string, 'x-oauth-basic');
        },
      },
    });
  }
}
