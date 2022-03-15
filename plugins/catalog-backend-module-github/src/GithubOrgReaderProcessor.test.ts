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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import {
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { LocationSpec } from '@backstage/plugin-catalog-backend';
import { graphql } from '@octokit/graphql';
import { GithubOrgReaderProcessor } from './GithubOrgReaderProcessor';

jest.mock('@octokit/graphql');

describe('GithubOrgReaderProcessor', () => {
  describe('implementation', () => {
    const logger = getVoidLogger();
    const integrations = ScmIntegrations.fromConfig(
      new ConfigReader({
        integrations: {
          github: [
            {
              host: 'github.com',
            },
          ],
        },
      }),
    );
    let githubCredentialsProvider: GithubCredentialsProvider = {
      getCredentials() {
        return Promise.resolve({
          type: 'app',
          headers: { token: 'blah' },
        });
      },
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('rejects unknown targets from integrations', async () => {
      const processor = new GithubOrgReaderProcessor({
        integrations,
        logger,
        githubCredentialsProvider,
      });
      const location: LocationSpec = {
        type: 'github-org',
        target: 'https://not.github.com/apa',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).rejects.toThrow(
        /There is no GitHub Org provider that matches https:\/\/not.github.com\/apa/,
      );
    });

    it('should not query for email addresses when GitHub Apps is used for authentication', async () => {
      githubCredentialsProvider = {
        getCredentials() {
          return Promise.resolve({
            headers: { token: 'blah' },
            type: 'app',
          });
        },
      };

      const mockClient = jest.fn();

      mockClient
        .mockResolvedValueOnce({
          organization: {
            membersWithRole: { pageInfo: { hasNextPage: false }, nodes: [{}] },
          },
        })
        .mockResolvedValueOnce({
          organization: {
            teams: {
              pageInfo: { hasNextPage: false },
              nodes: [
                { members: { pageInfo: { hasNextPage: false }, nodes: [{}] } },
              ],
            },
          },
        });

      (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

      const processor = new GithubOrgReaderProcessor({
        integrations,
        logger,
        githubCredentialsProvider,
      });
      const location: LocationSpec = {
        type: 'github-org',
        target: 'https://github.com/backstage',
      };

      await processor.readLocation(location, false, () => {});

      expect(mockClient).toHaveBeenCalledWith(
        expect.stringContaining('@include(if: $email)'),
        expect.objectContaining({ email: false }),
      );
    });

    it('should query for email addresses when token is used for authentication', async () => {
      githubCredentialsProvider = {
        getCredentials() {
          return Promise.resolve({
            type: 'token',
            headers: { token: 'blah' },
          });
        },
      };

      const mockClient = jest.fn();

      mockClient
        .mockResolvedValueOnce({
          organization: {
            membersWithRole: { pageInfo: { hasNextPage: false }, nodes: [{}] },
          },
        })
        .mockResolvedValueOnce({
          organization: {
            teams: {
              pageInfo: { hasNextPage: false },
              nodes: [
                { members: { pageInfo: { hasNextPage: false }, nodes: [{}] } },
              ],
            },
          },
        });

      (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

      const processor = new GithubOrgReaderProcessor({
        integrations,
        logger,
        githubCredentialsProvider,
      });
      const location: LocationSpec = {
        type: 'github-org',
        target: 'https://github.com/backstage',
      };

      await processor.readLocation(location, false, () => {});

      expect(mockClient).toHaveBeenCalledWith(
        expect.stringContaining('@include(if: $email)'),
        expect.objectContaining({ email: true }),
      );
    });
  });
});
