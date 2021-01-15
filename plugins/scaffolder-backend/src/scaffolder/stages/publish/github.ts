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
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import {
  GitHubIntegrationConfig,
  readGitHubIntegrationConfigs,
} from '@backstage/integration';
import gitUrlParse from 'git-url-parse';
import { Octokit } from '@octokit/rest';

export type RepoVisibilityOptions = 'private' | 'internal' | 'public';
export class GithubPublisher implements PublisherBase {
  private scaffolderToken: string | undefined;
  private readonly integrations: GitHubIntegrationConfig[];
  private readonly apiBaseUrl: string | undefined;
  private readonly repoVisibility: RepoVisibilityOptions;

  constructor(config: Config, { logger }: { logger: Logger }) {
    this.integrations = readGitHubIntegrationConfigs(
      config.getOptionalConfigArray('integrations.github') ?? [],
    );

    if (!this.integrations.length) {
      logger.warn(
        'Integrations for GitHub in Scaffolder are not set. This will cause errors in a future release. Please migrate to using integrations config and specifying tokens under hostnames',
      );
    }

    this.scaffolderToken = config.getOptionalString(
      'scaffolder.github.api.token',
    );

    this.apiBaseUrl = config.getOptionalString('scaffolder.github.api.baseUrl');

    if (this.scaffolderToken) {
      logger.warn(
        "DEPRECATION: Using the token format under 'scaffolder.github.api.token' will not be respected in future releases. Please consider using integrations config instead",
      );
    }

    if (this.apiBaseUrl) {
      logger.warn(
        "DEPRECATION: Using the apiBaseUrl format under 'scaffolder.github.api.baseUrl' will not be respected in future releases. Please consider using integrations config instead",
      );
    }

    this.repoVisibility = (config.getOptionalString(
      'scaffolder.github.visibility',
    ) ?? 'public') as RepoVisibilityOptions;
  }

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { resource: host, owner, name } = gitUrlParse(values.storePath);
    const token = this.getToken(host);

    if (!token) {
      throw new Error('No token provided to create the remote repository');
    }

    const description = values.description as string;
    const access = values.access as string;
    const remoteUrl = await this.createRemote({
      description,
      access,
      host,
      name,
      owner,
      token,
    });

    await initRepoAndPush({
      dir: directory,
      remoteUrl,
      auth: {
        username: token ?? '',
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

  private async createRemote(opts: {
    access: string;
    name: string;
    owner: string;
    host: string;
    token: string;
    description: string;
  }) {
    const { access, description, host, owner, name, token } = opts;

    // create a github client with the config
    const githubClient = new Octokit({
      auth: token,
      baseUrl: this.getBaseUrl(host),
    });

    const user = await githubClient.users.getByUsername({ username: owner });

    const repoCreationPromise =
      user.data.type === 'Organization'
        ? githubClient.repos.createInOrg({
            name,
            org: owner,
            private: this.repoVisibility !== 'public',
            visibility: this.repoVisibility,
            description,
          })
        : githubClient.repos.createForAuthenticatedUser({
            name,
            private: this.repoVisibility === 'private',
            description,
          });

    const { data } = await repoCreationPromise;

    if (access?.startsWith(`${owner}/`)) {
      const [, team] = access.split('/');
      await githubClient.teams.addOrUpdateRepoPermissionsInOrg({
        org: owner,
        team_slug: team,
        owner,
        repo: name,
        permission: 'admin',
      });
      // no need to add access if it's the person who own's the personal account
    } else if (access && access !== owner) {
      await githubClient.repos.addCollaborator({
        owner,
        repo: name,
        username: access,
        permission: 'admin',
      });
    }

    return data?.clone_url;
  }

  private getToken(host: string): string | undefined {
    return (
      this.scaffolderToken ||
      this.integrations.find(c => c.host === host)?.token
    );
  }

  private getBaseUrl(host: string): string | undefined {
    return (
      this.apiBaseUrl ||
      this.integrations.find(c => c.host === host)?.apiBaseUrl
    );
  }
}
