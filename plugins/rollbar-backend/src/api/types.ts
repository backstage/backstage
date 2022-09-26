/*
 * Copyright 2020 The Backstage Authors
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

// TODO: Make this re-usable with backend

/** @public */
export type RollbarProjectAccessTokenScope = 'read' | 'write';

/** @public */
export type RollbarEnvironment = 'production' | string;

/** @public */
export enum RollbarLevel {
  debug = 10,
  info = 20,
  warning = 30,
  error = 40,
  critical = 50,
}

/** @public */
export enum RollbarFrameworkId {
  'unknown' = 0,
  'rails' = 1,
  'django' = 2,
  'pyramid' = 3,
  'node-js' = 4,
  'pylons' = 5,
  'php' = 6,
  'browser-js' = 7,
  'rollbar-system' = 8,
  'android' = 9,
  'ios' = 10,
  'mailgun' = 11,
  'logentries' = 12,
  'python' = 13,
  'ruby' = 14,
  'sidekiq' = 15,
  'flask' = 16,
  'celery' = 17,
  'rq' = 18,
}

/** @public */
export enum RollbarPlatformId {
  'unknown' = 0,
  'browser' = 1,
  'flash' = 2,
  'android' = 3,
  'ios' = 4,
  'heroku' = 5,
  'google-app-engine' = 6,
  'client' = 7,
}

/** @public */
export type RollbarProject = {
  id: number;
  name: string;
  accountId: number;
  status: 'enabled' | string;
};

/** @public */
export type RollbarProjectAccessToken = {
  projectId: number;
  name: string;
  scopes: RollbarProjectAccessTokenScope[];
  accessToken: string;
  status: 'enabled' | string;
};

/** @public */
export type RollbarItem = {
  publicItemId: number;
  integrationsData: null;
  levelLock: number;
  controllingId: number;
  lastActivatedTimestamp: number;
  assignedUserId: number;
  groupStatus: number;
  hash: string;
  id: number;
  environment: RollbarEnvironment;
  titleLock: number;
  title: string;
  lastOccurrenceId: number;
  lastOccurrenceTimestamp: number;
  platform: RollbarPlatformId;
  firstOccurrenceTimestamp: number;
  project_id: number;
  resolvedInVersion: string;
  status: 'enabled' | string;
  uniqueOccurrences: number;
  groupItemId: number;
  framework: RollbarFrameworkId;
  totalOccurrences: number;
  level: RollbarLevel;
  counter: number;
  lastModifiedBy: number;
  firstOccurrenceId: number;
  activatingOccurrenceId: number;
  lastResolvedTimestamp: number;
};

/** @public */
export type RollbarItemsResponse = {
  items: RollbarItem[];
  page: number;
  totalCount: number;
};

/** @public */
export type RollbarItemCount = {
  timestamp: number;
  count: number;
};

/** @public */
export type RollbarTopActiveItem = {
  item: {
    id: number;
    counter: number;
    environment: RollbarEnvironment;
    framework: RollbarFrameworkId;
    lastOccurrenceTimestamp: number;
    level: number;
    occurrences: number;
    projectId: number;
    title: string;
    uniqueOccurrences: number;
  };
  counts: number[];
};
