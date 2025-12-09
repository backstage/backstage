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
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { CatalogClient } from './CatalogClient';
import {
  CATALOG_FILTER_EXISTS,
  GetEntitiesResponse,
  QueryEntitiesResponse,
} from './types/api';
import { DiscoveryApi } from './types/discovery';
import { GetLocations200ResponseInner } from './schema/openapi';

jest.mock('cross-fetch', () => ({
  __esModule: true,
  default: (...args: Parameters<typeof fetch>) => fetch(...args),
  Response: global.Response,
}));

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
        http.get(`${mockBaseUrl}/entities`, () => {
          return HttpResponse.json(defaultServiceResponse);
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
        http.get(`${mockBaseUrl}/entities`, ({ request }) => {
          const queryParams = new URL(request.url).searchParams;
          expect(queryParams.getAll('filter')).toEqual([
            'a=1,b=2,b=3,ö==',
            'a=2',
            'c',
          ]);
          return HttpResponse.json([]);
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
        http.get(`${mockBaseUrl}/entities`, ({ request }) => {
          const queryParams = new URL(request.url).searchParams;
          expect(queryParams.getAll('filter')).toEqual(['a=1,b=2,b=3,ö==,c']);
          return HttpResponse.json([]);
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

    it('builds search filters property even those with URL unsafe values', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation(() =>
          HttpResponse.json({ items: [], totalItems: 0 }),
        );

      server.use(http.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      const response = await client.queryEntities(
        {
          filter: [
            {
              '!@#$%': 't?i=1&a:2',
              '^&*(){}[]': ['t%^url*encoded2', 'url'],
            },
          ],
        },
        { token },
      );

      expect(response).toEqual({ items: [], totalItems: 0 });
      expect(mockedEndpoint).toHaveBeenCalledTimes(1);

      const queryParams = new URL(mockedEndpoint.mock.calls[0][0].request.url)
        .searchParams;
      expect(queryParams.getAll('filter')).toEqual([
        '!@#$%=t?i=1&a:2,^&*(){}[]=t%^url*encoded2,^&*(){}[]=url',
      ]);
    });

    it('builds entity field selectors properly', async () => {
      expect.assertions(2);

      server.use(
        http.get(`${mockBaseUrl}/entities`, ({ request }) => {
          const queryParams = new URL(request.url).searchParams;
          expect(queryParams.getAll('fields')).toEqual(['a.b,ö']);
          return HttpResponse.json([]);
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
        http.get(`${mockBaseUrl}/entities`, () => {
          return HttpResponse.json([{ apiVersion: '1' }, { apiVersion: '2' }]);
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
        http.get(`${mockBaseUrl}/entities`, ({ request }) => {
          expect(new URL(request.url).search).toBe(
            '?limit=2&offset=1&after=%3D',
          );
          return HttpResponse.json([]);
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
      const sortedEntities = [
        { apiVersion: '1', kind: 'Component', metadata: { name: 'b' } },
        { apiVersion: '1', kind: 'Component', metadata: { name: 'a' } },
      ];

      server.use(
        http.get(`${mockBaseUrl}/entities`, ({ request }) => {
          const queryParams = new URL(request.url).searchParams;
          expect(queryParams.getAll('order')).toEqual([
            'asc:kind',
            'desc:metadata.name',
          ]);
          return HttpResponse.json(sortedEntities);
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

      expect(response.items).toEqual(sortedEntities);
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
        http.post(`${mockBaseUrl}/entities/by-refs`, async ({ request }) => {
          expect(new URL(request.url).search).toBe(
            '?filter=kind%3DAPI%2Ckind%3DComponent',
          );
          await expect(request.json()).resolves.toEqual({
            entityRefs: ['k:n/a', 'k:n/b'],
            fields: ['a', 'b'],
          });
          return HttpResponse.json({ items: [entity, null] });
        }),
      );

      const response = await client.getEntitiesByRefs(
        {
          entityRefs: ['k:n/a', 'k:n/b'],
          fields: ['a', 'b'],
          filter: {
            kind: ['API', 'Component'],
          },
        },
        { token },
      );

      expect(response).toEqual({ items: [entity, undefined] });
    });
  });

  describe('queryEntities', () => {
    const defaultResponse: QueryEntitiesResponse = {
      items: [
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
      ],
      pageInfo: {
        nextCursor: 'next',
        prevCursor: 'prev',
      },
      totalItems: 10,
    };

    beforeEach(() => {
      server.use(
        http.get(`${mockBaseUrl}/entities/by-query`, () => {
          return HttpResponse.json(defaultResponse);
        }),
      );
    });

    it('should fetch entities from correct endpoint', async () => {
      const response = await client.queryEntities({}, { token });
      expect(response?.items).toEqual(defaultResponse.items);
      expect(response?.totalItems).toEqual(defaultResponse.totalItems);
      expect(response?.pageInfo.nextCursor).toBeDefined();
      expect(response?.pageInfo.prevCursor).toBeDefined();
    });

    it('builds multiple entity search filters properly', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation(() =>
          HttpResponse.json({ items: [], totalItems: 0 }),
        );

      server.use(http.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      const response = await client.queryEntities(
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

      expect(response).toEqual({ items: [], totalItems: 0 });
      expect(mockedEndpoint).toHaveBeenCalledTimes(1);

      const queryParams = new URL(mockedEndpoint.mock.calls[0][0].request.url)
        .searchParams;
      expect(queryParams.getAll('filter')).toEqual([
        'a=1,b=2,b=3,ö==',
        'a=2',
        'c',
      ]);
    });

    it('builds search filters property even those with URL unsafe values', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation(() =>
          HttpResponse.json({ items: [], totalItems: 0 }),
        );

      server.use(http.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      const response = await client.queryEntities(
        {
          filter: [
            {
              '!@#$%': 't?i=1&a:2',
              '^&*(){}[]': ['t%^url*encoded2', 'url'],
            },
          ],
        },
        { token },
      );

      expect(response).toEqual({ items: [], totalItems: 0 });
      expect(mockedEndpoint).toHaveBeenCalledTimes(1);
      const queryParams = new URL(mockedEndpoint.mock.calls[0][0].request.url)
        .searchParams;
      expect(queryParams.getAll('filter')).toEqual([
        '!@#$%=t?i=1&a:2,^&*(){}[]=t%^url*encoded2,^&*(){}[]=url',
      ]);
    });

    it('should send query params correctly on initial request', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation(() =>
          HttpResponse.json({ items: [], totalItems: 0 }),
        );

      server.use(http.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        fields: ['a', 'b'],
        limit: 100,
        fullTextFilter: {
          term: 'query',
        },
        orderFields: [
          { field: 'metadata.name', order: 'asc' },
          { field: 'metadata.uid', order: 'desc' },
        ],
      });

      const queryParams = new URL(mockedEndpoint.mock.calls[0][0].request.url)
        .searchParams;
      expect(queryParams.getAll('fields')).toEqual(['a,b']);
      expect(queryParams.getAll('limit')).toEqual(['100']);
      expect(queryParams.getAll('fullTextFilterTerm')).toEqual(['query']);
      expect(queryParams.getAll('orderField')).toEqual([
        'metadata.name,asc',
        'metadata.uid,desc',
      ]);
    });

    it('should ignore initial query params if cursor is passed', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation(() =>
          HttpResponse.json({ items: [], totalItems: 0 }),
        );

      server.use(http.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        fields: ['a', 'b'],
        limit: 100,
        fullTextFilter: {
          term: 'query',
        },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        cursor: 'cursor',
      });
      expect(new URL(mockedEndpoint.mock.calls[0][0].request.url).search).toBe(
        '?fields=a,b&limit=100&cursor=cursor',
      );
    });

    it('should return paginated functions if next and prev cursors are present', async () => {
      const mockedEndpoint = jest.fn().mockImplementation(() =>
        HttpResponse.json({
          items: [
            {
              apiVersion: 'v1',
              kind: 'CustomKind',
              metadata: {
                namespace: 'default',
                name: 'e1',
              },
            },
            {
              apiVersion: 'v1',
              kind: 'CustomKind',
              metadata: {
                namespace: 'default',
                name: 'e2',
              },
            },
          ],
          pageInfo: {
            nextCursor: 'nextcursor',
            prevCursor: 'prevcursor',
          },
          totalItems: 100,
        } as QueryEntitiesResponse),
      );

      server.use(http.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      const response = await client.queryEntities({
        limit: 2,
      });
      expect(new URL(mockedEndpoint.mock.calls[0][0].request.url).search).toBe(
        '?limit=2',
      );

      expect(response?.pageInfo.nextCursor).toBeDefined();
      expect(response?.pageInfo.prevCursor).toBeDefined();

      await client.queryEntities({ cursor: response!.pageInfo.nextCursor! });
      expect(new URL(mockedEndpoint.mock.calls[1][0].request.url).search).toBe(
        '?cursor=nextcursor',
      );

      await client.queryEntities({ cursor: response!.pageInfo.prevCursor! });
      expect(new URL(mockedEndpoint.mock.calls[2][0].request.url).search).toBe(
        '?cursor=prevcursor',
      );
    });

    it('should handle errors', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation(() => new HttpResponse(null, { status: 401 }));

      server.use(http.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await expect(() => client.queryEntities()).rejects.toThrow(
        /Request failed with 401 Unauthorized/,
      );
    });
  });

  describe('streamEntities', () => {
    const defaultResponse: QueryEntitiesResponse = {
      items: [
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
      ],
      pageInfo: {
        nextCursor: 'next',
        prevCursor: 'prev',
      },
      totalItems: 10,
    };

    beforeEach(() => {
      server.use(
        http.get(`${mockBaseUrl}/entities/by-query`, ({ request }) => {
          const cursor = new URL(request.url).searchParams.get('cursor');
          if (cursor === 'next') {
            return HttpResponse.json({
              items: [],
              pageInfo: {},
              totalItems: 0,
            });
          }
          return HttpResponse.json(defaultResponse);
        }),
      );
    });

    it('should stream entities', async () => {
      const stream = client.streamEntities({}, { token });
      const results: Entity[][] = [];
      for await (const entityPage of stream) {
        results.push(entityPage);
      }
      expect(results).toEqual([defaultResponse.items, []]);
    });

    it('should handle errors', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation(() => new HttpResponse(null, { status: 401 }));

      server.use(http.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      const stream = client.streamEntities({}, { token });
      await expect(async () => {
        const results = [];
        for await (const entity of stream) {
          results.push(entity);
        }
      }).rejects.toThrow(/Request failed with 401 Unauthorized/);
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
        http.get(
          `${mockBaseUrl}/entities/by-name/customkind/default/exists`,
          () => {
            return HttpResponse.json(existingEntity);
          },
        ),
        http.get(
          `${mockBaseUrl}/entities/by-name/customkind/default/missing`,
          () => {
            return new HttpResponse(null, { status: 404 });
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

  describe('getLocations', () => {
    const defaultResponse = [
      {
        data: {
          id: '42',
          type: 'url',
          target: 'https://example.com',
        },
      },
      {
        data: {
          id: '43',
          type: 'url',
          target: 'https://example.com',
        },
      },
    ] satisfies GetLocations200ResponseInner[];

    beforeEach(() => {
      server.use(
        http.get(`${mockBaseUrl}/locations`, () => {
          return HttpResponse.json(defaultResponse);
        }),
      );
    });

    it('should return locations from correct endpoint', async () => {
      const response = await client.getLocations({}, { token });
      expect(response).toEqual({
        items: [
          {
            id: '42',
            type: 'url',
            target: 'https://example.com',
          },
          {
            id: '43',
            type: 'url',
            target: 'https://example.com',
          },
        ],
      });
    });

    it('should return empty list with empty result', async () => {
      server.use(
        http.get(`${mockBaseUrl}/locations`, () => {
          return HttpResponse.json([]);
        }),
      );

      const response = await client.getLocations({}, { token });
      expect(response).toEqual({ items: [] });
    });

    it('should forward token', async () => {
      expect.assertions(1);

      server.use(
        http.get(`${mockBaseUrl}/locations`, ({ request }) => {
          expect(request.headers.get('authorization')).toBe(`Bearer ${token}`);
          return HttpResponse.json(defaultResponse);
        }),
      );

      await client.getLocations({}, { token });
    });

    it('should not forward token if omitted', async () => {
      expect.assertions(1);

      server.use(
        http.get(`${mockBaseUrl}/locations`, ({ request }) => {
          expect(request.headers.get('authorization')).toBeNull();
          return HttpResponse.json(defaultResponse);
        }),
      );

      await client.getLocations();
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
        http.get(`${mockBaseUrl}/locations/42`, () => {
          return HttpResponse.json(defaultResponse);
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
        http.get(`${mockBaseUrl}/locations/42`, ({ request }) => {
          expect(request.headers.get('authorization')).toBe(`Bearer ${token}`);
          return HttpResponse.json(defaultResponse);
        }),
      );

      await client.getLocationById('42', { token });
    });

    it('skips authorization header if token is omitted', async () => {
      expect.assertions(1);

      server.use(
        http.get(`${mockBaseUrl}/locations/42`, ({ request }) => {
          expect(request.headers.get('authorization')).toBeNull();
          return HttpResponse.json(defaultResponse);
        }),
      );

      await client.getLocationById('42');
    });
  });

  describe('getLocationByEntity', () => {
    const defaultResponse = {
      data: {
        kind: 'c',
        namespace: 'ns',
        name: 'n',
      },
    };

    beforeEach(() => {
      server.use(
        http.get(`${mockBaseUrl}/locations/by-entity/c/ns/n`, () => {
          return HttpResponse.json(defaultResponse);
        }),
      );
    });

    it('should locations from correct endpoint', async () => {
      const response = await client.getLocationByEntity(
        { kind: 'c', namespace: 'ns', name: 'n' },
        { token },
      );
      expect(response).toEqual(defaultResponse);
    });

    it('forwards authorization token', async () => {
      expect.assertions(1);

      server.use(
        http.get(`${mockBaseUrl}/locations/by-entity/c/ns/n`, ({ request }) => {
          expect(request.headers.get('authorization')).toBe(`Bearer ${token}`);
          return HttpResponse.json(defaultResponse);
        }),
      );

      await client.getLocationByEntity(
        { kind: 'c', namespace: 'ns', name: 'n' },
        { token },
      );
    });

    it('skips authorization header if token is omitted', async () => {
      expect.assertions(1);

      server.use(
        http.get(`${mockBaseUrl}/locations/by-entity/c/ns/n`, ({ request }) => {
          expect(request.headers.get('authorization')).toBeNull();
          return HttpResponse.json(defaultResponse);
        }),
      );

      await client.getLocationByEntity({
        kind: 'c',
        namespace: 'ns',
        name: 'n',
      });
    });
  });

  describe('validateEntity', () => {
    it('returns valid false when validation fails', async () => {
      server.use(
        http.post(`${mockBaseUrl}/validate-entity`, () => {
          return HttpResponse.json(
            {
              errors: [
                {
                  message: 'Missing name',
                },
              ],
            },
            { status: 400 },
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
        http.post(`${mockBaseUrl}/validate-entity`, () => {
          return new HttpResponse('', { status: 200 });
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
        http.post(`${mockBaseUrl}/validate-entity`, () => {
          return HttpResponse.json({}, { status: 500 });
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
      ).rejects.toThrow(/Request failed with 500 Internal Server Error/);
    });
  });
});
