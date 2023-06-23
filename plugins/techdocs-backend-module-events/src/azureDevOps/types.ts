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

// Generated using quicktype.io
// Based on https://learn.microsoft.com/en-us/azure/devops/service-hooks/events?view=azure-devops#code-pushed

export type CodePushEvent = {
  id: string;
  eventType: string;
  publisherId: string;
  scope: string;
  message: Message;
  detailedMessage: Message;
  resource: Resource;
  resourceVersion: string;
  resourceContainers: ResourceContainers;
  createdDate: Date;
};

export type Message = {
  text: string;
  html: string;
  markdown: string;
};

export type Resource = {
  commits: Commit[];
  refUpdates: RefUpdate[];
  repository: Repository;
  pushedBy: PushedBy;
  pushId: number;
  date: Date;
  url: string;
};

export type Commit = {
  commitId: string;
  author: Author;
  committer: Author;
  comment: string;
  url: string;
};

export type Author = {
  name: string;
  email: string;
  date: Date;
};

export type PushedBy = {
  id: string;
  displayName: string;
  uniqueName: string;
};

export type RefUpdate = {
  name: string;
  oldObjectId: string;
  newObjectId: string;
};

export type Repository = {
  id: string;
  name: string;
  url: string;
  project: Project;
  defaultBranch: string;
  remoteUrl: string;
};

export type Project = {
  id: string;
  name: string;
  url: string;
  state: string;
};

export type ResourceContainers = {
  collection: Account;
  account: Account;
  project: Account;
};

export type Account = {
  id: string;
};
