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

export type RepoVisibilityOptions = 'private' | 'internal' | 'public';

interface GithubPublisherParams {
  client: Octokit;
  token: string;
  repoVisibility: RepoVisibilityOptions;
}

export class GithubPublisher implements PublisherBase {
  private client: Octokit;
  private repoVisibility: RepoVisibilityOptions;

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
    const remoteUrl = await this.createRemote(values, token);

    await this.pushToRemote(directory, remoteUrl, token);

    return { remoteUrl };
  }

  private async createRemote(
    values: RequiredTemplateValues & Record<string, JsonValue>,
    token: string,
  ) {
    const githubClientPublish = new Octokit({ auth: token });
    const [owner, name] = values.storePath.split('/');
    const description = values.description as string;

    const user = await githubClientPublish.users.getByUsername({
      username: owner,
    });
    const repoCreationPromise =
      user.data.type === 'Organization'
        ? githubClientPublish.repos.createInOrg({
            // this.client.repos.createInOrg({
            name,
            org: owner,
            headers: {
              Accept: `application/vnd.github.nebula-preview+json`,
            },
            visibility: this.repoVisibility,
            description: description,
          })
        : this.client.repos.createForAuthenticatedUser({ name });

    const { data } = await repoCreationPromise;

    const access = values.access as string;
    if (access?.startsWith(`${owner}/`)) {
      const [, team] = access.split('/');
      await githubClientPublish.teams.addOrUpdateRepoPermissionsInOrg({
        org: owner,
        team_slug: team,
        owner,
        repo: name,
        permission: 'admin',
      });
      // no need to add access if it's the person who own's the personal account
    } else if (access && access !== owner) {
      await githubClientPublish.repos.addCollaborator({
        owner,
        repo: name,
        username: access,
        permission: 'admin',
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
