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

// Copyright 2024 DB Systel GmbH
// Licensed under the DBISL, see the accompanying file LICENSE.
import { graphql, rest } from 'msw';
import {
  all_groups_response,
  all_projects_response,
  all_saas_users_response,
  all_users_response,
  apiBaseUrl,
  apiBaseUrlSaas,
  graphQlBaseUrl,
  groupID,
  groupName,
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

  // fetch all projects in an instance
  rest.get(`${apiBaseUrl}/projects`, (_, res, ctx) => {
    return res(ctx.set('x-next-page', ''), ctx.json(all_projects_response));
  }),

  /**
   * Group REST endpoint mocks
   */

  rest.get(`${apiBaseUrl}/groups/${groupID}/projects`, (_, res, ctx) => {
    return res(ctx.set('x-next-page', ''), ctx.json(all_projects_response));
  }),

  rest.get(`${apiBaseUrl}/groups/${groupName}/projects`, (_, res, ctx) => {
    return res(ctx.set('x-next-page', ''), ctx.json(all_projects_response));
  }),

  rest.get(`${apiBaseUrl}/groups/${groupID}`, (_, res, ctx) => {
    return res(
      ctx.json(all_groups_response.find(group => group.id === groupID)),
    );
  }),

  rest.get(`${apiBaseUrl}/groups/4`, (_, res, ctx) => {
    return res(ctx.json(all_groups_response.find(group => group.id === 4)));
  }),

  rest.get(`${apiBaseUrl}/groups`, (_req, res, ctx) => {
    return res(ctx.set('x-next-page', ''), ctx.json(all_groups_response));
  }),

  rest.get(`${apiBaseUrl}/groups/42`, (_, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
  }),

  rest.get(`${apiBaseUrlSaas}/groups/group1/members/all`, (_req, res, ctx) => {
    return res(ctx.json(all_saas_users_response));
  }),

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

const httpDynamicHandlers = all_projects_response.map(project =>
  rest.head(
    `${apiBaseUrl}/projects/${groupName}%2F${project.name}/repository/files/catalog-info.yaml`,
    (req, res, ctx) => {
      const branch = req.url.searchParams.get('ref');
      if (branch === project.default_branch) {
        return res(ctx.status(200));
      }
      return res(ctx.status(404, 'Not Found'));
    },
  ),
);

/**
 * GraphQL endpoint mocks
 */

const graphqlHandlers = [
  graphql
    .link(graphQlBaseUrl)
    .query('getGroupMembers', async (req, res, ctx) => {
      const { group, relations } = req.variables;

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
  ...httpDynamicHandlers,
  ...graphqlHandlers,
];
