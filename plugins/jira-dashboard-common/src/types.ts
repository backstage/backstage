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

/**
 * Type for defining a Jira issue
 *  @public
 */
export type Issue = {
  key: string;
  self: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    assignee: {
      name: string;
      self: string;
    };
    issuetype: {
      name: string;
      iconUrl: string;
    };
  };
};

/**
 * Type for defining a Jira filter
 *  @public
 */
export type Filter = {
  name: string;
  query: string;
  shortName: string;
};

/**
 * Type for defining JiraDataResponse
 *  @public
 */
export type JiraDataResponse = {
  name: string;
  type: 'component' | 'filter';
  issues: Issue[];
};

/**
 * Type for defining a Jira project
 *  @public
 */
export type Project = {
  name: string;
  key: string;
  description: string;
  avatarUrls: { '48x48': string };
  projectTypeKey: string;
  projectCategory: {
    name: string;
  };
  lead: {
    key: string;
    displayName: string;
  };
  self: string;
};

/**
 * Type for defining JiraResponse
 *  @public
 */
export type JiraResponse = {
  project: Project;
  data: JiraDataResponse[];
};
