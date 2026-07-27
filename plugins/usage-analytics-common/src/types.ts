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

/** @public */
export interface UsageAnalyticsEventInput {
  eventId: string;
  occurredAt: string;
  action: string;
  subject?: string;
  value?: number;
  pluginId?: string;
  extensionId?: string;
  currentPath: string;
  previousPath?: string;
}

/** @public */
export interface RecordUsageEventsRequest {
  sessionId: string;
  events: UsageAnalyticsEventInput[];
}

/** @public */
export interface UsagePresenceHeartbeatRequest {
  sessionId: string;
  currentPath: string;
}

/** @public */
export interface UsageRange {
  from: string;
  to: string;
}

/** @public */
export type UsageTimeseriesInterval = 'hour' | 'day' | 'week';

/** @public */
export interface UsageOverview extends UsageRange {
  eventCount: number;
  activeUsers: number;
  sessions: number;
  pageViews: number;
}

/** @public */
export interface UsageTimeseriesPoint {
  start: string;
  eventCount: number;
  activeUsers: number;
  sessions: number;
  pageViews: number;
}

/** @public */
export interface UsageTimeseries extends UsageRange {
  interval: UsageTimeseriesInterval;
  buckets: UsageTimeseriesPoint[];
}

/** @public */
export interface UsagePage {
  path: string;
  pageViews: number;
  uniqueUsers: number;
  estimatedDurationSeconds: number;
  lastViewedAt: string;
}

/** @public */
export interface UsagePlugin {
  pluginId: string;
  events: number;
  uniqueUsers: number;
  lastUsedAt: string;
}

/** @public */
export interface UsageUser {
  userEntityRef: string;
  eventCount: number;
  sessionCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
}

/** @public */
export interface UsageActivityItem {
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

/** @public */
export interface UsageEventType {
  action: string;
  count: number;
}

/** @public */
export interface UsagePresenceSummary {
  onlineUsers: number;
}

/** @public */
export interface OnlineUsageUser {
  userEntityRef: string;
  activeSessionCount: number;
  currentPath: string;
  lastSeenAt: string;
}

/** @public */
export interface UsageSessionSummary {
  sessionId: string;
  userEntityRef: string;
  startedAt: string;
  lastSeenAt: string;
  durationSeconds: number;
  eventCount: number;
}

/** @public */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

/** @public */
export type UsagePagesResponse = PaginatedResponse<UsagePage>;

/** @public */
export type UsageUsersResponse = PaginatedResponse<UsageUser>;

/** @public */
export type UsagePluginsResponse = PaginatedResponse<UsagePlugin>;

/** @public */
export type UsageActivityResponse = PaginatedResponse<UsageActivityItem>;

/** @public */
export type OnlineUsageUsersResponse = PaginatedResponse<OnlineUsageUser>;

/** @public */
export type UsageSessionsResponse = PaginatedResponse<UsageSessionSummary>;

/** @public */
export interface UsageEventTypesResponse {
  items: UsageEventType[];
}
