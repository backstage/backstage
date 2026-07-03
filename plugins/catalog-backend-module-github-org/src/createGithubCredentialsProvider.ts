/*
 * Copyright 2026 The Backstage Authors
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

import type { ConnectionsService } from '@backstage/connections';
import {
  GithubCredentials,
  GithubCredentialsProvider,
  GithubIntegrationConfig,
  SingleInstanceGithubCredentialsProvider,
} from '@backstage/integration';

class ConnectionsGithubCredentialsProvider
  implements GithubCredentialsProvider
{
  private readonly providers = new Map<string, GithubCredentialsProvider>();

  constructor(private readonly connections: ConnectionsService) {}

  async getCredentials(options: { url: string }): Promise<GithubCredentials> {
    const connection = await this.connections.find({
      type: 'github',
      url: options.url,
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

    return provider.getCredentials(options);
  }
}

export function createGithubCredentialsProvider(
  connections: ConnectionsService,
): GithubCredentialsProvider {
  return new ConnectionsGithubCredentialsProvider(connections);
}
