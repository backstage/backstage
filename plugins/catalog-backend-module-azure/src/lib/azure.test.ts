/*
 * Copyright 2021 The Backstage Authors
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
import { codeSearch, CodeSearchResponse } from './azure';

describe('azure', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);

  describe('codeSearch', () => {
    it('returns empty when nothing is found', async () => {
      const response: CodeSearchResponse = { count: 0, results: [] };

      server.use(
        rest.post(
          `https://almsearch.dev.azure.com/shopify/engineering/_apis/search/codesearchresults`,
          (req, res, ctx) => {
            expect(req.headers.get('Authorization')).toBe('Basic OkFCQw==');
            expect(req.body).toEqual({
              searchText: 'path:/catalog-info.yaml repo:*',
              $skip: 0,
              $top: 1000,
            });
            return res(ctx.json(response));
          },
        ),
      );

      await expect(
        codeSearch(
          { host: 'dev.azure.com', token: 'ABC' },
          'shopify',
          'engineering',
          '',
          '/catalog-info.yaml',
        ),
      ).resolves.toEqual([]);
    });
  });

  it('returns entries when request matches some files', async () => {
    const response: CodeSearchResponse = {
      count: 2,
      results: [
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'backstage',
          },
        },
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'ios-app',
          },
        },
      ],
    };

    server.use(
      rest.post(
        `https://almsearch.dev.azure.com/shopify/engineering/_apis/search/codesearchresults`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(req.body).toEqual({
            searchText: 'path:/catalog-info.yaml repo:*',
            $skip: 0,
            $top: 1000,
          });
          return res(ctx.json(response));
        },
      ),
    );

    await expect(
      codeSearch(
        { host: 'dev.azure.com', token: 'ABC' },
        'shopify',
        'engineering',
        '',
        '/catalog-info.yaml',
      ),
    ).resolves.toEqual(response.results);
  });

  it('searches in specific repo if parameter is set', async () => {
    const response: CodeSearchResponse = {
      count: 1,
      results: [
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'backstage',
          },
        },
      ],
    };

    server.use(
      rest.post(
        `https://almsearch.dev.azure.com/shopify/engineering/_apis/search/codesearchresults`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(req.body).toEqual({
            searchText: 'path:/catalog-info.yaml repo:backstage',
            $skip: 0,
            $top: 1000,
          });
          return res(ctx.json(response));
        },
      ),
    );

    await expect(
      codeSearch(
        { host: 'dev.azure.com', token: 'ABC' },
        'shopify',
        'engineering',
        'backstage',
        '/catalog-info.yaml',
      ),
    ).resolves.toEqual(response.results);
  });

  it('can search using onpremise api', async () => {
    const response: CodeSearchResponse = {
      count: 1,
      results: [
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'backstage',
          },
        },
      ],
    };

    server.use(
      rest.post(
        `https://azuredevops.mycompany.com/shopify/engineering/_apis/search/codesearchresults`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(req.body).toEqual({
            searchText: 'path:/catalog-info.yaml repo:*',
            $skip: 0,
            $top: 1000,
          });
          return res(ctx.json(response));
        },
      ),
    );

    await expect(
      codeSearch(
        { host: 'azuredevops.mycompany.com', token: 'ABC' },
        'shopify',
        'engineering',
        '',
        '/catalog-info.yaml',
      ),
    ).resolves.toEqual(response.results);
  });

  it('searches multiple pages if response contains many items', async () => {
    const totalCount = 2401;
    const generateItems = (count: number) => {
      return Array.from(Array(count).keys()).map(_ => ({
        fileName: 'catalog-info.yaml',
        path: '/catalog-info.yaml',
        repository: {
          name: 'backstage',
        },
      }));
    };

    server.use(
      rest.post(
        `https://almsearch.dev.azure.com/shopify/engineering/_apis/search/codesearchresults`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(req.body).toMatchObject({
            searchText: 'path:/catalog-info.yaml repo:backstage',
            $top: 1000,
          });

          const body = req.body as { $skip: number; $top: number };
          const countItemsToReturn =
            body.$top + body.$skip > totalCount
              ? totalCount - body.$skip
              : body.$top;

          return res(
            ctx.json({
              count: totalCount,
              results: generateItems(countItemsToReturn),
            }),
          );
        },
      ),
    );

    await expect(
      codeSearch(
        { host: 'dev.azure.com', token: 'ABC' },
        'shopify',
        'engineering',
        'backstage',
        '/catalog-info.yaml',
      ),
    ).resolves.toHaveLength(totalCount);
  });
});
