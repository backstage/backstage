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
import { locationSpecToMetadataName } from '@backstage/plugin-catalog-node';
import { EventParams } from '@backstage/plugin-events-node';
import { GitLabGroup, GitLabProject, GitLabUser } from '../lib/types';

type MockObject = Record<string, any>;

/**
 * General
 */
export const apiBaseUrl: string = 'https://example.com/api/v4';
export const apiBaseUrlSaas: string = 'https://gitlab.com/api/v4';
export const graphQlBaseUrl = 'https://example.com/api/graphql';
export const saasGraphQlBaseUrl = 'https://gitlab.com/api/graphql';
export const groupName: string = 'test-group';
export const groupID: number = 1;
export const userID: number = 1;

/**
 * Endpoints
 */

export const paged_endpoint: string = `/paged-endpoint`;
export const some_endpoint: string = `/some-endpoint`;
export const unhealthy_endpoint = `/unhealthy-endpoint`;

/**
 * Integration Configurations
 */

export const config_self_managed: MockObject = {
  host: 'example.com',
  token: 'test-token',
  apiBaseUrl: 'https://example.com/api/v4',
  baseUrl: 'https://example.com',
};

export const config_saas: MockObject = {
  host: 'gitlab.com',
  token: 'test-token',
  apiBaseUrl: 'https://gitlab.com/api/v4',
  baseUrl: 'https://gitlab.com',
};

export const config_single_integration: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'example.com',
        apiBaseUrl: 'https://example.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'example.com',
          group: 'test-group',
          skipForkedRepos: false,
          schedule: {
            frequency: 'PT30M',
            timeout: 'PT3M',
          },
        },
      },
    },
  },
};

export const config_single_integration_branch: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'example.com',
        apiBaseUrl: 'https://example.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'example.com',
          group: 'test-group',
          branch: 'main',
          skipForkedRepos: false,
          schedule: {
            frequency: 'PT30M',
            timeout: 'PT3M',
          },
        },
      },
    },
  },
};

export const config_single_integration_skip_forks: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'example.com',
        apiBaseUrl: 'https://example.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'example.com',
          group: 'test-group',
          skipForkedRepos: true,
          schedule: {
            frequency: 'PT30M',
            timeout: 'PT3M',
          },
        },
      },
    },
  },
};

export const config_single_integration_project_pattern: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'example.com',
        apiBaseUrl: 'https://example.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'example.com',
          group: 'test-group',
          projectPattern: 'test-repo',
          skipForkedRepos: false,
          schedule: {
            frequency: 'PT30M',
            timeout: 'PT3M',
          },
        },
      },
    },
  },
};

export const config_no_schedule_integration: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'example.com',
        apiBaseUrl: 'https://example.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'example.com',
          group: 'test-group',
          projectPattern: 'test-repo',
          skipForkedRepos: true,
        },
      },
    },
  },
};

export const config_unmatched_project_integration: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'example.com',
        apiBaseUrl: 'https://example.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'example.com',
          group: 'my-other-group',
          projectPattern: 'my-other-project',
          skipForkedRepos: true,
        },
      },
    },
  },
};

export const config_double_integration: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'example.com',
        apiBaseUrl: 'https://example.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'example.com',
          group: 'test-group',
        },
        'second-test': {
          host: 'example.com',
          group: 'second-group',
        },
      },
    },
  },
};

export const config_org_integration: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'example.com',
        apiBaseUrl: 'https://example.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'example.com',
          groupPattern: 'group',
          orgEnabled: true,
        },
      },
    },
  },
};

export const config_org_integration_saas: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'gitlab.com',
        apiBaseUrl: 'https://gitlab.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'gitlab.com',
          group: 'group1',
          groupPattern: 'group',
          orgEnabled: true,
        },
      },
    },
  },
};

export const config_org_integration_saas_no_group: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'gitlab.com',
        apiBaseUrl: 'https://gitlab.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'gitlab.com',
          groupPattern: 'group',
          orgEnabled: true,
        },
      },
    },
  },
};

export const config_org_integration_saas_sched: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'gitlab.com',
        apiBaseUrl: 'https://gitlab.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'gitlab.com',
          group: 'group1',
          groupPattern: 'group',
          orgEnabled: true,
          schedule: {
            frequency: 'PT30M',
            timeout: 'PT3M',
          },
        },
      },
    },
  },
};

export const config_org_double_integration: MockObject = {
  integrations: {
    gitlab: [
      {
        host: 'example.com',
        apiBaseUrl: 'https://example.com/api/v4',
        token: '1234',
      },
    ],
  },
  catalog: {
    providers: {
      gitlab: {
        'test-id': {
          host: 'example.com',
          group: 'test-group',
          orgEnabled: true,
        },
        'second-test': {
          host: 'example.com',
          group: 'second-group',
          orgEnabled: true,
        },
      },
    },
  },
};

/**
 * GitLab API responses
 */

export const all_projects_response: GitLabProject[] = [
  {
    id: 1,
    description: 'Project One Description',
    name: 'test-repo1',
    default_branch: 'main',
    path: 'test-repo1',
    archived: false,
    last_activity_at: new Date().toString(),
    web_url: 'https://example.com/test-group/test-repo1',
    path_with_namespace: 'test-group/test-repo1',
  },
  {
    id: 2,
    description: 'Project Two Description',
    name: 'test-repo2',
    default_branch: 'prd',
    path: 'test-repo2',
    archived: false,
    last_activity_at: new Date().toString(),
    web_url: 'https://example.com/test-group/test-repo2',
    path_with_namespace: 'test-group/test-repo2',
  },
  // unmatched project
  {
    id: 3,
    description: 'Project Three Description',
    name: 'repo3',
    default_branch: 'main',
    path: 'repo3',
    archived: false,
    last_activity_at: new Date().toString(),
    web_url: 'https://example.com/test-group/repo3',
    path_with_namespace: 'test-group/repo3',
  },
  // forked project
  {
    id: 4,
    description: 'Project Four Description',
    name: 'test-repo4-forked',
    default_branch: 'main',
    path: 'test-repo4-forked',
    archived: false,
    last_activity_at: new Date().toString(),
    web_url: 'https://example.com/test-group/test-repo4-forked',
    path_with_namespace: 'test-group/test-repo4-forked',
    forked_from_project: { id: 13083 },
  },
];

export const all_users_response: GitLabUser[] = [
  {
    id: 1,
    username: 'JohnDoe',
    name: 'John Doe',
    state: 'active',
    email: 'john.doe@company.com',
    avatar_url: 'https://secure.gravatar.com/',
    web_url: 'https://gitlab.example/john_doe',
  },
  {
    id: 2,
    username: 'JaneDoe',
    name: 'Jane Doe',
    state: 'active',
    email: 'jane.doe@company.com',
    avatar_url: 'https://secure.gravatar.com/',
    web_url: 'https://gitlab.example/jane_doe',
  },
  {
    id: 3,
    username: 'MarySmith',
    name: 'Mary Smith',
    state: 'active',
    email: 'mary.smith@company.com',
    avatar_url: 'https://secure.gravatar.com/',
    web_url: 'https://gitlab.example/mary_smith',
  },
  {
    id: 4,
    username: 'LuigiMario',
    name: 'Luigi Mario',
    state: 'active',
    email: 'luigi.mario@company.com',
    avatar_url: 'https://secure.gravatar.com/',
    web_url: 'https://gitlab.example/luigi_mario',
  },
];

export const all_saas_users_response: MockObject[] = [
  {
    access_level: 30,
    created_at: '2023-07-17T08:58:34.984Z',
    expires_at: null,
    id: 12,
    username: 'testuser1',
    name: 'Test User 1',
    state: 'active',
    avatar_url: 'https://secure.gravatar.com/',
    web_url: 'https://gitlab.com/testuser1',
    email: 'testuser1@example.com',
    group_saml_identity: {
      provider: 'group_saml',
      extern_uid: '51',
      saml_provider_id: 1,
    },
    is_using_seat: true,
    membership_state: 'active',
  },
  {
    access_level: 30,
    created_at: '2023-07-19T08:58:34.984Z',
    expires_at: null,
    id: 34,
    username: 'testuser2',
    name: 'Test User 2',
    state: 'active',
    avatar_url: 'https://secure.gravatar.com/',
    web_url: 'https://gitlab.com/testuser2',
    email: 'testuser2@example.com',
    group_saml_identity: {
      provider: 'group_saml',
      extern_uid: '52',
      saml_provider_id: 1,
    },
    is_using_seat: true,
    membership_state: 'active',
  },
  {
    access_level: 50,
    created_at: '2023-07-15T08:58:34.984Z',
    expires_at: '2023-10-26',
    id: 54,
    username: 'group_100_bot_23dc8057bef66e05181f39be4652577c',
    name: 'Token Bot',
    state: 'active',
    avatar_url: 'https://secure.gravatar.com/',
    web_url:
      'https://gitlab.com/group_100_bot_23dc8057bef66e05181f39be4652577c',
    group_saml_identity: null,
    is_using_seat: false,
    membership_state: 'active',
  },
];

export const all_groups_response: GitLabGroup[] = [
  {
    id: 1,
    name: 'group1',
    description: '',
    full_path: 'group1',
  },
  {
    id: 2,
    name: 'group2',
    description: '',
    full_path: 'group2',
  },
  {
    id: 3,
    name: 'group3',
    description: '',
    full_path: 'group3',
  },
  {
    id: 4,
    name: 'group1',
    description: '',
    full_path: 'new-parent-path/group1',
  },
];

export const group_with_parent: MockObject[] = [
  {
    id: 1,
    name: 'group-with-parent',
    description: 'description1',
    full_path: 'path/group-with-parent',
    parent_id: 123,
  },
];

export const expectedSaasMember: MockObject[] = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@example.com',
    name: 'user1',
    state: 'active',
    web_url: 'user1.com',
    avatar_url: 'user1',
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@example.com',
    name: 'user2',
    state: 'active',
    web_url: 'user2.com',
    avatar_url: 'user2',
  },
];

export const expectedSaasGroup: MockObject[] = [
  {
    id: 1,
    name: 'group1',
    description: 'description1',
    full_path: 'path/group1',
    parent_id: 123,
  },
  {
    id: 2,
    name: 'group2',
    description: 'description2',
    full_path: 'path/group2',
    parent_id: 123,
  },
];

/**
 * GitLab Events
 */

const added_commits: MockObject[] = [
  {
    id: 'ce53673ebe13a961a6b937411019e7c1db79741f',
    message: 'test',
    title: 'test',
    timestamp: '2024-01-24T14:16:55+00:00',
    url: 'https://example.com/test-group/test-repo1/-/commit/ce53673ebe13a961a6b937411019e7c1db79741f',
    author: {
      name: 'Tom Sawyer',
      email: 'tom.sawyer@email.com',
    },
    added: ['catalog-info.yaml'],
    modified: [],
    removed: [],
  },
  {
    id: 'ce53673ebe13a961a6b937411019e7c1db79741f',
    message: 'test',
    title: 'test',
    timestamp: '2024-01-24T14:16:55+00:00',
    url: 'https://example.com/test-group/test-repo1/-/commit/ce53673ebe13a961a6b937411019e7c1db79741f',
    author: {
      name: 'Tom Sawyer',
      email: 'tom.sawyer@email.com',
    },
    added: ['cool-folder-1/cool-folder-2/catalog-info.yaml'],
    modified: [],
    removed: [],
  },
];

const removed_commits: MockObject[] = [
  {
    id: 'ce53673ebe13a961a6b937411019e7c1db79741f',
    message: 'test',
    title: 'test',
    timestamp: '2024-01-24T14:16:55+00:00',
    url: 'https://example.com/test-group/test-repo1/-/commit/ce53673ebe13a961a6b937411019e7c1db79741f',
    author: {
      name: 'Tom Sawyer',
      email: 'tom.sawyer@email.com',
    },
    added: [],
    modified: [],
    removed: ['catalog-info.yaml'],
  },
];

const modified_commits: MockObject[] = [
  {
    id: 'ce53673ebe13a961a6b937411019e7c1db79741f',
    message: 'test',
    title: 'test',
    timestamp: '2024-01-24T14:16:55+00:00',
    url: 'https://example.com/test-group/test-repo1/-/commit/ce53673ebe13a961a6b937411019e7c1db79741f',
    author: {
      name: 'Tom Sawyer',
      email: 'tom.sawyer@email.com',
    },
    added: [],
    modified: ['catalog-info.yaml'],
    removed: [],
  },
];

export const group_destroy_event: EventParams = {
  topic: 'gitlab.group_destroy',
  eventPayload: {
    event_name: 'group_destroy',
    created_at: '2024-02-02T10:53:09Z',
    updated_at: '2024-02-02T10:53:09Z',
    name: 'group1',
    path: 'group1',
    full_path: 'group1',
    group_id: 123,
  },
};

export const group_rename_event: EventParams = {
  topic: 'gitlab.group_rename',
  eventPayload: {
    event_name: 'group_rename',
    created_at: '2024-02-02T10:53:09Z',
    updated_at: '2024-02-02T10:53:09Z',
    name: 'group1', // this is the displayname
    path: 'new-parent-group',
    full_path: 'new-parent-group/group1',
    old_path: 'old-parent-group',
    old_full_path: 'old-parent-path/group1',
    group_id: 4,
  },
};

export const group_create_event: EventParams = {
  topic: 'gitlab.group_create',
  eventPayload: {
    event_name: 'group_create',
    created_at: '2024-02-02T10:53:09Z',
    updated_at: '2024-02-02T10:53:09Z',
    name: 'group1',
    path: 'group1',
    full_path: 'my-groups/group1',
    group_id: 1,
  },
};

export const user_create_event: EventParams = {
  topic: 'gitlab.user_create',
  eventPayload: {
    event_name: 'user_create',
    created_at: '2024-02-02T10:53:09Z',
    updated_at: '2024-02-02T10:53:09Z',
    email: 'john.doe@company.com',
    name: 'John Doe',
    username: 'johndoe',
    user_id: 1,
  },
};
export const user_destroy_event: EventParams = {
  topic: 'gitlab.user_destroy',
  eventPayload: {
    event_name: 'user_destroy',
    created_at: '2024-02-02T10:53:09Z',
    updated_at: '2024-02-02T10:53:09Z',
    email: 'john.doe@company.com',
    name: 'John Doe',
    username: 'johndoe',
    user_id: 1,
  },
};

export const user_add_to_group_event: EventParams = {
  topic: 'gitlab.user_add_to_group',
  eventPayload: {
    created_at: '2024-02-02T10:53:09Z',
    updated_at: '2024-02-02T10:53:09Z',
    group_name: 'group1',
    group_path: 'my-groups/group1',
    group_id: 1,
    user_username: 'JohnDoe',
    user_name: 'John Doe',
    user_email: 'john.doe@company.com',
    user_id: 1,
    group_access: 'Owner',
    expires_at: null,
    group_plan: null,
    event_name: 'user_add_to_group',
  },
};

export const user_remove_from_group_event: EventParams = {
  topic: 'gitlab.user_remove_from_group',
  eventPayload: {
    created_at: '2024-02-02T10:53:09Z',
    updated_at: '2024-02-02T10:53:09Z',
    group_name: 'group1',
    group_path: 'my-groups/group1',
    group_id: 1,
    user_username: 'user1',
    user_name: 'John Doe',
    user_email: 'john.doe@company.com',
    user_id: 1,
    group_access: 'Owner',
    expires_at: null,
    group_plan: null,
    event_name: 'user_remove_from_group',
  },
};

export const push_add_event: EventParams = {
  topic: 'gitlab.push',
  metadata: {
    'x-gitlab-event': 'Push Hook',
  },
  eventPayload: {
    object_kind: 'push',
    event_name: 'push',
    before: 'a1a1472b4a1b51d521d75a95cethisisatest00',
    after: '616thisisatestc424d5031540dee772a845bcf9',
    ref: 'refs/heads/main',
    ref_protected: true,
    checkout_sha: '616c427c283fb1b834d5thisiatest72a845bcf9',
    user_id: 11013327,
    user_name: 'Tom Sawyer',
    user_username: 'tom.sawyer',
    user_email: 'tom.sawyer@email.com',
    user_avatar: 'https://secure.gravatar.com/avatar/testtest=42&d=identicon',
    project_id: 123456789,
    project: {
      name: 'test-repo',
      path_with_namespace: 'test-group/test-repo1',
      description: 'My Cool Project',
      web_url: 'https://example.com/test-group/test-repo1',
      avatar_url: null,
      namespace: 'test-group',
      visibility_level: 20,
      default_branch: 'main',
      url: 'https://example.com/test-group/test-repo1',
      git_ssh_url: '',
      git_http_url: '',
      homepage: '',
      ssh_url: '',
      http_url: '',
    },
    commits: added_commits,
    total_commits_count: 2,
    // push_options: {},
    repository: {
      name: 'test-repo',
      url: 'https://gitlab.com/test-group/test-repo1',
      description: 'My Cool Project',
      homepage: 'https://gitlab.com/test-group/test-repo1',
      git_http_url: 'https://gitlab.com/test-group/test-repo1.git',
      git_ssh_url: 'git@gitlab.com:btest-group/test-repo1.git',
      visibility_level: 20,
    },
  },
};

export const push_remove_event: EventParams = {
  topic: 'gitlab.push',
  metadata: {
    'x-gitlab-event': 'Push Hook',
  },
  eventPayload: {
    object_kind: 'push',
    event_name: 'push',
    before: 'a1a1472b4a1b51d521d75a95cethisisatest00',
    after: '616thisisatestc424d5031540dee772a845bcf9',
    ref: 'refs/heads/main',
    ref_protected: true,
    checkout_sha: '616c427c283fb1b834d5thisiatest72a845bcf9',
    user_id: 11013327,
    user_name: 'Tom Sawyer',
    user_username: 'tom.sawyer',
    user_email: 'tom.sawyer@email.com',
    user_avatar: 'https://secure.gravatar.com/avatar/testtest=42&d=identicon',
    project_id: 123456789,
    project: {
      name: 'test-repo',
      path_with_namespace: 'test-group/test-repo1',
      description: 'My Cool Project',
      web_url: 'https://example.com/test-group/test-repo1',
      avatar_url: null,
      namespace: 'test-group',
      visibility_level: 20,
      default_branch: 'main',
      url: 'https://example.com/test-group/test-repo1',
      git_ssh_url: '',
      git_http_url: '',
      homepage: '',
      ssh_url: '',
      http_url: '',
    },
    commits: removed_commits,
    total_commits_count: 2,
    repository: {
      name: 'test-repo',
      url: 'https://gitlab.com/test-group/test-repo1',
      description: 'My Cool Project',
      homepage: 'https://gitlab.com/test-group/test-repo1',
      git_http_url: 'https://gitlab.com/test-group/test-repo1.git',
      git_ssh_url: 'git@gitlab.com:btest-group/test-repo1.git',
      visibility_level: 20,
    },
  },
};

export const push_modif_event: EventParams = {
  topic: 'gitlab.push',
  metadata: {
    'x-gitlab-event': 'Push Hook',
  },
  eventPayload: {
    object_kind: 'push',
    event_name: 'push',
    before: 'a1a1472b4a1b51d521d75a95cethisisatest00',
    after: '616thisisatestc424d5031540dee772a845bcf9',
    ref: 'refs/heads/main',
    ref_protected: true,
    checkout_sha: '616c427c283fb1b834d5thisiatest72a845bcf9',
    user_id: 11013327,
    user_name: 'Tom Sawyer',
    user_username: 'tom.sawyer',
    user_email: 'tom.sawyer@email.com',
    user_avatar: 'https://secure.gravatar.com/avatar/testtest=42&d=identicon',
    project_id: 123456789,
    project: {
      name: 'test-repo',
      path_with_namespace: 'test-group/test-repo1',
      description: 'My Cool Project',
      web_url: 'https://example.com/test-group/test-repo1',
      avatar_url: null,
      namespace: 'test-group',
      visibility_level: 20,
      default_branch: 'main',
      url: 'https://example.com/test-group/test-repo1',
      git_ssh_url: '',
      git_http_url: '',
      homepage: '',
      ssh_url: '',
      http_url: '',
    },
    commits: modified_commits,
    total_commits_count: 2,
    repository: {
      name: 'test-repo',
      url: 'https://gitlab.com/test-group/test-repo1',
      description: 'My Cool Project',
      homepage: 'https://gitlab.com/test-group/test-repo1',
      git_http_url: 'https://gitlab.com/test-group/test-repo1.git',
      git_ssh_url: 'git@gitlab.com:btest-group/test-repo1.git',
      visibility_level: 20,
    },
  },
};

/**
 * Expected Backstage entities
 */
export const expected_location_entities: MockObject[] =
  all_projects_response.map(project => {
    const targetUrl = `https://example.com/${groupName}/${project.name}/-/blob/${project.default_branch}/catalog-info.yaml`;

    return {
      entity: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Location',
        metadata: {
          annotations: {
            'backstage.io/managed-by-location': `url:${targetUrl}`,
            'backstage.io/managed-by-origin-location': `url:${targetUrl}`,
          },
          name: locationSpecToMetadataName({ target: targetUrl, type: 'url' }),
        },
        spec: {
          presence: 'optional',
          target: targetUrl,
          type: 'url',
        },
      },
      locationKey: 'GitlabDiscoveryEntityProvider:test-id',
    };
  });

export const expected_added_location_entities: MockObject[] = added_commits.map(
  commit => {
    const targetUrl = `https://example.com/test-group/test-repo1/-/blob/main/${commit.added}`;

    return {
      entity: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Location',
        metadata: {
          annotations: {
            'backstage.io/managed-by-location': `url:${targetUrl}`,
            'backstage.io/managed-by-origin-location': `url:${targetUrl}`,
          },
          name: locationSpecToMetadataName({ target: targetUrl, type: 'url' }),
        },
        spec: {
          presence: 'optional',
          target: targetUrl,
          type: 'url',
        },
      },
      locationKey: 'GitlabDiscoveryEntityProvider:test-id',
    };
  },
);

export const expected_removed_location_entities: MockObject[] =
  removed_commits.map(commit => {
    const targetUrl = `https://example.com/test-group/test-repo1/-/blob/main/${commit.removed}`;

    return {
      entity: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Location',
        metadata: {
          annotations: {
            'backstage.io/managed-by-location': `url:${targetUrl}`,
            'backstage.io/managed-by-origin-location': `url:${targetUrl}`,
          },
          name: locationSpecToMetadataName({ target: targetUrl, type: 'url' }),
        },
        spec: {
          presence: 'optional',
          target: targetUrl,
          type: 'url',
        },
      },
      locationKey: 'GitlabDiscoveryEntityProvider:test-id',
    };
  });

export const expected_group_entity: MockObject[] = [
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:https://example.com/group1',
          'backstage.io/managed-by-origin-location':
            'url:https://example.com/group1',
          'example.com/team-path': 'group1',
        },
        name: 'group1',
      },
      spec: {
        children: [],
        profile: {
          displayName: 'group1',
        },
        type: 'team',
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
];

export const expected_group_user_entity: MockObject[] = [
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:https://example.com/group1',
          'backstage.io/managed-by-origin-location':
            'url:https://example.com/group1',
          'example.com/team-path': 'group1',
        },
        name: 'group1',
      },
      spec: {
        children: [],
        members: ['user1'],
        profile: {
          displayName: 'group1',
        },
        type: 'team',
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
];

export const expected_added_group_entity: MockObject[] = [
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location':
            'url:https://example.com/new-parent-path/group1',
          'backstage.io/managed-by-origin-location':
            'url:https://example.com/new-parent-path/group1',
          'example.com/team-path': 'new-parent-path/group1',
        },
        name: 'new-parent-path-group1',
      },
      spec: {
        children: [],
        profile: {
          displayName: 'group1',
        },
        type: 'team',
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
];

export const expected_removed_group_entity: MockObject[] = [
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location':
            'url:https://example.com/old-parent-path/group1',
          'backstage.io/managed-by-origin-location':
            'url:https://example.com/old-parent-path/group1',
          'example.com/team-path': 'old-parent-path/group1',
        },
        name: 'old-parent-path-group1',
      },
      spec: {
        children: [],
        profile: {
          displayName: 'group1',
        },
        type: 'team',
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
];

export const expected_transformed_group_entity: MockObject[] = [
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:https://example.com/group1',
          'backstage.io/managed-by-origin-location':
            'url:https://example.com/group1',
          'example.com/team-path': 'group1',
        },
        name: '1',
      },
      spec: {
        children: [],
        profile: {
          displayName: 'group1',
        },
        type: 'team',
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
];

export const expected_user1_entity: MockObject[] = [
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:https://example.com/JohnDoe',
          'backstage.io/managed-by-origin-location':
            'url:https://example.com/JohnDoe',
          'example.com/user-login': 'https://gitlab.example/john_doe',
        },
        name: 'JohnDoe',
      },
      spec: {
        memberOf: [],
        profile: {
          displayName: 'John Doe',
          email: 'john.doe@company.com',
          picture: 'https://secure.gravatar.com/',
        },
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
];

export const expected_user1_removed_entity: MockObject[] = [
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:https://example.com/johndoe',
          'backstage.io/managed-by-origin-location':
            'url:https://example.com/johndoe',
          'example.com/user-login': '',
        },
        name: 'johndoe',
      },
      spec: {
        memberOf: [],
        profile: {
          displayName: 'John Doe',
          email: 'john.doe@company.com',
          picture: undefined,
        },
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
];

export const expected_full_org_scan_entities: MockObject[] = [
  {
    ...expected_user1_entity[0],
    entity: {
      ...expected_user1_entity[0].entity,
      spec: {
        ...expected_user1_entity[0].entity.spec,
        memberOf: ['group1'], // Add 'group1' to the memberOf property
      },
    },
  },
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:https://example.com/JaneDoe',
          'backstage.io/managed-by-origin-location':
            'url:https://example.com/JaneDoe',
          'example.com/user-login': 'https://gitlab.example/jane_doe',
        },
        name: 'JaneDoe',
      },
      spec: {
        memberOf: [],
        profile: {
          displayName: 'Jane Doe',
          email: 'jane.doe@company.com',
          picture: 'https://secure.gravatar.com/',
        },
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location':
            'url:https://example.com/MarySmith',
          'backstage.io/managed-by-origin-location':
            'url:https://example.com/MarySmith',
          'example.com/user-login': 'https://gitlab.example/mary_smith',
        },
        name: 'MarySmith',
      },
      spec: {
        memberOf: [],
        profile: {
          displayName: 'Mary Smith',
          email: 'mary.smith@company.com',
          picture: 'https://secure.gravatar.com/',
        },
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location':
            'url:https://example.com/LuigiMario',
          'backstage.io/managed-by-origin-location':
            'url:https://example.com/LuigiMario',
          'example.com/user-login': 'https://gitlab.example/luigi_mario',
        },
        name: 'LuigiMario',
      },
      spec: {
        memberOf: [],
        profile: {
          displayName: 'Luigi Mario',
          email: 'luigi.mario@company.com',
          picture: 'https://secure.gravatar.com/',
        },
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
  expected_group_entity[0],
];

export const expected_full_org_scan_entities_saas: MockObject[] = [
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location':
            'url:https://gitlab.com/testuser1',
          'backstage.io/managed-by-origin-location':
            'url:https://gitlab.com/testuser1',
          'gitlab.com/user-login': 'https://gitlab.com/testuser1',
          'gitlab.com/saml-external-uid': '51',
        },
        name: 'testuser1',
      },
      spec: {
        memberOf: [],
        profile: {
          displayName: 'Test User 1',
          email: 'testuser1@example.com',
          picture: 'https://secure.gravatar.com/',
        },
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
  {
    entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location':
            'url:https://gitlab.com/testuser2',
          'backstage.io/managed-by-origin-location':
            'url:https://gitlab.com/testuser2',
          'gitlab.com/user-login': 'https://gitlab.com/testuser2',
          'gitlab.com/saml-external-uid': '52',
        },
        name: 'testuser2',
      },
      spec: {
        memberOf: [],
        profile: {
          displayName: 'Test User 2',
          email: 'testuser2@example.com',
          picture: 'https://secure.gravatar.com/',
        },
      },
    },
    locationKey: 'GitlabOrgDiscoveryEntityProvider:test-id',
  },
];
