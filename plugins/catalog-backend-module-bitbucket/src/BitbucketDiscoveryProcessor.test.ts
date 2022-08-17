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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { Models } from '@backstage/plugin-bitbucket-cloud-common';
import {
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-backend';
import { RequestHandler, rest } from 'msw';
import { setupServer } from 'msw/node';
import { BitbucketDiscoveryProcessor } from './BitbucketDiscoveryProcessor';
import { PagedResponse } from './lib';

const server = setupServer();

function setupStubs(
  projects: any[],
  bitbucketBaseUrl = `https://bitbucket.mycompany.com`,
) {
  function pagedResponse(values: any): PagedResponse<any> {
    return {
      values: values,
      isLastPage: true,
    } as PagedResponse<any>;
  }

  function stubbedProject(
    project: string,
    repos: string[],
  ): RequestHandler<any, any> {
    return rest.get(
      `${bitbucketBaseUrl}/api/rest/1.0/projects/${project}/repos`,
      (_, res, ctx) => {
        const response = [];
        for (const repo of repos) {
          response.push({
            slug: repo,
            links: {
              self: [
                {
                  href: `${bitbucketBaseUrl}/projects/${project}/repos/${repo}/browse`,
                },
              ],
            },
          });
        }
        return res(ctx.json(pagedResponse(response)));
      },
    );
  }

  server.use(
    rest.get(`${bitbucketBaseUrl}/api/rest/1.0/projects`, (_, res, ctx) => {
      return res(
        ctx.json(
          pagedResponse(
            projects.map(p => {
              return { key: p.key };
            }),
          ),
        ),
      );
    }),
  );

  for (const project of projects) {
    server.use(stubbedProject(project.key, project.repos));
  }
}

function setupBitbucketCloudStubs(
  workspace: string,
  repositories: Pick<Models.Repository, 'slug' | 'project'>[],
) {
  const stubCallerFn = jest.fn();
  function pagedResponse(values: any): Models.PaginatedRepositories {
    return {
      values: values,
      page: 1,
    } as Models.PaginatedRepositories;
  }

  server.use(
    rest.get(
      `https://api.bitbucket.org/2.0/repositories/${workspace}`,
      (req, res, ctx) => {
        stubCallerFn(req);
        return res(
          ctx.json(
            pagedResponse(
              repositories.map(r => ({
                ...r,
                links: {
                  html: {
                    href: `https://bitbucket.org/${workspace}/${r.slug}`,
                  },
                },
              })),
            ),
          ),
        );
      },
    ),
  );
  return stubCallerFn;
}

function setupBitbucketCloudSearchStubs(
  workspace: string,
  repositories: Pick<Models.Repository, 'slug' | 'project'>[],
  catalogPath: string,
) {
  const stubCallerFn = jest.fn();
  function pagedResponse(values: any): Models.PaginatedRepositories {
    return {
      values: values,
      page: 1,
    } as Models.PaginatedRepositories;
  }

  server.use(
    rest.get(
      `https://api.bitbucket.org/2.0/workspaces/${workspace}/search/code`,
      (req, res, ctx) => {
        stubCallerFn(req);
        return res(
          ctx.json(
            pagedResponse(
              repositories.map(r => ({
                type: 'code_search_result',
                content_match_count: 0,
                content_matches: [],
                path_matches: [
                  catalogPath
                    .split('/')
                    .flatMap(seg => [{ text: '/' }, { text: seg, match: true }])
                    .slice(1),
                ],
                file: {
                  commit: {
                    repository: {
                      ...r,
                      links: {
                        html: {
                          href: `https://bitbucket.org/${workspace}/${r.slug}`,
                        },
                      },
                    },
                  },
                  path: catalogPath,
                },
              })),
            ),
          ),
        );
      },
    ),
  );
  return stubCallerFn;
}

describe('BitbucketDiscoveryProcessor', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  afterEach(() => jest.resetAllMocks());

  describe('reject unrelated entries', () => {
    it('rejects unknown types', async () => {
      const processor = BitbucketDiscoveryProcessor.fromConfig(
        new ConfigReader({
          integrations: {
            bitbucket: [{ host: 'bitbucket.mycompany.com', token: 'blob' }],
          },
        }),
        { logger: getVoidLogger() },
      );
      const location: LocationSpec = {
        type: 'not-bitbucket-discovery',
        target: 'https://bitbucket.mycompany.com',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).resolves.toBeFalsy();
    });

    it('rejects unknown targets', async () => {
      const processor = BitbucketDiscoveryProcessor.fromConfig(
        new ConfigReader({
          integrations: {
            bitbucket: [
              { host: 'bitbucket.org', token: 'blob' },
              { host: 'bitbucket.mycompany.com', token: 'blob' },
            ],
          },
        }),
        { logger: getVoidLogger() },
      );
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target: 'https://not.bitbucket.mycompany.com/foobar',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).rejects.toThrow(
        /There is no Bitbucket integration that matches https:\/\/not.bitbucket.mycompany.com\/foobar/,
      );
    });
  });

  describe('handles organisation repositories', () => {
    const processor = BitbucketDiscoveryProcessor.fromConfig(
      new ConfigReader({
        integrations: {
          bitbucket: [
            {
              host: 'bitbucket.mycompany.com',
              token: 'blob',
              apiBaseUrl: 'https://bitbucket.mycompany.com/api/rest/1.0',
            },
          ],
        },
      }),
      { logger: getVoidLogger() },
    );

    it('output all repositories', async () => {
      setupStubs([
        { key: 'backstage', repos: ['backstage'] },
        { key: 'demo', repos: ['demo'] },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/*/repos/*/catalog.yaml',
      };

      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/backstage/repos/backstage/browse/catalog.yaml',
          presence: 'optional',
        },
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/demo/repos/demo/browse/catalog.yaml',
          presence: 'optional',
        },
      });
    });

    it('output repositories with wildcards', async () => {
      setupStubs([
        { key: 'backstage', repos: ['backstage', 'techdocs-cli'] },
        { key: 'demo', repos: ['demo'] },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-*/catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-cli/browse/catalog.yaml',
          presence: 'optional',
        },
      });
    });

    it('output repositories by target search ref', async () => {
      setupStubs([{ key: 'demo', repos: ['demo'] }]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/demo/repos/demo/catalog.yaml?ref=branch-name',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/demo/repos/demo/browse/catalog.yaml?ref=branch-name',
          presence: 'optional',
        },
      });
    });

    it('filter unrelated repositories', async () => {
      setupStubs([{ key: 'backstage', repos: ['test', 'abctest', 'testxyz'] }]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/test/catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/backstage/repos/test/browse/catalog.yaml',
          presence: 'optional',
        },
      });
    });

    it.each`
      target
      ${'https://bitbucket.mycompany.com/projects/backstage/repos/*'}
      ${'https://bitbucket.mycompany.com/projects/backstage/repos/*/'}
      ${'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-*/'}
    `("target '$target' adds default path to catalog", async ({ target }) => {
      setupStubs([{ key: 'backstage', repos: ['techdocs-cli'] }]);

      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target: target,
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-cli/browse/catalog-info.yaml',
          presence: 'optional',
        },
      });
    });
  });

  describe('handles organisation repositories with a custom baseURL', () => {
    const processor = BitbucketDiscoveryProcessor.fromConfig(
      new ConfigReader({
        integrations: {
          bitbucket: [
            {
              host: 'bitbucket.mycompany.com',
              token: 'blob',
              apiBaseUrl:
                'https://bitbucket.mycompany.com/custom-path/api/rest/1.0',
            },
          ],
        },
      }),
      { logger: getVoidLogger() },
    );

    it('output all repositories', async () => {
      setupStubs(
        [
          { key: 'backstage', repos: ['backstage'] },
          { key: 'demo', repos: ['demo'] },
        ],
        'https://bitbucket.mycompany.com/custom-path',
      );
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/custom-path/projects/*/repos/*/catalog.yaml',
      };

      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/custom-path/projects/backstage/repos/backstage/browse/catalog.yaml',
          presence: 'optional',
        },
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/custom-path/projects/demo/repos/demo/browse/catalog.yaml',
          presence: 'optional',
        },
      });
    });

    it('output repositories with wildcards', async () => {
      setupStubs(
        [
          { key: 'backstage', repos: ['backstage', 'techdocs-cli'] },
          { key: 'demo', repos: ['demo'] },
        ],
        'https://bitbucket.mycompany.com/custom-path',
      );
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/custom-path/projects/backstage/repos/techdocs-*/catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/custom-path/projects/backstage/repos/techdocs-cli/browse/catalog.yaml',
          presence: 'optional',
        },
      });
    });

    it('output repositories by target search ref', async () => {
      setupStubs(
        [{ key: 'demo', repos: ['demo'] }],
        'https://bitbucket.mycompany.com/custom-path',
      );
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/custom-path/projects/demo/repos/demo/catalog.yaml?ref=branch-name',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/custom-path/projects/demo/repos/demo/browse/catalog.yaml?ref=branch-name',
          presence: 'optional',
        },
      });
    });

    it('filter unrelated repositories', async () => {
      setupStubs(
        [{ key: 'backstage', repos: ['test', 'abctest', 'testxyz'] }],
        'https://bitbucket.mycompany.com/custom-path',
      );
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/custom-path/projects/backstage/repos/test/catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/custom-path/projects/backstage/repos/test/browse/catalog.yaml',
          presence: 'optional',
        },
      });
    });

    it.each`
      target
      ${'https://bitbucket.mycompany.com/custom-path/projects/backstage/repos/*'}
      ${'https://bitbucket.mycompany.com/custom-path/projects/backstage/repos/*/'}
      ${'https://bitbucket.mycompany.com/custom-path/projects/backstage/repos/techdocs-*/'}
    `("target '$target' adds default path to catalog", async ({ target }) => {
      setupStubs(
        [{ key: 'backstage', repos: ['techdocs-cli'] }],
        'https://bitbucket.mycompany.com/custom-path',
      );

      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target: target,
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/custom-path/projects/backstage/repos/techdocs-cli/browse/catalog-info.yaml',
          presence: 'optional',
        },
      });
    });
  });

  describe('handles cloud repositories', () => {
    const processor = BitbucketDiscoveryProcessor.fromConfig(
      new ConfigReader({
        integrations: {
          bitbucket: [
            {
              host: 'bitbucket.org',
              username: 'myuser',
              appPassword: 'blob',
            },
          ],
        },
      }),
      { logger: getVoidLogger() },
    );

    it('output all repositories by default', async () => {
      setupBitbucketCloudStubs('myworkspace', [
        {
          project: { type: 'project', key: 'prj-one' },
          slug: 'repository-one',
        },
        {
          project: { type: 'project', key: 'prj-two' },
          slug: 'repository-two',
        },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target: 'https://bitbucket.org/workspaces/myworkspace',
      };

      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(emitter).toBeCalledTimes(2);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-one/src/master/catalog-info.yaml',
          presence: 'optional',
        },
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-two/src/master/catalog-info.yaml',
          presence: 'optional',
        },
      });
    });

    it('uses provided catalog path', async () => {
      setupBitbucketCloudStubs('myworkspace', [
        {
          project: { type: 'project', key: 'prj-one' },
          slug: 'repository-one',
        },
        {
          project: { type: 'project', key: 'prj-two' },
          slug: 'repository-two',
        },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.org/workspaces/myworkspace?catalogPath=my/nested/path/catalog.yaml',
      };

      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(emitter).toBeCalledTimes(2);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-one/src/master/my/nested/path/catalog.yaml',
          presence: 'optional',
        },
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-two/src/master/my/nested/path/catalog.yaml',
          presence: 'optional',
        },
      });
    });

    it('output all repositories', async () => {
      setupBitbucketCloudStubs('myworkspace', [
        {
          project: { type: 'project', key: 'prj-one' },
          slug: 'repository-one',
        },
        {
          project: { type: 'project', key: 'prj-two' },
          slug: 'repository-two',
        },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.org/workspaces/myworkspace/projects/*/repos/*?catalogPath=catalog.yaml',
      };

      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(emitter).toBeCalledTimes(2);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-one/src/master/catalog.yaml',
          presence: 'optional',
        },
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-two/src/master/catalog.yaml',
          presence: 'optional',
        },
      });
    });

    it('output repositories with wildcards', async () => {
      setupBitbucketCloudStubs('myworkspace', [
        {
          project: { type: 'project', key: 'prj-one' },
          slug: 'repository-one',
        },
        {
          project: { type: 'project', key: 'prj-two' },
          slug: 'repository-two',
        },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.org/workspaces/myworkspace/projects/prj-one/repos/*?catalogPath=catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toBeCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-one/src/master/catalog.yaml',
          presence: 'optional',
        },
      });
    });

    it('filter unrelated repositories', async () => {
      setupBitbucketCloudStubs('myworkspace', [
        {
          project: { type: 'project', key: 'prj-one' },
          slug: 'repository-one',
        },
        {
          project: { type: 'project', key: 'prj-one' },
          slug: 'repository-two',
        },
        {
          project: { type: 'project', key: 'prj-one' },
          slug: 'repository-three',
        },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.org/workspaces/myworkspace/projects/prj-one/repos/repository-three?catalogPath=catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toBeCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-three/src/master/catalog.yaml',
          presence: 'optional',
        },
      });
    });

    it('submits query', async () => {
      const mockCall = setupBitbucketCloudStubs('myworkspace', [
        {
          project: { type: 'project', key: 'prj-one' },
          slug: 'repository-one',
        },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.org/workspaces/myworkspace?q=project.key ~ "prj-one"',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toBeCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-one/src/master/catalog-info.yaml',
          presence: 'optional',
        },
      });
      expect(mockCall).toBeCalledTimes(1);
      // it should be possible to do this via an `expect.objectContaining` check but seems to fail with some encoding issue.
      expect(mockCall.mock.calls[0][0].url).toMatchInlineSnapshot(
        `"https://api.bitbucket.org/2.0/repositories/myworkspace?page=1&pagelen=100&q=project.key+%7E+%22prj-one%22"`,
      );
    });

    it.each`
      target
      ${'https://bitbucket.org/workspaces/myworkspace/projects/prj-one/repos/*'}
      ${'https://bitbucket.org/workspaces/myworkspace/projects/prj-one/repos/*/'}
      ${'https://bitbucket.org/workspaces/myworkspace/projects/prj-one/repos/repository-*/'}
    `("target '$target' adds default path to catalog", async ({ target }) => {
      setupBitbucketCloudStubs('myworkspace', [
        {
          project: { type: 'project', key: 'prj-one' },
          slug: 'repository-one',
        },
      ]);

      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target: target,
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-one/src/master/catalog-info.yaml',
          presence: 'optional',
        },
      });
    });

    it.each`
      target
      ${'https://bitbucket.org/test'}
    `("target '$target' is rejected", async ({ target }) => {
      setupBitbucketCloudStubs('myworkspace', [
        {
          project: { type: 'project', key: 'prj-one' },
          slug: 'repository-one',
        },
      ]);

      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target: target,
      };

      const emitter = jest.fn();
      await expect(
        processor.readLocation(location, false, emitter),
      ).rejects.toThrow(/Failed to parse /);
    });
  });

  describe('handles cloud repositories using code search', () => {
    const processor = BitbucketDiscoveryProcessor.fromConfig(
      new ConfigReader({
        integrations: {
          bitbucket: [
            {
              host: 'bitbucket.org',
              username: 'myuser',
              appPassword: 'blob',
            },
          ],
        },
      }),
      { logger: getVoidLogger() },
    );

    it('output all repositories by default', async () => {
      setupBitbucketCloudSearchStubs(
        'myworkspace',
        [
          {
            project: { type: 'project', key: 'prj-one' },
            slug: 'repository-one',
          },
          {
            project: { type: 'project', key: 'prj-two' },
            slug: 'repository-two',
          },
        ],
        'catalog-info.yaml',
      );
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target: 'https://bitbucket.org/workspaces/myworkspace?search=true',
      };

      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(emitter).toBeCalledTimes(2);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-one/src/master/catalog-info.yaml',
          presence: 'required',
        },
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-two/src/master/catalog-info.yaml',
          presence: 'required',
        },
      });
    });

    it('uses provided catalog path', async () => {
      setupBitbucketCloudSearchStubs(
        'myworkspace',
        [
          {
            project: { type: 'project', key: 'prj-one' },
            slug: 'repository-one',
          },
          {
            project: { type: 'project', key: 'prj-two' },
            slug: 'repository-two',
          },
        ],
        'my/nested/path/catalog.yaml',
      );
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.org/workspaces/myworkspace?search=true&catalogPath=my/nested/path/catalog.yaml',
      };

      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(emitter).toBeCalledTimes(2);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-one/src/master/my/nested/path/catalog.yaml',
          presence: 'required',
        },
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-two/src/master/my/nested/path/catalog.yaml',
          presence: 'required',
        },
      });
    });

    it('output all repositories', async () => {
      setupBitbucketCloudSearchStubs(
        'myworkspace',
        [
          {
            project: { type: 'project', key: 'prj-one' },
            slug: 'repository-one',
          },
          {
            project: { type: 'project', key: 'prj-two' },
            slug: 'repository-two',
          },
        ],
        'catalog.yaml',
      );
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.org/workspaces/myworkspace/projects/*/repos/*?search=true&catalogPath=catalog.yaml',
      };

      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(emitter).toBeCalledTimes(2);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-one/src/master/catalog.yaml',
          presence: 'required',
        },
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-two/src/master/catalog.yaml',
          presence: 'required',
        },
      });
    });

    it('output repositories with wildcards', async () => {
      setupBitbucketCloudSearchStubs(
        'myworkspace',
        [
          {
            project: { type: 'project', key: 'prj-one' },
            slug: 'repository-one',
          },
          {
            project: { type: 'project', key: 'prj-two' },
            slug: 'repository-two',
          },
        ],
        'catalog.yaml',
      );
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.org/workspaces/myworkspace/projects/prj-one/repos/*?search=true&catalogPath=catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toBeCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-one/src/master/catalog.yaml',
          presence: 'required',
        },
      });
    });

    it('filter unrelated repositories', async () => {
      setupBitbucketCloudSearchStubs(
        'myworkspace',
        [
          {
            project: { type: 'project', key: 'prj-one' },
            slug: 'repository-one',
          },
          {
            project: { type: 'project', key: 'prj-one' },
            slug: 'repository-two',
          },
          {
            project: { type: 'project', key: 'prj-one' },
            slug: 'repository-three',
          },
        ],
        'catalog.yaml',
      );
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.org/workspaces/myworkspace/projects/prj-one/repos/repository-three?search=true&catalogPath=catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toBeCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-three/src/master/catalog.yaml',
          presence: 'required',
        },
      });
    });

    it.each`
      target
      ${'https://bitbucket.org/workspaces/myworkspace/projects/prj-one/repos/*?search=true'}
      ${'https://bitbucket.org/workspaces/myworkspace/projects/prj-one/repos/*/?search=true'}
      ${'https://bitbucket.org/workspaces/myworkspace/projects/prj-one/repos/repository-*/?search=true'}
    `("target '$target' adds default path to catalog", async ({ target }) => {
      setupBitbucketCloudSearchStubs(
        'myworkspace',
        [
          {
            project: { type: 'project', key: 'prj-one' },
            slug: 'repository-one',
          },
        ],
        'catalog-info.yaml',
      );

      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target: target,
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.org/myworkspace/repository-one/src/master/catalog-info.yaml',
          presence: 'required',
        },
      });
    });

    it.each`
      target
      ${'https://bitbucket.org/test?search=true'}
    `("target '$target' is rejected", async ({ target }) => {
      setupBitbucketCloudSearchStubs(
        'myworkspace',
        [
          {
            project: { type: 'project', key: 'prj-one' },
            slug: 'repository-one',
          },
        ],
        'catalog-info.yaml',
      );

      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target: target,
      };

      const emitter = jest.fn();
      await expect(
        processor.readLocation(location, false, emitter),
      ).rejects.toThrow(/Failed to parse /);
    });
  });

  describe('Custom repository parser', () => {
    const processor = BitbucketDiscoveryProcessor.fromConfig(
      new ConfigReader({
        integrations: {
          bitbucket: [
            {
              host: 'bitbucket.mycompany.com',
              token: 'blob',
              apiBaseUrl: 'https://bitbucket.mycompany.com/api/rest/1.0',
            },
          ],
        },
      }),
      {
        parser: async function* customRepositoryParser({}) {
          yield processingResult.location({
            type: 'custom-location-type',
            target: 'custom-target',
            presence: 'optional',
          });
        },
        logger: getVoidLogger(),
      },
    );

    it('use custom repository parser', async () => {
      setupStubs([{ key: 'backstage', repos: ['test'] }]);

      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/test/catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'custom-location-type',
          target: 'custom-target',
          presence: 'optional',
        },
      });
    });
  });
});
