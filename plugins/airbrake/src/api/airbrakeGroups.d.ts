/*
 * Copyright 2022 The Backstage Authors
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

export interface Groups {
  count: number;
  end: string;
  groups?: Group[] | null;
  page: number;
  resolvedCount: number;
  unresolvedCount: number;
}

export interface Group {
  id: string;
  projectId: number;
  resolved: boolean;
  muted: boolean;
  mutedBy: number;
  mutedAt?: string | null;
  errors?: Error[];
  attributes?: string | null;
  context: Context;
  lastDeployId: string;
  lastDeployAt?: string | null;
  lastNoticeId: string;
  lastNoticeAt: string;
  noticeCount: number;
  noticeTotalCount: number;
  commentCount: number;
  createdAt: string;
}

export interface Error {
  type: string;
  message: string;
  backtrace?: Backtrace[];
}

export interface Backtrace {
  file: string;
  function: string;
  line: number;
  column: number;
  code?: string | null;
}

export interface Context {
  action: string;
  component: string;
  environment: string;
  severity: string;
}
