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

export type GitLabUser = {
  id: number;
  username: string;
  email: string;
  name: string;
  state: string;
  web_url: string;
  avatar_url: string;
  groups?: GitLabGroup[];
};

export type GitLabGroup = {
  id: number;
  name: string;
  full_path: string;
  description?: string;
  parent_id?: number;
};

export type GitLabGroupMembersResponse = {
  errors: { message: string }[];
  data: {
    group: {
      groupMembers: {
        nodes: { user: { id: string } }[];
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
      };
    };
  };
};

export type GitlabProviderConfig = {
  host: string;
  group: string;
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
  catalogFile: string;
  projectPattern: RegExp;
  userPattern: RegExp;
  groupPattern: RegExp;
  orgEnabled?: boolean;
  schedule?: TaskScheduleDefinition;
};
