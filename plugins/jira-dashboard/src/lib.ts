/*
 * Copyright 2023 The Backstage Authors
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

import { Project } from '@backstage/plugin-jira-dashboard-common';

/**
 * Get the URL to a Jira project.
 */
export const getProjectUrl = (project: Project) => {
  const url = new URL(project.self);
  return `https://${url.host}/browse/${project.key}`;
};

/**
 * Get the URL to a issue.
 */
export const getIssueUrl = (issueUrl: string, issueKey: string) => {
  const url = new URL(issueUrl);
  return `https://${url.host}/browse/${issueKey}`;
};
