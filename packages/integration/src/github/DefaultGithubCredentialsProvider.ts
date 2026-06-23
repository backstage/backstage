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
import type { ConnectionsService } from '@backstage/connections';
import { GithubIntegrationConfig } from './config';

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

  /**
   * Creates a credentials provider backed by the connections service.
   *
   * @param connections - The connections service used to resolve GitHub credentials.
   * @public
   */
  static fromConnections(connections: ConnectionsService) {
    return new DefaultGithubCredentialsProvider(new Map(), connections);
  }

  private constructor(
    private readonly providers: Map<string, GithubCredentialsProvider>,
    private readonly connections?: ConnectionsService,
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
    if (this.connections) {
      const connection = await this.connections.find({
        type: 'github',
        url: opts.url,
        authMethods: ['app', 'token', 'none'],
      });
      const { auth } = connection;
      const providerKey = `${connection.host}:${auth.method}:${
        auth.method === 'app' ? auth.appId : ''
      }`;

      let provider = this.providers.get(providerKey);
      if (!provider) {
        const config: GithubIntegrationConfig = {
          host: connection.host,
          apiBaseUrl: connection.apiBaseUrl,
          rawBaseUrl: connection.rawBaseUrl,
        };

        if (auth.method === 'app') {
          config.apps = [
            {
              appId: Number(auth.appId),
              privateKey: auth.privateKey,
              clientId: auth.clientId,
              clientSecret: auth.clientSecret,
              webhookSecret: auth.webhookSecret,
              publicAccess: auth.publicAccess,
              allowedInstallationOwners: auth.orgs,
            },
          ];
        } else if (auth.method === 'token') {
          config.token = auth.token;
        }

        provider = SingleInstanceGithubCredentialsProvider.create(config);
        this.providers.set(providerKey, provider);
      }

      return provider.getCredentials(opts);
    }

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
