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
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Octokit } from '@octokit/rest';
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
  private readonly credentialsProviders: Map<string, GithubCredentialsProvider>;

  constructor(integrations: ScmIntegrationRegistry) {
    this.integrations = integrations;
    this.credentialsProviders = new Map(
      integrations.github.list().map(integration => {
        const provider = GithubCredentialsProvider.create(integration.config);
        return [integration.config.host, provider];
      }),
    );
  }

  /**
   * gets standard Octokit client based on repository URL.
   *
   * @param repoUrl Repository URL
   */
  async getOctokit(repoUrl: string): Promise<OctokitIntegration> {
    const { owner, repo, host } = parseRepoUrl(repoUrl, this.integrations);

    if (!owner) {
      throw new InputError(`No owner provided for repo ${repoUrl}`);
    }

    const integrationConfig = this.integrations.github.byHost(host)?.config;

    if (!integrationConfig) {
      throw new InputError(`No integration for host ${host}`);
    }

    const credentialsProvider = this.credentialsProviders.get(host);

    if (!credentialsProvider) {
      throw new InputError(
        `No matching credentials for host ${host}, please check your integrations config`,
      );
    }

    // TODO(blam): Consider changing this API to have owner, repo interface instead of URL as the it's
    // needless to create URL and then parse again the other side.
    const { token } = await credentialsProvider.getCredentials({
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
