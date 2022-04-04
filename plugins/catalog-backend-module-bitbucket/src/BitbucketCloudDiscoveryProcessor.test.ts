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
import {
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-backend';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { BitbucketCloudDiscoveryProcessor } from './BitbucketCloudDiscoveryProcessor';
import { BitbucketRepository20, PagedResponse20 } from './lib';

const server = setupServer();

function setupBitbucketCloudStubs(
  workspace: string,
  repositories: Pick<BitbucketRepository20, 'slug' | 'project'>[],
) {
  const stubCallerFn = jest.fn();
  function pagedResponse(values: any): PagedResponse20<any> {
    return {
      values: values,
      page: 1,
    } as PagedResponse20<any>;
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
  repositories: Pick<BitbucketRepository20, 'slug' | 'project'>[],
  catalogPath: string,
) {
  const stubCallerFn = jest.fn();
  function pagedResponse(values: any): PagedResponse20<any> {
    return {
      values: values,
      page: 1,
    } as PagedResponse20<any>;
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

describe('BitbucketCloudDiscoveryProcessor', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  afterEach(() => jest.resetAllMocks());

  describe('reject unrelated entries', () => {
    it('rejects unknown types', async () => {
      const processor = BitbucketCloudDiscoveryProcessor.fromConfig(
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
      const location: LocationSpec = {
        type: 'not-bitbucket-cloud-discovery',
        target: 'https://bitbucket.org',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).resolves.toBeFalsy();
    });

    it('rejects unknown targets', async () => {
      const processor = BitbucketCloudDiscoveryProcessor.fromConfig(
        new ConfigReader({
          integrations: {
            bitbucket: [
              {
                host: 'bitbucket.org',
                username: 'myuser',
                appPassword: 'blob',
              },
              { host: 'bitbucket.mycompany.com', token: 'blob' },
            ],
          },
        }),
        { logger: getVoidLogger() },
      );
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
        target: 'https://not.bitbucket.org/foobar',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).rejects.toThrow(
        /There is no Bitbucket integration that matches https:\/\/not.bitbucket.org\/foobar/,
      );
    });
  });

  describe('handles cloud repositories', () => {
    const processor = BitbucketCloudDiscoveryProcessor.fromConfig(
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
        { project: { key: 'prj-one' }, slug: 'repository-one' },
        { project: { key: 'prj-two' }, slug: 'repository-two' },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
        { project: { key: 'prj-one' }, slug: 'repository-one' },
        { project: { key: 'prj-two' }, slug: 'repository-two' },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
        { project: { key: 'prj-one' }, slug: 'repository-one' },
        { project: { key: 'prj-two' }, slug: 'repository-two' },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
        { project: { key: 'prj-one' }, slug: 'repository-one' },
        { project: { key: 'prj-two' }, slug: 'repository-two' },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
        { project: { key: 'prj-one' }, slug: 'repository-one' },
        { project: { key: 'prj-one' }, slug: 'repository-two' },
        { project: { key: 'prj-one' }, slug: 'repository-three' },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
        { project: { key: 'prj-one' }, slug: 'repository-one' },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
        { project: { key: 'prj-one' }, slug: 'repository-one' },
      ]);

      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
        { project: { key: 'prj-one' }, slug: 'repository-one' },
      ]);

      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
        target: target,
      };

      const emitter = jest.fn();
      await expect(
        processor.readLocation(location, false, emitter),
      ).rejects.toThrow(/Failed to parse /);
    });
  });

  describe('handles cloud repositories using code search', () => {
    const processor = BitbucketCloudDiscoveryProcessor.fromConfig(
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
          { project: { key: 'prj-one' }, slug: 'repository-one' },
          { project: { key: 'prj-two' }, slug: 'repository-two' },
        ],
        'catalog-info.yaml',
      );
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
          { project: { key: 'prj-one' }, slug: 'repository-one' },
          { project: { key: 'prj-two' }, slug: 'repository-two' },
        ],
        'my/nested/path/catalog.yaml',
      );
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
          { project: { key: 'prj-one' }, slug: 'repository-one' },
          { project: { key: 'prj-two' }, slug: 'repository-two' },
        ],
        'catalog.yaml',
      );
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
          { project: { key: 'prj-one' }, slug: 'repository-one' },
          { project: { key: 'prj-two' }, slug: 'repository-two' },
        ],
        'catalog.yaml',
      );
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
          { project: { key: 'prj-one' }, slug: 'repository-one' },
          { project: { key: 'prj-one' }, slug: 'repository-two' },
          { project: { key: 'prj-one' }, slug: 'repository-three' },
        ],
        'catalog.yaml',
      );
      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
        [{ project: { key: 'prj-one' }, slug: 'repository-one' }],
        'catalog-info.yaml',
      );

      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
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
        [{ project: { key: 'prj-one' }, slug: 'repository-one' }],
        'catalog-info.yaml',
      );

      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
        target: target,
      };

      const emitter = jest.fn();
      await expect(
        processor.readLocation(location, false, emitter),
      ).rejects.toThrow(/Failed to parse /);
    });
  });

  describe('Custom repository parser', () => {
    const processor = BitbucketCloudDiscoveryProcessor.fromConfig(
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
      setupBitbucketCloudStubs('myworkspace', [
        { project: { key: 'prj-one' }, slug: 'repository-one' },
      ]);

      const location: LocationSpec = {
        type: 'bitbucket-cloud-discovery',
        target:
          'https://bitbucket.org/workspaces/myworkspace/repos/repository-one',
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
