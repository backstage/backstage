/*
 * Copyright 2025 The Backstage Authors
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
import { ManagedIdentityClientAssertion } from './ManagedIdentityClientAssertion';
import { ManagedIdentityCredential, AccessToken } from '@azure/identity';

const seconds = (s: number) => s * 1000;
const minutes = (m: number) => seconds(60) * m;
const hours = (h: number) => minutes(60) * h;
const MockedManagedIdentityCredential =
  ManagedIdentityCredential as jest.MockedClass<
    typeof ManagedIdentityCredential
  >;

jest.mock('@azure/identity');

describe('ManagedIdentityClientAssertion', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    MockedManagedIdentityCredential.prototype.getToken.mockImplementation(() =>
      Promise.resolve({
        expiresOnTimestamp: Date.now() + hours(8),
        token: 'fake-managed-identity-token',
      } as AccessToken),
    );
  });

  it('Should return a cached token if it does not expire within 5 minutes', async () => {
    const clientAssertion = new ManagedIdentityClientAssertion({
      clientId: 'clientId',
    });

    // First call to getToken to cache the token
    await clientAssertion.getSignedAssertion();
    // Second call should return the cached token
    const token = await clientAssertion.getSignedAssertion();

    expect(token).toBe('fake-managed-identity-token');
    expect(
      MockedManagedIdentityCredential.prototype.getToken,
    ).toHaveBeenCalledTimes(1);
  });

  it('Should obtain a new token if the cached token expires within 5 minutes', async () => {
    const clientAssertion = new ManagedIdentityClientAssertion({
      clientId: 'clientId',
    });

    MockedManagedIdentityCredential.prototype.getToken.mockImplementationOnce(
      () =>
        Promise.resolve({
          expiresOnTimestamp: Date.now() + minutes(4),
          token: 'expiring-soon-token',
        } as AccessToken),
    );

    // First call to getToken to cache the expiring token
    await clientAssertion.getSignedAssertion();

    MockedManagedIdentityCredential.prototype.getToken.mockImplementationOnce(
      () =>
        Promise.resolve({
          expiresOnTimestamp: Date.now() + hours(8),
          token: 'new-managed-identity-token',
        } as AccessToken),
    );

    // Second call should obtain a new token
    const token = await clientAssertion.getSignedAssertion();

    expect(token).toBe('new-managed-identity-token');
    expect(
      MockedManagedIdentityCredential.prototype.getToken,
    ).toHaveBeenCalledTimes(2);
  });

  it('Should obtain a new token if no token is cached', async () => {
    const clientAssertion = new ManagedIdentityClientAssertion({
      clientId: 'clientId',
    });

    const token = await clientAssertion.getSignedAssertion();

    expect(token).toBe('fake-managed-identity-token');
    expect(
      MockedManagedIdentityCredential.prototype.getToken,
    ).toHaveBeenCalledTimes(1);
  });

  it('Should request a token for the correct scope', async () => {
    const clientAssertion = new ManagedIdentityClientAssertion({
      clientId: 'clientId',
    });

    await clientAssertion.getSignedAssertion();

    expect(
      MockedManagedIdentityCredential.prototype.getToken,
    ).toHaveBeenCalledWith('api://AzureADTokenExchange');
  });

  it('Should handle system-assigned managed identity', async () => {
    const clientAssertion = new ManagedIdentityClientAssertion();

    await clientAssertion.getSignedAssertion();

    expect(
      MockedManagedIdentityCredential.prototype.getToken,
    ).toHaveBeenCalledWith('api://AzureADTokenExchange');
  });
});
