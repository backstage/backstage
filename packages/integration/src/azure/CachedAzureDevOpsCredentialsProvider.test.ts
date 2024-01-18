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
import { CachedAzureDevOpsCredentialsProvider } from './CachedAzureDevOpsCredentialsProvider';
import {
  AccessToken,
  ClientSecretCredential,
  ManagedIdentityCredential,
} from '@azure/identity';

const MockedClientSecretCredential = ClientSecretCredential as jest.MockedClass<
  typeof ClientSecretCredential
>;

const MockedManagedIdentityCredential =
  ManagedIdentityCredential as jest.MockedClass<
    typeof ManagedIdentityCredential
  >;

jest.mock('@azure/identity');

const seconds = (s: number) => s * 1000;
const minutes = (m: number) => seconds(60) * m;
const hours = (h: number) => minutes(60) * h;

describe('CachedAzureDevOpsCredentialsProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    MockedClientSecretCredential.prototype.getToken.mockImplementation(() =>
      Promise.resolve({
        expiresOnTimestamp: Date.now() + hours(8),
        token: 'fake-client-secret-token',
      } as AccessToken),
    );

    MockedManagedIdentityCredential.prototype.getToken.mockImplementation(() =>
      Promise.resolve({
        expiresOnTimestamp: Date.now() + hours(8),
        token: 'fake-managed-identity-token',
      } as AccessToken),
    );
  });

  it('Should return a pat credential when a personal access token is configured', async () => {
    const manager =
      CachedAzureDevOpsCredentialsProvider.fromAzureDevOpsCredential({
        kind: 'PersonalAccessToken',
        personalAccessToken: 'token',
      });
    const { headers, type, token } = await manager.getCredentials();

    expect(headers).toStrictEqual({
      Authorization: `Basic ${btoa(`:${token}`)}`,
    });

    expect(type).toBe('pat');
    expect(token).toBe('token');
  });

  it('Should return a bearer credential when a client secret is configured', async () => {
    const manager =
      CachedAzureDevOpsCredentialsProvider.fromAzureDevOpsCredential({
        kind: 'ClientSecret',
        clientId: 'id',
        clientSecret: 'secret',
        tenantId: 'tenantId',
      });

    const { headers, type, token } = await manager.getCredentials();

    expect(headers).toStrictEqual({
      Authorization: `Bearer fake-client-secret-token`,
    });

    expect(type).toBe('bearer');
    expect(token).toBe('fake-client-secret-token');
  });

  it('Should return a bearer credential when a managed identity is configured', async () => {
    const manager =
      CachedAzureDevOpsCredentialsProvider.fromAzureDevOpsCredential({
        kind: 'ManagedIdentity',
        clientId: 'id',
      });

    const { headers, type, token } = await manager.getCredentials();

    expect(headers).toStrictEqual({
      Authorization: `Bearer fake-managed-identity-token`,
    });

    expect(type).toBe('bearer');
    expect(token).toBe('fake-managed-identity-token');
  });

  it('Should not refresh the client secret token when it does not expire within 10 minutes', async () => {
    const manager =
      CachedAzureDevOpsCredentialsProvider.fromAzureDevOpsCredential({
        kind: 'ClientSecret',
        clientId: 'id',
        clientSecret: 'secret',
        tenantId: 'tenantId',
      });

    await manager.getCredentials();
    await manager.getCredentials();
    await manager.getCredentials();

    expect(
      MockedClientSecretCredential.prototype.getToken,
    ).toHaveBeenCalledTimes(1);
  });

  it('Should return the managed identity token when it does not expire within 10 minutes', async () => {
    const manager =
      CachedAzureDevOpsCredentialsProvider.fromAzureDevOpsCredential({
        kind: 'ManagedIdentity',
        clientId: 'id',
      });

    await manager.getCredentials();
    await manager.getCredentials();
    await manager.getCredentials();

    expect(
      MockedManagedIdentityCredential.prototype.getToken,
    ).toHaveBeenCalledTimes(1);
  });

  it('Should refresh the client secret token when it expires within 10 minutes', async () => {
    const manager =
      CachedAzureDevOpsCredentialsProvider.fromAzureDevOpsCredential({
        kind: 'ClientSecret',
        clientId: 'id',
        clientSecret: 'secret',
        tenantId: 'tenantId',
      });

    MockedClientSecretCredential.prototype.getToken.mockImplementation(() =>
      Promise.resolve({
        expiresOnTimestamp: Date.now() + minutes(9) + seconds(59),
        token: 'fake-client-secret-token',
      } as AccessToken),
    );

    await manager.getCredentials();
    await manager.getCredentials();

    expect(
      MockedClientSecretCredential.prototype.getToken,
    ).toHaveBeenCalledTimes(2);
  });

  it('Should refresh the managed identity token when it expires within 10 minutes', async () => {
    const manager =
      CachedAzureDevOpsCredentialsProvider.fromAzureDevOpsCredential({
        kind: 'ManagedIdentity',
        clientId: 'id',
      });

    MockedManagedIdentityCredential.prototype.getToken.mockImplementation(() =>
      Promise.resolve({
        expiresOnTimestamp: Date.now() + minutes(9) + seconds(59),
        token: 'fake-managed-identity-token',
      } as AccessToken),
    );

    await manager.getCredentials();
    await manager.getCredentials();

    expect(
      MockedManagedIdentityCredential.prototype.getToken,
    ).toHaveBeenCalledTimes(2);
  });
});
