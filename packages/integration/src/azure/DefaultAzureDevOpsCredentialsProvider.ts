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
import {
  AzureDevOpsCredentials,
  AzureDevOpsCredentialsProvider,
} from './types';
import { CachedAzureDevOpsCredentialsProvider } from './CachedAzureDevOpsCredentialsProvider';
import { ScmIntegrationRegistry } from '../registry';
import { DefaultAzureCredential } from '@azure/identity';

/**
 * Default implementation of AzureDevOpsCredentialsProvider.
 * @public
 */
export class DefaultAzureDevOpsCredentialsProvider
  implements AzureDevOpsCredentialsProvider
{
  static fromIntegrations(
    integrations: ScmIntegrationRegistry,
  ): DefaultAzureDevOpsCredentialsProvider {
    const providers = integrations.azure.list().reduce((acc, integration) => {
      integration.config.credentials?.forEach(credential => {
        if (
          credential.organizations === undefined ||
          credential.organizations.length === 0
        ) {
          if (acc.get(integration.config.host) === undefined) {
            acc.set(
              integration.config.host,
              CachedAzureDevOpsCredentialsProvider.fromAzureDevOpsCredential(
                credential,
              ),
            );
          }
        } else {
          const provider =
            CachedAzureDevOpsCredentialsProvider.fromAzureDevOpsCredential(
              credential,
            );
          credential.organizations?.forEach(organization => {
            acc.set(`${integration.config.host}/${organization}`, provider);
          });
        }
      });

      if (
        integration.config.host === 'dev.azure.com' &&
        acc.get(integration.config.host) === undefined
      ) {
        acc.set(
          integration.config.host,
          CachedAzureDevOpsCredentialsProvider.fromTokenCredential(
            new DefaultAzureCredential(),
          ),
        );
      }

      return acc;
    }, new Map<string, CachedAzureDevOpsCredentialsProvider>());

    return new DefaultAzureDevOpsCredentialsProvider(providers);
  }

  private constructor(
    private readonly providers: Map<
      string,
      CachedAzureDevOpsCredentialsProvider
    >,
  ) {}

  private forAzureDevOpsServerOrganization(
    url: URL,
  ): AzureDevOpsCredentialsProvider | undefined {
    const parts = url.pathname.split('/').filter(part => part !== '');
    if (url.host !== 'dev.azure.com' && parts.length > 0) {
      if (parts[0] !== 'tfs') {
        // url format: https://{host}/{organization}
        return this.providers.get(`${url.host}/${parts[0]}`);
      } else if (parts[0] === 'tfs' && parts.length > 1) {
        // url format: https://{host}/tfs/{organization}
        return this.providers.get(`${url.host}/${parts[1]}`);
      }
    }

    return undefined;
  }

  private forAzureDevOpsOrganization(
    url: URL,
  ): AzureDevOpsCredentialsProvider | undefined {
    const parts = url.pathname.split('/').filter(part => part !== '');
    if (url.host === 'dev.azure.com' && parts.length > 0) {
      // url format: https://{host}/{organization}
      return this.providers.get(`${url.host}/${parts[0]}`);
    }

    return undefined;
  }

  private forHost(url: URL): AzureDevOpsCredentialsProvider | undefined {
    return this.providers.get(url.host);
  }

  async getCredentials(opts: {
    url: string;
  }): Promise<AzureDevOpsCredentials | undefined> {
    const url = new URL(opts.url);
    const provider =
      this.forAzureDevOpsOrganization(url) ??
      this.forAzureDevOpsServerOrganization(url) ??
      this.forHost(url);

    if (provider === undefined) {
      return undefined;
    }

    return provider.getCredentials(opts);
  }
}
