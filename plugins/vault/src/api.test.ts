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

import { setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { VaultSecret, VaultClient } from './api';
import { UrlPatternDiscovery } from '@backstage/core-app-api';

describe('api', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'https://api-vault.com/api/vault';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);

  const mockSecretsResult: VaultSecret[] = [
    {
      name: 'secret::one',
      editUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/edit/test/success/secret::one`,
      showUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/show/test/success/secret::one`,
    },
    {
      name: 'secret::two',
      editUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/edit/test/success/secret::two`,
      showUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/show/test/success/secret::two`,
    },
  ];

  const setupHandlers = () => {
    server.use(
      rest.get(`${mockBaseUrl}/v1/secrets/:path`, (req, res, ctx) => {
        const { path } = req.params;
        if (path === 'test/success') {
          return res(ctx.json(mockSecretsResult));
        } else if (path === 'test/error') {
          return res(ctx.json([]));
        }
        return res(ctx.status(400));
      }),
    );
  };

  it('should return secrets', async () => {
    setupHandlers();
    const api = new VaultClient({ discoveryApi });
    const secrets = await api.listSecrets('test/success');
    expect(secrets).toEqual(mockSecretsResult);
  });

  it('should return empty secret list', async () => {
    setupHandlers();
    const api = new VaultClient({ discoveryApi });
    expect(await api.listSecrets('test/error')).toEqual([]);
    expect(await api.listSecrets('')).toEqual([]);
  });

  it('should return no secrets', async () => {
    setupHandlers();
    const api = new VaultClient({ discoveryApi });
    const secrets = await api.listSecrets('');
    expect(secrets).toEqual([]);
  });
});
