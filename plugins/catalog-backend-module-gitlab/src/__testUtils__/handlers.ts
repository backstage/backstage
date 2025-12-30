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

import { graphql, http, HttpResponse } from 'msw';
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
  all_saas_subgroup_1_members,
  all_saas_subgroup_2_members,
  group_with_subgroups_response,
} from './mocks';

const httpHandlers = [
  /**
   * Project REST endpoint mocks
   */

  // fetch all projects in an instance handling archived ones
  http.get(`${apiBaseUrl}/projects`, ({ request }) => {
    const url = new URL(request.url);
    const archived = url.searchParams.get('archived');

    return HttpResponse.json(
      all_projects_response.filter(p =>
        archived === 'false' ? !p.archived : true,
      ),
      { headers: { 'x-next-page': '' } },
    );
  }),

  http.get(`${apiBaseUrl}/projects/42`, () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }),

  // testing non existing file
  http.get(
    `${apiBaseUrl}/projects/test-group%2Ftest-repo1/repository/files/catalog-info.yaml`,
    () => {
      return HttpResponse.json({ error: 'Not found' }, { status: 400 });
    },
  ),

  /**
   * Group REST endpoint mocks
   */

  http.get(`${apiBaseUrl}/groups`, () => {
    return HttpResponse.json(all_groups_response, {
      headers: { 'x-next-page': '' },
    });
  }),

  http.get(`${apiBaseUrl}/groups/group-with-subgroup`, () => {
    return HttpResponse.json(group_with_subgroups_response, {
      headers: { 'x-next-page': '' },
    });
  }),

  http.get(`${apiBaseUrl}/groups/group1`, () => {
    return HttpResponse.json(
      all_groups_response.find(g => g.full_path === 'group1'),
      { headers: { 'x-next-page': '' } },
    );
  }),

  http.get(`${apiBaseUrl}/groups/42`, () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }),
  http.get(`${apiBaseUrl}/groups/group1/members/all`, () => {
    return HttpResponse.json(all_self_hosted_group1_members);
  }),

  http.get(`${apiBaseUrlSaas}/groups/group1/members/all`, () => {
    return HttpResponse.json(all_saas_users_response);
  }),

  http.get(`${apiBaseUrlSaas}/groups/group1%2Fsubgroup1/members/all`, () => {
    return HttpResponse.json(subgroup_saas_users_response); // To-DO change
  }),

  http.get(`${apiBaseUrlSaas}/groups/456/members/all`, () => {
    return HttpResponse.json(all_saas_users_response);
  }),

  http.get(`${apiBaseUrlSaas}/groups/1/members/all`, () => {
    return HttpResponse.json(all_saas_users_response);
  }),

  // Subgroup 1 members id=6
  http.get(`${apiBaseUrlSaas}/groups/6/members/all`, () => {
    return HttpResponse.json(all_saas_subgroup_1_members);
  }),

  // Subgroup 2 members id=7
  http.get(`${apiBaseUrlSaas}/groups/7/members/all`, () => {
    return HttpResponse.json(all_saas_subgroup_2_members);
  }),

  /**
   * Users REST endpoint mocks
   */

  http.get(`${apiBaseUrl}/users`, () => {
    return HttpResponse.json(all_users_response, {
      headers: { 'x-next-page': '' },
    });
  }),

  http.get(`${apiBaseUrl}/users/${userID}`, () => {
    return HttpResponse.json(
      all_users_response.find(user => user.id === userID),
    );
  }),

  http.get(`${apiBaseUrl}/users/42`, () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }),

  /**
   * others
   */

  // mock a 4 page response
  http.get(`${apiBaseUrl}${paged_endpoint}`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    const currentPage = page ? Number(page) : 1;
    const fakePageCount = 4;

    return HttpResponse.json([{ someContentOfPage: currentPage }], {
      headers: {
        'x-next-page':
          currentPage < fakePageCount ? String(currentPage + 1) : '',
      },
    });
  }),

  http.get(`${apiBaseUrl}${unhealthy_endpoint}`, () => {
    return HttpResponse.json({ error: 'some error' }, { status: 400 });
  }),

  http.get(`${apiBaseUrl}${some_endpoint}`, ({ request }) => {
    return HttpResponse.json([{ endpoint: request.url }]);
  }),
];

// dynamic handlers

// https://docs.gitlab.com/ee/api/groups.html#list-group-details supports encoded path and id
const httpGroupFindByEncodedPathDynamic = all_groups_response.flatMap(group => [
  // Handler for apiBaseUrl
  http.get(
    `${apiBaseUrl}/groups/${encodeURIComponent(group.full_path)}`,
    () => {
      return HttpResponse.json(
        all_groups_response.find(g => g.full_path === group.full_path),
      );
    },
  ),
  // Handler for apiSaaSBaseUrl
  http.get(
    `${apiBaseUrlSaas}/groups/${encodeURIComponent(group.full_path)}`,
    () => {
      return HttpResponse.json(
        all_groups_response.find(g => g.full_path === group.full_path),
      );
    },
  ),
]);

const httpGroupFindByIdDynamic = all_groups_response.map(group => {
  return http.get(`${apiBaseUrl}/groups/${group.id}`, () => {
    return HttpResponse.json(all_groups_response.find(g => g.id === group.id));
  });
});

const httpGroupListDescendantProjectsById = all_groups_response.map(group => {
  return http.get(
    `${apiBaseUrl}/groups/${group.id}/projects`,
    ({ request }) => {
      const url = new URL(request.url);
      const archived = url.searchParams.get('archived');

      const projectsInGroup = all_projects_response.filter(
        p =>
          p.path_with_namespace?.includes(group.name) &&
          (archived === 'false' ? !p.archived : true),
      );

      return HttpResponse.json(projectsInGroup);
    },
  );
});

const httpGroupListDescendantProjectsByName = all_groups_response.map(group => {
  return http.get(
    `${apiBaseUrl}/groups/${group.name}/projects`,
    ({ request }) => {
      const url = new URL(request.url);
      const archived = url.searchParams.get('archived');

      const projectsInGroup = all_projects_response.filter(
        p =>
          p.path_with_namespace?.includes(group.name) &&
          (archived === 'false' ? !p.archived : true),
      );

      return HttpResponse.json(projectsInGroup);
    },
  );
});

const httpGroupListDescendantProjectsByFullPath = all_groups_response.map(
  group => {
    return http.get(
      `${apiBaseUrl}/groups/${encodeURIComponent(group.full_path)}/projects`,
      ({ request }) => {
        const url = new URL(request.url);
        const archived = url.searchParams.get('archived');

        const projectsInGroup = all_projects_response.filter(
          p =>
            p.path_with_namespace?.includes(group.full_path) &&
            (archived === 'false' ? !p.archived : true),
        );

        return HttpResponse.json(projectsInGroup);
      },
    );
  },
);

const httpGroupFindByNameDynamic = all_groups_response.map(group => {
  return http.get(`${apiBaseUrl}/groups/${group.name}`, () => {
    return HttpResponse.json(
      all_groups_response.find(g => g.name === group.name),
    );
  });
});
const httpProjectFindByIdDynamic = all_projects_response.map(project => {
  return http.get(`${apiBaseUrl}/projects/${project.id}`, () => {
    return HttpResponse.json(
      all_projects_response.find(p => p.id === project.id),
    );
  });
});

/**
 * See https://docs.gitlab.com/api/repository_files/#get-file-from-repository
 */
const httpProjectCatalogDynamic = all_projects_response.flatMap(project => {
  return http.head(
    `${apiBaseUrl}/projects/${project.id.toString()}/repository/files/catalog-info.yaml`,
    ({ request }) => {
      const url = new URL(request.url);
      const branch = url.searchParams.get('ref');
      if (
        branch === project.default_branch ||
        branch === 'main' ||
        branch === 'develop'
      ) {
        return new HttpResponse(null, { status: 200 });
      }
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    },
  );
});

/**
 * GraphQL endpoint mocks
 */

const graphqlHandlers = [
  graphql
    .link(graphQlBaseUrl)
    .query('getGroupMembers', async ({ variables }) => {
      const { group, relations } = variables;
      // group is actually full_path
      if (group === 'group1/subgroup1' && relations.includes('DIRECT')) {
        return HttpResponse.json({
          data: {
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
          },
        });
      }
      if (group === 'group1' && relations.includes('DIRECT')) {
        return HttpResponse.json({
          data: {
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
          },
        });
      }
      // group with no associated members
      if (group === 'group3' && relations.includes('DIRECT')) {
        return HttpResponse.json({
          data: {
            group: {
              groupMembers: {
                nodes: [{}],
                pageInfo: {
                  endCursor: 'end',
                  hasNextPage: false,
                },
              },
            },
          },
        });
      }
      if (group === 'saas-multi-user-group') {
        return HttpResponse.json({
          data: {
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
          },
        });
      }

      if (group === 'non-existing-group' || group === '') {
        return HttpResponse.json({
          data: {
            group: {
              groupMembers: {
                pageInfo: {
                  endCursor: 'end',
                  hasNextPage: false,
                },
              },
            },
          },
        });
      }

      if (group === 'multi-page' && relations.includes('DIRECT')) {
        return HttpResponse.json({
          data: {
            group: {
              groupMembers: {
                nodes: variables.endCursor
                  ? [{ user: { id: 'gid://gitlab/User/2' } }]
                  : [{ user: { id: 'gid://gitlab/User/1' } }],
                pageInfo: {
                  endCursor: variables.endCursor ? 'end' : 'next',
                  hasNextPage: !variables.endCursor,
                },
              },
            },
          },
        });
      }

      if (group === 'multi-page-saas') {
        return HttpResponse.json({
          data: {
            group: {
              groupMembers: {
                nodes: variables.endCursor
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
                  endCursor: variables.endCursor ? 'end' : 'next',
                  hasNextPage: !variables.endCursor,
                },
              },
            },
          },
        });
      }

      if (group === 'error-group') {
        return HttpResponse.json({
          errors: [{ message: 'Unexpected end of document', locations: [] }],
        });
      }

      return new HttpResponse(null, { status: 200 });
    }),

  graphql
    .link(graphQlBaseUrl)
    .query('listDescendantGroups', async ({ variables }) => {
      const { group } = variables;

      if (group === 'error-group') {
        return HttpResponse.json({
          errors: [{ message: 'Unexpected end of document', locations: [] }],
        });
      }
      if (group === 'group1') {
        return HttpResponse.json({
          data: {
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
          },
        });
      }
      if (group === 'group-with-parent') {
        return HttpResponse.json({
          data: {
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
          },
        });
      }
      if (group === 'root') {
        return HttpResponse.json({
          data: {
            group: {
              descendantGroups: {
                nodes: variables.endCursor
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
                  endCursor: variables.endCursor ? 'end' : 'next',
                  hasNextPage: !variables.endCursor,
                },
              },
            },
          },
        });
      }

      if (group === 'non-existing-group') {
        return HttpResponse.json({
          data: {
            group: {},
          },
        });
      }
      return new HttpResponse(null, { status: 200 });
    }),

  graphql
    .link(saasGraphQlBaseUrl)
    .query('getGroupMembers', async ({ variables }) => {
      const { group } = variables;

      if (group === 'saas-multi-user-group') {
        return HttpResponse.json({
          data: {
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
          },
        });
      }

      if (group === '') {
        return HttpResponse.json({ data: {} });
      }

      if (group === 'error-group') {
        return HttpResponse.json({
          errors: [{ message: 'Unexpected end of document', locations: [] }],
        });
      }

      return new HttpResponse(null, { status: 200 });
    }),

  graphql
    .link(saasGraphQlBaseUrl)
    .query('listDescendantGroups', async ({ variables }) => {
      const { group } = variables;

      if (group === 'group1') {
        return HttpResponse.json({
          data: {
            group: {
              descendantGroups: {
                nodes: variables.endCursor
                  ? [
                      {
                        id: 'gid://gitlab/Group/6',
                        name: 'subgroup1',
                        description: 'description1',
                        fullPath: 'path/subgroup1',
                        parent: {
                          id: '1',
                        },
                      },
                    ]
                  : [
                      {
                        id: 'gid://gitlab/Group/7',
                        name: 'subgroup2',
                        description: 'description2',
                        fullPath: 'path/subgroup2',
                        parent: {
                          id: '1',
                        },
                      },
                    ],
                pageInfo: {
                  endCursor: variables.endCursor ? 'end' : 'next',
                  hasNextPage: !variables.endCursor,
                },
              },
            },
          },
        });
      }

      return HttpResponse.json({
        data: {
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
        },
      });
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
  ...httpGroupListDescendantProjectsByFullPath,
  ...graphqlHandlers,
  ...httpGroupFindByEncodedPathDynamic,
];
