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
import { ConfigReader } from '@backstage/config';
import { GithubCredentialsProvider } from '@backstage/integration';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { EventSubscriber } from '@backstage/plugin-events-node';
import { graphql } from '@octokit/graphql';
import {
  GithubMultiOrgEntityProvider,
  withLocations,
} from './GithubMultiOrgEntityProvider';
import { Logger } from 'winston';

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
    let mockClient: jest.Mock<any, any, any>;
    let entityProviderConnection: EntityProviderConnection;
    let logger: Logger;
    let gitHubConfig: { host: string };
    let mockGetCredentials: jest.Mock<any, any, any>;
    let entityProvider: GithubMultiOrgEntityProvider;

    beforeEach(() => {
      mockClient = jest.fn();
      (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

      entityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };

      logger = getVoidLogger();

      gitHubConfig = { host: 'github.com' };

      mockGetCredentials = jest.fn().mockReturnValue({
        headers: { token: 'blah' },
        type: 'app',
      });

      const githubCredentialsProvider: GithubCredentialsProvider = {
        getCredentials: mockGetCredentials,
      };

      entityProvider = new GithubMultiOrgEntityProvider({
        id: 'my-id',
        gitHubConfig,
        githubCredentialsProvider,
        githubUrl: 'https://github.com',
        logger,
        orgs: ['orgA', 'orgB'], // only include for tests that require it
      });

      entityProvider.connect(entityProviderConnection);
    });

    afterEach(() => jest.resetAllMocks());

    it('should read specified orgs', async () => {
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
                    'url:https://github.com/a',
                  'backstage.io/managed-by-origin-location':
                    'url:https://github.com/a',
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
                    'url:https://github.com/x',
                  'backstage.io/managed-by-origin-location':
                    'url:https://github.com/x',
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
                    'url:https://github.com/q',
                  'backstage.io/managed-by-origin-location':
                    'url:https://github.com/q',
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
                    'url:https://github.com/orgs/orgA/teams/team',
                  'backstage.io/managed-by-origin-location':
                    'url:https://github.com/orgs/orgA/teams/team',
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
                    'url:https://github.com/orgs/orgB/teams/team',
                  'backstage.io/managed-by-origin-location':
                    'url:https://github.com/orgs/orgB/teams/team',
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

      const githubCredentialsProvider: GithubCredentialsProvider = {
        getCredentials: mockGetCredentials,
      };

      entityProvider = new GithubMultiOrgEntityProvider({
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
                    'url:https://github.com/a',
                  'backstage.io/managed-by-origin-location':
                    'url:https://github.com/a',
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
                    'url:https://github.com/x',
                  'backstage.io/managed-by-origin-location':
                    'url:https://github.com/x',
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
                    'url:https://github.com/q',
                  'backstage.io/managed-by-origin-location':
                    'url:https://github.com/q',
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
                    'url:https://github.com/orgs/orgC/teams/team',
                  'backstage.io/managed-by-origin-location':
                    'url:https://github.com/orgs/orgC/teams/team',
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
                    'url:https://github.com/orgs/orgD/teams/team',
                  'backstage.io/managed-by-origin-location':
                    'url:https://github.com/orgs/orgD/teams/team',
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

    it('should not call applyMutation if an error is thrown', async () => {
      mockClient.mockImplementationOnce(() => {
        throw new Error('Network Error');
      });

      await expect(entityProvider.read()).rejects.toThrow('Network Error');

      expect(entityProviderConnection.applyMutation).not.toHaveBeenCalled();
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

  describe('events', () => {
    let onEvent: Function;

    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    beforeEach(() => {
      const logger = getVoidLogger();
      const config = new ConfigReader({
        integrations: {
          github: [
            {
              host: 'github.com',
            },
          ],
        },
      });

      const mockGetCredentials = jest.fn().mockReturnValue({
        headers: { token: 'blah' },
        type: 'app',
      });

      const githubCredentialsProvider: GithubCredentialsProvider = {
        getCredentials: mockGetCredentials,
      };

      const mockEventBroker = {
        publish: async () => {},
        subscribe: (subscriber: EventSubscriber) => {
          onEvent = subscriber.onEvent;
        },
      };

      const entityProvider = GithubMultiOrgEntityProvider.fromConfig(config, {
        id: 'my-id',
        githubCredentialsProvider,
        githubUrl: 'https://github.com',
        logger,
        orgs: ['orgA', 'orgB'],
        eventBroker: mockEventBroker,
      });

      entityProvider.connect(entityProviderConnection);
    });

    afterEach(() => jest.resetAllMocks());

    it('should ignore events from non-applicable orgs', async () => {
      await onEvent({
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
      });

      expect(entityProviderConnection.applyMutation).not.toHaveBeenCalled();

      await onEvent({
        topic: 'github.installation',
        eventPayload: {
          action: 'created',
          installation: {
            account: {
              login: 'test-org',
            },
          },
        },
      });

      expect(entityProviderConnection.applyMutation).not.toHaveBeenCalled();
    });

    describe('installation', () => {
      it('adds users and groups from new org', async () => {
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
                    combinedSlug: 'orgB/team',
                    name: 'TeamB',
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
          })
          .mockResolvedValueOnce({
            organization: {
              teams: {
                pageInfo: { hasNextPage: false },
                nodes: [
                  {
                    slug: 'team',
                    combinedSlug: 'orgA/team',
                    name: 'TeamA',
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
          })
          .mockResolvedValueOnce({
            organization: {
              teams: {
                pageInfo: { hasNextPage: false },
                nodes: [
                  {
                    slug: 'team',
                    combinedSlug: 'orgB/team',
                    name: 'TeamB',
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

        await onEvent({
          topic: 'github.installation',
          eventPayload: {
            action: 'created',
            installation: {
              account: {
                login: 'orgB',
              },
            },
          },
        });

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [
            {
              entity: {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'User',
                metadata: {
                  annotations: {
                    'backstage.io/managed-by-location':
                      'url:https://github.com/a',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/a',
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
                kind: 'Group',
                metadata: {
                  annotations: {
                    'backstage.io/managed-by-location':
                      'url:https://github.com/orgs/orgB/teams/team',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/orgs/orgB/teams/team',
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
                    displayName: 'TeamB',
                    picture: 'http://example.com/team.jpeg',
                  },
                  type: 'team',
                  members: ['default/a'],
                },
              },
              locationKey: 'github-multi-org-provider:my-id',
            },
          ],
          removed: [],
        });
      });
    });

    describe('organization', () => {
      it('should add a new user', async () => {
        const mockClient = jest.fn();

        mockClient
          .mockResolvedValueOnce({
            user: {
              organizations: {
                pageInfo: { hasNextPage: false },
                nodes: [
                  {
                    login: 'orgA',
                  },
                  {
                    login: 'orgB',
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
                    name: 'TeamB',
                    description: 'The one and only team',
                    avatarUrl: 'http://example.com/team.jpeg',
                    editTeamUrl: 'https://example.com',
                    parentTeam: {
                      slug: 'parent',
                    },
                    members: {
                      pageInfo: { hasNextPage: false },
                      nodes: [{ login: 'a', name: 'a' }],
                    },
                  },
                ],
              },
            },
          })
          .mockResolvedValueOnce({
            organization: {
              teams: {
                pageInfo: { hasNextPage: false },
                nodes: [],
              },
            },
          });

        (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

        await onEvent({
          topic: 'github.organization',
          eventPayload: {
            action: 'member_added',
            organization: {
              login: 'orgB',
            },
            membership: {
              user: {
                name: 'a',
                avatar_url: 'https://avatars.githubusercontent.com/u/83820368',
                email: 'user1@test.com',
                login: 'a',
              },
            },
          },
        });

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [
            {
              entity: {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'User',
                metadata: {
                  annotations: {
                    'backstage.io/managed-by-location':
                      'url:https://github.com/a',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/a',
                    'github.com/user-login': 'a',
                  },
                  name: 'a',
                },
                spec: {
                  memberOf: ['orga/team'],
                  profile: {
                    displayName: 'a',
                    email: 'user1@test.com',
                    picture: 'https://avatars.githubusercontent.com/u/83820368',
                  },
                },
              },
              locationKey: 'github-multi-org-provider:my-id',
            },
          ],
          removed: [],
        });
      });

      it('should remove a user', async () => {
        const mockClient = jest.fn();

        mockClient.mockResolvedValueOnce({
          user: {
            organizations: {
              pageInfo: { hasNextPage: false },
              nodes: [
                {
                  login: 'orgC',
                },
              ],
            },
          },
        });

        (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

        await onEvent({
          topic: 'github.organization',
          eventPayload: {
            action: 'member_removed',
            organization: {
              login: 'orgB',
            },
            membership: {
              user: {
                name: 'a',
                avatar_url: 'https://avatars.githubusercontent.com/u/83820368',
                email: 'user1@test.com',
                login: 'a',
              },
            },
          },
        });

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [],
          removed: [
            {
              entity: {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'User',
                metadata: {
                  annotations: {
                    'backstage.io/managed-by-location':
                      'url:https://github.com/a',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/a',
                    'github.com/user-login': 'a',
                  },
                  name: 'a',
                },
                spec: {
                  memberOf: [],
                  profile: {
                    displayName: 'a',
                    email: 'user1@test.com',
                    picture: 'https://avatars.githubusercontent.com/u/83820368',
                  },
                },
              },
              locationKey: 'github-multi-org-provider:my-id',
            },
          ],
        });
      });

      it('should only update group memberships of a user that still belongs to an applicable org', async () => {
        const mockClient = jest.fn();

        mockClient
          .mockResolvedValueOnce({
            user: {
              organizations: {
                pageInfo: { hasNextPage: false },
                nodes: [
                  {
                    login: 'orgA',
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
                    name: 'TeamB',
                    description: 'The one and only team',
                    avatarUrl: 'http://example.com/team.jpeg',
                    editTeamUrl: 'https://example.com',
                    parentTeam: {
                      slug: 'parent',
                    },
                    members: {
                      pageInfo: { hasNextPage: false },
                      nodes: [{ login: 'a', name: 'a' }],
                    },
                  },
                ],
              },
            },
          });

        (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

        await onEvent({
          topic: 'github.organization',
          eventPayload: {
            action: 'member_removed',
            organization: {
              login: 'orgB',
            },
            membership: {
              user: {
                name: 'a',
                avatar_url: 'https://avatars.githubusercontent.com/u/83820368',
                email: 'user1@test.com',
                login: 'a',
              },
            },
          },
        });

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [
            {
              entity: {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'User',
                metadata: {
                  annotations: {
                    'backstage.io/managed-by-location':
                      'url:https://github.com/a',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/a',
                    'github.com/user-login': 'a',
                  },
                  name: 'a',
                },
                spec: {
                  memberOf: ['orga/team'],
                  profile: {
                    displayName: 'a',
                    email: 'user1@test.com',
                    picture: 'https://avatars.githubusercontent.com/u/83820368',
                  },
                },
              },
              locationKey: 'github-multi-org-provider:my-id',
            },
          ],
          removed: [],
        });
      });
    });

    describe('team', () => {
      it('should create a new group from a new team', async () => {
        await onEvent({
          topic: 'github.team',
          eventPayload: {
            action: 'created',
            organization: {
              login: 'orgB',
            },
            team: {
              name: 'New Team',
              slug: 'new-team',
              description: 'description from the new team',
              html_url: 'https://github.com/orgs/orgB/teams/new-team',
              parent: {
                slug: 'father-team',
              },
            },
          },
        });

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [
            {
              entity: {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Group',
                metadata: {
                  name: 'new-team',
                  namespace: 'orgb',
                  description: 'description from the new team',
                  annotations: {
                    'backstage.io/edit-url':
                      'https://github.com/orgs/orgB/teams/new-team/edit',
                    'backstage.io/managed-by-location':
                      'url:https://github.com/orgs/orgB/teams/new-team',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/orgs/orgB/teams/new-team',
                    'github.com/team-slug': 'orgB/new-team',
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
              },
              locationKey: 'github-multi-org-provider:my-id',
            },
          ],
          removed: [],
        });
      });

      it('should remove a group from a deleted team', async () => {
        await onEvent({
          topic: 'github.team',
          eventPayload: {
            action: 'deleted',
            organization: {
              login: 'orgB',
            },
            team: {
              name: 'New Team',
              slug: 'new-team',
              description: 'description from the new team',
              html_url: 'https://github.com/orgs/orgB/teams/new-team',
              parent: {
                slug: 'father-team',
              },
            },
          },
        });

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [],
          removed: [
            {
              entity: {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Group',
                metadata: {
                  name: 'new-team',
                  namespace: 'orgb',
                  description: 'description from the new team',
                  annotations: {
                    'backstage.io/edit-url':
                      'https://github.com/orgs/orgB/teams/new-team/edit',
                    'backstage.io/managed-by-location':
                      'url:https://github.com/orgs/orgB/teams/new-team',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/orgs/orgB/teams/new-team',
                    'github.com/team-slug': 'orgB/new-team',
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
              },
              locationKey: 'github-multi-org-provider:my-id',
            },
          ],
        });
      });

      it('should update group and user entities when a team is edited', async () => {
        const mockClient = jest.fn();

        mockClient
          .mockResolvedValueOnce({
            organization: {
              team: {
                slug: 'team',
                combinedSlug: 'orgA/team',
                name: 'TeamA',
                description: 'The one and only team',
                avatarUrl: 'http://example.com/team.jpeg',
                editTeamUrl: 'https://example.com',
                parentTeam: {
                  slug: 'parent',
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [{ login: 'a', name: 'a' }],
                },
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
                    login: 'w',
                    name: 'x',
                    bio: 'y',
                    email: 'z',
                    avatarUrl: 'q',
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
                    name: 'TeamA',
                    description: 'The one and only team',
                    avatarUrl: 'http://example.com/team.jpeg',
                    editTeamUrl: 'https://example.com',
                    parentTeam: {
                      slug: 'parent',
                    },
                    members: {
                      pageInfo: { hasNextPage: false },
                      nodes: [{ login: 'a', name: 'a' }],
                    },
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
                    name: 'TeamB',
                    description: 'The one and only team',
                    avatarUrl: 'http://example.com/team.jpeg',
                    editTeamUrl: 'https://example.com',
                    parentTeam: {
                      slug: 'parent',
                    },
                    members: {
                      pageInfo: { hasNextPage: false },
                      nodes: [{ login: 'a', name: 'a' }],
                    },
                  },
                ],
              },
            },
          });

        (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

        await onEvent({
          topic: 'github.team',
          eventPayload: {
            action: 'edited',
            changes: {
              name: {
                from: 'oldName',
              },
              description: {
                from: 'oldDescription',
              },
            },
            team: {
              slug: 'team',
              parent: {
                slug: 'parent',
              },
            },
            organization: {
              login: 'orgA',
            },
          },
        });

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [
            {
              entity: {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'User',
                metadata: {
                  annotations: {
                    'backstage.io/managed-by-location':
                      'url:https://github.com/a',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/a',
                    'github.com/user-login': 'a',
                  },
                  name: 'a',
                  description: 'c',
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
                kind: 'Group',
                metadata: {
                  annotations: {
                    'backstage.io/edit-url': 'https://example.com',
                    'backstage.io/managed-by-location':
                      'url:https://github.com/orgs/orgA/teams/team',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/orgs/orgA/teams/team',
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
                    displayName: 'TeamA',
                    picture: 'http://example.com/team.jpeg',
                  },
                  type: 'team',
                  members: ['default/a'],
                },
              },
              locationKey: 'github-multi-org-provider:my-id',
            },
          ],
          removed: [
            {
              entity: {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Group',
                metadata: {
                  annotations: {
                    'backstage.io/managed-by-location':
                      'url:https://github.com/orgs/orgA/teams/oldname',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/orgs/orgA/teams/oldname',
                    'github.com/team-slug': 'orgA/oldname',
                  },
                  namespace: 'orga',
                  name: 'oldname',
                  description: 'oldDescription',
                },
                spec: {
                  children: [],
                  parent: 'parent',
                  profile: {
                    displayName: 'oldName',
                  },
                  type: 'team',
                  members: [],
                },
              },
              locationKey: 'github-multi-org-provider:my-id',
            },
          ],
        });
      });
    });

    describe('membership', () => {
      it('should update group and user entities when a member is added', async () => {
        const mockClient = jest.fn();

        mockClient
          .mockResolvedValueOnce({
            organization: {
              team: {
                slug: 'team',
                combinedSlug: 'orgA/team',
                name: 'TeamA',
                description: 'The one and only team',
                avatarUrl: 'http://example.com/team.jpeg',
                editTeamUrl: 'https://example.com',
                parentTeam: {
                  slug: 'parent',
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [{ login: 'a', name: 'a' }],
                },
              },
            },
          })
          .mockResolvedValueOnce({
            user: {
              organizations: {
                pageInfo: { hasNextPage: false },
                nodes: [
                  {
                    login: 'orgA',
                  },
                  {
                    login: 'orgB',
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
                    name: 'TeamA',
                    description: 'The one and only team',
                    avatarUrl: 'http://example.com/team.jpeg',
                    editTeamUrl: 'https://example.com',
                    parentTeam: {
                      slug: 'parent',
                    },
                    members: {
                      pageInfo: { hasNextPage: false },
                      nodes: [{ login: 'a', name: 'a' }],
                    },
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
                    name: 'TeamB',
                    description: 'The one and only team',
                    avatarUrl: 'http://example.com/team.jpeg',
                    editTeamUrl: 'https://example.com',
                    parentTeam: {
                      slug: 'parent',
                    },
                    members: {
                      pageInfo: { hasNextPage: false },
                      nodes: [{ login: 'a', name: 'a' }],
                    },
                  },
                ],
              },
            },
          });

        (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

        await onEvent({
          topic: 'github.membership',
          eventPayload: {
            action: 'added',
            organization: {
              login: 'orgA',
            },
            team: {
              slug: 'teama',
            },
            member: {
              name: 'a',
              login: 'a',
              avatar_url: 'https://avatars.githubusercontent.com/u/83820368',
              email: 'user1@test.com',
            },
          },
        });

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [
            {
              entity: {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Group',
                metadata: {
                  annotations: {
                    'backstage.io/edit-url': 'https://example.com',
                    'backstage.io/managed-by-location':
                      'url:https://github.com/orgs/orgA/teams/team',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/orgs/orgA/teams/team',
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
                    displayName: 'TeamA',
                    picture: 'http://example.com/team.jpeg',
                  },
                  type: 'team',
                  members: ['default/a'],
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
                      'url:https://github.com/a',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/a',
                    'github.com/user-login': 'a',
                  },
                  name: 'a',
                },
                spec: {
                  memberOf: ['orga/team', 'orgb/team'],
                  profile: {
                    displayName: 'a',
                    email: 'user1@test.com',
                    picture: 'https://avatars.githubusercontent.com/u/83820368',
                  },
                },
              },
              locationKey: 'github-multi-org-provider:my-id',
            },
          ],
          removed: [],
        });
      });

      it('should update group and user entities when a member is removed', async () => {
        const mockClient = jest.fn();

        mockClient
          .mockResolvedValueOnce({
            organization: {
              team: {
                slug: 'team',
                combinedSlug: 'orgA/team',
                name: 'TeamA',
                description: 'The one and only team',
                avatarUrl: 'http://example.com/team.jpeg',
                editTeamUrl: 'https://example.com',
                parentTeam: {
                  slug: 'parent',
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [],
                },
              },
            },
          })
          .mockResolvedValueOnce({
            user: {
              organizations: {
                pageInfo: { hasNextPage: false },
                nodes: [
                  {
                    login: 'orgA',
                  },
                  {
                    login: 'orgB',
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
                    name: 'TeamA',
                    description: 'The one and only team',
                    avatarUrl: 'http://example.com/team.jpeg',
                    editTeamUrl: 'https://example.com',
                    parentTeam: {
                      slug: 'parent',
                    },
                    members: {
                      pageInfo: { hasNextPage: false },
                      nodes: [],
                    },
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
                    name: 'TeamB',
                    description: 'The one and only team',
                    avatarUrl: 'http://example.com/team.jpeg',
                    editTeamUrl: 'https://example.com',
                    parentTeam: {
                      slug: 'parent',
                    },
                    members: {
                      pageInfo: { hasNextPage: false },
                      nodes: [{ login: 'a', name: 'a' }],
                    },
                  },
                ],
              },
            },
          });

        (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

        await onEvent({
          topic: 'github.membership',
          eventPayload: {
            action: 'removed',
            organization: {
              login: 'orgA',
            },
            team: {
              slug: 'teama',
            },
            member: {
              name: 'a',
              login: 'a',
              avatar_url: 'https://avatars.githubusercontent.com/u/83820368',
              email: 'user1@test.com',
            },
          },
        });

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [
            {
              entity: {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Group',
                metadata: {
                  annotations: {
                    'backstage.io/edit-url': 'https://example.com',
                    'backstage.io/managed-by-location':
                      'url:https://github.com/orgs/orgA/teams/team',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/orgs/orgA/teams/team',
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
                    displayName: 'TeamA',
                    picture: 'http://example.com/team.jpeg',
                  },
                  type: 'team',
                  members: [],
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
                      'url:https://github.com/a',
                    'backstage.io/managed-by-origin-location':
                      'url:https://github.com/a',
                    'github.com/user-login': 'a',
                  },
                  name: 'a',
                },
                spec: {
                  memberOf: ['orgb/team'],
                  profile: {
                    displayName: 'a',
                    email: 'user1@test.com',
                    picture: 'https://avatars.githubusercontent.com/u/83820368',
                  },
                },
              },
              locationKey: 'github-multi-org-provider:my-id',
            },
          ],
          removed: [],
        });
      });
    });
  });
});
