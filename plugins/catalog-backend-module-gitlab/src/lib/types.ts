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
import { SchedulerServiceTaskScheduleDefinition } from '@backstage/backend-plugin-api';
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { GitLabIntegrationConfig } from '@backstage/integration';

export type PagedResponse<T> = {
  items: T[];
  nextPage?: number;
};

export type GitlabGroupDescription = {
  id: number;
  web_url: string;
  projects: GitLabProject[];
};

export type GitlabProjectForkedFrom = {
  id: number;
};

export type GitLabProject = {
  id: number;
  description?: string;
  name?: string;
  path?: string;
  default_branch?: string;
  archived: boolean;
  last_activity_at: string;
  web_url: string;
  path_with_namespace?: string;
  forked_from_project?: GitlabProjectForkedFrom;
};

/**
 * Representation of a GitLab user in the GitLab API
 *
 * @public
 */
export type GitLabUser = {
  id: number;
  username: string;
  email?: string;
  name: string;
  state: string;
  web_url: string;
  avatar_url: string;
  groups?: GitLabGroup[];
  group_saml_identity?: GitLabGroupSamlIdentity;
  is_using_seat?: boolean; // Only available in responses from the group members endpoint
};

/**
 * @public
 */
export type GitLabGroupSamlIdentity = {
  extern_uid: string;
};

/**
 * Representation of a GitLab group in the GitLab API
 *
 * @public
 */
export type GitLabGroup = {
  id: number;
  name: string;
  full_path: string;
  description?: string;
  visibility?: string;
  parent_id?: number;
};

export type GitLabGroupMembersResponse = {
  errors: { message: string }[];
  data: {
    group: {
      groupMembers: {
        nodes: {
          user: {
            id: string;
            username: string;
            publicEmail: string;
            name: string;
            state: string;
            webUrl: string;
            avatarUrl: string;
          };
        }[];
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
      };
    };
  };
};

export type GitLabDescendantGroupsResponse = {
  errors: { message: string }[];
  data: {
    group: {
      descendantGroups: {
        nodes: [
          {
            id: string;
            name: string;
            description: string;
            fullPath: string;
            visibility: string;
            parent: {
              id: string;
            };
          },
        ];
        pageInfo: {
          endCursor: string;
          hasNextPage: false;
        };
      };
    };
  };
};
/**
 * The configuration parameters for the GitlabProvider
 *
 * @public
 */
export type GitlabProviderConfig = {
  /**
   * Identifies one of the hosts set up in the integrations
   */
  host: string;
  /**
   * Required for gitlab.com when `orgEnabled: true`.
   * Optional for self managed. Must not end with slash.
   * Accepts only groups under the provided path (which will be stripped)
   */
  group: string;

  /**
   * If true, the provider will only ingest users that are part of the configured group.
   */
  restrictUsersToGroup?: boolean;

  /**
   * ???
   */
  id: string;
  /**
   * The name of the branch to be used, to discover catalog files.
   */
  branch?: string;
  /**
   * If no `branch` is configured and there is no default branch defined at the project as well, this fallback is used
   * to discover catalog files.
   * Defaults to: `master`
   */
  fallbackBranch: string;
  /**
   * Defaults to `catalog-info.yaml`
   */
  catalogFile: string;
  /**
   * Filters found projects based on provided patter.
   * Defaults to `[\s\S]*`, which means to not filter anything
   */
  projectPattern: RegExp;
  /**
   * Filters found users based on provided patter.
   * Defaults to `[\s\S]*`, which means to not filter anything
   */
  userPattern: RegExp;
  /**
   * Filters found groups based on provided patter.
   * Defaults to `[\s\S]*`, which means to not filter anything
   */
  groupPattern: RegExp;

  /**
   * If true, the provider will also add inherited (ascendant) users to the ingested groups.
   * See: https://docs.gitlab.com/ee/api/graphql/reference/#groupmemberrelation
   *
   * @deprecated Use the `relations` array to configure group membership relations instead.
   **/
  allowInherited?: boolean;

  /**
   * Specifies the types of group membership relations that should be included when ingesting data.
   *
   * The following values are valid:
   * - 'DIRECT': Direct members of the group. This is the default relation and is always included.
   * - 'INHERITED': Members inherited from parent (ascendant) groups.
   * - 'DESCENDANTS': Members from child (descendant) groups.
   * - 'SHARED_FROM_GROUPS': Members shared from other groups.
   *
   * See: https://docs.gitlab.com/ee/api/graphql/reference/#groupmemberrelation
   *
   * If the `relations` array is provided in the app-config.yaml, it should contain any combination of the above values.
   * The 'DIRECT' relation is automatically included and cannot be excluded, even if not specified.
   * Example configuration:
   *
   * ```yaml
   * catalog:
   *   providers:
   *     gitlab:
   *       development:
   *         relations:
   *           - INHERITED
   *           - DESCENDANTS
   *           - SHARED_FROM_GROUPS
   * ```
   */
  relations?: string[];

  orgEnabled?: boolean;
  schedule?: SchedulerServiceTaskScheduleDefinition;
  /**
   * If the project is a fork, skip repository
   */
  skipForkedRepos?: boolean;
  /**
   * If the project is archived, include repository
   */
  includeArchivedRepos?: boolean;
  /**
   * List of repositories to exclude from discovery, should be the full path to the repository, e.g. `group/project`
   * Paths should not start or end with a slash.
   */
  excludeRepos?: string[];

  /**
   * If true, users without a seat will be included in the catalog.
   * Group/Application Access Tokens are still filtered out but you might find service accounts or other users without a seat.
   * Defaults to `false`
   */
  includeUsersWithoutSeat?: boolean;

  /**
   * If true, the membership parameter is set to true in the GitLab API request.
   * See: https://docs.gitlab.com/api/projects/#list-projects
   */
  membership?: boolean;

  /**
   * Optional comma seperated list of topics to filter projects by, as specified in the GitLab API documentation:
   * https://docs.gitlab.com/api/projects/#list-projects
   */
  topics?: string;
};

/**
 * Customize how group names are generated
 *
 * @public
 */
export type GroupNameTransformer = (
  options: GroupNameTransformerOptions,
) => string;

/**
 * The GroupTransformerOptions
 *
 * @public
 */
export interface GroupNameTransformerOptions {
  group: GitLabGroup;
  providerConfig: GitlabProviderConfig;
}
/**
 * Customize the ingested User entity
 *
 * @public
 */
export type UserTransformer = (options: UserTransformerOptions) => UserEntity;
/**
 * The UserTransformerOptions
 *
 * @public
 */
export interface UserTransformerOptions {
  user: GitLabUser;
  integrationConfig: GitLabIntegrationConfig;
  providerConfig: GitlabProviderConfig;
  groupNameTransformer: GroupNameTransformer;
}

/**
 * Customize the ingested Group entity
 *
 * @public
 */
export type GroupTransformer = (
  options: GroupTransformerOptions,
) => GroupEntity[];
/**
 * The GroupTransformer options
 *
 * @public
 */
export interface GroupTransformerOptions {
  groups: GitLabGroup[];
  providerConfig: GitlabProviderConfig;
  groupNameTransformer: GroupNameTransformer;
}

/**
 * Represents the schema for system hook events related to groups.
 * https://docs.gitlab.com/ee/administration/system_hooks.html
 *
 * @public
 */
export type SystemHookBaseGroupEventsSchema = {
  created_at: string;
  updated_at: string;
  name: string;
  path: string;
  full_path: string;
  group_id: number;
};

/**
 * Represents the schema for system hook events related to users.
 * https://docs.gitlab.com/ee/administration/system_hooks.html
 *
 * @public
 */
export type SystemHookBaseUserEventsSchema = {
  created_at: string;
  updated_at: string;
  email: string;
  name: string;
  username: string;
  user_id: number;
};

/**
 * Represents the schema for system hook events related to user memberships.
 * https://docs.gitlab.com/ee/administration/system_hooks.html
 *
 * @public
 */
export type SystemHookBaseMembershipEventsSchema = {
  created_at: string;
  updated_at: string;
  group_name: string;
  group_path: string;
  group_id: number;
  user_username: string;
  user_email: string;
  user_name: string;
  user_id: number;
  group_access: string;
};

/**
 * Represents the schema for system hook events related to projects.
 * https://docs.gitlab.com/ee/administration/system_hooks.html
 *
 * @public
 */
export type SystemHookBaseProjectEventsSchema = {
  created_at: string;
  updated_at: string;
  event_name: string;
  name: string;
  owner_email: string;
  owner_name: string;
  owners: { name: string; email: string }[];
  path: string;
  path_with_namespace: string;
  project_id: number;
  project_visibility: string;
};
