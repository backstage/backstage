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

import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { codeSearch, CodeSearchResponse } from './azure';
import {
  DefaultAzureDevOpsCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { ConfigReader } from '@backstage/config';

describe('azure', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  const createFixture = (host: string, token: string) => {
    const azureConfig = {
      host: host,
      credentials: [
        {
          personalAccessToken: token,
        },
      ],
    };
    const scmIntegrations = ScmIntegrations.fromConfig(
      new ConfigReader({
        integrations: {
          azure: [azureConfig],
        },
      }),
    );

    return {
      azureConfig: scmIntegrations.azure.byHost(host)?.config!,
      credentialsProvider:
        DefaultAzureDevOpsCredentialsProvider.fromIntegrations(scmIntegrations),
    };
  };

  describe('codeSearch', () => {
    it('returns empty when nothing is found', async () => {
      const response: CodeSearchResponse = { count: 0, results: [] };

      server.use(
        rest.post(
          `https://almsearch.dev.azure.com/shopify/_apis/search/codesearchresults`,
          (req, res, ctx) => {
            expect(req.headers.get('Authorization')).toBe('Basic OkFCQw==');
            expect(req.body).toEqual({
              searchText: 'path:/catalog-info.yaml repo:* proj:engineering',
              $orderBy: [
                {
                  field: 'path',
                  sortOrder: 'ASC',
                },
              ],
              $skip: 0,
              $top: 1000,
            });
            return res(ctx.json(response));
          },
        ),
      );

      const { credentialsProvider, azureConfig } = createFixture(
        'dev.azure.com',
        'ABC',
      );
      await expect(
        codeSearch(
          credentialsProvider,
          azureConfig,
          'shopify',
          'engineering',
          '',
          '/catalog-info.yaml',
          '',
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
          project: {
            name: 'backstage',
          },
        },
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'ios-app',
          },
          project: {
            name: 'backstage',
          },
        },
      ],
    };

    server.use(
      rest.post(
        `https://almsearch.dev.azure.com/shopify/_apis/search/codesearchresults`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(req.body).toEqual({
            searchText: 'path:/catalog-info.yaml repo:* proj:engineering',
            $orderBy: [
              {
                field: 'path',
                sortOrder: 'ASC',
              },
            ],
            $skip: 0,
            $top: 1000,
          });
          return res(ctx.json(response));
        },
      ),
    );

    const { credentialsProvider, azureConfig } = createFixture(
      'dev.azure.com',
      'ABC',
    );
    await expect(
      codeSearch(
        credentialsProvider,
        azureConfig,
        'shopify',
        'engineering',
        '',
        '/catalog-info.yaml',
        '',
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
          project: {
            name: '*',
          },
          repository: {
            name: 'backstage',
          },
        },
      ],
    };

    server.use(
      rest.post(
        `https://almsearch.dev.azure.com/shopify/_apis/search/codesearchresults`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(req.body).toEqual({
            searchText:
              'path:/catalog-info.yaml repo:backstage proj:engineering',
            $orderBy: [
              {
                field: 'path',
                sortOrder: 'ASC',
              },
            ],
            $skip: 0,
            $top: 1000,
          });
          return res(ctx.json(response));
        },
      ),
    );

    const { credentialsProvider, azureConfig } = createFixture(
      'dev.azure.com',
      'ABC',
    );

    await expect(
      codeSearch(
        credentialsProvider,
        azureConfig,
        'shopify',
        'engineering',
        'backstage',
        '/catalog-info.yaml',
        '',
      ),
    ).resolves.toEqual(response.results);
  });

  it('searches in specific branch if parameter is set', async () => {
    const response: CodeSearchResponse = {
      count: 1,
      results: [
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          project: {
            name: '*',
          },
          repository: {
            name: 'backstage',
          },
        },
      ],
    };

    server.use(
      rest.post(
        `https://almsearch.dev.azure.com/shopify/_apis/search/codesearchresults`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(req.body).toEqual({
            searchText:
              'path:/catalog-info.yaml repo:backstage proj:engineering',
            $orderBy: [
              {
                field: 'path',
                sortOrder: 'ASC',
              },
            ],
            $skip: 0,
            $top: 1000,
            filters: {
              Branch: ['topic/catalog-info'],
            },
          });
          return res(ctx.json(response));
        },
      ),
    );

    const { credentialsProvider, azureConfig } = createFixture(
      'dev.azure.com',
      'ABC',
    );

    await expect(
      codeSearch(
        credentialsProvider,
        azureConfig,
        'shopify',
        'engineering',
        'backstage',
        '/catalog-info.yaml',
        'topic/catalog-info',
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
          project: {
            name: '*',
          },
        },
      ],
    };

    server.use(
      rest.post(
        `https://azuredevops.mycompany.com/shopify/_apis/search/codesearchresults`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(req.body).toEqual({
            searchText: 'path:/catalog-info.yaml repo:* proj:engineering',
            $orderBy: [
              {
                field: 'path',
                sortOrder: 'ASC',
              },
            ],
            $skip: 0,
            $top: 1000,
          });
          return res(ctx.json(response));
        },
      ),
    );

    const { credentialsProvider, azureConfig } = createFixture(
      'azuredevops.mycompany.com',
      'ABC',
    );

    await expect(
      codeSearch(
        credentialsProvider,
        azureConfig,
        'shopify',
        'engineering',
        '',
        '/catalog-info.yaml',
        '',
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
        project: {
          name: 'engineering',
        },
      }));
    };

    server.use(
      rest.post(
        `https://almsearch.dev.azure.com/shopify/_apis/search/codesearchresults`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(req.body).toMatchObject({
            searchText:
              'path:/catalog-info.yaml repo:backstage proj:engineering',
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

    const { credentialsProvider, azureConfig } = createFixture(
      'dev.azure.com',
      'ABC',
    );

    await expect(
      codeSearch(
        credentialsProvider,
        azureConfig,
        'shopify',
        'engineering',
        'backstage',
        '/catalog-info.yaml',
        '',
      ),
    ).resolves.toHaveLength(totalCount);
  });
});
