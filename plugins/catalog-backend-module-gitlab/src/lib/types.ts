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

export type GitLabProject = {
  id: number;
  default_branch?: string;
  archived: boolean;
  last_activity_at: string;
  web_url: string;
  path_with_namespace?: string;
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

export type GitLabMembership = {
  source_id: number;
  source_name: string;
  source_type: string;
  access_level: number;
};

export type GitlabProviderConfig = {
  host: string;
  group: string;
  id: string;
  /**
   * @deprecated use `fallbackBranch` instead
   */
  branch?: string;
  /**
   * If there is no default branch defined at the project, this fallback is used to discover catalog files.
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
