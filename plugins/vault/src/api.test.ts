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

import { MockFetchApi, setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { VaultSecret, VaultClient } from './api';
import { UrlPatternDiscovery } from '@backstage/core-app-api';

describe('api', () => {
  let api: VaultClient;
  let fetchApiSpy: jest.SpyInstance<Promise<Response>>;

  const server = setupServer();
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'https://api-vault.com/api/vault';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  const fetchApi = new MockFetchApi();

  const mockSecretsResult: { items: VaultSecret[] } = {
    items: [
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
    ],
  };

  const setupHandlers = () => {
    server.use(
      rest.get(`${mockBaseUrl}/v1/secrets/:path`, (req, res, ctx) => {
        const { path } = req.params;
        if (path === 'test/success') {
          return res(ctx.json(mockSecretsResult));
        } else if (path === 'test/empty') {
          return res(ctx.json({ items: [] }));
        } else if (path === 'test/not-found') {
          return res(ctx.status(404));
        }
        return res(ctx.status(400));
      }),
      rest.get(`${mockBaseUrl}/v1/secrets/`, (_req, res, ctx) => {
        return res(ctx.json(mockSecretsResult));
      }),
    );
  };

  beforeEach(() => {
    setupHandlers();

    api = new VaultClient({ discoveryApi, fetchApi });
    fetchApiSpy = jest.spyOn(fetchApi, 'fetch');
  });

  it('should return secrets', async () => {
    expect(await api.listSecrets('test/success')).toEqual(
      mockSecretsResult.items,
    );
    expect(fetchApiSpy).toHaveBeenCalledWith(
      `${mockBaseUrl}/v1/secrets/test%2Fsuccess?`,
      expect.anything(),
    );
  });

  it('should return secrets with custom engine', async () => {
    expect(
      await api.listSecrets('test/success', { secretEngine: 'kv' }),
    ).toEqual(mockSecretsResult.items);
    expect(fetchApiSpy).toHaveBeenCalledWith(
      `${mockBaseUrl}/v1/secrets/test%2Fsuccess?engine=kv`,
      expect.anything(),
    );
  });

  it('should return empty secret list', async () => {
    expect(await api.listSecrets('test/empty')).toEqual([]);
  });

  it('should return all the secrets if no path defined', async () => {
    expect(await api.listSecrets('')).toEqual(mockSecretsResult.items);
  });

  it('should throw an error if the Vault API responds with an HTTP 404', async () => {
    await expect(api.listSecrets('test/not-found')).rejects.toThrow(
      "No secrets found in path 'v1/secrets/test%2Fnot-found'",
    );
  });

  it('should throw an error if the Vault API responds with a non-successful HTTP status code', async () => {
    await expect(api.listSecrets('test/error')).rejects.toThrow(
      'Request failed with 400 Bad Request',
    );
  });
});
