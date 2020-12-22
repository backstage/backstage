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

import { PublisherBase, PublisherOptions, PublisherResult } from './types';
import { Octokit } from '@octokit/rest';
import { initRepoAndPush } from './helpers';
import { JsonValue } from '@backstage/config';
import { RequiredTemplateValues } from '../templater';

export type RepoVisibilityOptions = 'private' | 'internal' | 'public';

interface GithubPublisherParams {
  client: Octokit;
  token: string;
  repoVisibility: RepoVisibilityOptions;
}

export class GithubPublisher implements PublisherBase {
  private client: Octokit;
  private token: string;
  private repoVisibility: RepoVisibilityOptions;

  constructor({
    client,
    token,
    repoVisibility = 'public',
  }: GithubPublisherParams) {
    this.client = client;
    this.token = token;
    this.repoVisibility = repoVisibility;
  }

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const remoteUrl = await this.createRemote(values);

    await initRepoAndPush({
      dir: directory,
      remoteUrl,
      auth: {
        username: this.token,
        password: 'x-oauth-basic',
      },
      logger,
    });

    const catalogInfoUrl = remoteUrl.replace(
      /\.git$/,
      '/blob/master/catalog-info.yaml',
    );

    return { remoteUrl, catalogInfoUrl };
  }

  private async createRemote(
    values: RequiredTemplateValues & Record<string, JsonValue>,
  ) {
    const [owner, name] = values.storePath.split('/');
    const description = values.description as string;

    const user = await this.client.users.getByUsername({ username: owner });

    const repoCreationPromise =
      user.data.type === 'Organization'
        ? this.client.repos.createInOrg({
            name,
            org: owner,
            private: this.repoVisibility !== 'public',
            visibility: this.repoVisibility,
            description,
          })
        : this.client.repos.createForAuthenticatedUser({
            name,
            private: this.repoVisibility === 'private',
            description,
          });

    const { data } = await repoCreationPromise;

    const access = values.access as string;
    if (access?.startsWith(`${owner}/`)) {
      const [, team] = access.split('/');
      await this.client.teams.addOrUpdateRepoPermissionsInOrg({
        org: owner,
        team_slug: team,
        owner,
        repo: name,
        permission: 'admin',
      });
      // no need to add access if it's the person who own's the personal account
    } else if (access && access !== owner) {
      await this.client.repos.addCollaborator({
        owner,
        repo: name,
        username: access,
        permission: 'admin',
      });
    }

    return data?.clone_url;
  }
}
