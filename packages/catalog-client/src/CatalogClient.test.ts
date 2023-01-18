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

import { Entity } from '@backstage/catalog-model';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { CatalogClient } from './CatalogClient';
import { CATALOG_FILTER_EXISTS, GetEntitiesResponse } from './types/api';
import { DiscoveryApi } from './types/discovery';

const server = setupServer();
const token = 'fake-token';
const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
const discoveryApi: DiscoveryApi = {
  async getBaseUrl(_pluginId) {
    return mockBaseUrl;
  },
};

describe('CatalogClient', () => {
  let client: CatalogClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    client = new CatalogClient({ discoveryApi });
  });

  describe('getEntities', () => {
    const defaultServiceResponse: Entity[] = [
      {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'Test2',
          namespace: 'test1',
        },
      },
      {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'Test1',
          namespace: 'test1',
        },
      },
    ];
    const defaultResponse: GetEntitiesResponse = {
      items: defaultServiceResponse.reverse(),
    };

    beforeEach(() => {
      server.use(
        rest.get(`${mockBaseUrl}/entities`, (_, res, ctx) => {
          return res(ctx.json(defaultServiceResponse));
        }),
      );
    });

    it('should fetch entities from correct endpoint', async () => {
      const response = await client.getEntities({}, { token });
      expect(response).toEqual(defaultResponse);
    });

    it('builds multiple entity search filters properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.url.search).toBe(
            '?filter=a=1,b=2,b=3,%C3%B6=%3D&filter=a=2&filter=c',
          );
          return res(ctx.json([]));
        }),
      );

      const response = await client.getEntities(
        {
          filter: [
            {
              a: '1',
              b: ['2', '3'],
              ö: '=',
            },
            {
              a: '2',
            },
            {
              c: CATALOG_FILTER_EXISTS,
            },
          ],
        },
        { token },
      );

      expect(response.items).toEqual([]);
    });

    it('builds single entity search filter properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.url.search).toBe('?filter=a=1,b=2,b=3,%C3%B6=%3D,c');
          return res(ctx.json([]));
        }),
      );

      const response = await client.getEntities(
        {
          filter: {
            a: '1',
            b: ['2', '3'],
            ö: '=',
            c: CATALOG_FILTER_EXISTS,
          },
        },
        { token },
      );

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

      const response = await client.getEntities(
        {
          fields: ['a.b', 'ö'],
        },
        { token },
      );

      expect(response.items).toEqual([]);
    });

    it('handles field filtered entities', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/entities`, (_req, res, ctx) => {
          return res(ctx.json([{ apiVersion: '1' }, { apiVersion: '2' }]));
        }),
      );

      const response = await client.getEntities(
        {
          fields: ['apiVersion'],
        },
        { token },
      );

      expect(response.items).toEqual([
        { apiVersion: '1' },
        { apiVersion: '2' },
      ]);
    });

    it('builds paging parameters properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.url.search).toBe('?offset=1&limit=2&after=%3D');
          return res(ctx.json([]));
        }),
      );

      const response = await client.getEntities(
        { offset: 1, limit: 2, after: '=' },
        { token },
      );

      expect(response.items).toEqual([]);
    });

    it('handles ordering properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.url.search).toBe(
            '?order=asc:kind&order=desc:metadata.name',
          );
          return res(ctx.json([]));
        }),
      );

      const response = await client.getEntities(
        {
          order: [
            { field: 'kind', order: 'asc' },
            { field: 'metadata.name', order: 'desc' },
          ],
        },
        { token },
      );

      expect(response.items).toEqual([]);
    });
  });

  describe('getEntitiesByRefs', () => {
    it('encodes and decodes the query correctly', async () => {
      const entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'Test2',
          namespace: 'test1',
        },
      };
      server.use(
        rest.post(`${mockBaseUrl}/entities/by-refs`, async (req, res, ctx) => {
          await expect(req.json()).resolves.toEqual({
            entityRefs: ['k:n/a', 'k:n/b'],
            fields: ['a', 'b'],
          });
          return res(ctx.json({ items: [entity, null] }));
        }),
      );

      const response = await client.getEntitiesByRefs(
        { entityRefs: ['k:n/a', 'k:n/b'], fields: ['a', 'b'] },
        { token },
      );

      expect(response).toEqual({ items: [entity, null] });
    });
  });

  describe('getEntityByRef', () => {
    const existingEntity: Entity = {
      apiVersion: 'v1',
      kind: 'CustomKind',
      metadata: {
        namespace: 'default',
        name: 'exists',
      },
    };

    beforeEach(() => {
      server.use(
        rest.get(
          `${mockBaseUrl}/entities/by-name/customkind/default/exists`,
          (_, res, ctx) => {
            return res(ctx.json(existingEntity));
          },
        ),
        rest.get(
          `${mockBaseUrl}/entities/by-name/customkind/default/missing`,
          (_, res, ctx) => {
            return res(ctx.status(404));
          },
        ),
      );
    });

    it('finds by string and compound', async () => {
      await expect(
        client.getEntityByRef('customkind:default/exists'),
      ).resolves.toEqual(existingEntity);
      await expect(
        client.getEntityByRef({
          kind: 'CustomKind',
          namespace: 'default',
          name: 'exists',
        }),
      ).resolves.toEqual(existingEntity);
    });

    it('returns undefined for 404s', async () => {
      await expect(
        client.getEntityByRef('customkind:default/missing'),
      ).resolves.toBeUndefined();
      await expect(
        client.getEntityByRef({
          kind: 'CustomKind',
          namespace: 'default',
          name: 'missing',
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe('getLocationById', () => {
    const defaultResponse = {
      data: {
        id: '42',
      },
    };

    beforeEach(() => {
      server.use(
        rest.get(`${mockBaseUrl}/locations/42`, (_, res, ctx) => {
          return res(ctx.json(defaultResponse));
        }),
      );
    });

    it('should locations from correct endpoint', async () => {
      const response = await client.getLocationById('42', { token });
      expect(response).toEqual(defaultResponse);
    });

    it('forwards authorization token', async () => {
      expect.assertions(1);

      server.use(
        rest.get(`${mockBaseUrl}/locations/42`, (req, res, ctx) => {
          expect(req.headers.get('authorization')).toBe(`Bearer ${token}`);
          return res(ctx.json(defaultResponse));
        }),
      );

      await client.getLocationById('42', { token });
    });

    it('skips authorization header if token is omitted', async () => {
      expect.assertions(1);

      server.use(
        rest.get(`${mockBaseUrl}/locations/42`, (req, res, ctx) => {
          expect(req.headers.get('authorization')).toBeNull();
          return res(ctx.json(defaultResponse));
        }),
      );

      await client.getLocationById('42');
    });
  });

  describe('validateEntity', () => {
    it('returns valid false when validation fails', async () => {
      server.use(
        rest.post(`${mockBaseUrl}/validate-entity`, (_req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              errors: [
                {
                  message: 'Missing name',
                },
              ],
            }),
          );
        }),
      );

      expect(
        await client.validateEntity(
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: '',
            },
          },
          'url:http://example.com',
        ),
      ).toMatchObject({
        valid: false,
        errors: [
          {
            message: 'Missing name',
          },
        ],
      });
    });

    it('returns valid true when validation fails', async () => {
      server.use(
        rest.post(`${mockBaseUrl}/validate-entity`, (_req, res, ctx) => {
          return res(ctx.status(200), ctx.text(''));
        }),
      );

      expect(
        await client.validateEntity(
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: 'good',
            },
          },
          'url:http://example.com',
        ),
      ).toMatchObject({
        valid: true,
      });
    });

    it('throws unexpected error', async () => {
      server.use(
        rest.post(`${mockBaseUrl}/validate-entity`, (_req, res, ctx) => {
          return res(ctx.status(500), ctx.json({}));
        }),
      );

      await expect(() =>
        client.validateEntity(
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: 'good',
            },
          },
          'url:http://example.com',
        ),
      ).rejects.toThrow(/Request failed with 500 Error/);
    });
  });
});
