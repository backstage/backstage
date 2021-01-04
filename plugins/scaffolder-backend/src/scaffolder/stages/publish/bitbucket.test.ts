/*
 * Copyright 2020 Spotify AB
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

const mockResponse = jest.fn();
jest.mock('./helpers');
jest.mock('cross-fetch', () => mockResponse);

import { BitbucketPublisher } from './bitbucket';
import { initRepoAndPush } from './helpers';
import { getVoidLogger } from '@backstage/backend-common';

describe('Bitbucket Publisher', () => {
  const logger = getVoidLogger();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('publish: createRemoteInBitbucketCloud', () => {
    it('should create repo in bitbucket cloud', async () => {
      const publisher = new BitbucketPublisher(
        'https://bitbucket.org',
        'fake-user',
        'fake-token',
      );
      mockResponse.mockResolvedValue({
        status: 200,
        json: () =>
          Promise.resolve({
            links: {
              html: {
                href: 'https://bitbucket.org/project/repo',
              },
              clone: [
                {
                  name: 'https',
                  href: 'https://bitbucket.org/project/repo',
                },
              ],
            },
          }),
      });

      const result = await publisher.publish({
        values: {
          storePath: 'project/repo',
          owner: 'bob',
        },
        directory: '/tmp/test',
        logger: logger,
      });

      expect(result).toEqual({
        remoteUrl: 'https://bitbucket.org/project/repo',
        catalogInfoUrl:
          'https://bitbucket.org/project/repo/src/master/catalog-info.yaml',
      });

      expect(initRepoAndPush).toHaveBeenCalledWith({
        dir: '/tmp/test',
        remoteUrl: 'https://bitbucket.org/project/repo',
        auth: { username: 'fake-user', password: 'fake-token' },
        logger: logger,
      });
    });
  });
  describe('publish: createRemoteInBitbucketServer', () => {
    it('should create repo in bitbucket server', async () => {
      const publisher = new BitbucketPublisher(
        'https://bitbucket.mycompany.com',
        'fake-user',
        'fake-token',
      );
      mockResponse.mockResolvedValue({
        status: 201,
        json: () =>
          Promise.resolve({
            links: {
              self: [
                {
                  href:
                    'https://bitbucket.mycompany.com/projects/project/repos/repo',
                },
              ],
              clone: [
                {
                  name: 'http',
                  href: 'https://bitbucket.mycompany.com/scm/project/repo',
                },
              ],
            },
          }),
      });

      const result = await publisher.publish({
        values: {
          storePath: 'project/repo',
          owner: 'bob',
        },
        directory: '/tmp/test',
        logger: logger,
      });

      expect(result).toEqual({
        remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
        catalogInfoUrl:
          'https://bitbucket.mycompany.com/projects/project/repos/repo/catalog-info.yaml',
      });

      expect(initRepoAndPush).toHaveBeenCalledWith({
        dir: '/tmp/test',
        remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
        auth: { username: 'fake-user', password: 'fake-token' },
        logger: logger,
      });
    });
  });
});
