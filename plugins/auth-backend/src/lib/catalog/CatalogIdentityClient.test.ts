/*
 * Copyright 2020 Spotify AB
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

import { UserEntity } from '@backstage/catalog-model';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { CatalogIdentityClient } from './CatalogIdentityClient';
import { PluginEndpointDiscovery } from '@backstage/backend-common';

const server = setupServer();
const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
const discovery: PluginEndpointDiscovery = {
  async getBaseUrl(_pluginId) {
    return mockBaseUrl;
  },
  async getExternalBaseUrl(_pluginId) {
    return mockBaseUrl;
  },
};

describe('CatalogIdentityClient', () => {
  let client: CatalogIdentityClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    client = new CatalogIdentityClient({ discovery });
  });

  describe('findUser', () => {
    const defaultServiceResponse: UserEntity[] = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'Test1',
          namespace: 'test1',
          annotations: {
            key: 'value',
          },
        },
        spec: {
          memberOf: ['group1'],
        },
      },
    ];

    beforeEach(() => {
      server.use(
        rest.get(`${mockBaseUrl}/entities`, (_, res, ctx) => {
          return res(ctx.json(defaultServiceResponse));
        }),
      );
    });

    it('should entities from correct endpoint', async () => {
      const response = await client.findUser({ annotations: { key: 'value' } });
      expect(response).toEqual(defaultServiceResponse[0]);
    });

    it('builds entity search filters properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.url.search).toBe(
            '?filter=kind=user,metadata.annotations.key=value',
          );
          return res(ctx.json(defaultServiceResponse));
        }),
      );

      const response = await client.findUser({ annotations: { key: 'value' } });

      expect(response).toEqual(defaultServiceResponse[0]);
    });

    it('omits authorization header if not available', async () => {
      expect.assertions(1);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.headers.has('authorization')).toBe(false);
          return res(ctx.json([]));
        }),
      );

      client.findUser({ annotations: { key: 'value' } });
    });

    it('adds authorization header if available', async () => {
      expect.assertions(1);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.headers.get('authorization')).toEqual('hello');
          return res(ctx.json([]));
        }),
      );

      client.findUser(
        { annotations: { key: 'value' } },
        { headers: { authorization: 'hello' } },
      );
    });
  });
});
