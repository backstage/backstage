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
import { ApiRef, createApiRef } from '@backstage/core-plugin-api';
import {
  OnlineUsageUsersResponse,
  UsageActivityResponse,
  UsageEventTypesResponse,
  UsageOverview,
  UsagePagesResponse,
  UsagePluginsResponse,
  UsagePresenceSummary,
  UsageSessionsResponse,
  UsageTimeseries,
  UsageTimeseriesInterval,
  UsageUsersResponse,
} from '@backstage/plugin-usage-analytics-common';

/**
 * Options shared by usage analytics report requests.
 *
 * @public
 */
export interface UsageReportFilters {
  from?: string;
  to?: string;
  userEntityRef?: string;
  path?: string;
  pluginId?: string;
  action?: string;
}

/**
 * Pagination and sorting shared by tabular usage analytics reports.
 *
 * @public
 */
export interface UsagePagingOptions<OrderField extends string> {
  limit?: number;
  offset?: number;
  orderField?: OrderField;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Options shared by paginated usage analytics reports.
 *
 * @public
 */
export type UsageReportOptions<OrderField extends string> = UsageReportFilters &
  UsagePagingOptions<OrderField>;

/** @public */
export type UsagePagesOptions = UsageReportOptions<
  | 'path'
  | 'pageViews'
  | 'uniqueUsers'
  | 'estimatedDurationSeconds'
  | 'lastViewedAt'
>;

/** @public */
export type UsagePluginsOptions = UsageReportOptions<
  'pluginId' | 'events' | 'uniqueUsers' | 'lastUsedAt'
>;

/** @public */
export type UsageUsersOptions = UsageReportOptions<
  'userEntityRef' | 'eventCount' | 'sessionCount' | 'lastSeenAt'
>;

/** @public */
export type UsageSessionsOptions = UsageReportOptions<
  'sessionId' | 'userEntityRef' | 'lastSeenAt'
>;

/**
 * Options for querying individual usage events.
 *
 * @public
 */
export interface UsageActivityOptions
  extends UsageReportOptions<
    'occurredAt' | 'action' | 'currentPath' | 'pluginId'
  > {
  sessionId?: string;
}

/** @public */
export type OnlineUsageUsersOptions = UsagePagingOptions<
  'userEntityRef' | 'activeSessionCount' | 'currentPath' | 'lastSeenAt'
>;

/**
 * Read-only client API for the usage analytics backend.
 *
 * @public
 */
export interface UsageAnalyticsApi {
  getOverview(options?: UsageReportFilters): Promise<UsageOverview>;
  getTimeseries(
    interval: UsageTimeseriesInterval,
    options?: UsageReportFilters,
  ): Promise<UsageTimeseries>;
  getPages(options?: UsagePagesOptions): Promise<UsagePagesResponse>;
  getPlugins(options?: UsagePluginsOptions): Promise<UsagePluginsResponse>;
  getUsers(options?: UsageUsersOptions): Promise<UsageUsersResponse>;
  getActivity(options?: UsageActivityOptions): Promise<UsageActivityResponse>;
  getSessions(options?: UsageSessionsOptions): Promise<UsageSessionsResponse>;
  getEventTypes(options?: UsageReportFilters): Promise<UsageEventTypesResponse>;
  getPresenceSummary(): Promise<UsagePresenceSummary>;
  getOnlineUsers(
    options?: OnlineUsageUsersOptions,
  ): Promise<OnlineUsageUsersResponse>;
}

/** @public */
export const usageAnalyticsApiRef: ApiRef<UsageAnalyticsApi> = createApiRef({
  id: 'plugin.usage-analytics.service',
});
