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

const octokit = {
  repos: {
    get: () => Promise.resolve({ data: { default_branch: 'main' } }),
    createOrUpdateFileContents: jest.fn(async () => {}),
  },
  search: {
    code: jest.fn(),
  },
  git: {
    getRef: async () => ({
      data: { object: { sha: 'any' } },
    }),
    createRef: jest.fn(async () => {}),
  },
  pulls: {
    create: jest.fn(async () => ({
      data: {
        html_url: 'http://pull/request/0',
      },
    })),
  },
};

jest.doMock('@octokit/rest', () => {
  class Octokit {
    constructor() {
      return octokit;
    }
  }
  return { Octokit };
});

import { ConfigReader, UrlPatternDiscovery } from '@backstage/core-app-api';
import { ScmIntegrations } from '@backstage/integration';
import { ScmAuthApi } from '@backstage/integration-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { Octokit } from '@octokit/rest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { CatalogImportClient } from './CatalogImportClient';

describe('CatalogImportClient', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api/catalog';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);

  const scmAuthApi: jest.Mocked<ScmAuthApi> = {
    getCredentials: jest.fn().mockResolvedValue({ token: 'token' }),
  };
  const identityApi = {
    signOut: () => {
      return Promise.resolve();
    },
    getProfileInfo: jest.fn(),
    getBackstageIdentity: jest.fn(),
    getCredentials: jest.fn().mockResolvedValue({ token: 'token' }),
  };

  const scmIntegrationsApi = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'example.com' }],
        gitlab: [
          {
            host: 'registered-but-not-github.com',
            apiBaseUrl: 'https://registered-but-not-github.com',
          },
        ],
      },
    }),
  );

  const catalogApi: jest.Mocked<typeof catalogApiRef.T> = {
    getEntities: jest.fn(),
    addLocation: jest.fn(),
    removeLocationById: jest.fn(),
    getEntityByRef: jest.fn(),
    getLocationByRef: jest.fn(),
    getLocationById: jest.fn(),
    removeEntityByUid: jest.fn(),
    refreshEntity: jest.fn(),
    getEntityAncestors: jest.fn(),
    getEntityFacets: jest.fn(),
  };

  let catalogImportClient: CatalogImportClient;

  beforeEach(() => {
    catalogImportClient = new CatalogImportClient({
      discoveryApi,
      scmAuthApi,
      scmIntegrationsApi,
      identityApi,
      catalogApi,
      configApi: new ConfigReader({
        app: {
          baseUrl: 'https://demo.backstage.io/',
        },
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('analyzeUrl', () => {
    it('should add yaml location', async () => {
      catalogApi.addLocation.mockResolvedValueOnce({
        location: {
          id: 'id-0',
          type: 'url',
          target: 'http://example.com/folder/catalog-info.yaml',
        },
        entities: [
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: 'my-entity',
              namespace: 'my-namespace',
            },
          },
        ],
      });

      await expect(
        catalogImportClient.analyzeUrl(
          'http://example.com/folder/catalog-info.yaml',
        ),
      ).resolves.toEqual({
        locations: [
          {
            entities: [
              {
                kind: 'Component',
                name: 'my-entity',
                namespace: 'my-namespace',
              },
            ],
            target: 'http://example.com/folder/catalog-info.yaml',
          },
        ],
        type: 'locations',
      });

      expect(catalogApi.addLocation).toBeCalledTimes(1);
      expect(catalogApi.addLocation.mock.calls[0][0]).toEqual({
        type: 'url',
        target: 'http://example.com/folder/catalog-info.yaml',
        dryRun: true,
      });
    });

    it('should add yaml location, if url includes query parameter named path=', async () => {
      catalogApi.addLocation.mockResolvedValueOnce({
        location: {
          id: 'id-0',
          type: 'url',
          target:
            'https://dev.azure.com/any-org/any-project/_git/any-repository?path=%2Fcatalog-info.yaml',
        },
        entities: [
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: 'my-entity-1',
              namespace: 'my-namespace-1',
            },
          },
        ],
      });

      await expect(
        catalogImportClient.analyzeUrl(
          'https://dev.azure.com/any-org/any-project/_git/any-repository?path=%2Fcatalog-info.yaml',
        ),
      ).resolves.toEqual({
        locations: [
          {
            entities: [
              {
                kind: 'Component',
                name: 'my-entity-1',
                namespace: 'my-namespace-1',
              },
            ],
            target:
              'https://dev.azure.com/any-org/any-project/_git/any-repository?path=%2Fcatalog-info.yaml',
          },
        ],
        type: 'locations',
      });

      expect(catalogApi.addLocation).toBeCalledTimes(1);
      expect(catalogApi.addLocation.mock.calls[0][0]).toEqual({
        type: 'url',
        target:
          'https://dev.azure.com/any-org/any-project/_git/any-repository?path=%2Fcatalog-info.yaml',
        dryRun: true,
      });
    });

    it('should add yaml location, if url includes query parameters', async () => {
      catalogApi.addLocation.mockResolvedValueOnce({
        location: {
          id: 'id-0',
          type: 'url',
          target: 'http://example.com/folder/catalog-info.yaml?branch=test',
        },
        entities: [
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: 'my-entity',
              namespace: 'my-namespace',
            },
          },
        ],
      });

      await expect(
        catalogImportClient.analyzeUrl(
          'http://example.com/folder/catalog-info.yaml?branch=test',
        ),
      ).resolves.toEqual({
        locations: [
          {
            entities: [
              {
                kind: 'Component',
                name: 'my-entity',
                namespace: 'my-namespace',
              },
            ],
            target: 'http://example.com/folder/catalog-info.yaml?branch=test',
          },
        ],
        type: 'locations',
      });

      expect(catalogApi.addLocation).toBeCalledTimes(1);
      expect(catalogApi.addLocation.mock.calls[0][0]).toEqual({
        type: 'url',
        target: 'http://example.com/folder/catalog-info.yaml?branch=test',
        dryRun: true,
      });
    });

    it('should reject for integrations that are not github ones', async () => {
      await expect(
        catalogImportClient.analyzeUrl(
          'https://registered-but-not-github.com/backstage/backstage',
        ),
      ).rejects.toThrow(
        new Error(
          'The registered-but-not-github.com integration only supports full URLs to catalog-info.yaml files. Did you try to pass in the URL of a directory instead?',
        ),
      );
    });

    it('should reject when unable to match with any integration', async () => {
      await expect(
        catalogImportClient.analyzeUrl(
          'https://not-registered-as-integration.com/foo/bar',
        ),
      ).rejects.toThrow(
        new Error(
          'This URL was not recognized as a valid GitHub URL because there was no configured integration that matched the given host name. You could try to paste the full URL to a catalog-info.yaml file instead.',
        ),
      );
    });

    it('should find locations from github', async () => {
      (new Octokit().search.code as any as jest.Mock).mockResolvedValueOnce({
        data: {
          total_count: 2,
          items: [
            { path: 'simple/path/catalog-info.yaml' },
            { path: 'co/mple/x/path/catalog-info.yaml' },
            { path: 'catalog-info.yaml' },
          ],
        },
      });

      catalogApi.addLocation.mockImplementation(async ({ type, target }) => ({
        location: {
          id: 'id-0',
          type: type ?? 'url',
          target,
        },
        entities: [
          {
            apiVersion: '1',
            kind: 'k',
            metadata: {
              name: 'e',
              namespace: 'n',
            },
          },
        ],
      }));

      await expect(
        catalogImportClient.analyzeUrl(
          'https://github.com/backstage/backstage',
        ),
      ).resolves.toEqual({
        locations: [
          {
            entities: [{ kind: 'k', name: 'e', namespace: 'n' }],
            target:
              'https://github.com/backstage/backstage/blob/main/simple/path/catalog-info.yaml',
          },
          {
            entities: [{ kind: 'k', name: 'e', namespace: 'n' }],
            target:
              'https://github.com/backstage/backstage/blob/main/co/mple/x/path/catalog-info.yaml',
          },
          {
            entities: [{ kind: 'k', name: 'e', namespace: 'n' }],
            target:
              'https://github.com/backstage/backstage/blob/main/catalog-info.yaml',
          },
        ],
        type: 'locations',
      });
    });

    it('should find repository from github', async () => {
      (new Octokit().search.code as any as jest.Mock).mockResolvedValueOnce({
        data: { total_count: 0, items: [] },
      });

      server.use(
        rest.post(`${mockBaseUrl}/analyze-location`, (req, res, ctx) => {
          expect(req.body).toEqual({
            location: {
              target: 'https://github.com/backstage/backstage',
              type: 'url',
            },
          });

          return res(
            ctx.json({
              generateEntities: [
                {
                  entity: {
                    kind: 'k',
                    metadata: { name: 'e', namespace: 'n' },
                  },
                  fields: [],
                },
              ],
              existingEntityFiles: [],
            }),
          );
        }),
      );

      await expect(
        catalogImportClient.analyzeUrl(
          'https://github.com/backstage/backstage',
        ),
      ).resolves.toEqual({
        type: 'repository',
        url: 'https://github.com/backstage/backstage',
        integrationType: 'github',
        generatedEntities: [
          {
            kind: 'k',
            metadata: { name: 'e', namespace: 'n' },
          },
        ],
      });
    });

    it('should find location with custom catalog filename', async () => {
      const repositoryUrl = 'https://github.com/acme-corp/our-awesome-api';
      const entityFilename = 'anvil.yaml';

      catalogImportClient = new CatalogImportClient({
        discoveryApi,
        scmAuthApi,
        scmIntegrationsApi,
        identityApi,
        catalogApi,
        configApi: new ConfigReader({
          catalog: {
            import: {
              entityFilename,
            },
          },
        }),
      });

      (new Octokit().search.code as any as jest.Mock).mockImplementationOnce(
        async params => ({
          data: {
            total_count: 1,
            items: [{ path: params.q.split('+filename:').slice(-1)[0] }],
          },
        }),
      );

      catalogApi.addLocation.mockImplementation(async ({ type, target }) => ({
        location: {
          id: 'id-0',
          type: type ?? 'url',
          target,
        },
        entities: [
          {
            apiVersion: '1',
            kind: 'Location',
            metadata: {
              name: 'my-entity',
              namespace: 'my-namespace',
            },
          },
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: 'my-entity',
              namespace: 'my-namespace',
            },
          },
        ],
      }));

      await expect(
        catalogImportClient.analyzeUrl(repositoryUrl),
      ).resolves.toEqual({
        locations: [
          {
            entities: [
              {
                kind: 'Location',
                namespace: 'my-namespace',
                name: 'my-entity',
              },
              {
                kind: 'Component',
                namespace: 'my-namespace',
                name: 'my-entity',
              },
            ],
            target: `${repositoryUrl}/blob/main/${entityFilename}`,
          },
        ],
        type: 'locations',
      });
    });
  });

  describe('submitPullRequest', () => {
    it('should create GitHub pull request', async () => {
      await expect(
        catalogImportClient.submitPullRequest({
          repositoryUrl: 'https://github.com/backstage/backstage',
          fileContent: 'some content 🤖',
          title: 'A title/message',
          body: 'A body',
        }),
      ).resolves.toEqual({
        link: 'http://pull/request/0',
        location:
          'https://github.com/backstage/backstage/blob/main/catalog-info.yaml',
      });

      expect(
        (new Octokit().git.createRef as any as jest.Mock).mock.calls[0][0],
      ).toEqual({
        owner: 'backstage',
        repo: 'backstage',
        ref: 'refs/heads/backstage-integration',
        sha: 'any',
      });
      expect(
        (new Octokit().repos.createOrUpdateFileContents as any as jest.Mock)
          .mock.calls[0][0],
      ).toEqual({
        owner: 'backstage',
        repo: 'backstage',
        path: 'catalog-info.yaml',
        message: 'A title/message',
        content: 'c29tZSBjb250ZW50IPCfpJY=',
        branch: 'backstage-integration',
      });
      expect(
        (new Octokit().pulls.create as any as jest.Mock).mock.calls[0][0],
      ).toEqual({
        owner: 'backstage',
        repo: 'backstage',
        title: 'A title/message',
        head: 'backstage-integration',
        body: 'A body',
        base: 'main',
      });
    });

    it('should create GitHub pull request with custom filename and branch name', async () => {
      const entityFilename = 'anvil.yaml';
      const pullRequestBranchName = 'anvil-integration';

      catalogImportClient = new CatalogImportClient({
        discoveryApi,
        scmAuthApi,
        scmIntegrationsApi,
        identityApi,
        catalogApi,
        configApi: new ConfigReader({
          catalog: {
            import: {
              entityFilename,
              pullRequestBranchName,
            },
          },
        }),
      });

      await expect(
        catalogImportClient.submitPullRequest({
          repositoryUrl: 'https://github.com/acme-corp/our-awesome-api',
          fileContent: '',
          title: `Add ${entityFilename} config file`,
          body: `Add ${entityFilename} config file`,
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          link: 'http://pull/request/0',
          location: `https://github.com/acme-corp/our-awesome-api/blob/main/${entityFilename}`,
        }),
      );

      expect(
        (new Octokit().git.createRef as any as jest.Mock).mock.calls[0][0],
      ).toEqual(
        expect.objectContaining({
          ref: `refs/heads/${pullRequestBranchName}`,
        }),
      );

      expect(
        (new Octokit().repos.createOrUpdateFileContents as any as jest.Mock)
          .mock.calls[0][0],
      ).toEqual(
        expect.objectContaining({
          path: entityFilename,
          branch: pullRequestBranchName,
        }),
      );

      expect(
        (new Octokit().pulls.create as any as jest.Mock).mock.calls[0][0],
      ).toEqual(
        expect.objectContaining({
          head: pullRequestBranchName,
        }),
      );
    });
  });

  describe('preparePullRequest', () => {
    test('should prepare pull request details', async () => {
      await expect(catalogImportClient.preparePullRequest()).resolves.toEqual({
        title: 'Add catalog-info.yaml config file',
        body: expect.any(String),
      });
    });

    test('should prepare pull request details with custom filename', async () => {
      const entityFilename = 'anvil.yaml';
      const pullRequestBranchName = 'anvil-integration';

      catalogImportClient = new CatalogImportClient({
        discoveryApi,
        scmAuthApi,
        scmIntegrationsApi,
        identityApi,
        catalogApi,
        configApi: new ConfigReader({
          catalog: {
            import: {
              entityFilename,
              pullRequestBranchName,
            },
          },
          app: {
            baseUrl: 'https://demo.backstage.io/',
          },
        }),
      });

      await expect(catalogImportClient.preparePullRequest()).resolves.toEqual({
        title: `Add ${entityFilename} config file`,
        body: expect.any(String),
      });
    });
  });
});
