/*
 * Copyright 2020 Spotify AB
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
/* eslint-disable no-restricted-imports */

import {
  CostInsightsApi,
  Alert,
  Cost,
  Duration,
  Project,
  ProductCost,
  Group,
} from '@backstage/plugin-cost-insights';

export class ExampleCostInsightsClient implements CostInsightsApi {
  private request(_: any, res: any): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, 0, res));
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const groups: Group[] = await this.request({ userId }, [
      { id: 'pied-piper' },
    ]);

    return groups;
  }

  async getGroupProjects(group: string): Promise<Project[]> {
    const projects: Project[] = await this.request({ group }, [
      { id: 'project-a' },
      { id: 'project-b' },
      { id: 'project-c' },
    ]);

    return projects;
  }

  async getGroupDailyCost(
    group: string,
    metric: string | null,
    intervals: string,
  ): Promise<Cost> {
    const groupDailyCost: Cost = await this.request(
      { group, metric, intervals },
      {
        id: metric, // costs with null ids will appear as "All Projects" in Cost Overview panel
        aggregation: [
          { date: '2020-08-01', amount: 75_000 / (metric ? 200_000 : 1) },
          { date: '2020-08-02', amount: 120_000 / (metric ? 200_000 : 1) },
          { date: '2020-08-03', amount: 110_000 / (metric ? 200_000 : 1) },
          { date: '2020-08-04', amount: 90_000 / (metric ? 200_000 : 1) },
          { date: '2020-08-05', amount: 80_000 / (metric ? 200_000 : 1) },
          { date: '2020-08-06', amount: 85_000 / (metric ? 200_000 : 1) },
          { date: '2020-08-07', amount: 82_500 / (metric ? 200_000 : 1) },
          { date: '2020-08-08', amount: 100_000 / (metric ? 200_000 : 1) },
          { date: '2020-08-09', amount: 130_000 / (metric ? 200_000 : 1) },
          { date: '2020-08-10', amount: 140_000 / (metric ? 200_000 : 1) },
        ],
        change: {
          ratio: 0.86,
          amount: 65_000,
        },
        trendline: {
          slope: 0,
          intercept: 90_000,
        },
      },
    );

    return groupDailyCost;
  }

  async getProjectDailyCost(
    project: string,
    metric: string | null,
    intervals: string,
  ): Promise<Cost> {
    const projectDailyCost: Cost = await this.request(
      { project, metric, intervals },
      {
        id: 'project-a',
        aggregation: [
          { date: '2020-08-01', amount: 1000 },
          { date: '2020-08-02', amount: 2000 },
          { date: '2020-08-03', amount: 3000 },
          { date: '2020-08-04', amount: 4000 },
          { date: '2020-08-05', amount: 5000 },
          { date: '2020-08-06', amount: 6000 },
          { date: '2020-08-07', amount: 7000 },
          { date: '2020-08-08', amount: 8000 },
          { date: '2020-08-09', amount: 9000 },
          { date: '2020-08-10', amount: 10_000 },
        ],
        change: {
          ratio: 0.5,
          amount: 10000,
        },
        trendline: {
          slope: 0,
          intercept: 0,
        },
      },
    );

    return projectDailyCost;
  }

  async getProductInsights(
    product: string,
    group: string,
    duration: Duration,
  ): Promise<ProductCost> {
    const productInsights: ProductCost = await this.request(
      { product, group, duration },
      {
        aggregation: [200_000, 250_000],
        change: {
          ratio: 0.2,
          amount: 50_000,
        },
        entities: [
          {
            id: null, // entities with null ids will be appear as "Unlabeled" in product panels
            aggregation: [45_000, 50_000],
          },
          {
            id: 'entity-a',
            aggregation: [15_000, 20_000],
          },
          {
            id: 'entity-b',
            aggregation: [20_000, 30_000],
          },
          {
            id: 'entity-c',
            aggregation: [18_000, 25_000],
          },
          {
            id: 'entity-d',
            aggregation: [36_000, 42_000],
          },
          {
            id: 'entity-e',
            aggregation: [0, 10_000],
          },
          {
            id: 'entity-f',
            aggregation: [17_000, 19_000],
          },
          {
            id: 'entity-g',
            aggregation: [49_000, 30_000],
          },
          {
            id: 'entity-h',
            aggregation: [0, 34_000],
          },
        ],
      },
    );

    return productInsights;
  }

  async getAlerts(group: string): Promise<Alert[]> {
    const alerts: Alert[] = await this.request({ group }, [
      {
        id: 'projectGrowth',
        project: 'example-project',
        periodStart: 'Q1 2020',
        periodEnd: 'Q2 2020',
        aggregation: [60_000, 120_000],
        change: {
          ratio: 1,
          amount: 60000,
        },
        products: [
          {
            id: 'Compute Engine',
            aggregation: [58_000, 118_000],
          },
          {
            id: 'Cloud Dataflow',
            aggregation: [1200, 1500],
          },
          {
            id: 'Cloud Storage',
            aggregation: [800, 500],
          },
        ],
      },
    ]);

    return alerts;
  }
}
