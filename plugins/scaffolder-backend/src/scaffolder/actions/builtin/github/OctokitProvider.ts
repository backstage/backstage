/*
 * Copyright 2021 The Backstage Authors
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

import { InputError } from '@backstage/errors';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Octokit } from 'octokit';
import { parseRepoUrl } from '../publish/util';

export type OctokitIntegration = {
  client: Octokit;
  token: string;
  owner: string;
  repo: string;
};
/**
 * OctokitProvider provides Octokit client based on ScmIntegrationsRegistry configuration.
 * OctokitProvider supports GitHub credentials caching out of the box.
 */
export class OctokitProvider {
  private readonly integrations: ScmIntegrationRegistry;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;

  constructor(
    integrations: ScmIntegrationRegistry,
    githubCredentialsProvider?: GithubCredentialsProvider,
  ) {
    this.integrations = integrations;
    this.githubCredentialsProvider =
      githubCredentialsProvider ||
      DefaultGithubCredentialsProvider.fromIntegrations(this.integrations);
  }

  /**
   * gets standard Octokit client based on repository URL.
   *
   * @param repoUrl - Repository URL
   */
  async getOctokit(
    repoUrl: string,
    options?: { token?: string },
  ): Promise<OctokitIntegration> {
    const { owner, repo, host } = parseRepoUrl(repoUrl, this.integrations);

    if (!owner) {
      throw new InputError(`No owner provided for repo ${repoUrl}`);
    }

    const integrationConfig = this.integrations.github.byHost(host)?.config;

    if (!integrationConfig) {
      throw new InputError(`No integration for host ${host}`);
    }

    // Short circuit the internal Github Token provider the token provided
    // by the action or the caller.
    if (options?.token) {
      const client = new Octokit({
        auth: options.token,
        baseUrl: integrationConfig.apiBaseUrl,
        previews: ['nebula-preview'],
      });

      return { client, token: options.token, owner, repo };
    }

    // TODO(blam): Consider changing this API to have owner, repoo interface instead of URL as the it's
    // needless to create URL and then parse again the other side.
    const { token } = await this.githubCredentialsProvider.getCredentials({
      url: `https://${host}/${encodeURIComponent(owner)}/${encodeURIComponent(
        repo,
      )}`,
    });

    if (!token) {
      throw new InputError(
        `No token available for host: ${host}, with owner ${owner}, and repo ${repo}`,
      );
    }

    const client = new Octokit({
      auth: token,
      baseUrl: integrationConfig.apiBaseUrl,
      previews: ['nebula-preview'],
    });

    return { client, token, owner, repo };
  }
}
