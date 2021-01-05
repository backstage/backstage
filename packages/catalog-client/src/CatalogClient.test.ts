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

import { Entity } from '@backstage/catalog-model';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { CatalogClient } from './CatalogClient';
import { CatalogListResponse, DiscoveryApi, IdentityApi } from './types';

const server = setupServer();
const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
const discoveryApi: DiscoveryApi = {
  async getBaseUrl(_pluginId) {
    return mockBaseUrl;
  },
};
const identityApi: IdentityApi = {
  getUserId() {
    return 'jane-fonda';
  },
  getProfile() {
    return { email: 'jane-fonda@spotify.com' };
  },
  async getIdToken() {
    return Promise.resolve('fake-id-token');
  },
  async signOut() {
    return Promise.resolve();
  },
};

describe('CatalogClient', () => {
  let client: CatalogClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    client = new CatalogClient({ discoveryApi, identityApi });
  });

  describe('getEntities', () => {
    const defaultServiceResponse: Entity[] = [
      {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'Test1',
          namespace: 'test1',
        },
      },
      {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'Test2',
          namespace: 'test1',
        },
      },
    ];
    const defaultResponse: CatalogListResponse<Entity> = {
      items: defaultServiceResponse,
    };

    beforeEach(() => {
      server.use(
        rest.get(`${mockBaseUrl}/entities`, (_, res, ctx) => {
          return res(ctx.json(defaultServiceResponse));
        }),
      );
    });

    it('should entities from correct endpoint', async () => {
      const response = await client.getEntities();
      expect(response).toEqual(defaultResponse);
    });

    it('builds entity search filters properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.url.search).toBe('?filter=a=1,b=2,b=3,%C3%B6=%3D');
          return res(ctx.json([]));
        }),
      );

      const response = await client.getEntities({
        filter: {
          a: '1',
          b: ['2', '3'],
          ö: '=',
        },
      });

      expect(response.items).toEqual([]);
    });

    it('builds entity field selectors properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.url.search).toBe('?fields=a.b,%C3%B6');
          return res(ctx.json([]));
        }),
      );

      const response = await client.getEntities({
        fields: ['a.b', 'ö'],
      });

      expect(response.items).toEqual([]);
    });
  });
});
