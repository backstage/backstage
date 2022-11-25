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
  GithubIntegrationConfig,
} from '@backstage/integration';
import { EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { graphql } from '@octokit/graphql';
import { EventParams } from '@backstage/plugin-events-node';
import {
  GithubOrgEntityProvider,
  withLocations,
} from './GithubOrgEntityProvider';

jest.mock('@octokit/graphql');

describe('GithubOrgEntityProvider', () => {
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

      const entityProvider = new GithubOrgEntityProvider({
        id: 'my-id',
        githubCredentialsProvider,
        orgUrl: 'https://github.com/backstage',
        gitHubConfig,
        logger,
      });

      entityProvider.connect(entityProviderConnection);

      await entityProvider.read();

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
                members: ['a'],
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

  describe('receiving events from github', () => {
    afterEach(() => jest.resetAllMocks());

    it('should apply delta added on receive a new member in the organization', async () => {
      const entityProviderConnection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };

      const logger = getVoidLogger();
      const gitHubConfig: GithubIntegrationConfig = {
        host: 'github.com',
      };

      const mockGetCredentials = jest.fn().mockReturnValue({
        headers: { token: 'blah' },
        type: 'app',
      });

      const githubCredentialsProvider: GithubCredentialsProvider = {
        getCredentials: mockGetCredentials,
      };

      const entityProvider = new GithubOrgEntityProvider({
        id: 'my-id',
        githubCredentialsProvider,
        orgUrl: 'https://github.com/backstage',
        gitHubConfig,
        logger,
      });

      entityProvider.connect(entityProviderConnection);

      const expectedEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'githubuser',
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
          profile: {
            displayName: 'githubuser',
            email: 'user1@test.com',
            picture: 'https://avatars.githubusercontent.com/u/83820368',
          },
        },
      };

      const event: EventParams = {
        topic: 'github.organization',
        eventPayload: {
          action: 'member_added',
          membership: {
            user: {
              name: 'githubuser',
              login: 'githubuser',
              avatar_url: 'https://avatars.githubusercontent.com/u/83820368',
              email: 'user1@test.com',
            },
          },
          organization: {
            login: 'test-org',
          },
        },
      };

      await entityProvider.onEvent(event);

      expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
      expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
        type: 'delta',
        added: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: expectedEntity,
          },
        ],
        removed: [],
      });
    });

    it('should apply delta removed on receive a removed member in the organization', async () => {
      const entityProviderConnection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };

      const logger = getVoidLogger();
      const gitHubConfig: GithubIntegrationConfig = {
        host: 'github.com',
      };

      const mockGetCredentials = jest.fn().mockReturnValue({
        headers: { token: 'blah' },
        type: 'app',
      });

      const githubCredentialsProvider: GithubCredentialsProvider = {
        getCredentials: mockGetCredentials,
      };

      const entityProvider = new GithubOrgEntityProvider({
        id: 'my-id',
        githubCredentialsProvider,
        orgUrl: 'https://github.com/test-org',
        gitHubConfig,
        logger,
      });

      entityProvider.connect(entityProviderConnection);

      const expectedEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'githubuser',
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
          profile: {
            displayName: 'githubuser',
            email: 'user1@test.com',
            picture: 'https://avatars.githubusercontent.com/u/83820368',
          },
        },
      };

      const event: EventParams = {
        topic: 'github.organization',
        eventPayload: {
          action: 'member_removed',
          membership: {
            user: {
              name: 'githubuser',
              login: 'githubuser',
              avatar_url: 'https://avatars.githubusercontent.com/u/83820368',
              email: 'user1@test.com',
            },
          },
          organization: {
            login: 'test-org',
          },
        },
      };

      await entityProvider.onEvent(event);

      expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
      expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
        type: 'delta',
        removed: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: expectedEntity,
          },
        ],
        added: [],
      });
    });

    it('should apply delta added on receive a created team', async () => {
      const entityProviderConnection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };

      const logger = getVoidLogger();
      const gitHubConfig: GithubIntegrationConfig = {
        host: 'github.com',
      };

      const mockGetCredentials = jest.fn().mockReturnValue({
        headers: { token: 'blah' },
        type: 'app',
      });

      const githubCredentialsProvider: GithubCredentialsProvider = {
        getCredentials: mockGetCredentials,
      };

      const entityProvider = new GithubOrgEntityProvider({
        id: 'my-id',
        githubCredentialsProvider,
        orgUrl: 'https://github.com/test-org',
        gitHubConfig,
        logger,
      });

      entityProvider.connect(entityProviderConnection);

      const expectedEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'new-team',
          description: 'description from the new team',
          annotations: {
            'backstage.io/edit-url':
              'https://github.com/orgs/test-org/teams/new-team/edit',
            'backstage.io/managed-by-location':
              'url:https://github.com/orgs/test-org/teams/new-team',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/orgs/test-org/teams/new-team',
            'github.com/team-slug': 'test-org/new-team',
          },
        },
        spec: {
          type: 'team',
          children: [],
          members: [],
          parent: 'father-team',
          profile: {
            displayName: 'New Team',
          },
        },
      };

      const event: EventParams = {
        topic: 'github.team',
        eventPayload: {
          action: 'created',
          team: {
            name: 'New Team',
            slug: 'new-team',
            description: 'description from the new team',
            html_url: 'https://github.com/orgs/test-org/teams/new-team',
            parent: {
              slug: 'father-team',
            },
          },
          organization: {
            login: 'test-org',
          },
        },
      };

      await entityProvider.onEvent(event);

      expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
      expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
        type: 'delta',
        added: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: expectedEntity,
          },
        ],
        removed: [],
      });
    });

    it('should apply delta removed on receive a deleted team', async () => {
      const entityProviderConnection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };

      const logger = getVoidLogger();
      const gitHubConfig: GithubIntegrationConfig = {
        host: 'github.com',
      };

      const mockGetCredentials = jest.fn().mockReturnValue({
        headers: { token: 'blah' },
        type: 'app',
      });

      const githubCredentialsProvider: GithubCredentialsProvider = {
        getCredentials: mockGetCredentials,
      };

      const entityProvider = new GithubOrgEntityProvider({
        id: 'my-id',
        githubCredentialsProvider,
        orgUrl: 'https://github.com/test-org',
        gitHubConfig,
        logger,
      });

      entityProvider.connect(entityProviderConnection);

      const expectedEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'new-team',
          description: 'description from the new team',
          annotations: {
            'backstage.io/edit-url':
              'https://github.com/orgs/test-org/teams/new-team/edit',
            'backstage.io/managed-by-location':
              'url:https://github.com/orgs/test-org/teams/new-team',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/orgs/test-org/teams/new-team',
            'github.com/team-slug': 'test-org/new-team',
          },
        },
        spec: {
          type: 'team',
          children: [],
          members: [],
          parent: 'father-team',
          profile: {
            displayName: 'New Team',
          },
        },
      };

      const event: EventParams = {
        topic: 'github.team',
        eventPayload: {
          action: 'deleted',
          team: {
            name: 'New Team',
            slug: 'new-team',
            description: 'description from the new team',
            html_url: 'https://github.com/orgs/test-org/teams/new-team',
            parent: {
              slug: 'father-team',
            },
          },
          organization: {
            login: 'test-org',
          },
        },
      };

      await entityProvider.onEvent(event);

      expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
      expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
        type: 'delta',
        removed: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: expectedEntity,
          },
        ],
        added: [],
      });
    });
  });
});
