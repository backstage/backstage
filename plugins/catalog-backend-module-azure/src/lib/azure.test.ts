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
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  codeSearch,
  CodeSearchResponse,
  fileExists,
  GitRepositoryListResponse,
  listRepositories,
} from './azure';
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
        http.post(
          `https://almsearch.dev.azure.com/shopify/_apis/search/codesearchresults`,
          async ({ request }) => {
            const body = await request.json();
            expect(request.headers.get('Authorization')).toBe('Basic OkFCQw==');
            expect(body).toEqual({
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
            return HttpResponse.json(response);
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
      http.post(
        `https://almsearch.dev.azure.com/shopify/_apis/search/codesearchresults`,
        async ({ request }) => {
          const body = await request.json();
          expect(request.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(body).toEqual({
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
          return HttpResponse.json(response);
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
      http.post(
        `https://almsearch.dev.azure.com/shopify/_apis/search/codesearchresults`,
        async ({ request }) => {
          const body = await request.json();
          expect(request.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(body).toEqual({
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
          return HttpResponse.json(response);
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
      http.post(
        `https://almsearch.dev.azure.com/shopify/_apis/search/codesearchresults`,
        async ({ request }) => {
          const body = await request.json();
          expect(request.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(body).toEqual({
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
          return HttpResponse.json(response);
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
      http.post(
        `https://azuredevops.mycompany.com/shopify/_apis/search/codesearchresults`,
        async ({ request }) => {
          const body = await request.json();
          expect(request.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(body).toEqual({
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
          return HttpResponse.json(response);
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
      http.post(
        `https://almsearch.dev.azure.com/shopify/_apis/search/codesearchresults`,
        async ({ request }) => {
          const body = (await request.json()) as {
            $skip: number;
            $top: number;
          };
          expect(request.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(body).toMatchObject({
            searchText:
              'path:/catalog-info.yaml repo:backstage proj:engineering',
            $top: 1000,
          });

          const countItemsToReturn =
            body.$top + body.$skip > totalCount
              ? totalCount - body.$skip
              : body.$top;

          return HttpResponse.json({
            count: totalCount,
            results: generateItems(countItemsToReturn),
          });
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

  it('can search using visualstudio.com domain', async () => {
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
      http.post(
        `https://almsearch.dev.azure.com/shopify/_apis/search/codesearchresults`,
        async ({ request }) => {
          const body = await request.json();
          expect(request.headers.get('Authorization')).toBe('Basic OkFCQw==');
          expect(body).toEqual({
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
          return HttpResponse.json(response);
        },
      ),
    );

    const { credentialsProvider, azureConfig } = createFixture(
      'backstage.visualstudio.com',
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

  it('identifies both dev.azure.com and visualstudio.com domains as cloud', async () => {
    const domains = [
      { host: 'dev.azure.com', expectedCloud: true },
      { host: 'example.visualstudio.com', expectedCloud: true },
      { host: 'on-premise.company.com', expectedCloud: false },
    ];

    for (const { host, expectedCloud } of domains) {
      const mockResponse = { count: 0, results: [] };

      const expectedBaseUrl = expectedCloud
        ? 'https://almsearch.dev.azure.com'
        : `https://${host}`;

      server.use(
        http.post(
          `${expectedBaseUrl}/test-org/_apis/search/codesearchresults`,
          () => {
            return HttpResponse.json(mockResponse);
          },
        ),
      );

      const { credentialsProvider, azureConfig } = createFixture(host, 'TOKEN');

      await codeSearch(
        credentialsProvider,
        azureConfig,
        'test-org',
        'test-project',
        '',
        '/test-path',
        '',
      );
    }
  });

  describe('listRepositories', () => {
    const response: GitRepositoryListResponse = {
      count: 2,
      value: [
        {
          id: 'b1a4f3f4-9d36-4bb8-a0be-2bd36a3a6bd5',
          name: 'backstage',
          defaultBranch: 'refs/heads/main',
          project: { name: 'Engineering Platform' },
        },
        {
          id: '2c1f4f42-3cb2-4b7e-9d0a-4a0b0e1d7c55',
          name: 'backstage-fork',
          defaultBranch: 'refs/heads/main',
          isFork: true,
          project: { name: 'Engineering Platform' },
        },
      ],
    };

    it('lists the repositories of a project or of the whole organization', async () => {
      const requestedUrls: string[] = [];
      server.use(
        http.get('https://dev.azure.com/shopify/*', ({ request }) => {
          requestedUrls.push(request.url);
          expect(request.headers.get('Authorization')).toBe('Basic OkFCQw==');
          return HttpResponse.json(response);
        }),
        http.get('https://shopify.visualstudio.com/*', ({ request }) => {
          requestedUrls.push(request.url);
          return HttpResponse.json(response);
        }),
      );

      const cloud = createFixture('dev.azure.com', 'ABC');
      const legacy = createFixture('shopify.visualstudio.com', 'ABC');

      await expect(
        listRepositories(
          cloud.credentialsProvider,
          cloud.azureConfig,
          'shopify',
          'Engineering Platform',
        ),
      ).resolves.toEqual(response.value);
      await expect(
        listRepositories(
          cloud.credentialsProvider,
          cloud.azureConfig,
          'shopify',
        ),
      ).resolves.toEqual(response.value);
      await expect(
        listRepositories(
          legacy.credentialsProvider,
          legacy.azureConfig,
          'shopify',
          'engineering',
        ),
      ).resolves.toEqual(response.value);

      expect(requestedUrls).toEqual([
        'https://dev.azure.com/shopify/Engineering%20Platform/_apis/git/repositories?api-version=6.0',
        'https://dev.azure.com/shopify/_apis/git/repositories?api-version=6.0',
        'https://shopify.visualstudio.com/engineering/_apis/git/repositories?api-version=6.0',
      ]);
    });

    it('throws when the repositories cannot be listed', async () => {
      server.use(
        http.get(
          'https://dev.azure.com/shopify/engineering/_apis/git/repositories',
          () => new HttpResponse(null, { status: 401 }),
        ),
      );

      const { credentialsProvider, azureConfig } = createFixture(
        'dev.azure.com',
        'ABC',
      );

      await expect(
        listRepositories(
          credentialsProvider,
          azureConfig,
          'shopify',
          'engineering',
        ),
      ).rejects.toThrow(
        'Azure DevOps repository listing failed with response status 401',
      );
    });
  });

  describe('fileExists', () => {
    const itemsUrl =
      'https://dev.azure.com/shopify/Engineering%20Platform/_apis/git/repositories/b1a4f3f4-9d36-4bb8-a0be-2bd36a3a6bd5/items';

    it('checks the file on the default branch or on the given branch', async () => {
      const requestedUrls: string[] = [];
      server.use(
        http.get('https://dev.azure.com/shopify/*', ({ request }) => {
          requestedUrls.push(request.url);
          expect(request.headers.get('Authorization')).toBe('Basic OkFCQw==');
          const params = new URL(request.url).searchParams;
          const branch = params.get('versionDescriptor.version');
          if (
            params.get('path') === '/catalog-info.yaml' &&
            (branch === null || branch === 'main')
          ) {
            return HttpResponse.json({ gitObjectType: 'blob' });
          }
          return new HttpResponse(null, { status: 404 });
        }),
      );

      const { credentialsProvider, azureConfig } = createFixture(
        'dev.azure.com',
        'ABC',
      );
      const exists = (path: string, branch?: string) =>
        fileExists(
          credentialsProvider,
          azureConfig,
          'shopify',
          'Engineering Platform',
          'b1a4f3f4-9d36-4bb8-a0be-2bd36a3a6bd5',
          path,
          branch,
        );

      await expect(exists('/catalog-info.yaml')).resolves.toBe(true);
      await expect(exists('/catalog-info.yaml', 'main')).resolves.toBe(true);
      await expect(exists('/missing.yaml')).resolves.toBe(false);
      await expect(exists('/catalog-info.yaml', 'missing')).resolves.toBe(
        false,
      );

      expect(requestedUrls).toEqual([
        `${itemsUrl}?path=%2Fcatalog-info.yaml&%24format=json&api-version=6.0`,
        `${itemsUrl}?path=%2Fcatalog-info.yaml&%24format=json&api-version=6.0&versionDescriptor.version=main&versionDescriptor.versionType=branch`,
        `${itemsUrl}?path=%2Fmissing.yaml&%24format=json&api-version=6.0`,
        `${itemsUrl}?path=%2Fcatalog-info.yaml&%24format=json&api-version=6.0&versionDescriptor.version=missing&versionDescriptor.versionType=branch`,
      ]);
    });

    it('throws on unexpected responses', async () => {
      server.use(
        http.get(itemsUrl, () => new HttpResponse(null, { status: 500 })),
      );

      const { credentialsProvider, azureConfig } = createFixture(
        'dev.azure.com',
        'ABC',
      );

      await expect(
        fileExists(
          credentialsProvider,
          azureConfig,
          'shopify',
          'Engineering Platform',
          'b1a4f3f4-9d36-4bb8-a0be-2bd36a3a6bd5',
          '/catalog-info.yaml',
        ),
      ).rejects.toThrow(
        'Azure DevOps file lookup failed with response status 500',
      );
    });
  });
});
