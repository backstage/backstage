/*
 * Copyright 2023 The Backstage Authors
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

import { ScmIntegrationRegistry } from '../registry';
import { SingleInstanceGitlabCredentialsProvider } from './SingleInstanceGitlabCredentialsProvider';
import { GitlabCredentials, GitlabCredentialsProvider } from './types';

/**
 * Handles the creation and caching of credentials for GitLab integrations.
 *
 * @public
 */
export class DefaultGitlabCredentialsProvider
  implements GitlabCredentialsProvider
{
  static fromIntegrations(integrations: ScmIntegrationRegistry) {
    const credentialsProviders: Map<string, GitlabCredentialsProvider> =
      new Map<string, GitlabCredentialsProvider>();

    integrations.gitlab.list().forEach(integration => {
      const credentialsProvider =
        SingleInstanceGitlabCredentialsProvider.create(integration.config);
      credentialsProviders.set(integration.config.host, credentialsProvider);
    });
    return new DefaultGitlabCredentialsProvider(credentialsProviders);
  }

  private constructor(
    private readonly providers: Map<string, GitlabCredentialsProvider>,
  ) {}

  async getCredentials(opts: { url: string }): Promise<GitlabCredentials> {
    const parsed = new URL(opts.url);
    const provider = this.providers.get(parsed.host);

    if (!provider) {
      throw new Error(
        `There is no GitLab integration that matches ${opts.url}. Please add a configuration for an integration.`,
      );
    }

    return provider.getCredentials(opts);
  }
}
