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

export type GitlabProjectSettings = {
  path?: string;
  auto_devops_enabled?: boolean;
  ci_config_path?: string;
  description?: string;
  namespace_id?: number;
  topics?: string[];
  visibility?: 'private' | 'internal' | 'public';
  group_runners_enabled?: boolean;
  emails_enabled?: boolean;
  container_registry_access_level?: 'disabled' | 'private' | 'enabled';
  builds_access_level?: 'disabled' | 'private' | 'enabled';
  auto_cancel_pending_pipelines?: 'disabled' | 'enabled';
};

export type GitlabBranchSettings = {
  name: string;
  protect?: boolean;
  create?: boolean;
  ref?: string;
};

export type GitlabProjectVariableSettings = {
  key: string;
  value: string;
  description?: string;
  variable_type?: string;
  protected?: boolean;
  masked?: boolean;
  raw?: boolean;
  environment_scope?: string;
};
