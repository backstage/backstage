/*
 * Copyright 2023 The Backstage Authors
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
  GithubIntegrationConfig,
} from '@backstage/integration';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { graphql } from '@octokit/graphql';
import {
  GithubMultiOrgEntityProvider,
  withLocations,
} from './GithubMultiOrgEntityProvider';

jest.mock('@octokit/graphql');

const getAllInstallationsMock = jest.fn();
jest.mock('@backstage/integration', () => ({
  ...jest.requireActual('@backstage/integration'),
  GithubAppCredentialsMux: function mockGithubAppCredentialsMux() {
    return {
      getAllInstallations: getAllInstallationsMock,
    };
  },
}));

describe('GithubMultiOrgEntityProvider', () => {
  describe('read', () => {
    afterEach(() => jest.resetAllMocks());

    it('should read specified orgs', async () => {
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
                {
                  login: 'x',
                  name: 'y',
                  bio: 'z',
                  email: 'w',
                  avatarUrl: 'v',
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
                  combinedSlug: 'orgA/team',
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
                    nodes: [{ login: 'a' }, { login: 'x' }],
                  },
                },
              ],
            },
          },
        })
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
                {
                  login: 'x',
                  name: 'y',
                  bio: 'z',
                  email: 'w',
                  avatarUrl: 'v',
                },
                {
                  login: 'q',
                  name: 'r',
                  bio: 's',
                  email: 't',
                  avatarUrl: 'u',
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
                  combinedSlug: 'orgB/team',
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
                    nodes: [{ login: 'a' }, { login: 'q' }],
                  },
                },
              ],
            },
          },
        });

      (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

      const entityProviderConnection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };

      const logger = getVoidLogger();
      const gitHubConfig: GithubIntegrationConfig = {
        host: 'https://github.com',
      };

      const mockGetCredentials = jest.fn().mockReturnValue({
        headers: { token: 'blah' },
        type: 'app',
      });

      const githubCredentialsProvider: GithubCredentialsProvider = {
        getCredentials: mockGetCredentials,
      };

      const entityProvider = new GithubMultiOrgEntityProvider({
        id: 'my-id',
        gitHubConfig,
        githubCredentialsProvider,
        githubUrl: 'https://github.com',
        logger,
        orgs: ['orgA', 'orgB'],
      });

      entityProvider.connect(entityProviderConnection);

      await entityProvider.read();

      expect(mockGetCredentials).toHaveBeenCalledWith({
        url: 'https://github.com/orgA',
      });
      expect(mockGetCredentials).toHaveBeenCalledWith({
        url: 'https://github.com/orgB',
      });

      expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
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
                memberOf: ['orga/team', 'orgb/team'],
                profile: {
                  displayName: 'b',
                  email: 'd',
                  picture: 'e',
                },
              },
            },
            locationKey: 'github-multi-org-provider:my-id',
          },
          {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'User',
              metadata: {
                annotations: {
                  'backstage.io/managed-by-location':
                    'url:https://https://github.com/x',
                  'backstage.io/managed-by-origin-location':
                    'url:https://https://github.com/x',
                  'github.com/user-login': 'x',
                },
                description: 'z',
                name: 'x',
              },
              spec: {
                memberOf: ['orga/team'],
                profile: {
                  displayName: 'y',
                  email: 'w',
                  picture: 'v',
                },
              },
            },
            locationKey: 'github-multi-org-provider:my-id',
          },
          {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'User',
              metadata: {
                annotations: {
                  'backstage.io/managed-by-location':
                    'url:https://https://github.com/q',
                  'backstage.io/managed-by-origin-location':
                    'url:https://https://github.com/q',
                  'github.com/user-login': 'q',
                },
                description: 's',
                name: 'q',
              },
              spec: {
                memberOf: ['orgb/team'],
                profile: {
                  displayName: 'r',
                  email: 't',
                  picture: 'u',
                },
              },
            },
            locationKey: 'github-multi-org-provider:my-id',
          },
          {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Group',
              metadata: {
                annotations: {
                  'backstage.io/managed-by-location':
                    'url:https://https://github.com/orgs/orgA/teams/team',
                  'backstage.io/managed-by-origin-location':
                    'url:https://https://github.com/orgs/orgA/teams/team',
                  'github.com/team-slug': 'orgA/team',
                },
                namespace: 'orga',
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
                members: ['default/a', 'default/x'],
              },
            },
            locationKey: 'github-multi-org-provider:my-id',
          },
          {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Group',
              metadata: {
                annotations: {
                  'backstage.io/managed-by-location':
                    'url:https://https://github.com/orgs/orgB/teams/team',
                  'backstage.io/managed-by-origin-location':
                    'url:https://https://github.com/orgs/orgB/teams/team',
                  'github.com/team-slug': 'orgB/team',
                },
                namespace: 'orgb',
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
                members: ['default/a', 'default/q'],
              },
            },
            locationKey: 'github-multi-org-provider:my-id',
          },
        ],
        type: 'full',
      });
    });

    it('should read every accessible org', async () => {
      getAllInstallationsMock.mockResolvedValue([
        {
          target_type: 'Organization',
          account: {
            login: 'orgC',
          },
        },
        {
          target_type: 'Organization',
          account: {
            login: 'orgD',
          },
        },
      ]);

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
                {
                  login: 'x',
                  name: 'y',
                  bio: 'z',
                  email: 'w',
                  avatarUrl: 'v',
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
                  combinedSlug: 'orgC/team',
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
                    nodes: [{ login: 'a' }, { login: 'x' }],
                  },
                },
              ],
            },
          },
        })
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
                {
                  login: 'x',
                  name: 'y',
                  bio: 'z',
                  email: 'w',
                  avatarUrl: 'v',
                },
                {
                  login: 'q',
                  name: 'r',
                  bio: 's',
                  email: 't',
                  avatarUrl: 'u',
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
                  combinedSlug: 'orgD/team',
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
                    nodes: [{ login: 'a' }, { login: 'q' }],
                  },
                },
              ],
            },
          },
        });

      (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

      const entityProviderConnection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };

      const logger = getVoidLogger();
      const gitHubConfig: GithubIntegrationConfig = {
        host: 'https://github.com',
      };

      const mockGetCredentials = jest.fn().mockReturnValue({
        headers: { token: 'blah' },
        type: 'app',
      });

      const githubCredentialsProvider: GithubCredentialsProvider = {
        getCredentials: mockGetCredentials,
      };

      const entityProvider = new GithubMultiOrgEntityProvider({
        id: 'my-id',
        gitHubConfig,
        githubCredentialsProvider,
        githubUrl: 'https://github.com',
        logger,
      });

      entityProvider.connect(entityProviderConnection);

      await entityProvider.read();

      expect(mockGetCredentials).toHaveBeenCalledWith({
        url: 'https://github.com/orgC',
      });
      expect(mockGetCredentials).toHaveBeenCalledWith({
        url: 'https://github.com/orgD',
      });

      expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
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
                memberOf: ['orgc/team', 'orgd/team'],
                profile: {
                  displayName: 'b',
                  email: 'd',
                  picture: 'e',
                },
              },
            },
            locationKey: 'github-multi-org-provider:my-id',
          },
          {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'User',
              metadata: {
                annotations: {
                  'backstage.io/managed-by-location':
                    'url:https://https://github.com/x',
                  'backstage.io/managed-by-origin-location':
                    'url:https://https://github.com/x',
                  'github.com/user-login': 'x',
                },
                description: 'z',
                name: 'x',
              },
              spec: {
                memberOf: ['orgc/team'],
                profile: {
                  displayName: 'y',
                  email: 'w',
                  picture: 'v',
                },
              },
            },
            locationKey: 'github-multi-org-provider:my-id',
          },
          {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'User',
              metadata: {
                annotations: {
                  'backstage.io/managed-by-location':
                    'url:https://https://github.com/q',
                  'backstage.io/managed-by-origin-location':
                    'url:https://https://github.com/q',
                  'github.com/user-login': 'q',
                },
                description: 's',
                name: 'q',
              },
              spec: {
                memberOf: ['orgd/team'],
                profile: {
                  displayName: 'r',
                  email: 't',
                  picture: 'u',
                },
              },
            },
            locationKey: 'github-multi-org-provider:my-id',
          },
          {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Group',
              metadata: {
                annotations: {
                  'backstage.io/managed-by-location':
                    'url:https://https://github.com/orgs/orgC/teams/team',
                  'backstage.io/managed-by-origin-location':
                    'url:https://https://github.com/orgs/orgC/teams/team',
                  'github.com/team-slug': 'orgC/team',
                },
                namespace: 'orgc',
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
                members: ['default/a', 'default/x'],
              },
            },
            locationKey: 'github-multi-org-provider:my-id',
          },
          {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Group',
              metadata: {
                annotations: {
                  'backstage.io/managed-by-location':
                    'url:https://https://github.com/orgs/orgD/teams/team',
                  'backstage.io/managed-by-origin-location':
                    'url:https://https://github.com/orgs/orgD/teams/team',
                  'github.com/team-slug': 'orgD/team',
                },
                namespace: 'orgd',
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
                members: ['default/a', 'default/q'],
              },
            },
            locationKey: 'github-multi-org-provider:my-id',
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
          name: 'user-name',
          annotations: {
            'github.com/user-login': 'githubuser',
          },
        },
        spec: {
          memberOf: [],
        },
      };

      expect(withLocations('https://github.com', entity)).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'user-name',
          annotations: {
            'backstage.io/managed-by-location':
              'url:https://github.com/githubuser',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/githubuser',
            'github.com/user-login': 'githubuser',
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
          name: 'group-name',
          annotations: {
            'github.com/team-slug': 'backstage/mygroup',
          },
        },
        spec: {
          type: 'team',
          children: [],
        },
      };

      expect(withLocations('https://github.com', entity)).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'group-name',
          annotations: {
            'backstage.io/managed-by-location':
              'url:https://github.com/orgs/backstage/teams/mygroup',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/orgs/backstage/teams/mygroup',
            'github.com/team-slug': 'backstage/mygroup',
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
