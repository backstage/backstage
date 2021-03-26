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
import {
  BitbucketDiscoveryProcessor,
  readBitbucketOrg,
} from './BitbucketDiscoveryProcessor';
import { ConfigReader } from '@backstage/config';
import { LocationSpec } from '@backstage/catalog-model';
import { BitbucketClient, PagedResponse } from './bitbucket';

function pagedResponse(values: any): PagedResponse<any> {
  return {
    values: values,
    isLastPage: true,
  } as PagedResponse<any>;
}

describe('BitbucketDiscoveryProcessor', () => {
  const client: jest.Mocked<BitbucketClient> = {
    listProjects: jest.fn(),
    listRepositories: jest.fn(),
  } as any;

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
    it('output all repositories', async () => {
      const target =
        'https://bitbucket.mycompany.com/projects/*/repos/*/catalog.yaml';

      client.listProjects.mockResolvedValue(
        pagedResponse([{ key: 'backstage' }, { key: 'demo' }]),
      );
      client.listRepositories.mockResolvedValueOnce(
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
      client.listRepositories.mockResolvedValueOnce(
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

      const actual = await readBitbucketOrg(client, target);
      expect(actual).toContainEqual({
        type: 'url',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/backstage/browse/catalog.yaml',
      });
      expect(actual).toContainEqual({
        type: 'url',
        target:
          'https://bitbucket.mycompany.com/projects/demo/repos/demo/browse/catalog.yaml',
      });
    });

    it('output repositories with wildcards', async () => {
      const target =
        'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-*/catalog.yaml';

      client.listProjects.mockResolvedValue(
        pagedResponse([{ key: 'backstage' }]),
      );
      client.listRepositories.mockResolvedValueOnce(
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

      const actual = await readBitbucketOrg(client, target);

      expect(actual).toContainEqual({
        type: 'url',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-cli/browse/catalog.yaml',
      });
      expect(actual).toContainEqual({
        type: 'url',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-container/browse/catalog.yaml',
      });
    });
    it('filter unrelated repositories', async () => {
      const target =
        'https://bitbucket.mycompany.com/projects/backstage/repos/test/catalog.yaml';

      client.listProjects.mockResolvedValue(
        pagedResponse([{ key: 'backstage' }]),
      );
      client.listRepositories.mockResolvedValue(
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

      const actual = await readBitbucketOrg(client, target);

      expect(actual).toContainEqual({
        type: 'url',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/test/catalog.yaml',
      });
    });
  });
});
