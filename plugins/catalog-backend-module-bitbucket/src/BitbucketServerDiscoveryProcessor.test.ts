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
import { RequestHandler, rest } from 'msw';
import { setupServer } from 'msw/node';
import { BitbucketServerDiscoveryProcessor } from './BitbucketServerDiscoveryProcessor';
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

describe('BitbucketServerDiscoveryProcessor', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  afterEach(() => jest.resetAllMocks());

  describe('reject unrelated entries', () => {
    it('rejects unknown types', async () => {
      const processor = BitbucketServerDiscoveryProcessor.fromConfig(
        new ConfigReader({
          integrations: {
            bitbucket: [{ host: 'bitbucket.mycompany.com', token: 'blob' }],
          },
        }),
        { logger: getVoidLogger() },
      );
      const location: LocationSpec = {
        type: 'not-bitbucket-server-discovery',
        target: 'https://bitbucket.mycompany.com',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).resolves.toBeFalsy();
    });

    it('rejects unknown targets', async () => {
      const processor = BitbucketServerDiscoveryProcessor.fromConfig(
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
        type: 'bitbucket-server-discovery',
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
    const processor = BitbucketServerDiscoveryProcessor.fromConfig(
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
        type: 'bitbucket-server-discovery',
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
        type: 'bitbucket-server-discovery',
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
        type: 'bitbucket-server-discovery',
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
        type: 'bitbucket-server-discovery',
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
        type: 'bitbucket-server-discovery',
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
    const processor = BitbucketServerDiscoveryProcessor.fromConfig(
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
        type: 'bitbucket-server-discovery',
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
        type: 'bitbucket-server-discovery',
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
        type: 'bitbucket-server-discovery',
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
        type: 'bitbucket-server-discovery',
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
        type: 'bitbucket-server-discovery',
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

  describe('Custom repository parser', () => {
    const processor = BitbucketServerDiscoveryProcessor.fromConfig(
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
        type: 'bitbucket-server-discovery',
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
