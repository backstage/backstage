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
import { ForwardedError, InputError } from '@backstage/errors';
import type { GithubIntegrationConfig } from './config';

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
   * @internal
   */
  static experimentalFromConnections(connections: ConnectionsService) {
    return new DefaultGithubCredentialsProvider(
      new Map<string, GithubCredentialsProvider>(),
      connections,
    );
  }

  private readonly providers: Map<string, GithubCredentialsProvider>;
  readonly #connections?: ConnectionsService;

  private constructor(
    providers: Map<string, GithubCredentialsProvider>,
    connections?: ConnectionsService,
  ) {
    this.providers = providers;
    this.#connections = connections;
  }

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
    if (this.#connections) {
      // Ask the connections service to select auth for this URL. A host may
      // have different GitHub Apps for different organizations, so this
      // selection cannot be done once when the provider is created.

      const connection = await this.#connections
        .find({
          type: 'github',
          url: opts.url,
          authMethods: ['app', 'token', 'none'],
        })
        .catch(error => {
          throw new ForwardedError(
            'Failed getting credentials from connection',
            error,
          );
        });

      const { auth } = connection;

      // Adapt the connection schema to the existing provider configuration so
      // credential creation and token caching stay in one implementation.
      const config: GithubIntegrationConfig = {
        host: connection.host,
        apiBaseUrl: connection.apiBaseUrl,
        rawBaseUrl: connection.rawBaseUrl,
      };

      // Reusing an App provider preserves its installation-token cache. App
      // organizations are canonicalized because GitHub owner matching is
      // case-insensitive and does not depend on ordering. Static token
      // providers have no internal token cache, so they are recreated rather
      // than placing their secret token in a cache key.
      let providerKey: string | undefined;
      if (auth.method === 'app') {
        const appId = Number(auth.appId);
        if (!Number.isSafeInteger(appId) || appId <= 0) {
          throw new InputError(
            `Invalid GitHub App ID "${auth.appId}", expected a positive safe integer`,
          );
        }
        const normalizedOrgs = auth.orgs?.length
          ? Array.from(
              new Set(auth.orgs.map(org => org.toLocaleLowerCase('en-US'))),
            ).sort()
          : undefined;
        config.apps = [
          {
            appId,
            privateKey: auth.privateKey,
            clientId: auth.clientId,
            clientSecret: auth.clientSecret,
            webhookSecret: auth.webhookSecret,
            publicAccess: auth.publicAccess,
            allowedInstallationOwners: normalizedOrgs,
          },
        ];
        providerKey = `${connection.host}:app:${appId}:${JSON.stringify(
          normalizedOrgs ?? [],
        )}:${String(auth.publicAccess ?? false)}`;
      } else if (auth.method === 'token') {
        config.token = auth.token;
      } else {
        providerKey = `${connection.host}:none`;
      }

      let provider = providerKey ? this.providers.get(providerKey) : undefined;
      if (!provider) {
        provider = SingleInstanceGithubCredentialsProvider.create(config);
        if (providerKey) {
          this.providers.set(providerKey, provider);
        }
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
