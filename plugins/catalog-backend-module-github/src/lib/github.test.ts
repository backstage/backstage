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

import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { graphql as graphqlOctokit } from '@octokit/graphql';
import { graphql as graphqlMsw } from 'msw';
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
} from './github';
import fetch from 'node-fetch';

describe('github', () => {
  const graphql = graphqlOctokit.defaults({ request: { fetch } });

  const server = setupServer();
  registerMswTestHooks(server);

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
        graphqlMsw.query('users', (_req, res, ctx) => res(ctx.data(input))),
      );

      await expect(
        getOrganizationUsers(graphql, 'a', 'token'),
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
        graphqlMsw.query('users', (_req, res, ctx) => res(ctx.data(input))),
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
        graphqlMsw.query('users', (_req, res, ctx) => res(ctx.data(input))),
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
  });

  describe('getOrganizationUsers using query options', () => {
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

    it('uses correct delay', async () => {
      const pageOne: QueryResponse = {
        organization: {
          membersWithRole: {
            pageInfo: { hasNextPage: true },
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
      const pageTwo: QueryResponse = {
        organization: {
          membersWithRole: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                login: 'a2',
                name: 'b2',
                bio: 'c2',
                email: 'd2',
                avatarUrl: 'e2',
              },
            ],
          },
        },
      };
      const start = Date.now();
      let calls = 0;
      server.use(
        graphqlMsw.query('users', (_req, res, ctx) => {
          if (calls === 0) {
            calls += 1;
            return res(ctx.data(pageOne));
          }
          return res(ctx.data(pageTwo));
        }),
      );
      await getOrganizationUsers(graphql, 'a', 'token', undefined, {
        pageSize: 1,
        requestDelayMs: 1,
      });
      const end = Date.now();
      expect(end - start).toBeLessThan(1000);
    });

    it('uses default page size', async () => {
      server.use(
        graphqlMsw.query('users', (req, res, ctx) => {
          expect(req.variables).toEqual(
            expect.objectContaining({ pageSize: 100 }),
          );
          return res(ctx.data(input));
        }),
      );
      await getOrganizationUsers(graphql, 'a', 'token');
    });

    it('uses provided page size', async () => {
      server.use(
        graphqlMsw.query('users', (req, res, ctx) => {
          expect(req.variables).toEqual(
            expect.objectContaining({ pageSize: 1 }),
          );
          return res(ctx.data(input));
        }),
      );
      await getOrganizationUsers(graphql, 'a', 'token', undefined, {
        pageSize: 1,
      });
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
        graphqlMsw.query('teams', (_req, res, ctx) => res(ctx.data(input))),
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
        graphqlMsw.query('teams', (_req, res, ctx) => res(ctx.data(input))),
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
        graphqlMsw.query('teams', (_req, res, ctx) => res(ctx.data(input))),
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

  describe('getOrganizationTeams using query options', () => {
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

    it('uses correct delay', async () => {
      const pageOne: QueryResponse = {
        organization: {
          teams: {
            pageInfo: { hasNextPage: true },
            nodes: [
              {
                slug: 'team',
                combinedSlug: 'blah/team',
                name: 'Team',
                description: 'The first team',
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
      const pageTwo: QueryResponse = {
        organization: {
          teams: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                slug: 'team2',
                combinedSlug: 'blah/team2',
                name: 'Team2',
                description: 'The second team',
                avatarUrl: 'http://example.com/team2.jpeg',
                editTeamUrl: 'http://example.com/orgs/blah/teams/team2/edit',
                parentTeam: {
                  slug: 'parent',
                  combinedSlug: '',
                  members: [],
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [{ login: 'user2' }],
                },
              },
            ],
          },
        },
      };
      const start = Date.now();
      let calls = 0;
      server.use(
        graphqlMsw.query('teams', (_req, res, ctx) => {
          if (calls === 0) {
            calls += 1;
            return res(ctx.data(pageOne));
          }
          return res(ctx.data(pageTwo));
        }),
      );
      await getOrganizationTeams(graphql, 'a', undefined, {
        pageSize: 1,
        requestDelayMs: 1,
      });
      const end = Date.now();
      expect(end - start).toBeLessThan(1000);
    });

    it('uses default page size', async () => {
      server.use(
        graphqlMsw.query('teams', (req, res, ctx) => {
          expect(req.variables).toEqual(
            expect.objectContaining({ pageSize: 50 }),
          );
          return res(ctx.data(input));
        }),
      );
      await getOrganizationTeams(graphql, 'a');
    });

    it('uses provided page size', async () => {
      server.use(
        graphqlMsw.query('teams', (req, res, ctx) => {
          expect(req.variables).toEqual(
            expect.objectContaining({ pageSize: 1 }),
          );
          return res(ctx.data(input));
        }),
      );
      await getOrganizationTeams(graphql, 'a', undefined, { pageSize: 1 });
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
        graphqlMsw.query('orgs', (_req, res, ctx) => res(ctx.data(input))),
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
        graphqlMsw.query('members', (_req, res, ctx) => res(ctx.data(input))),
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
        graphqlMsw.query('repositories', (_req, res, ctx) =>
          res(ctx.data(input)),
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
});
