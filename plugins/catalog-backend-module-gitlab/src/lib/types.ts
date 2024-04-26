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
import { TaskScheduleDefinition } from '@backstage/backend-tasks';
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

  orgEnabled?: boolean;
  schedule?: TaskScheduleDefinition;
  /**
   * If the project is a fork, skip repository
   */
  skipForkedRepos?: boolean;
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
