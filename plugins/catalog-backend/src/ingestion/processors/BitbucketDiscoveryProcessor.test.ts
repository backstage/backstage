/*
 * Copyright 2021 Spotify AB
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
import { BitbucketDiscoveryProcessor } from './BitbucketDiscoveryProcessor';
import { ConfigReader } from '@backstage/config';
import { LocationSpec } from '@backstage/catalog-model';
import {
  BitbucketClient,
  BitbucketRepositoryParser,
  PagedResponse,
} from './bitbucket';
import { results } from './index';

function pagedResponse(values: any): PagedResponse<any> {
  return {
    values: values,
    isLastPage: true,
  } as PagedResponse<any>;
}

describe('BitbucketDiscoveryProcessor', () => {
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

  describe('handles repositories', () => {
    const processor = BitbucketDiscoveryProcessor.fromConfig(
      new ConfigReader({
        integrations: {
          bitbucket: [{ host: 'bitbucket.mycompany.com', token: 'blob' }],
        },
      }),
      { logger: getVoidLogger() },
    );

    it('output all repositories', async () => {
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/*/repos/*/catalog.yaml',
      };

      jest
        .spyOn(BitbucketClient.prototype, 'listProjects')
        .mockResolvedValue(
          pagedResponse([{ key: 'backstage' }, { key: 'demo' }]),
        );
      jest
        .spyOn(BitbucketClient.prototype, 'listRepositories')
        .mockResolvedValueOnce(
          pagedResponse([
            {
              slug: 'backstage',
              links: {
                self: [
                  {
                    href:
                      'https://bitbucket.mycompany.com/projects/backstage/repos/backstage/browse',
                  },
                ],
              },
            },
          ]),
        );
      jest
        .spyOn(BitbucketClient.prototype, 'listRepositories')
        .mockResolvedValueOnce(
          pagedResponse([
            {
              slug: 'demo',
              links: {
                self: [
                  {
                    href:
                      'https://bitbucket.mycompany.com/projects/demo/repos/demo/browse',
                  },
                ],
              },
            },
          ]),
        );
      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/backstage/repos/backstage/browse/catalog.yaml',
        },
        optional: true,
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/demo/repos/demo/browse/catalog.yaml',
        },
        optional: true,
      });
    });

    it('output repositories with wildcards', async () => {
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-*/catalog.yaml',
      };

      jest
        .spyOn(BitbucketClient.prototype, 'listProjects')
        .mockResolvedValue(pagedResponse([{ key: 'backstage' }]));
      jest
        .spyOn(BitbucketClient.prototype, 'listRepositories')
        .mockResolvedValueOnce(
          pagedResponse([
            { slug: 'backstage' },
            {
              slug: 'techdocs-cli',
              links: {
                self: [
                  {
                    href:
                      'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-cli/browse',
                  },
                ],
              },
            },
            {
              slug: 'techdocs-container',
              links: {
                self: [
                  {
                    href:
                      'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-container/browse',
                  },
                ],
              },
            },
          ]),
        );
      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-cli/browse/catalog.yaml',
        },
        optional: true,
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-container/browse/catalog.yaml',
        },
        optional: true,
      });
    });
    it('filter unrelated repositories', async () => {
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/test/catalog.yaml',
      };

      jest
        .spyOn(BitbucketClient.prototype, 'listProjects')
        .mockResolvedValue(pagedResponse([{ key: 'backstage' }]));
      jest
        .spyOn(BitbucketClient.prototype, 'listRepositories')
        .mockResolvedValue(
          pagedResponse([
            { slug: 'abstest' },
            { slug: 'testxyz' },
            {
              slug: 'test',
              links: {
                self: [
                  {
                    href:
                      'https://bitbucket.mycompany.com/projects/backstage/repos/test',
                  },
                ],
              },
            },
          ]),
        );

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/backstage/repos/test/catalog.yaml',
        },
        optional: true,
      });
    });
  });

  describe('Custom repository parser', () => {
    const customRepositoryParser: BitbucketRepositoryParser = async function* customRepositoryParser({}) {
      yield results.location(
        {
          type: 'custom-location-type',
          target: 'custom-target',
        },
        true,
      );
    };

    const processor = BitbucketDiscoveryProcessor.fromConfig(
      new ConfigReader({
        integrations: {
          bitbucket: [{ host: 'bitbucket.mycompany.com', token: 'blob' }],
        },
      }),
      { parser: customRepositoryParser, logger: getVoidLogger() },
    );

    it('use custom repository parser', async () => {
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/test/catalog.yaml',
      };

      jest
        .spyOn(BitbucketClient.prototype, 'listProjects')
        .mockResolvedValue(pagedResponse([{ key: 'backstage' }]));
      jest
        .spyOn(BitbucketClient.prototype, 'listRepositories')
        .mockResolvedValue(pagedResponse([{ slug: 'test' }]));

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'custom-location-type',
          target: 'custom-target',
        },
        optional: true,
      });
    });
  });
});
