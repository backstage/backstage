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
import { initRepoAndPush } from './helpers';
import { GitHubIntegrationConfig } from '@backstage/integration';
import { createAppAuth } from '@octokit/auth-app';
import parseGitUrl from 'git-url-parse';
import { Octokit } from '@octokit/rest';
import path from 'path';

export type RepoVisibilityOptions = 'private' | 'internal' | 'public';

export class GithubPublisher implements PublisherBase {
  static async fromConfig(
    config: GitHubIntegrationConfig,
    { repoVisibility }: { repoVisibility: RepoVisibilityOptions },
  ) {
    config.accessType = 'oAuth';

    if (!config.token) {
      if (!config.apps) {
        return undefined
      }
      const auth = createAppAuth({
        appId: config.apps[0].appId,
        privateKey: config.apps[0].privateKey,
        installationId: process.env.GITHUB_INSTALLATION_ID,
        clientId: config.apps[0].clientId,
        clientSecret: config.apps[0].clientSecret,
      });
      const appAuthentication = await auth({ type: 'installation' });

      config.token = appAuthentication.token;
      config.accessType = 'githubApp'
    }

    const githubClient = new Octokit({
      auth: config.token,
      baseUrl: config.apiBaseUrl,
    });

    return new GithubPublisher({
      token: config.token,
      accessType: config.accessType,
      client: githubClient,
      repoVisibility,
    });
  }

  constructor(
    private readonly config: {
      token: string;
      accessType: string;
      client: Octokit;
      repoVisibility: RepoVisibilityOptions;
    },
  ) {}

  async publish({
    values,
    workspacePath,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { owner, name } = parseGitUrl(values.storePath);

    const description = values.description as string;
    const access = values.access as string;
    const remoteUrl = await this.createRemote({
      description,
      access,
      name,
      owner,
    });

    if (this.config.accessType === 'githubApp') {
     await initRepoAndPush({
      dir: path.join(workspacePath, 'result'),
      remoteUrl,
      auth: {
        username: 'x-access-token',
        password: this.config.token,
      },
      logger,
    });
    } else if (this.config.accessType === 'oAuth'){
      await initRepoAndPush({
        dir: path.join(workspacePath, 'result'),
        remoteUrl,
        auth: {
          username: this.config.token,
          password: 'x-oauth-basic',
        },
        logger,
      });
    }

    const catalogInfoUrl = remoteUrl.replace(
      /\.git$/,
      '/blob/master/catalog-info.yaml',
    );
    return { remoteUrl, catalogInfoUrl };
  }

  private async createRemote(opts: {
    access: string;
    name: string;
    owner: string;
    description: string;
  }) {
    const { access, description, owner, name } = opts;

    const user = await this.config.client.users.getByUsername({
      username: owner,
    });

    const repoCreationPromise =
      user.data.type === 'Organization'
        ? this.config.client.repos.createInOrg({
            name,
            org: owner,
            private: this.config.repoVisibility !== 'public',
            visibility: this.config.repoVisibility,
            description,
          })
        : this.config.client.repos.createForAuthenticatedUser({
            name,
            private: this.config.repoVisibility === 'private',
            description,
          });

    const { data } = await repoCreationPromise;

    if (access?.startsWith(`${owner}/`)) {
      const [, team] = access.split('/');
      await this.config.client.teams.addOrUpdateRepoPermissionsInOrg({
        org: owner,
        team_slug: team,
        owner,
        repo: name,
        permission: 'admin',
      });
      // no need to add access if it's the person who own's the personal account
    } else if (access && access !== owner) {
      await this.config.client.repos.addCollaborator({
        owner,
        repo: name,
        username: access,
        permission: 'admin',
      });
    }

    return data?.clone_url;
  }
}
