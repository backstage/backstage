/*
 * Copyright 2024 The Backstage Authors
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
  AccessToken,
  ClientSecretCredential,
  DefaultAzureCredential,
} from '@azure/identity';
import { ScmIntegrationRegistry } from '../registry';
import { ConfigReader } from '@backstage/config';
import { DefaultAzureCredentialsManager } from './DefaultAzureCredentialsProvider';
import { ScmIntegrations } from '../ScmIntegrations';
import { DateTime } from 'luxon';

const MockedClientSecretCredential = ClientSecretCredential as jest.MockedClass<
  typeof ClientSecretCredential
>;

jest.mock('@azure/identity');

describe('DefaultAzureCredentialsManager', () => {
  let mockIntegration: ScmIntegrationRegistry;

  const buildProvider = (azureIntegrations: any[]) =>
    DefaultAzureCredentialsManager.fromIntegrations(
      ScmIntegrations.fromConfig(
        new ConfigReader({
          integrations: {
            azureBlobStorage: azureIntegrations,
          },
        }),
      ),
    );

  beforeEach(() => {
    mockIntegration = {
      azureBlobStorage: {
        list: jest.fn().mockReturnValue([
          {
            config: {
              accountName: 'testaccount',
              aadCredential: {
                clientId: 'someClientId',
                tenantId: 'someTenantId',
                clientSecret: 'someClientSecret',
              },
            },
          },
        ]),
      },
    } as unknown as ScmIntegrationRegistry;

    MockedClientSecretCredential.prototype.getToken.mockImplementation(() =>
      Promise.resolve({
        expiresOnTimestamp: DateTime.local().plus({ days: 1 }).toSeconds(),
        token: 'fake-client-secret-token',
      } as AccessToken),
    );
  });

  it('should create an instance from ScmIntegrationRegistry', () => {
    const manager =
      DefaultAzureCredentialsManager.fromIntegrations(mockIntegration);
    expect(manager).toBeInstanceOf(DefaultAzureCredentialsManager);
  });

  it('should return cached credentials if available', async () => {
    const manager = buildProvider([
      {
        accountName: 'testaccount',
        aadCredential: {
          clientId: 'someClientId',
          tenantId: 'someTenantId',
          clientSecret: 'someClientSecret',
        },
      },
    ]);

    const mockCredential = new MockedClientSecretCredential(
      'someTenantId',
      'someClientId',
      'someClientSecret',
    );

    const credential = await manager.getCredentials('testaccount');

    const scopes = ['https://storage.azure.com/.default'];

    const expectedToken = await mockCredential.getToken(scopes);
    const receivedToken = await credential.getToken(scopes);

    expect(receivedToken?.token).toEqual(expectedToken.token);
  });

  it('should use Azure AD credentials if aadCredential is provided', async () => {
    const manager = buildProvider([
      {
        accountName: 'testaccount',
        aadCredential: {
          clientId: 'someClientId',
          tenantId: 'someTenantId',
          clientSecret: 'someClientSecret',
        },
      },
    ]);

    const credential = await manager.getCredentials('testaccount');

    expect(credential).toBeInstanceOf(ClientSecretCredential);
  });

  it('should use DefaultAzureCredential if no aadCredential is provided', async () => {
    const manager = buildProvider([
      {
        accountName: 'testaccount',
      },
    ]);

    const credential = await manager.getCredentials('testaccount');

    expect(credential).toBeInstanceOf(DefaultAzureCredential);
  });

  it('should cache credentials after first retrieval', async () => {
    const manager = buildProvider([
      {
        accountName: 'testaccount',
      },
    ]);

    const credential = await manager.getCredentials('testaccount');

    const cachedCredential = await manager.getCredentials('testaccount');
    expect(cachedCredential).toBe(credential);
  });
});
