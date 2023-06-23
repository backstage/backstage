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
// Based on https://confluence.atlassian.com/bitbucketserver/event-payload-938025882.html

export type PushEvent = {
  eventKey: string;
  date: string;
  actor: Actor;
  repository: Repository;
  changes: Change[];
};

export type Actor = {
  name: string;
  emailAddress: string;
  id: number;
  displayName: string;
  active: boolean;
  slug: string;
  type: string;
};

export type Change = {
  ref: Ref;
  refId: string;
  fromHash: string;
  toHash: string;
  type: string;
};

export type Ref = {
  id: string;
  displayId: string;
  type: string;
};

export type Repository = {
  slug: string;
  id: number;
  name: string;
  scmId: string;
  state: string;
  statusMessage: string;
  forkable: boolean;
  project: Project;
  public: boolean;
};

export type Project = {
  key: string;
  id: number;
  name: string;
  public: boolean;
  type: string;
};
