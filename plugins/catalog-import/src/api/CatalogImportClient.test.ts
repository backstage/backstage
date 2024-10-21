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

jest.mock('@octokit/rest', () => {
  class Octokit {
    constructor() {
      return octokit;
    }
  }

  return { Octokit };
});

jest.mock('./AzureRepoApiClient', () => {
  return {
    createAzurePullRequest: jest.fn(),
  };
});

import { ConfigReader, UrlPatternDiscovery } from '@backstage/core-app-api';
import { ScmIntegrations } from '@backstage/integration';
import { ScmAuthApi } from '@backstage/integration-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { MockFetchApi, registerMswTestHooks } from '@backstage/test-utils';
import { Octokit } from '@octokit/rest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { CatalogImportClient } from './CatalogImportClient';
import {
  AzurePrOptions,
  AzurePrResult,
  createAzurePullRequest,
} from './AzureRepoApiClient';

describe('CatalogImportClient', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  const mockBaseUrl = 'http://backstage:9191/api/catalog';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);

  const scmAuthApi: jest.Mocked<ScmAuthApi> = {
    getCredentials: jest.fn().mockResolvedValue({ token: 'token' }),
  };
  const fetchApi = new MockFetchApi();

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

  const catalogApi = catalogApiMock.mock();

  let catalogImportClient: CatalogImportClient;

  beforeEach(() => {
    catalogImportClient = new CatalogImportClient({
      discoveryApi,
      scmAuthApi,
      scmIntegrationsApi,
      fetchApi,
      catalogApi: catalogApi,
      configApi: new ConfigReader({
        app: {
          baseUrl: 'https://demo.backstage.io/',
        },
      }),
    });
  });

  afterEach(() => {
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

      expect(catalogApi.addLocation).toHaveBeenCalledTimes(1);
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

      expect(catalogApi.addLocation).toHaveBeenCalledTimes(1);
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

      expect(catalogApi.addLocation).toHaveBeenCalledTimes(1);
      expect(catalogApi.addLocation.mock.calls[0][0]).toEqual({
        type: 'url',
        target: 'http://example.com/folder/catalog-info.yaml?branch=test',
        dryRun: true,
      });
    });

    it('should reject for integrations that are not github or azure', async () => {
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
          'This URL was not recognized as a valid git URL because there was no configured integration that matched the given host name. Currently GitHub and Azure DevOps are supported. You could try to paste the full URL to a catalog-info.yaml file instead.',
        ),
      );
    });

    it('should find locations from github', async () => {
      (new Octokit().search.code as any as jest.Mock).mockResolvedValueOnce({
        data: {
          total_count: 3,
          items: [
            { path: 'simple/path/catalog-info.yaml' },
            { path: 'co/mple/x/path/catalog-info.yaml' },
            { path: 'catalog-info.yaml' },
          ],
        },
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
              generateEntities: [],
              existingEntityFiles: [
                {
                  isRegistered: false,
                  location: {
                    type: 'url',
                    target:
                      'https://github.com/backstage/backstage/blob/main/simple/path/catalog-info.yaml',
                  },
                  entity: {
                    apiVersion: '1',
                    kind: 'k',
                    metadata: {
                      name: 'e',
                      namespace: 'n',
                    },
                  },
                },
                {
                  isRegistered: false,
                  location: {
                    type: 'url',
                    target:
                      'https://github.com/backstage/backstage/blob/main/co/mple/x/path/catalog-info.yaml',
                  },
                  entity: {
                    apiVersion: '1',
                    kind: 'k',
                    metadata: {
                      name: 'e',
                      namespace: 'n',
                    },
                  },
                },
                {
                  isRegistered: false,
                  location: {
                    type: 'url',
                    target:
                      'https://github.com/backstage/backstage/blob/main/catalog-info.yaml',
                  },
                  entity: {
                    apiVersion: '1',
                    kind: 'k',
                    metadata: {
                      name: 'e',
                      namespace: 'n',
                    },
                  },
                },
              ],
            }),
          );
        }),
      );

      await expect(
        catalogImportClient.analyzeUrl(
          'https://github.com/backstage/backstage',
        ),
      ).resolves.toEqual({
        locations: [
          {
            entities: [{ kind: 'k', name: 'e', namespace: 'n' }],
            exists: false,
            target:
              'https://github.com/backstage/backstage/blob/main/simple/path/catalog-info.yaml',
          },
          {
            entities: [{ kind: 'k', name: 'e', namespace: 'n' }],
            exists: false,
            target:
              'https://github.com/backstage/backstage/blob/main/co/mple/x/path/catalog-info.yaml',
          },
          {
            entities: [{ kind: 'k', name: 'e', namespace: 'n' }],
            exists: false,
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
        fetchApi,
        catalogApi: catalogApi,
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

      server.use(
        rest.post(`${mockBaseUrl}/analyze-location`, (req, res, ctx) => {
          expect(req.body).toEqual({
            location: {
              target: 'https://github.com/acme-corp/our-awesome-api',
              type: 'url',
            },
            catalogFilename: 'anvil.yaml',
          });

          return res(
            ctx.json({
              generateEntities: [],
              existingEntityFiles: [
                {
                  isRegistered: false,
                  location: {
                    type: 'url',
                    target:
                      'https://github.com/acme-corp/our-awesome-api/blob/main/anvil.yaml',
                  },
                  entity: {
                    apiVersion: '1',
                    kind: 'Location',
                    metadata: {
                      name: 'my-entity',
                      namespace: 'my-namespace',
                    },
                  },
                },
                {
                  isRegistered: false,
                  location: {
                    type: 'url',
                    target:
                      'https://github.com/acme-corp/our-awesome-api/blob/main/anvil.yaml',
                  },
                  entity: {
                    apiVersion: '1',
                    kind: 'Component',
                    metadata: {
                      name: 'my-entity',
                      namespace: 'my-namespace',
                    },
                  },
                },
              ],
            }),
          );
        }),
      );

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
            exists: false,
          },
        ],
        type: 'locations',
      });
    });
  });

  describe('submitPullRequest', () => {
    it('should create GitHub pull request', async () => {
      catalogApi.validateEntity.mockResolvedValueOnce({
        valid: true,
      });
      await expect(
        catalogImportClient.submitPullRequest({
          repositoryUrl: 'https://github.com/backstage/backstage',
          fileContent: `
            {
                "apiVersion": "backstage.io/v1alpha1",
                "kind": "Component",
                "metadata": {
                  "name": "valid-name",
                  "annotations": {
                      "github.com/project-slug": "backstage/example-repo"
                }
              },
              "spec": {
                  "type": "other",
                  "lifecycle": "unknown",
                  "owner": "backstage"
              }
            }
          `,
          title: 'A title/message',
          body: 'A body',
        }),
      ).resolves.toEqual({
        link: 'http://pull/request/0',
        location:
          'https://github.com/backstage/backstage/blob/main/catalog-info.yaml',
      });
      expect(catalogApi.validateEntity).toHaveBeenCalledTimes(1);
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
        content:
          'CiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICJhcGlWZXJzaW9uIjogImJhY2tzdGFnZS5pby92MWFscGhhMSIsCiAgICAgICAgICAgICAgICAia2luZCI6ICJDb21wb25lbnQiLAogICAgICAgICAgICAgICAgIm1ldGFkYXRhIjogewogICAgICAgICAgICAgICAgICAibmFtZSI6ICJ2YWxpZC1uYW1lIiwKICAgICAgICAgICAgICAgICAgImFubm90YXRpb25zIjogewogICAgICAgICAgICAgICAgICAgICAgImdpdGh1Yi5jb20vcHJvamVjdC1zbHVnIjogImJhY2tzdGFnZS9leGFtcGxlLXJlcG8iCiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAic3BlYyI6IHsKICAgICAgICAgICAgICAgICAgInR5cGUiOiAib3RoZXIiLAogICAgICAgICAgICAgICAgICAibGlmZWN5Y2xlIjogInVua25vd24iLAogICAgICAgICAgICAgICAgICAib3duZXIiOiAiYmFja3N0YWdlIgogICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgICAg',
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
    it('should create AzureDevops pull request', async () => {
      catalogApi.validateEntity.mockResolvedValueOnce({
        valid: true,
      });
      const azureMock = createAzurePullRequest as jest.Mock;
      azureMock.mockResolvedValueOnce({
        repository: {
          name: 'backstage',
          webUrl: 'https://dev.azure.com/spotify/backstage/_git/backstage',
        },
        pullRequestId: '01',
      } satisfies AzurePrResult);
      const expectedPrOptions: AzurePrOptions = {
        title: 'A title/message',
        description: 'A body',
        repository: 'backstage',
        fileName: 'catalog-info.yaml',
        project: 'backstage',
        tenantUrl: 'https://dev.azure.com/spotify',
        branchName: 'backstage-integration',
        token: 'token',
        fileContent: `
            {
                "apiVersion": "backstage.io/v1alpha1",
                "kind": "Component",
                "metadata": {
                  "name": "valid-name",
                  "annotations": {
                      "github.com/project-slug": "backstage/example-repo"
                }
              },
              "spec": {
                  "type": "other",
                  "lifecycle": "unknown",
                  "owner": "backstage"
              }
            }
          `,
      };
      await expect(
        catalogImportClient.submitPullRequest({
          repositoryUrl:
            'https://dev.azure.com/spotify/backstage/_git/backstage',
          fileContent: expectedPrOptions.fileContent,
          title: expectedPrOptions.title,
          body: expectedPrOptions.description,
        }),
      ).resolves.toEqual({
        link: 'https://dev.azure.com/spotify/backstage/_git/backstage/pullrequest/01',
        location:
          'https://dev.azure.com/spotify/backstage/_git/backstage?path=/catalog-info.yaml',
      });

      expect(azureMock).toHaveBeenCalledWith(expectedPrOptions);
    });
    it('Submit Pull Request with invalid component name', async () => {
      const ErrorMessage =
        'Policy check failed for component:default/invalid name; caused by Error: "metadata.name" is not valid; expected a string that is sequences of [a-zA-Z0-9] separated by any of [-_.], at most 63 characters in total but found "invalid name". To learn more about catalog file format, visit: https://github.com/backstage/backstage/blob/master/docs/architecture-decisions/adr002-default-catalog-file-format.md';
      catalogApi.validateEntity.mockRejectedValueOnce(new Error(ErrorMessage));
      await expect(
        catalogImportClient.submitPullRequest({
          repositoryUrl: 'https://github.com/acme-corp/our-awesome-api',
          fileContent: `
            {
                "apiVersion": "backstage.io/v1alpha1",
                "kind": "Component",
                "metadata": {
                  "name": "invalid name",
                  "annotations": {
                      "github.com/project-slug": "backstage/example-repo"
                }
              },
              "spec": {
                  "type": "other",
                  "lifecycle": "unknown",
                  "owner": "backstage"
              }
            }
          `,
          title: 'A title/message',
          body: 'A body',
        }),
      ).rejects.toThrow(ErrorMessage);
    });
    it('should create GitHub pull request with custom filename and branch name', async () => {
      catalogApi.validateEntity.mockResolvedValueOnce({
        valid: true,
      });
      const entityFilename = 'anvil.yaml';
      const pullRequestBranchName = 'anvil-integration';

      catalogImportClient = new CatalogImportClient({
        discoveryApi,
        scmAuthApi,
        scmIntegrationsApi,
        fetchApi,
        catalogApi: catalogApi,
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
          fileContent: `
            {
                "apiVersion": "backstage.io/v1alpha1",
                "kind": "Component",
                "metadata": {
                  "name": "valid-name",
                  "annotations": {
                      "github.com/project-slug": "backstage/example-repo"
                }
              },
              "spec": {
                  "type": "other",
                  "lifecycle": "unknown",
                  "owner": "backstage"
              }
            }
          `,
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
        fetchApi,
        catalogApi: catalogApi,
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
