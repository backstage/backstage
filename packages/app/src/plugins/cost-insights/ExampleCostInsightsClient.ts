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
import regression, { DataPoint } from 'regression';
import {
  Alert,
  ChangeStatistic,
  Cost,
  CostInsightsApi,
  DateAggregation,
  Duration,
  exclusiveEndDateOf,
  Group,
  inclusiveStartDateOf,
  Maybe,
  MetricData,
  ProductCost,
  Project,
  ProjectGrowthAlert,
  ProjectGrowthData,
  Trendline,
  UnlabeledDataflowAlert,
  UnlabeledDataflowData,
} from '@backstage/plugin-cost-insights';

function durationOf(intervals: string): Duration {
  const match = intervals.match(/\/(?<duration>P\d+[DM])\//);
  const { duration } = match!.groups!;
  return duration as Duration;
}

function aggregationFor(
  duration: Duration,
  baseline: number,
): DateAggregation[] {
  const days = dayjs(exclusiveEndDateOf(duration)).diff(
    inclusiveStartDateOf(duration),
    'day',
  );

  return [...Array(days).keys()].reduce(
    (values: DateAggregation[], i: number): DateAggregation[] => {
      const last = values.length ? values[values.length - 1].amount : baseline;
      values.push({
        date: dayjs(inclusiveStartDateOf(duration))
          .add(i, 'day')
          .format('YYYY-MM-DD'),
        amount: last + (baseline / 20) * (Math.random() * 2 - 1),
      });
      return values;
    },
    [],
  );
}

function trendlineOf(aggregation: DateAggregation[]): Trendline {
  const data: ReadonlyArray<DataPoint> = aggregation.map(a => [
    Date.parse(a.date) / 1000,
    a.amount,
  ]);
  const result = regression.linear(data, { precision: 5 });
  return {
    slope: result.equation[0],
    intercept: result.equation[1],
  };
}

function changeOf(aggregation: DateAggregation[]): ChangeStatistic {
  const half = Math.ceil(aggregation.length / 2);
  const before = aggregation
    .slice(0, half)
    .reduce((sum, a) => sum + a.amount, 0);
  const after = aggregation
    .slice(half, aggregation.length)
    .reduce((sum, a) => sum + a.amount, 0);
  return {
    ratio: (after - before) / before,
    amount: after - before,
  };
}

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

  async getDailyMetricData(
    metric: string,
    intervals: string,
  ): Promise<MetricData> {
    const aggregation = aggregationFor(
      durationOf(intervals),
      100_000,
    ).map(entry => ({ ...entry, amount: Math.round(entry.amount) }));

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
    const aggregation = aggregationFor(durationOf(intervals), 8_000);
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
    const aggregation = aggregationFor(durationOf(intervals), 1_500);
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
    product: string,
    group: string,
    duration: Duration,
    project: Maybe<string>,
  ): Promise<ProductCost> {
    const projectProductInsights = await this.request(
      { product, group, duration, project },
      {
        aggregation: [80_000, 110_000],
        change: {
          ratio: 0.375,
          amount: 30_000,
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
            id: 'entity-e',
            aggregation: [0, 10_000],
          },
        ],
      },
    );
    const productInsights: ProductCost = await this.request(
      { product, group, duration, project },
      {
        aggregation: [200_000, 250_000],
        change: {
          ratio: 0.2,
          amount: 50_000,
        },
        entities: [
          {
            id: null, // entities with null ids will be appear as "Unlabeled" in product panels
            aggregation: [15_000, 30_000],
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

    return project ? projectProductInsights : productInsights;
  }

  async getAlerts(group: string): Promise<Alert[]> {
    const projectGrowthData: ProjectGrowthData = {
      project: 'example-project',
      periodStart: 'Q2 2020',
      periodEnd: 'Q3 2020',
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
