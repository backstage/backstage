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

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { CatalogClient } from './CatalogClient';
import { Entity } from '@backstage/catalog-model';

const server = setupServer();

describe('CatalogClient', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  const mockApiOrigin = 'http://backstage:9191';
  const mockBasePath = '/i-am-a-mock-base';
  let client = new CatalogClient({
    apiOrigin: mockApiOrigin,
    basePath: mockBasePath,
  });

  beforeEach(() => {
    client = new CatalogClient({
      apiOrigin: mockApiOrigin,
      basePath: mockBasePath,
    });
  });

  describe('getEntiies', () => {
    const defaultResponse: Entity[] = [
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

    beforeEach(() => {
      server.use(
        rest.get(`${mockApiOrigin}${mockBasePath}/entities`, (_, res, ctx) => {
          return res(ctx.json(defaultResponse));
        }),
      );
    });

    it('should entities from correct endpoint', async () => {
      const entities = await client.getEntities();
      expect(entities).toEqual(defaultResponse);
    });

    it('builds entity search filters properly', async () => {
      expect.assertions(2);
      server.use(
        rest.get(
          `${mockApiOrigin}${mockBasePath}/entities`,
          (req, res, ctx) => {
            expect(req.url.searchParams.toString()).toBe(
              'a=1&b=2&b=3&%C3%B6=%3D',
            );
            return res(ctx.json([]));
          },
        ),
      );

      const entities = await client.getEntities({
        a: '1',
        b: ['2', '3'],
        ö: '=',
      });

      expect(entities).toEqual([]);
    });
  });
});
