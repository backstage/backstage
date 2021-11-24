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
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import {
  GithubCredentialsProvider,
  GitHubIntegrationConfig,
} from '@backstage/integration';
import { GitHubOrgEntityProvider } from '.';
import { EntityProviderConnection } from '../../providers';
import { withLocations } from './GitHubOrgEntityProvider';
import { graphql } from '@octokit/graphql';

jest.mock('@octokit/graphql');

describe('GitHubOrgEntityProvider', () => {
  describe('read', () => {
    afterEach(() => jest.resetAllMocks());

    it('should read org data and apply mutation', async () => {
      const mockClient = jest.fn();

      mockClient
        .mockResolvedValueOnce({
          organization: {
            membersWithRole: {
              pageInfo: { hasNextPage: false },
              nodes: [
                {
                  login: 'a',
                  name: 'b',
                  bio: 'c',
                  email: 'd',
                  avatarUrl: 'e',
                },
              ],
            },
          },
        })
        .mockResolvedValueOnce({
          organization: {
            teams: {
              pageInfo: { hasNextPage: false },
              nodes: [
                {
                  slug: 'team',
                  combinedSlug: 'blah/team',
                  name: 'Team',
                  description: 'The one and only team',
                  avatarUrl: 'http://example.com/team.jpeg',
                  parentTeam: {
                    slug: 'parent',
                    combinedSlug: '',
                    members: { pageInfo: { hasNextPage: false }, nodes: [] },
                  },
                  members: {
                    pageInfo: { hasNextPage: false },
                    nodes: [{ login: 'a' }],
                  },
                },
              ],
            },
          },
        });

      (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

      const entityProviderConnection: EntityProviderConnection = {
        applyMutation: jest.fn(),
      };

      const logger = getVoidLogger();
      const gitHubConfig: GitHubIntegrationConfig = {
        host: 'https://github.com',
      };

      const mockGetCredentials = jest.fn().mockReturnValue({
        headers: { token: 'blah' },
        type: 'app',
      });

      jest.spyOn(GithubCredentialsProvider, 'create').mockReturnValue({
        getCredentials: mockGetCredentials,
      } as any);

      const entityProvider = new GitHubOrgEntityProvider({
        id: 'my-id',
        orgUrl: 'https://github.com/backstage',
        gitHubConfig,
        logger,
      });

      entityProvider.connect(entityProviderConnection);

      await entityProvider.read();

      expect(entityProviderConnection.applyMutation).toBeCalledWith({
        entities: [
          {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'User',
              metadata: {
                annotations: {
                  'backstage.io/managed-by-location':
                    'url:https://https://github.com/a',
                  'backstage.io/managed-by-origin-location':
                    'url:https://https://github.com/a',
                  'github.com/user-login': 'a',
                },
                description: 'c',
                name: 'a',
              },
              spec: {
                memberOf: ['team'],
                profile: {
                  displayName: 'b',
                  email: 'd',
                  picture: 'e',
                },
              },
            },
            locationKey: 'github-org-provider:my-id',
          },
          {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Group',
              metadata: {
                annotations: {
                  'backstage.io/managed-by-location':
                    'url:https://https://github.com/orgs/backstage/teams/team',
                  'backstage.io/managed-by-origin-location':
                    'url:https://https://github.com/orgs/backstage/teams/team',
                  'github.com/team-slug': 'blah/team',
                },
                name: 'team',
                description: 'The one and only team',
              },
              spec: {
                children: [],
                parent: 'parent',
                profile: {
                  displayName: 'Team',
                  picture: 'http://example.com/team.jpeg',
                },
                type: 'team',
              },
            },
            locationKey: 'github-org-provider:my-id',
          },
        ],
        type: 'full',
      });
    });
  });

  describe('withLocations', () => {
    it('should set location for user', () => {
      const entity: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'githubuser',
        },
        spec: {
          memberOf: [],
        },
      };

      expect(withLocations('https://github.com', 'backstage', entity)).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'githubuser',
          annotations: {
            'backstage.io/managed-by-location':
              'url:https://github.com/githubuser',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/githubuser',
          },
        },
        spec: {
          memberOf: [],
        },
      });
    });

    it('should set location for group', () => {
      const entity: GroupEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'mygroup',
        },
        spec: {
          type: 'team',
          children: [],
        },
      };

      expect(withLocations('https://github.com', 'backstage', entity)).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'mygroup',
          annotations: {
            'backstage.io/managed-by-location':
              'url:https://github.com/orgs/backstage/teams/mygroup',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/orgs/backstage/teams/mygroup',
          },
        },
        spec: {
          type: 'team',
          children: [],
        },
      });
    });
  });
});
