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

export type Filter = {
  name: string;
  query: string;
};

export type JiraDataResponse = {
  name: string;
  type: 'component' | 'filter';
  issues: Issue[];
};

export type Project = {
  name: string;
  key: string;
  description: string;
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

export type JiraResponse = {
  project: Project;
  data: JiraDataResponse[];
};
