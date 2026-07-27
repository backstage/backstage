/*
 * Copyright 2026 The Backstage Authors
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
export interface DateRange {
  from: Date;
  to: Date;
}

export interface Paging {
  limit: number;
  offset: number;
  orderField?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ReportQuery extends DateRange {
  userEntityRef?: string;
  action?: string;
  path?: string;
  pluginId?: string;
}

export interface ActivityQuery extends ReportQuery, Paging {
  sessionId?: string;
}

export interface ExportActivityRow {
  eventId: string;
  occurredAt: string;
  userEntityRef: string;
  sessionId: string;
  action: string;
  subject?: string;
  value?: number;
  pluginId?: string;
  extensionId?: string;
  currentPath: string;
  previousPath?: string;
}

export interface ExportPageRow {
  path: string;
  pageViews: number;
  uniqueUsers: number;
  estimatedDurationSeconds: number;
  lastViewedAt: string;
}

export interface ExportRowStream<T> extends AsyncIterable<T> {
  destroy(error?: Error): void;
}

export interface StoredUsageEvent {
  eventId: string;
  occurredAt: Date;
  receivedAt: Date;
  userEntityRef: string;
  sessionId: string;
  action: string;
  subject?: string;
  value?: number;
  pluginId?: string;
  extensionId?: string;
  currentPath: string;
  previousPath?: string;
}

export interface StoredPresence {
  sessionId: string;
  userEntityRef: string;
  currentPath: string;
  seenAt: Date;
}
