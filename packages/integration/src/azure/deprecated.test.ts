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
import { getAzureRequestOptions } from './deprecated';
import { DateTime } from 'luxon';
import {
  AccessToken,
  ClientSecretCredential,
  ManagedIdentityCredential,
} from '@azure/identity';

jest.mock('@azure/identity');

const MockedClientSecretCredential = ClientSecretCredential as jest.MockedClass<
  typeof ClientSecretCredential
>;

const MockedManagedIdentityCredential =
  ManagedIdentityCredential as jest.MockedClass<
    typeof ManagedIdentityCredential
  >;

describe('azure core', () => {
  beforeEach(() => {
    jest.resetAllMocks();

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
  });

  describe('getAzureRequestOptions', () => {
    it('should not add authorization header when not using token or credential', async () => {
      expect(
        await getAzureRequestOptions({ host: '', apiVersion: '' }),
      ).toEqual(
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.anything(),
          }),
        }),
      );
    });

    it('should add authorization header when using a personal access token', async () => {
      const pat = '0123456789';
      const encoded = Buffer.from(`:${pat}`).toString('base64');
      expect(
        await getAzureRequestOptions({
          host: '',
          apiVersion: '',
          credentials: [
            {
              kind: 'PersonalAccessToken',
              personalAccessToken: pat,
            },
          ],
        }),
      ).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Basic ${encoded}`,
          }),
        }),
      );
    });

    it('should add authorization header when using a client secret', async () => {
      expect(
        await getAzureRequestOptions({
          host: '',
          apiVersion: '',
          credentials: [
            {
              kind: 'ClientSecret',
              clientId: 'fake-id',
              clientSecret: 'fake-secret',
              tenantId: 'fake-tenant',
            },
          ],
        }),
      ).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-client-secret-token',
          }),
        }),
      );
    });

    it('should add authorization header when using a managed identity', async () => {
      expect(
        await getAzureRequestOptions({
          host: '',
          apiVersion: '',
          credentials: [
            {
              kind: 'ManagedIdentity',
              clientId: 'fake-id',
            },
          ],
        }),
      ).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-managed-identity-token',
          }),
        }),
      );
    });
  });
});
