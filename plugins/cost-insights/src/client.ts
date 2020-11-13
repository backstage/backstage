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

import dayjs from 'dayjs';
import { CostInsightsApi, ProductInsightsOptions } from '../src/api';
import {
  Alert,
  Cost,
  DateAggregation,
  DEFAULT_DATE_FORMAT,
  Duration,
  Entity,
  Group,
  MetricData,
  Project,
  ProjectGrowthData,
  UnlabeledDataflowData,
} from '../src/types';
import {
  ProjectGrowthAlert,
  UnlabeledDataflowAlert,
} from '../src/utils/alerts';
import { inclusiveStartDateOf } from '../src/utils/duration';
import { trendlineOf, changeOf } from './utils/mockData';

type IntervalFields = {
  duration: Duration;
  endDate: string;
};

function parseIntervals(intervals: string): IntervalFields {
  const match = intervals.match(
    /\/(?<duration>P\d+[DM])\/(?<date>\d{4}-\d{2}-\d{2})/,
  );
  if (Object.keys(match?.groups || {}).length !== 2) {
    throw new Error(`Invalid intervals: ${intervals}`);
  }
  const { duration, date } = match!.groups!;
  return {
    duration: duration as Duration,
    endDate: date,
  };
}

function aggregationFor(
  intervals: string,
  baseline: number,
): DateAggregation[] {
  const { duration, endDate } = parseIntervals(intervals);
  const days = dayjs(endDate).diff(
    inclusiveStartDateOf(duration, endDate),
    'day',
  );

  return [...Array(days).keys()].reduce(
    (values: DateAggregation[], i: number): DateAggregation[] => {
      const last = values.length ? values[values.length - 1].amount : baseline;
      values.push({
        date: dayjs(inclusiveStartDateOf(duration, endDate))
          .add(i, 'day')
          .format(DEFAULT_DATE_FORMAT),
        amount: Math.max(0, last + (baseline / 20) * (Math.random() * 2 - 1)),
      });
      return values;
    },
    [],
  );
}

export class ExampleCostInsightsClient implements CostInsightsApi {
  private request(_: any, res: any): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, 0, res));
  }

  getLastCompleteBillingDate(): Promise<string> {
    return Promise.resolve(
      dayjs().subtract(1, 'day').format(DEFAULT_DATE_FORMAT),
    );
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

  async getDailyMetricData(
    metric: string,
    intervals: string,
  ): Promise<MetricData> {
    const aggregation = aggregationFor(intervals, 100_000).map(entry => ({
      ...entry,
      amount: Math.round(entry.amount),
    }));

    const cost: MetricData = await this.request(
      { metric, intervals },
      {
        format: 'number',
        aggregation: aggregation,
        change: changeOf(aggregation),
        trendline: trendlineOf(aggregation),
      },
    );

    return cost;
  }

  async getGroupDailyCost(group: string, intervals: string): Promise<Cost> {
    const aggregation = aggregationFor(intervals, 8_000);
    const groupDailyCost: Cost = await this.request(
      { group, intervals },
      {
        aggregation: aggregation,
        change: changeOf(aggregation),
        trendline: trendlineOf(aggregation),
      },
    );

    return groupDailyCost;
  }

  async getProjectDailyCost(project: string, intervals: string): Promise<Cost> {
    const aggregation = aggregationFor(intervals, 1_500);
    const projectDailyCost: Cost = await this.request(
      { project, intervals },
      {
        id: 'project-a',
        aggregation: aggregation,
        change: changeOf(aggregation),
        trendline: trendlineOf(aggregation),
      },
    );

    return projectDailyCost;
  }

  async getProductInsights(
    productInsightsOptions: ProductInsightsOptions,
  ): Promise<Entity> {
    const projectProductInsights = await this.request(productInsightsOptions, {
      id: productInsightsOptions.product,
      aggregation: [80_000, 110_000],
      change: {
        ratio: 0.375,
        amount: 30_000,
      },
      entities: [
        {
          id: null, // entities with null ids will be appear as "Unlabeled" in product panels
          aggregation: [45_000, 50_000],
          change: {
            ratio: 0.111,
            amount: 5_000,
          },
          entities: [],
        },
        {
          id: 'entity-a',
          aggregation: [15_000, 20_000],
          change: {
            ratio: 0.333,
            amount: 5_000,
          },
          entities: [],
        },
        {
          id: 'entity-b',
          aggregation: [20_000, 30_000],
          change: {
            ratio: 0.5,
            amount: 10_000,
          },
          entities: [],
        },
        {
          id: 'entity-c',
          aggregation: [0, 10_000],
          change: {
            ratio: 10_000,
            amount: 10_000,
          },
          entities: [],
        },
      ],
    });

    const productInsights: Entity = await this.request(productInsightsOptions, {
      id: productInsightsOptions.product,
      aggregation: [200_000, 250_000],
      change: {
        ratio: 0.2,
        amount: 50_000,
      },
      entities: [
        {
          id: null, // entities with null ids will be appear as "Unlabeled" in product panels
          aggregation: [36_000, 42_000],
          change: {
            ratio: 0.1666,
            amount: 6_000,
          },
          entities: [],
        },
        {
          id: 'entity-a',
          aggregation: [15_000, 20_000],
          change: {
            ratio: -0.33333333,
            amount: 5_000,
          },
          entities: [],
        },
        {
          id: 'entity-b',
          aggregation: [20_000, 30_000],
          change: {
            ratio: 0.5,
            amount: 10_000,
          },
          entities: [],
        },
        {
          id: 'entity-c',
          aggregation: [18_000, 25_000],
          change: {
            ratio: 0.38,
            amount: 7_000,
          },
          entities: [],
        },
        {
          id: 'entity-d',
          aggregation: [15_000, 30_000],
          change: {
            ratio: 1,
            amount: 15_000,
          },
          entities: [],
        },
        {
          id: 'entity-e',
          aggregation: [0, 10_000],
          entities: [],
          change: {
            ratio: 10_000,
            amount: 10_000,
          },
        },
        {
          id: 'entity-f',
          aggregation: [17_000, 19_000],
          change: {
            ratio: 0.118,
            amount: 2_000,
          },
          entities: [],
        },
        {
          id: 'entity-g',
          aggregation: [80_000, 60_000],
          change: {
            ratio: -0.25,
            amount: -20_000,
          },
          entities: [
            {
              id: 'vCPU Time Batch Belgium',
              aggregation: [15_000, 15_000],
              change: {
                ratio: 0,
                amount: 0,
              },
              entities: [],
            },
            {
              id: 'RAM Time Belgium',
              aggregation: [15_000, 30_000],
              change: {
                ratio: 1,
                amount: 15_000,
              },
              entities: [],
            },
            {
              id: 'Local Disk Time PD Standard Belgium',
              aggregation: [50_000, 15_000],
              change: {
                ratio: -0.7,
                amount: -35_000,
              },
              entities: [],
            },
          ],
        },
      ],
    });

    return productInsightsOptions.project
      ? projectProductInsights
      : productInsights;
  }

  async getAlerts(group: string): Promise<Alert[]> {
    const projectGrowthData: ProjectGrowthData = {
      project: 'example-project',
      periodStart: '2020-Q2',
      periodEnd: '2020-Q3',
      aggregation: [60_000, 120_000],
      change: {
        ratio: 1,
        amount: 60000,
      },
      products: [
        { id: 'Compute Engine', aggregation: [58_000, 118_000] },
        { id: 'Cloud Dataflow', aggregation: [1200, 1500] },
        { id: 'Cloud Storage', aggregation: [800, 500] },
      ],
    };

    const unlabeledDataflowData: UnlabeledDataflowData = {
      periodStart: '2020-09-01',
      periodEnd: '2020-09-30',
      labeledCost: 6_200,
      unlabeledCost: 7_000,
      projects: [
        {
          id: 'example-project-1',
          unlabeledCost: 5_000,
          labeledCost: 3_000,
        },
        {
          id: 'example-project-2',
          unlabeledCost: 2_000,
          labeledCost: 3_200,
        },
      ],
    };

    const alerts: Alert[] = await this.request({ group }, [
      new ProjectGrowthAlert(projectGrowthData),
      new UnlabeledDataflowAlert(unlabeledDataflowData),
    ]);

    return alerts;
  }
}
