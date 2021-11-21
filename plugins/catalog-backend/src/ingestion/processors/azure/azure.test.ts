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

import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
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
});
