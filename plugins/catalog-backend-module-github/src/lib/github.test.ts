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

import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { graphql as graphqlOctokit } from '@octokit/graphql';
import { graphql as graphqlMsw, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { TeamTransformer, UserTransformer } from './defaultTransformers';
import {
  getOrganizationsFromUser,
  getOrganizationTeams,
  getOrganizationUsers,
  getTeamMembers,
  getOrganizationRepositories,
  QueryResponse,
  GithubUser,
  GithubTeam,
  createAddEntitiesOperation,
  createRemoveEntitiesOperation,
  createReplaceEntitiesOperation,
  createGraphqlClient,
  getOrganizationTeamsForUser,
} from './github';
import { Octokit } from '@octokit/core';
import { throttling } from '@octokit/plugin-throttling';

jest.mock('@octokit/core', () => ({
  ...jest.requireActual('@octokit/core'),
  Octokit: {
    plugin: jest.fn().mockReturnValue({ defaults: jest.fn() }),
  },
}));

describe('github', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  const graphql = graphqlOctokit.defaults({});

  describe('getOrganizationTeamsForUser', () => {
    const org = 'my-org';
    const userLogin = 'testuser';

    it('returns teams for a user', async () => {
      server.use(
        graphqlMsw.query('teams', () =>
          HttpResponse.json({
            data: {
              organization: {
                teams: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [
                    {
                      slug: 'team1',
                      combinedSlug: 'my-org/team1',
                      name: 'Team 1',
                      description: 'desc',
                      avatarUrl: '',
                      editTeamUrl: '',
                      parentTeam: null,
                    },
                  ],
                },
              },
            },
          }),
        ),
      );

      const mockTransformer = jest.fn().mockImplementation(async team => ({
        kind: 'Group',
        metadata: { name: team.slug },
      }));

      const { teams } = await getOrganizationTeamsForUser(
        graphql as any,
        org,
        userLogin,
        mockTransformer as any,
      );
      expect(Array.isArray(teams)).toBe(true);
      expect(teams[0]).toEqual({ kind: 'Group', metadata: { name: 'team1' } });
      expect(mockTransformer).toHaveBeenCalled();
    });

    it('returns an empty array if no teams found', async () => {
      server.use(
        graphqlMsw.query('teams', () =>
          HttpResponse.json({
            data: {
              organization: {
                teams: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [],
                },
              },
            },
          }),
        ),
      );
      const mockTransformer = jest.fn().mockResolvedValue(undefined);
      const { teams } = await getOrganizationTeamsForUser(
        graphql as any,
        org,
        userLogin,
        mockTransformer as any,
      );
      expect(Array.isArray(teams)).toBe(true);
      expect(teams.length).toBe(0);
    });
  });

  describe('getOrganizationUsers using defaultUserMapper', () => {
    it('reads members', async () => {
      const input: QueryResponse = {
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
      };

      const output = {
        users: [
          expect.objectContaining({
            metadata: expect.objectContaining({ name: 'a', description: 'c' }),
            spec: {
              profile: { displayName: 'b', email: 'd', picture: 'e' },
              memberOf: [],
            },
          }),
        ],
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      await expect(
        getOrganizationUsers(graphql, 'a', 'token'),
      ).resolves.toEqual(output);
    });

    it('reads members excluding suspended users', async () => {
      const input: QueryResponse = {
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
                suspendedAt: '2025-01-01',
              },
              {
                login: 'a',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
                suspendedAt: undefined,
              },
            ],
          },
        },
      };

      const output = {
        users: [
          expect.objectContaining({
            metadata: expect.objectContaining({ name: 'a', description: 'c' }),
            spec: {
              profile: { displayName: 'b', email: 'd', picture: 'e' },
              memberOf: [],
            },
          }),
        ],
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      await expect(
        getOrganizationUsers(graphql, 'a', 'token', undefined, undefined, true),
      ).resolves.toEqual(output);
    });
  });

  describe('getOrganizationUsers using custom UserTransformer', () => {
    const customUserTransformer: UserTransformer = async (
      item: GithubUser,
      {},
    ) => {
      if (item.login === 'aa') {
        return undefined;
      }

      return {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: `${item.login}-custom`,
          annotations: {
            'github.com/user-login': item.login,
          },
        },
        spec: {
          profile: {},
          memberOf: [],
        },
      } as UserEntity;
    };

    it('reads members', async () => {
      const input: QueryResponse = {
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
      };

      const output = {
        users: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'a-custom',
            }),
          }),
        ],
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      await expect(
        getOrganizationUsers(graphql, 'a', 'token', customUserTransformer),
      ).resolves.toEqual(output);
    });

    it('reads members if undefined is returned from transformer', async () => {
      const input: QueryResponse = {
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
                login: 'aa',
                name: 'bb',
                bio: 'cc',
                email: 'dd',
                avatarUrl: 'ee',
              },
            ],
          },
        },
      };

      const output = {
        users: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'a-custom',
            }),
          }),
        ],
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      const users = await getOrganizationUsers(
        graphql,
        'a',
        'token',
        customUserTransformer,
      );

      expect(users.users).toHaveLength(1);
      expect(users).toEqual(output);
    });

    it('reads members including suspended users', async () => {
      const input: QueryResponse = {
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
                login: 'ab',
                name: 'bb',
                bio: 'cc',
                email: 'dd',
                avatarUrl: 'ee',
                suspendedAt: '2025-01-01',
              },
            ],
          },
        },
      };

      const output = {
        users: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'a-custom',
            }),
          }),
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'ab-custom',
            }),
          }),
        ],
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      await expect(
        getOrganizationUsers(
          graphql,
          'a',
          'token',
          customUserTransformer,
          undefined,
          false,
        ),
      ).resolves.toEqual(output);
    });
  });

  describe('getOrganizationTeams using default TeamTransformer', () => {
    let input: QueryResponse;

    beforeEach(() => {
      input = {
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
                editTeamUrl: 'http://example.com/orgs/blah/teams/team/edit',
                parentTeam: {
                  slug: 'parent',
                  combinedSlug: '',
                  members: [],
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [{ login: 'user' }],
                },
              },
            ],
          },
        },
      };
    });

    it('reads teams', async () => {
      const output = {
        teams: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'team',
              description: 'The one and only team',
              annotations: {
                'github.com/team-slug': 'blah/team',
                'backstage.io/edit-url':
                  'http://example.com/orgs/blah/teams/team/edit',
              },
            }),
            spec: {
              type: 'team',
              profile: {
                displayName: 'Team',
                picture: 'http://example.com/team.jpeg',
              },
              parent: 'parent',
              children: [],
              members: ['user'],
            },
          }),
        ],
      };

      server.use(
        graphqlMsw.query('teams', () => HttpResponse.json({ data: input })),
      );

      await expect(getOrganizationTeams(graphql, 'a')).resolves.toEqual(output);
    });
  });

  describe('getOrganizationTeams using custom TeamTransformer', () => {
    let input: QueryResponse;

    const customTeamTransformer: TeamTransformer = async (
      item: GithubTeam,
      {},
    ) => {
      if (item.name === 'aa') {
        return undefined;
      }

      return {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: `${item.name}-custom`,
          annotations: {
            'github.com/team-slug': 'blah/team',
            'backstage.io/edit-url':
              'http://example.com/orgs/blah/teams/team/edit',
          },
          description: item.description,
        },
        spec: {
          type: 'team',
          profile: {
            displayName: `${item.name}-custom`,
            picture: 'http://example.com/team.jpeg',
          },
          parent: 'parent',
          children: [],
          members: ['user'],
        },
      } as GroupEntity;
    };

    beforeEach(() => {
      input = {
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
                editTeamUrl: 'http://example.com/orgs/blah/teams/team/edit',
                parentTeam: {
                  slug: 'parent',
                  combinedSlug: '',
                  members: [],
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [{ login: 'user' }],
                },
              },
            ],
          },
        },
      };
    });

    it('reads teams', async () => {
      const output = {
        teams: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'Team-custom',
              description: 'The one and only team',
              annotations: {
                'github.com/team-slug': 'blah/team',
                'backstage.io/edit-url':
                  'http://example.com/orgs/blah/teams/team/edit',
              },
            }),
            spec: {
              type: 'team',
              profile: {
                displayName: 'Team-custom',
                picture: 'http://example.com/team.jpeg',
              },
              parent: 'parent',
              children: [],
              members: ['user'],
            },
          }),
        ],
      };

      server.use(
        graphqlMsw.query('teams', () => HttpResponse.json({ data: input })),
      );

      await expect(
        getOrganizationTeams(graphql, 'a', customTeamTransformer),
      ).resolves.toEqual(output);
    });

    it('reads teams if undefined is returned', async () => {
      input = {
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
                editTeamUrl: 'http://example.com/orgs/blah/teams/team/edit',
                parentTeam: {
                  slug: 'parent',
                  combinedSlug: '',
                  members: [],
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [{ login: 'user' }],
                },
              },
              {
                slug: 'team',
                combinedSlug: 'blah/team',
                name: 'aa',
                description: 'The one and only team',
                avatarUrl: 'http://example.com/team.jpeg',
                editTeamUrl: 'http://example.com/orgs/blah/teams/team/edit',
                parentTeam: {
                  slug: 'parent',
                  combinedSlug: '',
                  members: [],
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [{ login: 'user' }],
                },
              },
            ],
          },
        },
      };

      const output = {
        teams: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'Team-custom',
              description: 'The one and only team',
              annotations: {
                'github.com/team-slug': 'blah/team',
                'backstage.io/edit-url':
                  'http://example.com/orgs/blah/teams/team/edit',
              },
            }),
            spec: {
              type: 'team',
              profile: {
                displayName: 'Team-custom',
                picture: 'http://example.com/team.jpeg',
              },
              parent: 'parent',
              children: [],
              members: ['user'],
            },
          }),
        ],
      };

      server.use(
        graphqlMsw.query('teams', () => HttpResponse.json({ data: input })),
      );

      const teams = await getOrganizationTeams(
        graphql,
        'a',
        customTeamTransformer,
      );

      expect(teams.teams).toHaveLength(1);
      expect(teams).toEqual(output);
    });
  });

  describe('getOrganizationsFromUser', () => {
    it('reads orgs from user', async () => {
      const input: QueryResponse = {
        user: {
          organizations: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                login: 'a',
              },
              {
                login: 'b',
              },
              {
                login: 'c',
              },
            ],
          },
        },
      };

      server.use(
        graphqlMsw.query('orgs', () => HttpResponse.json({ data: input })),
      );

      await expect(getOrganizationsFromUser(graphql, 'foo')).resolves.toEqual({
        orgs: ['a', 'b', 'c'],
      });
    });
  });

  describe('getTeamMembers', () => {
    it('reads team members', async () => {
      const input: QueryResponse = {
        organization: {
          team: {
            slug: '',
            combinedSlug: '',
            members: {
              pageInfo: { hasNextPage: false },
              nodes: [{ login: 'user' }],
            },
          },
        },
      };

      const output = {
        members: [{ login: 'user' }],
      };

      server.use(
        graphqlMsw.query('members', () => HttpResponse.json({ data: input })),
      );

      await expect(getTeamMembers(graphql, 'a', 'b')).resolves.toEqual(output);
    });
  });

  describe('getOrganizationRepositories', () => {
    it('read repositories', async () => {
      const input: QueryResponse = {
        repositoryOwner: {
          repositories: {
            nodes: [
              {
                name: 'backstage',
                url: 'https://github.com/backstage/backstage',
                isArchived: false,
                isFork: false,
                repositoryTopics: {
                  nodes: [{ topic: { name: 'blah' } }],
                },
                defaultBranchRef: {
                  name: 'main',
                },
                catalogInfoFile: null,
                visibility: 'public',
              },
              {
                name: 'demo',
                url: 'https://github.com/backstage/demo',
                isArchived: true,
                isFork: true,
                repositoryTopics: { nodes: [] },
                defaultBranchRef: {
                  name: 'main',
                },
                catalogInfoFile: {
                  __typename: 'Blob',
                  id: 'acb123',
                  text: 'some yaml',
                },
                visibility: 'private',
              },
            ],
            pageInfo: {
              hasNextPage: false,
            },
          },
        },
      };

      const output = {
        repositories: [
          {
            name: 'backstage',
            url: 'https://github.com/backstage/backstage',
            isArchived: false,
            isFork: false,
            repositoryTopics: {
              nodes: [{ topic: { name: 'blah' } }],
            },
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: null,
            visibility: 'public',
          },
          {
            name: 'demo',
            url: 'https://github.com/backstage/demo',
            isArchived: true,
            isFork: true,
            repositoryTopics: { nodes: [] },
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: {
              __typename: 'Blob',
              id: 'acb123',
              text: 'some yaml',
            },
            visibility: 'private',
          },
        ],
      };

      server.use(
        graphqlMsw.query('repositories', () =>
          HttpResponse.json({ data: input }),
        ),
      );

      await expect(
        getOrganizationRepositories(graphql, 'a', 'catalog-info.yaml'),
      ).resolves.toEqual(output);
    });
  });

  describe('createAddEntitiesOperation', () => {
    it('create a function to add deferred entities to a delta operation', () => {
      const operation = createAddEntitiesOperation('my-id', 'host');

      const userEntity: UserEntity = {
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
          memberOf: ['new-team'],
        },
      };
      expect(operation('org', [userEntity])).toEqual({
        added: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: userEntity,
          },
        ],
        removed: [],
      });
    });
  });

  describe('createRemoveEntitiesOperation', () => {
    it('create a function to remove deferred entities to a delta operation', () => {
      const operation = createRemoveEntitiesOperation('my-id', 'host');

      const userEntity: UserEntity = {
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
          memberOf: ['new-team'],
        },
      };
      expect(operation('org', [userEntity])).toEqual({
        removed: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: userEntity,
          },
        ],
        added: [],
      });
    });
  });
  describe('createReplaceEntitiesOperation', () => {
    it('create a function to replace deferred entities to a delta operation', () => {
      const operation = createReplaceEntitiesOperation('my-id', 'host');

      const userEntity: UserEntity = {
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
          memberOf: ['new-team'],
        },
      };
      expect(operation('org', [userEntity])).toEqual({
        removed: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: userEntity,
          },
        ],
        added: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: userEntity,
          },
        ],
      });
    });
  });

  describe('createGraphqlClient', () => {
    const headers = {};

    const baseUrl = 'https://api.github.com';

    const logger = mockServices.rootLogger();

    const mockClient = jest.fn().mockImplementation();

    const graphqlDefaults = jest.fn().mockReturnValue(mockClient);
    const mockedOctokit = jest.fn().mockImplementation(() => ({
      graphql: {
        defaults: graphqlDefaults,
      },
    }));
    (Octokit.plugin as jest.Mock).mockReturnValue(mockedOctokit);

    const rateLimitOptions = {
      method: 'POST',
      url: '/graphql',
    };
    const client = createGraphqlClient({
      headers,
      baseUrl,
      logger,
    });
    it('should return a graphql client with throttling', async () => {
      expect(client).toBeDefined();
      expect(Octokit.plugin).toHaveBeenCalledWith(throttling);
    });

    it('should return a graphql client with the correct options', async () => {
      expect(graphqlDefaults).toHaveBeenCalledWith({
        baseUrl,
        headers,
      });
    });

    describe('onRateLimit', () => {
      it.each([
        { retryCount: 0, expectedResult: true },
        { retryCount: 1, expectedResult: true },
        { retryCount: 2, expectedResult: false },
      ])('should return %s', async ({ retryCount, expectedResult }) => {
        const throttleOptions = mockedOctokit.mock.calls[0][0].throttle;

        const result = throttleOptions.onRateLimit(
          60,
          rateLimitOptions,
          undefined,
          retryCount,
        );

        expect(result).toBe(expectedResult);
      });
    });

    describe('onSecondaryRateLimit', () => {
      it.each([
        { retryCount: 0, expectedResult: true },
        { retryCount: 1, expectedResult: true },
        { retryCount: 2, expectedResult: false },
      ])('should return %s', async ({ retryCount, expectedResult }) => {
        const throttleOptions = mockedOctokit.mock.calls[0][0].throttle;

        const result = throttleOptions.onSecondaryRateLimit(
          60,
          rateLimitOptions,
          undefined,
          retryCount,
        );

        expect(result).toBe(expectedResult);
      });
    });
  });

  describe('Page sizes configuration', () => {
    const org = 'my-org';

    it('uses custom page sizes for getOrganizationTeams', async () => {
      server.use(
        graphqlMsw.query('teams', ({ variables }) => {
          expect(variables.teamsPageSize).toBe(10);
          expect(variables.membersPageSize).toBe(20);
          return HttpResponse.json({
            data: {
              organization: {
                teams: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [
                    {
                      slug: 'team1',
                      combinedSlug: 'my-org/team1',
                      name: 'Team 1',
                      description: 'desc',
                      avatarUrl: '',
                      editTeamUrl: '',
                      parentTeam: null,
                      members: {
                        pageInfo: { hasNextPage: false },
                        nodes: [{ login: 'user1' }],
                      },
                    },
                  ],
                },
              },
            },
          });
        }),
      );

      await getOrganizationTeams(graphql as any, org, undefined, {
        teams: 10,
        teamMembers: 20,
        organizationMembers: 20,
        repositories: 10,
      });
    });

    it('uses custom page sizes for getOrganizationUsers', async () => {
      server.use(
        graphqlMsw.query('users', ({ variables }) => {
          expect(variables.organizationMembersPageSize).toBe(30);
          return HttpResponse.json({
            data: {
              organization: {
                membersWithRole: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [
                    {
                      login: 'user1',
                      name: 'User 1',
                      bio: '',
                      avatarUrl: '',
                      email: 'user1@example.com',
                      organizationVerifiedDomainEmails: [],
                    },
                  ],
                },
              },
            },
          });
        }),
      );

      await getOrganizationUsers(graphql as any, org, 'token', undefined, {
        teams: 10,
        teamMembers: 20,
        organizationMembers: 30,
        repositories: 10,
      });
    });

    it('uses custom page sizes for getOrganizationRepositories', async () => {
      server.use(
        graphqlMsw.query('repositories', ({ variables }) => {
          expect(variables.repositoriesPageSize).toBe(15);
          return HttpResponse.json({
            data: {
              repositoryOwner: {
                repositories: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [
                    {
                      name: 'repo1',
                      url: 'https://github.com/my-org/repo1',
                      isArchived: false,
                      isFork: false,
                      visibility: 'public',
                      defaultBranchRef: { name: 'main' },
                      catalogInfoFile: null,
                      repositoryTopics: { nodes: [] },
                    },
                  ],
                },
              },
            },
          });
        }),
      );

      await getOrganizationRepositories(
        graphql as any,
        org,
        '/catalog-info.yaml',
        {
          teams: 10,
          teamMembers: 20,
          organizationMembers: 30,
          repositories: 15,
        },
      );
    });

    it('uses default page sizes when not specified', async () => {
      server.use(
        graphqlMsw.query('teams', ({ variables }) => {
          expect(variables.teamsPageSize).toBe(25);
          expect(variables.membersPageSize).toBe(50);
          return HttpResponse.json({
            data: {
              organization: {
                teams: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [],
                },
              },
            },
          });
        }),
      );

      await getOrganizationTeams(graphql as any, org);
    });
  });
});
