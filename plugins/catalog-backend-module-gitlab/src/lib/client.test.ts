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

import { ConfigReader } from '@backstage/config';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { readGitLabIntegrationConfig } from '@backstage/integration';
import { getVoidLogger } from '@backstage/backend-common';
import { graphql, rest } from 'msw';
import { setupServer, SetupServer } from 'msw/node';
import { GitLabClient, paginated } from './client';
import { GitLabGroup, GitLabUser } from './types';

const server = setupServer();
setupRequestMockHandlers(server);

const MOCK_CONFIG = readGitLabIntegrationConfig(
  new ConfigReader({
    host: 'example.com',
    token: 'test-token',
    apiBaseUrl: 'https://example.com/api/v4',
    baseUrl: 'https://example.com',
  }),
);
const FAKE_PAGED_ENDPOINT = `/some-endpoint`;
const FAKE_PAGED_URL = `${MOCK_CONFIG.apiBaseUrl}${FAKE_PAGED_ENDPOINT}`;

function setupFakeFourPageURL(srv: SetupServer, url: string) {
  srv.use(
    rest.get(url, (req, res, ctx) => {
      const page = req.url.searchParams.get('page');
      const currentPage = page ? Number(page) : 1;
      const fakePageCount = 4;

      return res(
        // set next page number header if page requested is less than count
        ctx.set(
          'x-next-page',
          currentPage < fakePageCount ? String(currentPage + 1) : '',
        ),
        ctx.json([{ someContentOfPage: currentPage }]),
      );
    }),
  );
}

function setupFakeGroupProjectsEndpoint(
  srv: SetupServer,
  apiBaseUrl: string,
  groupID: string,
) {
  srv.use(
    rest.get(`${apiBaseUrl}/groups/${groupID}/projects`, (_, res, ctx) => {
      return res(
        ctx.set('x-next-page', ''),
        ctx.json([
          {
            id: 1,
            description: 'Project One Description',
            name: 'Project One',
            path: 'project-one',
          },
        ]),
      );
    }),
  );
}

function setupFakeInstanceProjectsEndpoint(
  srv: SetupServer,
  apiBaseUrl: string,
) {
  srv.use(
    rest.get(`${apiBaseUrl}/projects`, (_, res, ctx) => {
      return res(
        ctx.set('x-next-page', ''),
        ctx.json([
          {
            id: 1,
            description: 'Project One Description',
            name: 'Project One',
            path: 'project-one',
          },
          {
            id: 2,
            description: 'Project Two Description',
            name: 'Project Two',
            path: 'project-two',
          },
        ]),
      );
    }),
  );
}

function setupFakeHasFileEndpoint(srv: SetupServer, apiBaseUrl: string) {
  srv.use(
    rest.head(
      `${apiBaseUrl}/projects/group%2Frepo/repository/files/catalog-info.yaml`,
      (req, res, ctx) => {
        const branch = req.url.searchParams.get('ref');
        if (branch === 'master') {
          return res(ctx.status(200));
        }
        return res(ctx.status(404, 'Not Found'));
      },
    ),
  );
}

function setupFakeURLReturnEndpoint(srv: SetupServer, url: string) {
  srv.use(
    rest.get(url, (req, res, ctx) => {
      return res(ctx.json([{ endpoint: req.url.toString() }]));
    }),
  );
}

describe('GitLabClient', () => {
  describe('isSelfManaged', () => {
    it('returns true if self managed instance', () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader({
            host: 'example.com',
            token: 'test-token',
            apiBaseUrl: 'https://example.com/api/v4',
          }),
        ),
        logger: getVoidLogger(),
      });
      expect(client.isSelfManaged()).toBeTruthy();
    });
    it('returns false if gitlab.com', () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader({
            host: 'gitlab.com',
            token: 'test-token',
          }),
        ),
        logger: getVoidLogger(),
      });
      expect(client.isSelfManaged()).toBeFalsy();
    });
  });

  describe('pagedRequest', () => {
    beforeEach(() => {
      // setup fake paginated endpoint with 4 pages each returning one item
      setupFakeFourPageURL(server, FAKE_PAGED_URL);
    });

    it('should provide immediate items within the page', async () => {
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const { items } = await client.pagedRequest(FAKE_PAGED_ENDPOINT);
      // fake page contains exactly one item
      expect(items).toHaveLength(1);
    });

    it('should request items for a given page number', async () => {
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const requestedPage = 2;
      const { items, nextPage } = await client.pagedRequest(
        FAKE_PAGED_ENDPOINT,
        {
          page: requestedPage,
        },
      );
      // should contain an item from a given page
      expect(items[0].someContentOfPage).toEqual(requestedPage);
      // should set the nextPage property to the next page
      expect(nextPage).toEqual(3);
    });

    it('should not have a next page if at the end', async () => {
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const { items, nextPage } = await client.pagedRequest(
        FAKE_PAGED_ENDPOINT,
        {
          page: 4,
        },
      );
      // should contain item of last page
      expect(items).toHaveLength(1);
      expect(nextPage).toBeNull();
    });

    it('should throw if response is not okay', async () => {
      const endpoint = '/unhealthy-endpoint';
      const url = `${MOCK_CONFIG.apiBaseUrl}${endpoint}`;
      server.use(
        rest.get(url, (_, res, ctx) => {
          return res(ctx.status(400), ctx.json({ error: 'some error' }));
        }),
      );

      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });
      // non-200 status code should throw
      await expect(() => client.pagedRequest(endpoint)).rejects.toThrow();
    });
  });

  describe('listProjects', () => {
    it('should get projects for a given group', async () => {
      setupFakeGroupProjectsEndpoint(
        server,
        MOCK_CONFIG.apiBaseUrl,
        'test-group',
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const groupProjectsGen = paginated(
        options => client.listProjects(options),
        { group: 'test-group' },
      );
      const allItems = [];
      for await (const item of groupProjectsGen) {
        allItems.push(item);
      }
      expect(allItems).toHaveLength(1);
    });

    it('should get all projects for an instance', async () => {
      setupFakeInstanceProjectsEndpoint(server, MOCK_CONFIG.apiBaseUrl);
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const instanceProjects = paginated(
        options => client.listProjects(options),
        {},
      );
      const allProjects = [];
      for await (const project of instanceProjects) {
        allProjects.push(project);
      }
      expect(allProjects).toHaveLength(2);
    });
  });

  it('listUsers gets all users in the instance', async () => {
    server.use(
      rest.get(`${MOCK_CONFIG.apiBaseUrl}/users`, (_, res, ctx) =>
        res(
          ctx.set('x-next-page', ''),
          ctx.json([
            {
              id: 1,
              username: 'test1',
              name: 'Test Testit',
              state: 'active',
              avatar_url: 'https://secure.gravatar.com/',
              web_url: 'https://gitlab.example/test1',
              created_at: '2023-01-19T07:27:03.333Z',
              bio: '',
              location: null,
              public_email: null,
              skype: '',
              linkedin: '',
              twitter: '',
              website_url: '',
              organization: null,
              job_title: '',
              pronouns: null,
              bot: false,
              work_information: null,
              followers: 0,
              following: 0,
              is_followed: false,
              local_time: null,
              last_sign_in_at: '2023-01-19T07:27:49.601Z',
              confirmed_at: '2023-01-19T07:27:02.905Z',
              last_activity_on: '2023-01-19',
              email: 'test@example.com',
              theme_id: 1,
              color_scheme_id: 1,
              projects_limit: 100000,
              current_sign_in_at: '2023-01-19T09:09:10.676Z',
              identities: [],
              can_create_group: true,
              can_create_project: true,
              two_factor_enabled: false,
              external: false,
              private_profile: false,
              commit_email: 'test@example.com',
              is_admin: false,
              note: '',
            },
          ]),
        ),
      ),
    );
    const client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });

    const allUsers: GitLabUser[] = [];
    for await (const user of paginated(
      options => client.listUsers(options),
      {},
    )) {
      allUsers.push(user);
    }

    expect(allUsers).toMatchObject([
      {
        id: 1,
        username: 'test1',
        email: 'test@example.com',
        name: 'Test Testit',
        state: 'active',
        web_url: 'https://gitlab.example/test1',
        avatar_url: 'https://secure.gravatar.com/',
      },
    ]);
  });

  it('listGroups gets all groups in the instance', async () => {
    server.use(
      rest.get(`${MOCK_CONFIG.apiBaseUrl}/groups`, (_, res, ctx) =>
        res(
          ctx.set('x-next-page', ''),
          ctx.json([
            {
              id: 1,
              web_url: 'https://gitlab.example/groups/group1',
              name: 'group1',
              path: 'group1',
              description: '',
              visibility: 'internal',
              share_with_group_lock: false,
              require_two_factor_authentication: false,
              two_factor_grace_period: 48,
              project_creation_level: 'developer',
              auto_devops_enabled: null,
              subgroup_creation_level: 'owner',
              emails_disabled: null,
              mentions_disabled: null,
              lfs_enabled: true,
              default_branch_protection: 2,
              avatar_url: null,
              request_access_enabled: false,
              full_name: '8020',
              full_path: '8020',
              created_at: '2017-06-19T06:42:34.160Z',
              parent_id: null,
            },
          ]),
        ),
      ),
    );
    const client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });

    const allGroups: GitLabGroup[] = [];
    for await (const group of paginated(
      options => client.listGroups(options),
      {},
    )) {
      allGroups.push(group);
    }

    expect(allGroups).toMatchObject([
      {
        id: 1,
        name: 'group1',
        full_path: '8020',
        description: '',
        parent_id: null,
      },
    ]);
  });

  describe('get gitlab.com users', () => {
    it('gets all users under group', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('getGroupMembers', async (_, res, ctx) =>
            res(
              ctx.data({
                group: {
                  groupMembers: {
                    nodes: [
                      {
                        user: {
                          id: 'gid://gitlab/User/1',
                          username: 'user1',
                          publicEmail: 'user1@example.com',
                          name: 'user1',
                          state: 'active',
                          webUrl: 'user1.com',
                          avatarUrl: 'user1',
                        },
                      },
                    ],
                    pageInfo: {
                      endCursor: 'end',
                      hasNextPage: false,
                    },
                  },
                },
              }),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const saasMembers = (
        await client.getGroupMembers('group1', ['DIRECT, DESCENDANTS'])
      ).items;
      const expectedSaasMember = [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          name: 'user1',
          state: 'active',
          web_url: 'user1.com',
          avatar_url: 'user1',
        },
      ];

      expect(saasMembers.length).toEqual(1);
      expect(saasMembers).toEqual(expectedSaasMember);
    });

    it('gets all users with token without full permissions', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('getGroupMembers', async (_, res, ctx) =>
            res(
              ctx.data({
                group: {},
              }),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const saasMembers = (
        await client.getGroupMembers('group1', ['DIRECT, DESCENDANTS'])
      ).items;

      expect(saasMembers).toEqual([]);
    });

    it('rejects when GraphQL returns errors', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('getGroupMembers', async (_, res, ctx) =>
            res(
              ctx.errors([
                { message: 'Unexpected end of document', locations: [] },
              ]),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      await expect(() =>
        client.getGroupMembers('group1', ['DIRECT, DESCENDANTS']),
      ).rejects.toThrow(
        'GraphQL errors: [{"message":"Unexpected end of document","locations":[]}]',
      );
    });
    it('traverses multi-page results', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('getGroupMembers', async (req, res, ctx) =>
            res(
              ctx.data({
                group: {
                  groupMembers: {
                    nodes: req.variables.endCursor
                      ? [
                          {
                            user: {
                              id: 'gid://gitlab/User/1',
                              username: 'user1',
                              publicEmail: 'user1@example.com',
                              name: 'user1',
                              state: 'active',
                              webUrl: 'user1.com',
                              avatarUrl: 'user1',
                            },
                          },
                        ]
                      : [
                          {
                            user: {
                              id: 'gid://gitlab/User/2',
                              username: 'user2',
                              publicEmail: 'user2@example.com',
                              name: 'user2',
                              state: 'active',
                              webUrl: 'user2.com',
                              avatarUrl: 'user2',
                            },
                          },
                        ],
                    pageInfo: {
                      endCursor: req.variables.endCursor ? 'end' : 'next',
                      hasNextPage: !req.variables.endCursor,
                    },
                  },
                },
              }),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const saasMembers = (
        await client.getGroupMembers('group1', ['DIRECT, DESCENDANTS'])
      ).items;

      const expectedSaasMember1 = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        name: 'user1',
        state: 'active',
        web_url: 'user1.com',
        avatar_url: 'user1',
      };

      const expectedSaasMember2 = {
        id: 2,
        username: 'user2',
        email: 'user2@example.com',
        name: 'user2',
        state: 'active',
        web_url: 'user2.com',
        avatar_url: 'user2',
      };

      expect(saasMembers.length).toEqual(2);
      expect(saasMembers[0]).toEqual(expectedSaasMember2);
      expect(saasMembers[1]).toEqual(expectedSaasMember1);
    });
  });

  describe('listDescendantGroups', () => {
    it('gets all groups under root', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('listDescendantGroups', async (_, res, ctx) =>
            res(
              ctx.data({
                group: {
                  descendantGroups: {
                    nodes: [
                      {
                        id: 'gid://gitlab/Group/1',
                        name: 'group1',
                        description: 'description1',
                        fullPath: 'path/group1',
                        parent: {
                          id: '123',
                        },
                      },
                    ],
                    pageInfo: {
                      endCursor: 'end',
                      hasNextPage: false,
                    },
                  },
                },
              }),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const saasGroups = (await client.listDescendantGroups('group1')).items;

      const expectedSaasGroup = [
        {
          id: 1,
          name: 'group1',
          description: 'description1',
          full_path: 'path/group1',
          parent_id: 123,
        },
      ];

      expect(saasGroups.length).toEqual(1);
      expect(saasGroups).toEqual(expectedSaasGroup);
    });

    it('gets all descendant groups with token without full permissions', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('listDescendantGroups', async (_, res, ctx) =>
            res(
              ctx.data({
                group: {},
              }),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const saasGroups = (await client.listDescendantGroups('group1')).items;

      expect(saasGroups).toEqual([]);
    });

    it('rejects when GraphQL returns errors', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('listDescendantGroups', async (_, res, ctx) =>
            res(
              ctx.errors([
                { message: 'Unexpected end of document', locations: [] },
              ]),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      await expect(() => client.listDescendantGroups('group1')).rejects.toThrow(
        'GraphQL errors: [{"message":"Unexpected end of document","locations":[]}]',
      );
    });
    it('traverses multi-page results', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('listDescendantGroups', async (req, res, ctx) =>
            res(
              ctx.data({
                group: {
                  descendantGroups: {
                    nodes: req.variables.endCursor
                      ? [
                          {
                            id: 'gid://gitlab/Group/1',
                            name: 'group1',
                            description: 'description1',
                            fullPath: 'path/group1',
                            parent: {
                              id: '123',
                            },
                          },
                        ]
                      : [
                          {
                            id: 'gid://gitlab/Group/2',
                            name: 'group2',
                            description: 'description2',
                            fullPath: 'path/group2',
                            parent: {
                              id: '123',
                            },
                          },
                        ],
                    pageInfo: {
                      endCursor: req.variables.endCursor ? 'end' : 'next',
                      hasNextPage: !req.variables.endCursor,
                    },
                  },
                },
              }),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const saasGroups = (await client.listDescendantGroups('root')).items;

      const expectedSaasGroup1 = {
        id: 1,
        name: 'group1',
        description: 'description1',
        full_path: 'path/group1',
        parent_id: 123,
      };

      const expectedSaasGroup2 = {
        id: 2,
        name: 'group2',
        description: 'description2',
        full_path: 'path/group2',
        parent_id: 123,
      };

      expect(saasGroups.length).toEqual(2);
      expect(saasGroups[0]).toEqual(expectedSaasGroup2);
      expect(saasGroups[1]).toEqual(expectedSaasGroup1);
    });
  });

  describe('getGroupMembers', () => {
    it('gets member IDs', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('getGroupMembers', async (_, res, ctx) =>
            res(
              ctx.data({
                group: {
                  groupMembers: {
                    nodes: [
                      {
                        user: {
                          id: 'gid://gitlab/User/1',
                          username: 'user1',
                          publicEmail: 'user1@example.com',
                          name: 'user1',
                          state: 'active',
                          webUrl: 'user1.com',
                          avatarUrl: 'user1',
                        },
                      },
                    ],
                    pageInfo: {
                      endCursor: 'end',
                      hasNextPage: false,
                    },
                  },
                },
              }),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const members = await client.getGroupMembers('group1', ['DIRECT']);

      const user = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        name: 'user1',
        state: 'active',
        web_url: 'user1.com',
        avatar_url: 'user1',
      };

      expect(members.items).toEqual([user]);
    });

    it('gets member IDs with token without full permissions', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('getGroupMembers', async (_, res, ctx) =>
            res(
              ctx.data({
                group: {},
              }),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const members = await client.getGroupMembers('group1', ['DIRECT']);

      expect(members.items).toEqual([]);
    });

    it('rejects when GraphQL returns errors', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('getGroupMembers', async (_, res, ctx) =>
            res(
              ctx.errors([
                { message: 'Unexpected end of document', locations: [] },
              ]),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      await expect(() =>
        client.getGroupMembers('group1', ['DIRECT']),
      ).rejects.toThrow(
        'GraphQL errors: [{"message":"Unexpected end of document","locations":[]}]',
      );
    });

    it('traverses multi-page results', async () => {
      server.use(
        graphql
          .link(`${MOCK_CONFIG.baseUrl}/api/graphql`)
          .query('getGroupMembers', async (req, res, ctx) =>
            res(
              ctx.data({
                group: {
                  groupMembers: {
                    nodes: req.variables.endCursor
                      ? [{ user: { id: 'gid://gitlab/User/2' } }]
                      : [{ user: { id: 'gid://gitlab/User/1' } }],
                    pageInfo: {
                      endCursor: req.variables.endCursor ? 'end' : 'next',
                      hasNextPage: !req.variables.endCursor,
                    },
                  },
                },
              }),
            ),
          ),
      );
      const client = new GitLabClient({
        config: MOCK_CONFIG,
        logger: getVoidLogger(),
      });

      const members = await client.getGroupMembers('group1', ['DIRECT']);

      expect(members.items[0].id).toEqual(1);
      expect(members.items[1].id).toEqual(2);
    });
  });
});

describe('paginated', () => {
  it('should iterate through the pages until exhausted', async () => {
    setupFakeFourPageURL(server, FAKE_PAGED_URL);
    const client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });

    const paginatedItems = paginated(
      options => client.pagedRequest(FAKE_PAGED_ENDPOINT, options),
      {},
    );
    const allItems = [];
    for await (const item of paginatedItems) {
      allItems.push(item);
    }

    expect(allItems).toHaveLength(4);
  });
});

describe('hasFile', () => {
  let client: GitLabClient;

  beforeEach(() => {
    setupFakeHasFileEndpoint(server, MOCK_CONFIG.apiBaseUrl);
    client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });
  });

  it('should not find catalog file', async () => {
    const hasFile = await client.hasFile(
      'group/repo',
      'master',
      'catalog-info.yaml',
    );
    expect(hasFile).toBe(true);
  });

  it('should find catalog file', async () => {
    const hasFile = await client.hasFile(
      'group/repo',
      'unknown',
      'catalog-info.yaml',
    );
    expect(hasFile).toBe(false);
  });
});

describe('pagedRequest search params', () => {
  beforeEach(() => {
    // setup fake paginated endpoint with 4 pages each returning one item
    setupFakeURLReturnEndpoint(server, FAKE_PAGED_URL);
  });

  it('no search params provided', async () => {
    const client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });

    const { items } = await client.pagedRequest<{ endpoint: string }>(
      FAKE_PAGED_ENDPOINT,
    );
    // fake page contains exactly one item
    expect(items).toHaveLength(1);
    expect(items).toEqual([
      { endpoint: 'https://example.com/api/v4/some-endpoint' },
    ]);
  });

  it('defined numeric search params', async () => {
    const client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });

    const { items } = await client.pagedRequest<{ endpoint: string }>(
      FAKE_PAGED_ENDPOINT,
      { page: 1, per_page: 50 },
    );
    // fake page contains exactly one item
    expect(items).toHaveLength(1);
    expect(items).toEqual([
      {
        endpoint: 'https://example.com/api/v4/some-endpoint?page=1&per_page=50',
      },
    ]);
  });

  it('defined string search params', async () => {
    const client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });

    const { items } = await client.pagedRequest<{ endpoint: string }>(
      FAKE_PAGED_ENDPOINT,
      { test: 'value', empty: '' },
    );
    // fake page contains exactly one item
    expect(items).toHaveLength(1);
    expect(items).toEqual([
      {
        endpoint: 'https://example.com/api/v4/some-endpoint?test=value',
      },
    ]);
  });

  it('defined boolean search params', async () => {
    const client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });

    const { items } = await client.pagedRequest<{ endpoint: string }>(
      FAKE_PAGED_ENDPOINT,
      { active: true, archived: false },
    );
    // fake page contains exactly one item
    expect(items).toHaveLength(1);
    expect(items).toEqual([
      {
        endpoint:
          'https://example.com/api/v4/some-endpoint?active=true&archived=false',
      },
    ]);
  });
});
