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

import { GithubCredentials, GithubCredentialsProvider } from './types';
import { ScmIntegrationRegistry } from '../registry';
import { SingleInstanceGithubCredentialsProvider } from './SingleInstanceGithubCredentialsProvider';

/**
 * Handles the creation and caching of credentials for GitHub integrations.
 *
 * @public
 * @remarks
 *
 * TODO: Possibly move this to a backend only package so that it's not used in the frontend by mistake
 */
export class DefaultGithubCredentialsProvider
  implements GithubCredentialsProvider
{
  static fromIntegrations(integrations: ScmIntegrationRegistry) {
    const credentialsProviders: Map<string, GithubCredentialsProvider> =
      new Map<string, GithubCredentialsProvider>();

    integrations.github.list().forEach(integration => {
      const credentialsProvider =
        SingleInstanceGithubCredentialsProvider.create(integration.config);
      credentialsProviders.set(integration.config.host, credentialsProvider);
    });
    return new DefaultGithubCredentialsProvider(credentialsProviders);
  }

  private constructor(
    private readonly providers: Map<string, GithubCredentialsProvider>,
  ) {}

  /**
   * Returns {@link GithubCredentials} for a given URL.
   *
   * @remarks
   *
   * Consecutive calls to this method with the same URL will return cached
   * credentials.
   *
   * The shortest lifetime for a token returned is 10 minutes.
   *
   * @example
   * ```ts
   * const { token, headers } = await getCredentials({
   *   url: 'https://github.com/backstage/foobar'
   * })
   *
   * const { token, headers } = await getCredentials({
   *   url: 'https://github.com/backstage'
   * })
   * ```
   *
   * @param opts - The organization or repository URL
   * @returns A promise of {@link GithubCredentials}.
   */
  async getCredentials(opts: { url: string }): Promise<GithubCredentials> {
    const parsed = new URL(opts.url);
    const provider = this.providers.get(parsed.host);

    if (!provider) {
      throw new Error(
        `There is no GitHub integration that matches ${opts.url}. Please add a configuration for an integration.`,
      );
    }

    return provider.getCredentials(opts);
  }
}
