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
import { analyticsApiRef } from '@backstage/core-plugin-api';
import {
  UsageAnalyticsPage,
  usageAnalyticsCollectorApi,
  usageAnalyticsPlugin,
} from './index';
import { usageAnalyticsApiRef } from './api/UsageAnalyticsApi';
import { rootRouteRef } from './routes';

describe('usage-analytics', () => {
  it('registers the legacy plugin, page, and report API', () => {
    expect(usageAnalyticsPlugin.getId()).toBe('usage-analytics');
    expect(usageAnalyticsPlugin.routes.root).toBe(rootRouteRef);
    expect(
      [...usageAnalyticsPlugin.getApis()].map(factory => factory.api),
    ).toEqual([usageAnalyticsApiRef]);
    expect(
      [...usageAnalyticsPlugin.getApis()].map(factory => factory.api),
    ).not.toContain(analyticsApiRef);
    expect(usageAnalyticsCollectorApi.api).toBe(analyticsApiRef);
    expect(UsageAnalyticsPage).toBeDefined();
  });
});
