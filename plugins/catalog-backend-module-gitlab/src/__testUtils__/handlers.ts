/*
 * Copyright 2024 The Backstage Authors
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

import { graphql, rest } from 'msw';
import {
  all_groups_response,
  all_projects_response,
  all_saas_users_response,
  all_self_hosted_group1_members,
  subgroup_saas_users_response,
  all_users_response,
  apiBaseUrl,
  apiBaseUrlSaas,
  graphQlBaseUrl,
  paged_endpoint,
  saasGraphQlBaseUrl,
  some_endpoint,
  unhealthy_endpoint,
  userID,
} from './mocks';

const httpHandlers = [
  /**
   * Project REST endpoint mocks
   */

  // fetch all projects in an instance handling archived ones
  rest.get(`${apiBaseUrl}/projects`, (req, res, ctx) => {
    const archived = req.url.searchParams.get('archived');

    return res(
      ctx.set('x-next-page', ''),
      ctx.json(
        all_projects_response.filter(p =>
          archived === 'false' ? !p.archived : true,
        ),
      ),
    );
  }),

  rest.get(`${apiBaseUrl}/projects/42`, (_, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
  }),

  // testing non existing file
  rest.get(
    `${apiBaseUrl}/projects/test-group%2Ftest-repo1/repository/files/catalog-info.yaml`,
    (_, res, ctx) => {
      return res(ctx.status(400), ctx.json({ error: 'Not found' }));
    },
  ),

  /**
   * Group REST endpoint mocks
   */

  rest.get(`${apiBaseUrl}/groups`, (_req, res, ctx) => {
    return res(ctx.set('x-next-page', ''), ctx.json(all_groups_response));
  }),

  rest.get(`${apiBaseUrl}/groups/42`, (_, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
  }),
  rest.get(`${apiBaseUrl}/groups/group1/members/all`, (_req, res, ctx) => {
    return res(ctx.json(all_self_hosted_group1_members));
  }),

  rest.get(`${apiBaseUrlSaas}/groups/group1/members/all`, (_req, res, ctx) => {
    return res(ctx.json(all_saas_users_response));
  }),

  rest.get(
    `${apiBaseUrlSaas}/groups/group1%2Fsubgroup1/members/all`,
    (_req, res, ctx) => {
      return res(ctx.json(subgroup_saas_users_response)); // To-DO change
    },
  ),

  /**
   * Users REST endpoint mocks
   */

  rest.get(`${apiBaseUrl}/users`, (_req, res, ctx) => {
    return res(ctx.set('x-next-page', ''), ctx.json(all_users_response));
  }),

  rest.get(`${apiBaseUrl}/users/${userID}`, (_, res, ctx) => {
    return res(ctx.json(all_users_response.find(user => user.id === userID)));
  }),

  rest.get(`${apiBaseUrl}/users/42`, (_, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
  }),

  /**
   * others
   */

  // mock a 4 page response
  rest.get(`${apiBaseUrl}${paged_endpoint}`, (req, res, ctx) => {
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

  rest.get(`${apiBaseUrl}${unhealthy_endpoint}`, (_, res, ctx) => {
    return res(ctx.status(400), ctx.json({ error: 'some error' }));
  }),

  rest.get(`${apiBaseUrl}${some_endpoint}`, (req, res, ctx) => {
    return res(ctx.json([{ endpoint: req.url.toString() }]));
  }),
];

// dynamic handlers

// https://docs.gitlab.com/ee/api/groups.html#list-group-details supports encoded path and id
const httpGroupFindByEncodedPathDynamic = all_groups_response.flatMap(group => [
  // Handler for apiBaseUrl
  rest.get(`${apiBaseUrl}/groups/${group.full_path}`, (_, res, ctx) => {
    return res(
      ctx.json(all_groups_response.find(g => g.full_path === group.full_path)),
    );
  }),
  // Handler for apiSaaSBaseUrl
  rest.get(`${apiBaseUrlSaas}/groups/${group.full_path}`, (_, res, ctx) => {
    return res(
      ctx.json(all_groups_response.find(g => g.full_path === group.full_path)),
    );
  }),
]);

const httpGroupFindByIdDynamic = all_groups_response.map(group => {
  return rest.get(`${apiBaseUrl}/groups/${group.id}`, (_, res, ctx) => {
    return res(ctx.json(all_groups_response.find(g => g.id === group.id)));
  });
});

const httpGroupListDescendantProjectsById = all_groups_response.map(group => {
  return rest.get(
    `${apiBaseUrl}/groups/${group.id}/projects`,
    (req, res, ctx) => {
      const archived = req.url.searchParams.get('archived');

      const projectsInGroup = all_projects_response.filter(
        p =>
          p.path_with_namespace?.includes(group.name) &&
          (archived === 'false' ? !p.archived : true),
      );

      return res(ctx.json(projectsInGroup));
    },
  );
});

const httpGroupListDescendantProjectsByName = all_groups_response.map(group => {
  return rest.get(
    `${apiBaseUrl}/groups/${group.name}/projects`,
    (req, res, ctx) => {
      const archived = req.url.searchParams.get('archived');

      const projectsInGroup = all_projects_response.filter(
        p =>
          p.path_with_namespace?.includes(group.name) &&
          (archived === 'false' ? !p.archived : true),
      );

      return res(ctx.json(projectsInGroup));
    },
  );
});
const httpGroupFindByNameDynamic = all_groups_response.map(group => {
  return rest.get(`${apiBaseUrl}/groups/${group.name}`, (_, res, ctx) => {
    return res(ctx.json(all_groups_response.find(g => g.name === group.name)));
  });
});
const httpProjectFindByIdDynamic = all_projects_response.map(project => {
  return rest.get(`${apiBaseUrl}/projects/${project.id}`, (_, res, ctx) => {
    return res(ctx.json(all_projects_response.find(p => p.id === project.id)));
  });
});
const httpProjectCatalogDynamic = all_projects_response.map(project => {
  const path: string = project.path_with_namespace
    ? project.path_with_namespace!.replace(/\//g, '%2F')
    : `${project.path_with_namespace}%2F${project.name}`;

  return rest.head(
    `${apiBaseUrl}/projects/${path}/repository/files/catalog-info.yaml`,
    (req, res, ctx) => {
      const branch = req.url.searchParams.get('ref');
      if (
        branch === project.default_branch ||
        branch === 'main' ||
        branch === 'develop'
      ) {
        return res(ctx.status(200));
      }
      return res(ctx.status(404, 'Not Found'));
    },
  );
});

/**
 * GraphQL endpoint mocks
 */

const graphqlHandlers = [
  graphql
    .link(graphQlBaseUrl)
    .query('getGroupMembers', async (req, res, ctx) => {
      const { group, relations } = req.variables;
      // group is actually full_path
      if (group === 'group1/subgroup1' && relations.includes('DIRECT')) {
        return res(
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
        );
      }
      if (group === 'group1' && relations.includes('DIRECT')) {
        return res(
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
        );
      }
      // group with no associated members
      if (group === 'group3' && relations.includes('DIRECT')) {
        return res(
          ctx.data({
            group: {
              groupMembers: {
                nodes: [{}],
                pageInfo: {
                  endCursor: 'end',
                  hasNextPage: false,
                },
              },
            },
          }),
        );
      }
      if (group === 'saas-multi-user-group') {
        return res(
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
                  endCursor: 'end',
                  hasNextPage: false,
                },
              },
            },
          }),
        );
      }

      if (group === 'non-existing-group' || group === '') {
        return res(
          ctx.data({
            group: {
              groupMembers: {
                pageInfo: {
                  endCursor: 'end',
                  hasNextPage: false,
                },
              },
            },
          }),
        );
      }

      if (group === 'multi-page' && relations.includes('DIRECT')) {
        return res(
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
        );
      }

      if (group === 'multi-page-saas') {
        return res(
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
        );
      }

      if (group === 'error-group') {
        return res(
          ctx.errors([
            { message: 'Unexpected end of document', locations: [] },
          ]),
        );
      }

      return res(ctx.status(200));
    }),

  graphql
    .link(graphQlBaseUrl)
    .query('listDescendantGroups', async (req, res, ctx) => {
      const { group } = req.variables;

      if (group === 'error-group') {
        return res(
          ctx.errors([
            { message: 'Unexpected end of document', locations: [] },
          ]),
        );
      }
      if (group === 'group1') {
        return res(
          ctx.data({
            group: {
              descendantGroups: {
                nodes: [
                  {
                    id: 'gid://gitlab/Group/6',
                    name: 'subgroup1',
                    description: 'description1',
                    fullPath: 'group1/subgroup1',
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
        );
      }
      if (group === 'group-with-parent') {
        return res(
          ctx.data({
            group: {
              descendantGroups: {
                nodes: [
                  {
                    id: 'gid://gitlab/Group/1',
                    name: 'group-with-parent',
                    description: 'description1',
                    fullPath: 'path/group-with-parent',
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
        );
      }
      if (group === 'root') {
        return res(
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
        );
      }

      if (group === 'non-existing-group') {
        return res(
          ctx.data({
            group: {},
          }),
        );
      }
      return res(ctx.status(200));
    }),

  graphql
    .link(saasGraphQlBaseUrl)
    .query('getGroupMembers', async (req, res, ctx) => {
      const { group } = req.variables;

      if (group === 'saas-multi-user-group') {
        return res(
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
                  endCursor: 'end',
                  hasNextPage: false,
                },
              },
            },
          }),
        );
      }

      if (group === '') {
        return res(ctx.data({}));
      }

      if (group === 'error-group') {
        return res(
          ctx.errors([
            { message: 'Unexpected end of document', locations: [] },
          ]),
        );
      }

      return res(ctx.status(200));
    }),

  graphql
    .link(saasGraphQlBaseUrl)
    .query('listDescendantGroups', async (_, res, ctx) => {
      return res(
        ctx.data({
          group: {
            descendantGroups: {
              nodes: [
                {
                  id: 'gid://gitlab/Group/456',
                  name: 'group1',
                  description: 'Group1',
                  fullPath: 'group1/group1',
                  parent: {
                    id: 'gid://gitlab/Group/123',
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
      );
    }),
];

export const handlers = [
  ...httpHandlers,
  ...httpProjectFindByIdDynamic,
  ...httpProjectCatalogDynamic,
  ...httpGroupFindByIdDynamic,
  ...httpGroupFindByNameDynamic,
  ...httpGroupListDescendantProjectsById,
  ...httpGroupListDescendantProjectsByName,
  ...graphqlHandlers,
  ...httpGroupFindByEncodedPathDynamic,
];
