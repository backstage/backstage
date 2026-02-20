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
import {
  CATALOG_FILTER_EXISTS,
  GetEntitiesResponse,
  QueryEntitiesResponse,
} from './types/api';
import { DiscoveryApi } from './types/discovery';
import { GetLocations200ResponseInner } from './schema/openapi';

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
          const queryParams = new URLSearchParams(req.url.search);
          expect(queryParams.getAll('filter')).toEqual([
            'a=1,b=2,b=3,ö==',
            'a=2',
            'c',
          ]);
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
          const queryParams = new URLSearchParams(req.url.search);
          expect(queryParams.getAll('filter')).toEqual(['a=1,b=2,b=3,ö==,c']);
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

    it('builds search filters property even those with URL unsafe values', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation((_req, res, ctx) =>
          res(ctx.json({ items: [], totalItems: 0 })),
        );

      server.use(rest.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

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

      const queryParams = new URLSearchParams(
        mockedEndpoint.mock.calls[0][0].url.search,
      );
      expect(queryParams.getAll('filter')).toEqual([
        '!@#$%=t?i=1&a:2,^&*(){}[]=t%^url*encoded2,^&*(){}[]=url',
      ]);
    });

    it('builds entity field selectors properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          const queryParams = new URLSearchParams(req.url.search);
          expect(queryParams.getAll('fields')).toEqual(['a.b,ö']);
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
          expect(req.url.search).toBe('?limit=2&offset=1&after=%3D');
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
      const sortedEntities = [
        { apiVersion: '1', kind: 'Component', metadata: { name: 'b' } },
        { apiVersion: '1', kind: 'Component', metadata: { name: 'a' } },
      ];

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          const queryParams = new URLSearchParams(req.url.search);
          expect(queryParams.getAll('order')).toEqual([
            'asc:kind',
            'desc:metadata.name',
          ]);
          return res(ctx.json(sortedEntities));
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
        rest.post(`${mockBaseUrl}/entities/by-refs`, async (req, res, ctx) => {
          expect(req.url.search).toBe('?filter=kind%3DAPI%2Ckind%3DComponent');
          await expect(req.json()).resolves.toEqual({
            entityRefs: ['k:n/a', 'k:n/b'],
            fields: ['a', 'b'],
          });
          return res(ctx.json({ items: [entity, null] }));
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
        rest.get(`${mockBaseUrl}/entities/by-query`, (_, res, ctx) => {
          return res(ctx.json(defaultResponse));
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
        .mockImplementation((_req, res, ctx) =>
          res(ctx.json({ items: [], totalItems: 0 })),
        );

      server.use(rest.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

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

      const queryParams = new URLSearchParams(
        mockedEndpoint.mock.calls[0][0].url.search,
      );
      expect(queryParams.getAll('filter')).toEqual([
        'a=1,b=2,b=3,ö==',
        'a=2',
        'c',
      ]);
    });

    it('builds search filters property even those with URL unsafe values', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation((_req, res, ctx) =>
          res(ctx.json({ items: [], totalItems: 0 })),
        );

      server.use(rest.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

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
      const queryParams = new URLSearchParams(
        mockedEndpoint.mock.calls[0][0].url.search,
      );
      expect(queryParams.getAll('filter')).toEqual([
        '!@#$%=t?i=1&a:2,^&*(){}[]=t%^url*encoded2,^&*(){}[]=url',
      ]);
    });

    it('should send query params correctly on initial request', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation((_req, res, ctx) =>
          res(ctx.json({ items: [], totalItems: 0 })),
        );

      server.use(rest.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

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

      const queryParams = new URLSearchParams(
        mockedEndpoint.mock.calls[0][0].url.search,
      );
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
        .mockImplementation((_req, res, ctx) =>
          res(ctx.json({ items: [], totalItems: 0 })),
        );

      server.use(rest.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        fields: ['a', 'b'],
        limit: 100,
        fullTextFilter: {
          term: 'query',
        },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        cursor: 'cursor',
      });
      expect(mockedEndpoint.mock.calls[0][0].url.search).toBe(
        '?fields=a,b&limit=100&cursor=cursor',
      );
    });

    it('should return paginated functions if next and prev cursors are present', async () => {
      const mockedEndpoint = jest.fn().mockImplementation((_req, res, ctx) =>
        res(
          ctx.json({
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
        ),
      );

      server.use(rest.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      const response = await client.queryEntities({
        limit: 2,
      });
      expect(mockedEndpoint.mock.calls[0][0].url.search).toBe('?limit=2');

      expect(response?.pageInfo.nextCursor).toBeDefined();
      expect(response?.pageInfo.prevCursor).toBeDefined();

      await client.queryEntities({ cursor: response!.pageInfo.nextCursor! });
      expect(mockedEndpoint.mock.calls[1][0].url.search).toBe(
        '?cursor=nextcursor',
      );

      await client.queryEntities({ cursor: response!.pageInfo.prevCursor! });
      expect(mockedEndpoint.mock.calls[2][0].url.search).toBe(
        '?cursor=prevcursor',
      );
    });

    it('should handle errors', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation((_req, res, ctx) => res(ctx.status(401)));

      server.use(rest.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await expect(() => client.queryEntities()).rejects.toThrow(
        /Request failed with 401 Unauthorized/,
      );
    });
  });

  describe('queryEntities with predicate-based queries (POST endpoint)', () => {
    const defaultResponse = {
      items: [
        {
          apiVersion: '1',
          kind: 'Component',
          metadata: {
            name: 'service-1',
            namespace: 'default',
          },
          spec: {
            type: 'service',
            owner: 'team-a',
          },
        },
        {
          apiVersion: '1',
          kind: 'Component',
          metadata: {
            name: 'service-2',
            namespace: 'default',
          },
          spec: {
            type: 'service',
            owner: 'team-b',
          },
        },
      ],
      totalItems: 2,
      pageInfo: {},
    };

    it('should use POST endpoint when query is provided', async () => {
      const mockedEndpoint = jest.fn().mockImplementation((req, res, ctx) => {
        expect(req.method).toBe('POST');
        expect(req.body).toMatchObject({
          query: { kind: 'component' },
          limit: 20,
        });
        return res(ctx.json(defaultResponse));
      });

      server.use(rest.post(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      const response = await client.queryEntities({
        query: { kind: 'component' },
        limit: 20,
      });

      expect(mockedEndpoint).toHaveBeenCalledTimes(1);
      expect(response.items).toEqual(defaultResponse.items);
      expect(response.totalItems).toBe(2);
    });

    it('should throw error when both filter and query are provided', async () => {
      await expect(
        client.queryEntities({
          filter: { kind: 'component' },
          query: { kind: 'component' },
        } as any),
      ).rejects.toThrow(
        'Cannot specify both "filter" and "query" in the same request',
      );
    });

    it('should support $all operator', async () => {
      const mockedEndpoint = jest.fn().mockImplementation((req, res, ctx) => {
        expect(req.body).toMatchObject({
          query: {
            $all: [{ kind: 'component' }, { 'spec.type': 'service' }],
          },
        });
        return res(ctx.json(defaultResponse));
      });

      server.use(rest.post(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        query: {
          $all: [{ kind: 'component' }, { 'spec.type': 'service' }],
        },
      });

      expect(mockedEndpoint).toHaveBeenCalledTimes(1);
    });

    it('should support $any operator', async () => {
      const mockedEndpoint = jest.fn().mockImplementation((req, res, ctx) => {
        expect(req.body).toMatchObject({
          query: {
            $any: [{ 'spec.type': 'service' }, { 'spec.type': 'website' }],
          },
        });
        return res(ctx.json(defaultResponse));
      });

      server.use(rest.post(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        query: {
          $any: [{ 'spec.type': 'service' }, { 'spec.type': 'website' }],
        },
      });

      expect(mockedEndpoint).toHaveBeenCalledTimes(1);
    });

    it('should support $not operator', async () => {
      const mockedEndpoint = jest.fn().mockImplementation((req, res, ctx) => {
        expect(req.body).toMatchObject({
          query: {
            $not: { 'spec.lifecycle': 'experimental' },
          },
        });
        return res(ctx.json(defaultResponse));
      });

      server.use(rest.post(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        query: {
          $not: { 'spec.lifecycle': 'experimental' },
        },
      });

      expect(mockedEndpoint).toHaveBeenCalledTimes(1);
    });

    it('should support $exists operator', async () => {
      const mockedEndpoint = jest.fn().mockImplementation((req, res, ctx) => {
        expect(req.body).toMatchObject({
          query: {
            'spec.owner': { $exists: true },
          },
        });
        return res(ctx.json(defaultResponse));
      });

      server.use(rest.post(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        query: {
          'spec.owner': { $exists: true },
        },
      });

      expect(mockedEndpoint).toHaveBeenCalledTimes(1);
    });

    it('should support $in operator', async () => {
      const mockedEndpoint = jest.fn().mockImplementation((req, res, ctx) => {
        expect(req.body).toMatchObject({
          query: {
            'spec.owner': { $in: ['team-a', 'team-b', 'team-c'] },
          },
        });
        return res(ctx.json(defaultResponse));
      });

      server.use(rest.post(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        query: {
          'spec.owner': { $in: ['team-a', 'team-b', 'team-c'] },
        },
      });

      expect(mockedEndpoint).toHaveBeenCalledTimes(1);
    });

    it('should support complex nested predicates', async () => {
      const mockedEndpoint = jest.fn().mockImplementation((req, res, ctx) => {
        expect(req.body).toMatchObject({
          query: {
            $all: [
              { kind: 'component' },
              {
                $any: [{ 'spec.type': 'service' }, { 'spec.type': 'website' }],
              },
              {
                $not: {
                  'spec.lifecycle': 'experimental',
                },
              },
            ],
          },
        });
        return res(ctx.json(defaultResponse));
      });

      server.use(rest.post(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        query: {
          $all: [
            { kind: 'component' },
            {
              $any: [{ 'spec.type': 'service' }, { 'spec.type': 'website' }],
            },
            {
              $not: {
                'spec.lifecycle': 'experimental',
              },
            },
          ],
        },
      });

      expect(mockedEndpoint).toHaveBeenCalledTimes(1);
    });

    it('should send orderFields with correct format', async () => {
      const mockedEndpoint = jest.fn().mockImplementation((req, res, ctx) => {
        expect(req.body.orderBy).toEqual([
          { field: 'metadata.name', order: 'asc' },
        ]);
        return res(ctx.json(defaultResponse));
      });

      server.use(rest.post(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        query: { kind: 'component' },
        orderFields: { field: 'metadata.name', order: 'asc' },
      });

      expect(mockedEndpoint).toHaveBeenCalledTimes(1);
    });

    it('should send multiple orderFields with correct format', async () => {
      const mockedEndpoint = jest.fn().mockImplementation((req, res, ctx) => {
        expect(req.body.orderBy).toEqual([
          { field: 'metadata.name', order: 'asc' },
          { field: 'spec.type', order: 'desc' },
        ]);
        return res(ctx.json(defaultResponse));
      });

      server.use(rest.post(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        query: { kind: 'component' },
        orderFields: [
          { field: 'metadata.name', order: 'asc' },
          { field: 'spec.type', order: 'desc' },
        ],
      });

      expect(mockedEndpoint).toHaveBeenCalledTimes(1);
    });

    it('should send limit and offset parameters in the body', async () => {
      const mockedEndpoint = jest.fn().mockImplementation((req, res, ctx) => {
        expect(req.body.limit).toBe(50);
        return res(ctx.json(defaultResponse));
      });

      server.use(rest.post(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await client.queryEntities({
        query: { kind: 'component' },
        limit: 50,
      });

      expect(mockedEndpoint).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from POST endpoint', async () => {
      const mockedEndpoint = jest
        .fn()
        .mockImplementation((_req, res, ctx) => res(ctx.status(400)));

      server.use(rest.post(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

      await expect(() =>
        client.queryEntities({ query: { kind: 'component' } }),
      ).rejects.toThrow(/Request failed with 400/);
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
        rest.get(`${mockBaseUrl}/entities/by-query`, (req, res, ctx) => {
          const cursor = req.url.searchParams.get('cursor');
          if (cursor === 'next') {
            return res(ctx.json({ items: [], pageInfo: {}, totalItems: 0 }));
          }
          return res(ctx.json(defaultResponse));
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
        .mockImplementation((_req, res, ctx) => res(ctx.status(401)));

      server.use(rest.get(`${mockBaseUrl}/entities/by-query`, mockedEndpoint));

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
        rest.get(`${mockBaseUrl}/locations`, (_, res, ctx) => {
          return res(ctx.json(defaultResponse));
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
        rest.get(`${mockBaseUrl}/locations`, (_, res, ctx) => {
          return res(ctx.json([]));
        }),
      );

      const response = await client.getLocations({}, { token });
      expect(response).toEqual({ items: [] });
    });

    it('should forward token', async () => {
      expect.assertions(1);

      server.use(
        rest.get(`${mockBaseUrl}/locations`, (req, res, ctx) => {
          expect(req.headers.get('authorization')).toBe(`Bearer ${token}`);
          return res(ctx.json(defaultResponse));
        }),
      );

      await client.getLocations({}, { token });
    });

    it('should not forward token if omitted', async () => {
      expect.assertions(1);

      server.use(
        rest.get(`${mockBaseUrl}/locations`, (req, res, ctx) => {
          expect(req.headers.get('authorization')).toBeNull();
          return res(ctx.json(defaultResponse));
        }),
      );

      await client.getLocations();
    });
  });

  describe('queryLocations', () => {
    it('should fetch locations from correct endpoint', async () => {
      const defaultResponse = {
        items: [
          { id: '1', type: 'url', target: 'https://example.com/1' },
          { id: '2', type: 'url', target: 'https://example.com/2' },
        ],
        totalItems: 3,
        pageInfo: {
          nextCursor: 'next',
        },
      };

      server.use(
        rest.post(`${mockBaseUrl}/locations/by-query`, (_, res, ctx) => {
          return res(ctx.json(defaultResponse));
        }),
      );

      const response = await client.queryLocations({}, { token });
      expect(response).toEqual(defaultResponse);
    });

    it('should send request body correctly', async () => {
      expect.assertions(2);

      server.use(
        rest.post(
          `${mockBaseUrl}/locations/by-query`,
          async (req, res, ctx) => {
            const body = await req.json();
            expect(body).toEqual({
              limit: 50,
              query: { type: 'url' },
            });
            return res(ctx.json({ items: [], totalItems: 0, pageInfo: {} }));
          },
        ),
      );

      const response = await client.queryLocations(
        {
          limit: 50,
          query: { type: 'url' },
        },
        { token },
      );

      expect(response.items).toEqual([]);
    });

    it('should handle cursor-based pagination', async () => {
      expect.assertions(3);

      server.use(
        rest.post(
          `${mockBaseUrl}/locations/by-query`,
          async (req, res, ctx) => {
            const body = await req.json();
            expect(body).toEqual({ cursor: 'mycursor' });
            return res(
              ctx.json({
                items: [
                  { id: '3', type: 'url', target: 'https://example.com/3' },
                ],
                totalItems: 10,
                pageInfo: {
                  nextCursor: 'nextcursor',
                },
              }),
            );
          },
        ),
      );

      const response = await client.queryLocations({ cursor: 'mycursor' });

      expect(response.items).toHaveLength(1);
      expect(response.pageInfo.nextCursor).toBe('nextcursor');
    });

    it('should handle errors', async () => {
      server.use(
        rest.post(`${mockBaseUrl}/locations/by-query`, (_req, res, ctx) =>
          res(ctx.status(401)),
        ),
      );

      await expect(() => client.queryLocations()).rejects.toThrow(
        /Request failed with 401 Unauthorized/,
      );
    });

    it('should forward token', async () => {
      expect.assertions(1);

      server.use(
        rest.post(`${mockBaseUrl}/locations/by-query`, (req, res, ctx) => {
          expect(req.headers.get('authorization')).toBe(`Bearer ${token}`);
          return res(ctx.json({ items: [], totalItems: 0, pageInfo: {} }));
        }),
      );

      await client.queryLocations({}, { token });
    });
  });

  describe('streamLocations', () => {
    it('should stream locations through pagination', async () => {
      const firstPage = {
        items: [
          { id: '1', type: 'url', target: 'https://example.com/1' },
          { id: '2', type: 'url', target: 'https://example.com/2' },
        ],
        totalItems: 3,
        pageInfo: { nextCursor: 'cursor2' },
      };
      const secondPage = {
        items: [{ id: '3', type: 'url', target: 'https://example.com/3' }],
        totalItems: 3,
        pageInfo: {},
      };

      server.use(
        rest.post(
          `${mockBaseUrl}/locations/by-query`,
          async (req, res, ctx) => {
            const body = await req.json();
            if (body.cursor === 'cursor2') {
              return res(ctx.json(secondPage));
            }
            return res(ctx.json(firstPage));
          },
        ),
      );

      const stream = client.streamLocations({}, { token });
      const results = [];
      for await (const page of stream) {
        results.push(page);
      }

      expect(results).toEqual([firstPage.items, secondPage.items]);
    });

    it('should handle empty results', async () => {
      server.use(
        rest.post(`${mockBaseUrl}/locations/by-query`, (_req, res, ctx) => {
          return res(ctx.json({ items: [], totalItems: 0, pageInfo: {} }));
        }),
      );

      const stream = client.streamLocations({}, { token });
      const results = [];
      for await (const page of stream) {
        results.push(page);
      }

      expect(results).toEqual([]);
    });

    it('should handle errors', async () => {
      server.use(
        rest.post(`${mockBaseUrl}/locations/by-query`, (_req, res, ctx) =>
          res(ctx.status(401)),
        ),
      );

      const stream = client.streamLocations({}, { token });
      await expect(async () => {
        const results = [];
        for await (const page of stream) {
          results.push(page);
        }
      }).rejects.toThrow(/Request failed with 401 Unauthorized/);
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
        rest.get(`${mockBaseUrl}/locations/by-entity/c/ns/n`, (_, res, ctx) => {
          return res(ctx.json(defaultResponse));
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
        rest.get(
          `${mockBaseUrl}/locations/by-entity/c/ns/n`,
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBe(`Bearer ${token}`);
            return res(ctx.json(defaultResponse));
          },
        ),
      );

      await client.getLocationByEntity(
        { kind: 'c', namespace: 'ns', name: 'n' },
        { token },
      );
    });

    it('skips authorization header if token is omitted', async () => {
      expect.assertions(1);

      server.use(
        rest.get(
          `${mockBaseUrl}/locations/by-entity/c/ns/n`,
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBeNull();
            return res(ctx.json(defaultResponse));
          },
        ),
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
      ).rejects.toThrow(/Request failed with 500 Internal Server Error/);
    });
  });
});
