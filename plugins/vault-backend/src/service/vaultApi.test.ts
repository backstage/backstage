/*
 * Copyright 2020 The Backstage Authors
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

import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { VaultSecret, VaultClient, VaultSecretList } from './vaultApi';
import { ConfigReader } from '@backstage/config';

describe('VaultApi', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'https://api-vault.com';
  const config = new ConfigReader({
    vault: {
      baseUrl: mockBaseUrl,
      token: '1234567890',
    },
  });
  const subkeysConfig = new ConfigReader({
    vault: {
      baseUrl: mockBaseUrl,
      token: '1234567890',
      listType: 'subkeys',
    },
  });
  const approleConfig = new ConfigReader({
    vault: {
      baseUrl: mockBaseUrl,
      token: 'none',
      authMethod: 'approle',
      authRoleId: 'abcdefghijklm',
      authSecretId: 'nopqrstuvwxyz',
    },
  });

  const mockListResult: VaultSecretList = {
    data: {
      keys: ['secret::one', 'secret::two'],
      subkeys: {},
    },
  };
  const mockListResultEmpty: VaultSecretList = {
    data: {
      keys: [],
      subkeys: {},
    },
  };

  const mockSecretsResult: VaultSecret[] = [
    {
      name: 'secret::one',
      path: 'test/success',
      editUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/edit/test/success/secret::one`,
      showUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/show/test/success/secret::one`,
    },
    {
      name: 'secret::two',
      path: 'test/success',
      editUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/edit/test/success/secret::two`,
      showUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/show/test/success/secret::two`,
    },
  ];

  const mockListSubkeysResult: VaultSecretList = {
    data: {
      keys: [],
      subkeys: {
        subkey_one: null,
        subkey_two: null,
      },
    },
  };
  const mockSecretsSubkeysResult: VaultSecret[] = [
    {
      name: 'subkey_one',
      path: 'test/success/', // NOTE: The trailing slash fixes wrong UI display behavior
      editUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/edit/test/success`,
      showUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/show/test/success`,
    },
    {
      name: 'subkey_two',
      path: 'test/success/', // NOTE: The trailing slash fixes wrong UI display behavior
      editUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/edit/test/success`,
      showUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/show/test/success`,
    },
  ];

  const setupHandlers = () => {
    server.use(
      rest.get(
        `${mockBaseUrl}/v1/secrets/metadata/test/success`,
        (_, res, ctx) => {
          return res(ctx.json(mockListResult));
        },
      ),
      rest.get(
        `${mockBaseUrl}/v1/secrets/metadata/test/error`,
        (_, res, ctx) => {
          return res(ctx.json(mockListResultEmpty));
        },
      ),
      rest.get(
        `${mockBaseUrl}/v1/secrets/subkeys/test/success`,
        (_, res, ctx) => {
          return res(ctx.json(mockListSubkeysResult));
        },
      ),
      rest.get(
        `${mockBaseUrl}/v1/secrets/subkeys/test/error`,
        (_, res, ctx) => {
          return res(ctx.json(mockListResultEmpty));
        },
      ),
      rest.post(`${mockBaseUrl}/v1/auth/token/renew-self`, (_, res, ctx) => {
        return res(ctx.json({ auth: { client_token: '0987654321' } }));
      }),
      rest.post(`${mockBaseUrl}/v1/auth/approle/login`, (_, res, ctx) => {
        return res(ctx.json({ auth: { client_token: '0123456789abcdef' } }));
      }),
    );
  };

  it('should return secrets for metadata list type', async () => {
    setupHandlers();
    const api = new VaultClient({ config });
    const secrets = await api.listSecrets('test/success');
    expect(secrets).toEqual(mockSecretsResult);
  });

  it('should return empty secret list for metadata list type', async () => {
    setupHandlers();
    const api = new VaultClient({ config });
    const secrets = await api.listSecrets('test/error');
    expect(secrets).toEqual([]);
  });

  it('should return secrets for subkeys list type', async () => {
    setupHandlers();
    const api = new VaultClient({ config: subkeysConfig });
    const secrets = await api.listSecrets('test/success');
    expect(secrets).toEqual(mockSecretsSubkeysResult);
  });

  it('should return empty secret list for subkeys list type', async () => {
    setupHandlers();
    const api = new VaultClient({ config: subkeysConfig });
    const secrets = await api.listSecrets('test/error');
    expect(secrets).toEqual([]);
  });

  it('should return success token renew for token auth method', async () => {
    setupHandlers();
    const api = new VaultClient({ config });
    expect(await api.renewToken()).toBe(undefined);
  });

  it('should return success token renew for approle auth method', async () => {
    setupHandlers();
    const api = new VaultClient({ config: approleConfig });
    expect(await api.renewToken()).toBe(undefined);
  });

  it('should render frontend url', () => {
    const api = new VaultClient({ config });
    const url = api.getFrontendSecretsUrl();
    expect(url).toEqual(`${mockBaseUrl}/ui/vault/secrets/secrets`);
  });
});
