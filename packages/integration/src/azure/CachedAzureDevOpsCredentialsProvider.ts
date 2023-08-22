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
import { AzureDevOpsCredential, PersonalAccessTokenCredential } from './config';
import {
  ClientSecretCredential,
  ManagedIdentityCredential,
  TokenCredential,
} from '@azure/identity';
import {
  AzureDevOpsCredentials,
  AzureDevOpsCredentialsProvider,
} from './types';

type CachedAzureDevOpsCredentials = AzureDevOpsCredentials & {
  expiresAt?: number;
};

function exhaustiveCheck(_param: never) {}

const tenMinutes = 1000 * 60 * 10;

/**
 * A credentials provider that caches the credentials for as long as it is valid.
 *
 * @public
 */
export class CachedAzureDevOpsCredentialsProvider
  implements AzureDevOpsCredentialsProvider
{
  azureDevOpsScope = '499b84ac-1321-427f-aa17-267ca6975798/.default';
  cached: CachedAzureDevOpsCredentials | undefined;

  static fromAzureDevOpsCredential(
    credential: AzureDevOpsCredential,
  ): CachedAzureDevOpsCredentialsProvider {
    switch (credential.kind) {
      case 'PersonalAccessToken':
        return CachedAzureDevOpsCredentialsProvider.fromPersonalAccessTokenCredential(
          credential,
        );
      case 'ClientSecret':
        return CachedAzureDevOpsCredentialsProvider.fromTokenCredential(
          new ClientSecretCredential(
            credential.tenantId,
            credential.clientId,
            credential.clientSecret,
          ),
        );
      case 'ManagedIdentity':
        return CachedAzureDevOpsCredentialsProvider.fromTokenCredential(
          new ManagedIdentityCredential(credential.clientId),
        );
      default:
        exhaustiveCheck(credential);

        throw new Error(
          `Credential kind '${(credential as any).kind}' not supported`,
        );
    }
  }

  static fromTokenCredential(
    credential: TokenCredential,
  ): CachedAzureDevOpsCredentialsProvider {
    return new CachedAzureDevOpsCredentialsProvider(credential);
  }

  static fromPersonalAccessTokenCredential(
    credential: PersonalAccessTokenCredential,
  ) {
    return new CachedAzureDevOpsCredentialsProvider(
      credential.personalAccessToken,
    );
  }

  private constructor(private readonly credential: TokenCredential | string) {}

  async getCredentials(): Promise<AzureDevOpsCredentials> {
    if (
      this.cached === undefined ||
      (this.cached.expiresAt !== undefined &&
        Date.now() > this.cached.expiresAt)
    ) {
      if (typeof this.credential === 'string') {
        this.cached = {
          headers: {
            Authorization: `Basic ${btoa(`:${this.credential}`)}`,
          },
          type: 'pat',
          token: this.credential,
        };
      } else {
        const accessToken = await this.credential.getToken(
          this.azureDevOpsScope,
        );

        if (!accessToken) {
          throw new Error('Failed to retrieve access token');
        }

        this.cached = {
          expiresAt: accessToken.expiresOnTimestamp - tenMinutes,
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
          },
          type: 'bearer',
          token: accessToken.token,
        };
      }
    }

    return this.cached;
  }
}
