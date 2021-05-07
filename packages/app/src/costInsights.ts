/* eslint-disable no-console */
/*
 * Copyright 2021 Spotify AB
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
import {
  CostInsightsApi,
  Alert,
  Cost,
  Entity,
  Group,
  MetricData,
  ProductInsightsOptions,
  Project,
} from '@backstage/plugin-cost-insights';

export default class CostInsightsClient implements CostInsightsApi {
  async getLastCompleteBillingDate(): Promise<string> {
    // throw new Error('getLastCompleteBillingDate Method not implemented.');
    console.log(`getLastCompleteBillingDate`);
    const lastBillingDate = new Date();
    return lastBillingDate.toISOString().split('T')[0];
  }
  async getUserGroups(userId: string): Promise<Group[]> {
    console.log(`getGroupProjects`, { userId });
    return [{ id: 'hello world' }];
  }
  async getGroupProjects(group: string): Promise<Project[]> {
    console.log(`getGroupProjects`, { group });
    // throw new Error(`getGroupProjects Method not implemented. ${group}`);
    return [{ id: 'test' }];
  }
  async getGroupDailyCost(group: string, intervals: string): Promise<Cost> {
    console.log(`getGroupDailyCost`, { group, intervals });
    return {
      id: 'test1',
      trendline: { intercept: 1, slope: 1 },
      change: {
        ratio: 1,
        amount: 122,
      },
      aggregation: [
        {
          amount: 450000000,
          date: new Date('2020-12-14').toISOString().split('T')[0],
        },
        {
          amount: 700000000,
          date: new Date('2021-04-05').toISOString().split('T')[0],
        },
        {
          amount: 400000000,
          date: new Date().toISOString().split('T')[0],
        },
      ],
    };
  }
  async getProjectDailyCost(project: string, intervals: string): Promise<Cost> {
    console.log(`getProjectDailyCost`, { project, intervals });
    return {
      id: 'test1',
      trendline: { intercept: 1, slope: 1 },
      change: {
        ratio: 1,
        amount: 122,
      },
      aggregation: [
        {
          amount: 10000000,
          date: new Date('2020-12-14').toISOString().split('T')[0],
        },
        {
          amount: 10000000000,
          date: new Date('2021-04-05').toISOString().split('T')[0],
        },
        {
          amount: 1000000000,
          date: new Date().toISOString().split('T')[0],
        },
      ],
    };
  }
  async getDailyMetricData(
    metric: string,
    intervals: string,
  ): Promise<MetricData> {
    console.log(`getDailyMetricData`, { metric, intervals });
    return {
      id: '',
      format: 'number',
      aggregation: [
        {
          amount: 500000,
          date: new Date('2020-12-14').toISOString().split('T')[0],
        },
        {
          amount: 700000,
          date: new Date('2021-04-05').toISOString().split('T')[0],
        },
        {
          amount: 400000,
          date: new Date().toISOString().split('T')[0],
        },
      ],
      change: {
        ratio: 1,
        amount: 122,
      },
    };
  }
  async getProductInsights(options: ProductInsightsOptions): Promise<Entity> {
    console.log(`getProductInsights`, { options });
    return {
      id: '',
      aggregation: [1, 2],
      change: {
        ratio: 1,
        amount: 122,
      },
      entities: { 'test-test': [] },
    };
  }
  async getAlerts(group: string): Promise<Alert[]> {
    console.log(`getAlerts`, { group });
    return [];
  }
}