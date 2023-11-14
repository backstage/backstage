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
import { ScmIntegrations } from '../ScmIntegrations';
import { CachedAzureDevOpsCredentialsProvider } from './CachedAzureDevOpsCredentialsProvider';
import { AzureDevOpsCredentialLike, AzureIntegrationConfig } from './config';
import { ConfigReader } from '@backstage/config';
import { DefaultAzureDevOpsCredentialsProvider } from './DefaultAzureDevOpsCredentialsProvider';
import {
  AccessToken,
  ClientSecretCredential,
  DefaultAzureCredential,
  ManagedIdentityCredential,
} from '@azure/identity';
import { DateTime } from 'luxon';

type AzureIntegrationConfigLike = Partial<
  Omit<AzureIntegrationConfig, 'credential' | 'credentials'>
> & {
  credential?: Partial<AzureDevOpsCredentialLike>;
  credentials?: Partial<AzureDevOpsCredentialLike>[];
};

const MockedClientSecretCredential = ClientSecretCredential as jest.MockedClass<
  typeof ClientSecretCredential
>;

const MockedManagedIdentityCredential =
  ManagedIdentityCredential as jest.MockedClass<
    typeof ManagedIdentityCredential
  >;

const MockedDefaultAzureCredential = DefaultAzureCredential as jest.MockedClass<
  typeof DefaultAzureCredential
>;

jest.mock('@azure/identity');

describe('DefaultAzureDevOpsCredentialProvider', () => {
  const fromAzureDevOpsCredential = jest.spyOn(
    CachedAzureDevOpsCredentialsProvider,
    'fromAzureDevOpsCredential',
  );
  const fromTokenCredential = jest.spyOn(
    CachedAzureDevOpsCredentialsProvider,
    'fromTokenCredential',
  );
  const fromPersonalAccessTokenCredential = jest.spyOn(
    CachedAzureDevOpsCredentialsProvider,
    'fromPersonalAccessTokenCredential',
  );

  const buildProvider = (azureIntegrations: AzureIntegrationConfigLike[]) =>
    DefaultAzureDevOpsCredentialsProvider.fromIntegrations(
      ScmIntegrations.fromConfig(
        new ConfigReader({
          integrations: {
            azure: azureIntegrations,
          },
        }),
      ),
    );

  beforeEach(() => {
    jest.clearAllMocks();
    MockedClientSecretCredential.prototype.getToken.mockImplementation(() =>
      Promise.resolve({
        expiresOnTimestamp: DateTime.local().plus({ days: 1 }).toSeconds(),
        token: 'fake-client-secret-token',
      } as AccessToken),
    );

    MockedManagedIdentityCredential.prototype.getToken.mockImplementation(() =>
      Promise.resolve({
        expiresOnTimestamp: DateTime.local().plus({ days: 1 }).toSeconds(),
        token: 'fake-managed-identity-token',
      } as AccessToken),
    );

    MockedDefaultAzureCredential.prototype.getToken.mockImplementation(() =>
      Promise.resolve({
        expiresOnTimestamp: DateTime.local().plus({ days: 1 }).toSeconds(),
        token: 'fake-default-azure-credential-token',
      } as AccessToken),
    );
  });

  describe('fromIntegrations', () => {
    it('Should create a credential provider when a credential is specified', async () => {
      const provider = buildProvider([
        {
          host: 'dev.azure.com',
          credentials: [
            {
              personalAccessToken: 'pat',
            },
          ],
        },
      ]);

      expect(provider).toBeDefined();
      expect(fromAzureDevOpsCredential).toHaveBeenCalledTimes(1);
    });

    it('Should create a single credential provider per credential', async () => {
      const provider = buildProvider([
        {
          host: 'dev.azure.com',
          credentials: [
            {
              organizations: ['org1', 'org2'],
              clientId: 'client-id-1',
            },
            {
              organizations: ['org3', 'org4'],
              clientId: 'client-id-2',
            },
          ],
        },
      ]);

      expect(provider).toBeDefined();
      expect(fromAzureDevOpsCredential).toHaveBeenCalledTimes(2);
    });

    it('Should create a default credential provider for Azure DevOps when no credential is specified', async () => {
      const provider = buildProvider([
        {
          host: 'dev.azure.com',
          credentials: [],
        },
      ]);

      expect(provider).toBeDefined();
      expect(fromTokenCredential).toHaveBeenCalledTimes(1);

      expect(fromTokenCredential).toHaveBeenCalledWith(
        new DefaultAzureCredential(),
      );
    });

    it('Should create a default credential provider for Azure DevOps when no default credential is specified', async () => {
      const provider = buildProvider([
        {
          host: 'dev.azure.com',
          credentials: [
            {
              organizations: ['org1', 'org2'],
              clientId: 'client-id',
              tenantId: 'tenant-id',
              clientSecret: 'client-secret',
            },
          ],
        },
      ]);

      expect(provider).toBeDefined();
      expect(fromTokenCredential).toHaveBeenCalledTimes(2);

      expect(fromTokenCredential).toHaveBeenCalledWith(
        new DefaultAzureCredential(),
      );
    });

    it('Should not create a default credential provider for Azure DevOps when another default credential is specified', async () => {
      const provider = buildProvider([
        {
          host: 'dev.azure.com',
          credentials: [
            {
              clientId: 'client-id',
              tenantId: 'tenant-id',
              clientSecret: 'client-secret',
            },
          ],
        },
      ]);

      expect(provider).toBeDefined();
      expect(fromTokenCredential).toHaveBeenCalledTimes(1);

      expect(fromTokenCredential).toHaveBeenCalledWith(
        expect.any(ClientSecretCredential),
      );
    });

    it('Should not create a default credential provider for on-premise Azure DevOps server when no credential is specified', async () => {
      const provider = buildProvider([
        {
          host: 'my.devops.server',
          credentials: [],
        },
      ]);

      expect(provider).toBeDefined();
      expect(fromAzureDevOpsCredential).toHaveBeenCalledTimes(0);

      // expect 1 call because the Azure integration adds a default integration for dev.azure.com when it is not configured
      expect(fromTokenCredential).toHaveBeenCalledTimes(1);

      expect(fromPersonalAccessTokenCredential).toHaveBeenCalledTimes(0);
    });
  });

  describe('getCredentials', () => {
    describe('Azure DevOps (dev.azure.com)', () => {
      it('Should return a token when a credential with the same organization is specified', async () => {
        const provider = buildProvider([
          {
            host: 'dev.azure.com',
            credentials: [
              {
                organizations: ['org1'],
                personalAccessToken: 'pat',
              },
            ],
          },
        ]);

        const credentials = provider.getCredentials({
          url: 'https://dev.azure.com/org1/project1',
        });

        expect(credentials).toBeDefined();
      });

      it('Should return DefaultAzureCredential when no credential with the same organization is specified and host is dev.azure.com', async () => {
        const provider = buildProvider([
          {
            host: 'dev.azure.com',
            credentials: [
              {
                organizations: ['org1'],
                personalAccessToken: 'pat',
              },
            ],
          },
        ]);

        const credentials = await provider.getCredentials({
          url: 'https://dev.azure.com/org2/project1',
        });

        expect(credentials).toMatchObject({
          token: 'fake-default-azure-credential-token',
        });
      });

      it('Should return undefined when no credential is specified and host is Azure DevOps server', async () => {
        const provider = buildProvider([
          {
            host: 'my.devops.server',
            credentials: [],
          },
        ]);

        const credentials = await provider.getCredentials({
          url: 'https://my.devops.server/org2/project1',
        });

        expect(credentials).toBeUndefined();
      });

      it('Should prefer organization credential when a credential with the same organization is specified', async () => {
        const provider = buildProvider([
          {
            host: 'dev.azure.com',
            credentials: [
              {
                personalAccessToken: 'fallback-pat',
              },
              {
                organizations: ['org1'],
                personalAccessToken: 'org1-pat',
              },
            ],
          },
        ]);

        const credentials = await provider.getCredentials({
          url: 'https://dev.azure.com/org1/project1',
        });

        expect(credentials).toMatchObject({
          token: 'org1-pat',
        });
      });

      it('Should fallback to host credential when no credential with the same organization is specified', async () => {
        const provider = buildProvider([
          {
            host: 'dev.azure.com',
            credentials: [
              {
                personalAccessToken: 'fallback-pat',
              },
              {
                organizations: ['org1'],
                personalAccessToken: 'org1-pat',
              },
            ],
          },
        ]);

        const credentials = await provider.getCredentials({
          url: 'https://dev.azure.com/org2/project1',
        });

        expect(credentials).toMatchObject({
          token: 'fallback-pat',
        });
      });
    });
    describe('Azure DevOps Server', () => {
      [
        'https://{host}/{organization}/{project}',
        'https://{host}/tfs/{organization}/{project}',
      ].map(format => {
        describe(`With url format ${format}`, () => {
          const formatUrl = (opts: {
            host: string;
            organization: string;
            project: string;
          }) =>
            format
              .replace('{host}', opts.host)
              .replace('{organization}', opts.organization)
              .replace('{project}', opts.project);

          it('Should return a token when a credential with the same host is specified', async () => {
            const provider = buildProvider([
              {
                host: 'my.devops.server',
                credentials: [
                  {
                    personalAccessToken: 'pat',
                  },
                ],
              },
            ]);

            const credentials = await provider.getCredentials({
              url: formatUrl({
                host: 'my.devops.server',
                organization: 'org1',
                project: 'project1',
              }),
            });

            expect(credentials).toBeDefined();
          });

          it('Should prefer organization credential when a credential with the same organization is specified', async () => {
            const provider = buildProvider([
              {
                host: 'my.devops.server',
                credentials: [
                  {
                    personalAccessToken: 'fallback-pat',
                  },
                  {
                    organizations: ['org1'],
                    personalAccessToken: 'org1-pat',
                  },
                ],
              },
            ]);

            const credentials = await provider.getCredentials({
              url: formatUrl({
                host: 'my.devops.server',
                organization: 'org1',
                project: 'project1',
              }),
            });

            expect(credentials).toMatchObject({
              token: 'org1-pat',
            });
          });

          it('Should fallback to host credential when no credential with the same organization is specified', async () => {
            const provider = buildProvider([
              {
                host: 'my.devops.server',
                credentials: [
                  {
                    personalAccessToken: 'fallback-pat',
                  },
                  {
                    organizations: ['org1'],
                    personalAccessToken: 'org1-pat',
                  },
                ],
              },
            ]);

            const credentials = await provider.getCredentials({
              url: formatUrl({
                host: 'my.devops.server',
                organization: 'org2',
                project: 'project1',
              }),
            });

            expect(credentials).toMatchObject({
              token: 'fallback-pat',
            });
          });

          it('Should return a undefined when no credential with the same host is specified', async () => {
            const provider = buildProvider([
              {
                host: 'my.devops.server',
                credentials: [
                  {
                    personalAccessToken: 'pat',
                  },
                ],
              },
            ]);

            const credentials = await provider.getCredentials({
              url: formatUrl({
                host: 'my.other.devops.server',
                organization: 'org1',
                project: 'project1',
              }),
            });

            expect(credentials).toBeUndefined();
          });
        });
      });
    });
  });
});
