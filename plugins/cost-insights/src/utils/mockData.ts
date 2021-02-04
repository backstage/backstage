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

import dayjs from 'dayjs';
import regression, { DataPoint } from 'regression';
import { Config } from '@backstage/config';
import { ConfigApi } from '@backstage/core';
import {
  ChangeStatistic,
  Duration,
  Entity,
  Product,
  ProductFilters,
  ProjectGrowthData,
  Trendline,
  UnlabeledDataflowAlertProject,
  UnlabeledDataflowData,
  DateAggregation,
  DEFAULT_DATE_FORMAT,
} from '../types';
import {
  DefaultLoadingAction,
  getDefaultState as getDefaultLoadingState,
} from '../utils/loading';
import { findAlways } from '../utils/assert';
import { inclusiveEndDateOf, inclusiveStartDateOf } from './duration';

type mockAlertRenderer<T> = (alert: T) => T;
type mockEntityRenderer<T> = (entity: T) => T;

type IntervalFields = {
  duration: Duration;
  endDate: string;
};

export const createMockEntity = (
  callback?: mockEntityRenderer<Entity>,
): Entity => {
  const defaultEntity: Entity = {
    id: 'test-entity',
    aggregation: [100, 200],
    entities: {},
    change: {
      ratio: 0,
      amount: 0,
    },
  };

  if (typeof callback === 'function') {
    return callback({ ...defaultEntity });
  }
  return { ...defaultEntity };
};

export const createMockProduct = (
  callback?: mockEntityRenderer<Product>,
): Product => {
  const defaultProduct: Product = {
    kind: 'compute-engine',
    name: 'Compute Engine',
  };
  if (typeof callback === 'function') {
    return callback({ ...defaultProduct });
  }
  return { ...defaultProduct };
};

export const createMockProjectGrowthData = (
  callback?: mockAlertRenderer<ProjectGrowthData>,
): ProjectGrowthData => {
  const data: ProjectGrowthData = {
    project: 'test-project-growth-alert',
    periodStart: '2019-Q4',
    periodEnd: '2020-Q1',
    aggregation: [670532.1, 970502.8],
    change: {
      ratio: 0.5,
      amount: 180000,
    },
    products: [],
  };

  if (typeof callback === 'function') {
    return callback({ ...data });
  }

  return { ...data };
};

export const createMockUnlabeledDataflowData = (
  callback?: mockAlertRenderer<UnlabeledDataflowData>,
): UnlabeledDataflowData => {
  const data: UnlabeledDataflowData = {
    periodStart: '2020-05-01',
    periodEnd: '2020-06-1',
    projects: [],
    unlabeledCost: 0,
    labeledCost: 0,
  };

  if (typeof callback === 'function') {
    return callback({ ...data });
  }

  return { ...data };
};

export const createMockUnlabeledDataflowAlertProject = (
  callback?: mockEntityRenderer<UnlabeledDataflowAlertProject>,
): UnlabeledDataflowAlertProject => {
  const defaultProject: UnlabeledDataflowAlertProject = {
    id: 'test-alert-project',
    unlabeledCost: 2000.0,
    labeledCost: 3200.0,
  };
  if (typeof callback === 'function') {
    return callback({ ...defaultProject });
  }
  return { ...defaultProject };
};

export const MockProductTypes: Record<string, string> = {
  'compute-engine': 'Compute Engine',
  'cloud-dataflow': 'Cloud Dataflow',
  'cloud-storage': 'Cloud Storage',
  'big-query': 'Big Query',
  'big-table': 'BigTable',
  'cloud-pub-sub': 'Cloud Pub/Sub',
};

export const MockProductFilters: ProductFilters = Object.keys(
  MockProductTypes,
).map(productType => ({ duration: Duration.P30D, productType }));

export const MockProducts: Product[] = Object.keys(MockProductTypes).map(
  productType =>
    createMockProduct(() => ({
      kind: productType,
      name: MockProductTypes[productType],
    })),
);

export const MockDefaultLoadingActions = ([
  DefaultLoadingAction.UserGroups,
  DefaultLoadingAction.CostInsightsInitial,
  DefaultLoadingAction.CostInsightsPage,
] as string[]).concat(MockProducts.map(product => product.kind));

export const mockDefaultLoadingState = getDefaultLoadingState(
  MockDefaultLoadingActions,
);

export const MockComputeEngine = findAlways(
  MockProducts,
  p => p.kind === 'compute-engine',
);
export const MockCloudDataflow = findAlways(
  MockProducts,
  p => p.kind === 'cloud-dataflow',
);
export const MockCloudStorage = findAlways(
  MockProducts,
  p => p.kind === 'cloud-storage',
);
export const MockBigQuery = findAlways(
  MockProducts,
  p => p.kind === 'big-query',
);
export const MockBigtable = findAlways(
  MockProducts,
  p => p.kind === 'big-table',
);

export const MockProductsConfig: Partial<ConfigApi> = {
  keys: () => Object.keys(MockProductTypes),
};

export const MockMetricsConfig: Partial<ConfigApi> = {
  getOptionalString: () => 'daily-cost',
  keys: () => ['daily-cost'],
};

export const MockCostInsightsConfig: Partial<Config> = {
  getConfig: () => MockProductsConfig as Config,
  getOptionalConfig: () => MockMetricsConfig as Config,
};

export function trendlineOf(aggregation: DateAggregation[]): Trendline {
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

export function changeOf(aggregation: DateAggregation[]): ChangeStatistic {
  const firstAmount = aggregation.length ? aggregation[0].amount : 0;
  const lastAmount = aggregation.length
    ? aggregation[aggregation.length - 1].amount
    : 0;
  const ratio =
    firstAmount !== 0 ? (lastAmount - firstAmount) / firstAmount : 0;
  return {
    ratio: ratio,
    amount: lastAmount - firstAmount,
  };
}

export function aggregationFor(
  intervals: string,
  baseline: number,
): DateAggregation[] {
  const { duration, endDate } = parseIntervals(intervals);
  const inclusiveEndDate = inclusiveEndDateOf(duration, endDate);
  const days = dayjs(endDate).diff(
    inclusiveStartDateOf(duration, inclusiveEndDate),
    'day',
  );

  function nextDelta(): number {
    const varianceFromBaseline = 0.15;
    // Let's give positive vibes in trendlines - higher change for positive delta with >0.5 value
    const positiveTrendChance = 0.55;
    const normalization = positiveTrendChance - 1;
    return baseline * (Math.random() + normalization) * varianceFromBaseline;
  }

  return [...Array(days).keys()].reduce(
    (values: DateAggregation[], i: number): DateAggregation[] => {
      const last = values.length ? values[values.length - 1].amount : baseline;
      const date = dayjs(inclusiveStartDateOf(duration, inclusiveEndDate))
        .add(i, 'day')
        .format(DEFAULT_DATE_FORMAT);
      const amount = Math.max(0, last + nextDelta());
      values.push({
        date: date,
        amount: amount,
      });
      return values;
    },
    [],
  );
}

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

export const MockAggregatedDailyCosts: DateAggregation[] = [
  {
    date: '2020-08-07',
    amount: 3500,
  },
  {
    date: '2020-08-06',
    amount: 2500,
  },
  {
    date: '2020-08-05',
    amount: 1400,
  },
  {
    date: '2020-08-04',
    amount: 3800,
  },
  {
    date: '2020-08-09',
    amount: 1900,
  },
  {
    date: '2020-08-08',
    amount: 2400,
  },
  {
    date: '2020-08-03',
    amount: 4000,
  },
  {
    date: '2020-08-02',
    amount: 3700,
  },
  {
    date: '2020-08-01',
    amount: 2500,
  },
  {
    date: '2020-08-18',
    amount: 4300,
  },
  {
    date: '2020-08-17',
    amount: 1500,
  },
  {
    date: '2020-08-16',
    amount: 3600,
  },
  {
    date: '2020-08-15',
    amount: 2200,
  },
  {
    date: '2020-08-19',
    amount: 3900,
  },
  {
    date: '2020-08-10',
    amount: 4100,
  },
  {
    date: '2020-08-14',
    amount: 3600,
  },
  {
    date: '2020-08-13',
    amount: 2900,
  },
  {
    date: '2020-08-12',
    amount: 2700,
  },
  {
    date: '2020-08-11',
    amount: 5100,
  },
  {
    date: '2020-09-19',
    amount: 1200,
  },
  {
    date: '2020-09-18',
    amount: 6500,
  },
  {
    date: '2020-09-17',
    amount: 2500,
  },
  {
    date: '2020-09-16',
    amount: 1400,
  },
  {
    date: '2020-09-11',
    amount: 2300,
  },
  {
    date: '2020-09-10',
    amount: 1900,
  },
  {
    date: '2020-09-15',
    amount: 3100,
  },
  {
    date: '2020-09-14',
    amount: 4500,
  },
  {
    date: '2020-09-13',
    amount: 3300,
  },
  {
    date: '2020-09-12',
    amount: 2800,
  },
  {
    date: '2020-09-29',
    amount: 2600,
  },
  {
    date: '2020-09-28',
    amount: 4100,
  },
  {
    date: '2020-09-27',
    amount: 3800,
  },
  {
    date: '2020-09-22',
    amount: 3700,
  },
  {
    date: '2020-09-21',
    amount: 2700,
  },
  {
    date: '2020-09-20',
    amount: 2200,
  },
  {
    date: '2020-09-26',
    amount: 3300,
  },
  {
    date: '2020-09-25',
    amount: 4000,
  },
  {
    date: '2020-09-24',
    amount: 3800,
  },
  {
    date: '2020-09-23',
    amount: 4100,
  },
  {
    date: '2020-08-29',
    amount: 4400,
  },
  {
    date: '2020-08-28',
    amount: 5000,
  },
  {
    date: '2020-08-27',
    amount: 4900,
  },
  {
    date: '2020-08-26',
    amount: 4100,
  },
  {
    date: '2020-08-21',
    amount: 3700,
  },
  {
    date: '2020-08-20',
    amount: 2200,
  },
  {
    date: '2020-08-25',
    amount: 1700,
  },
  {
    date: '2020-08-24',
    amount: 2100,
  },
  {
    date: '2020-08-23',
    amount: 3100,
  },
  {
    date: '2020-08-22',
    amount: 1500,
  },
  {
    date: '2020-09-08',
    amount: 2900,
  },
  {
    date: '2020-09-07',
    amount: 4100,
  },
  {
    date: '2020-09-06',
    amount: 3600,
  },
  {
    date: '2020-09-05',
    amount: 3300,
  },
  {
    date: '2020-09-09',
    amount: 2800,
  },
  {
    date: '2020-08-31',
    amount: 3400,
  },
  {
    date: '2020-08-30',
    amount: 4300,
  },
  {
    date: '2020-09-04',
    amount: 6100,
  },
  {
    date: '2020-09-03',
    amount: 2500,
  },
  {
    date: '2020-09-02',
    amount: 4900,
  },
  {
    date: '2020-09-01',
    amount: 6100,
  },
  {
    date: '2020-09-30',
    amount: 5500,
  },
];

export const SampleBigQueryInsights: Entity = {
  id: 'bigQuery',
  aggregation: [10_000, 30_000],
  change: {
    ratio: 3,
    amount: 20_000,
  },
  entities: {
    dataset: [
      {
        id: 'dataset-a',
        aggregation: [5_000, 10_000],
        change: {
          ratio: 1,
          amount: 5_000,
        },
        entities: {},
      },
      {
        id: 'dataset-b',
        aggregation: [5_000, 10_000],
        change: {
          ratio: 1,
          amount: 5_000,
        },
        entities: {},
      },
      {
        id: 'dataset-c',
        aggregation: [0, 10_000],
        change: {
          ratio: 10_000,
          amount: 10_000,
        },
        entities: {},
      },
    ],
  },
};

export const SampleCloudDataflowInsights: Entity = {
  id: 'cloudDataflow',
  aggregation: [100_000, 158_000],
  change: {
    ratio: 0.58,
    amount: 58_000,
  },
  entities: {
    pipeline: [
      {
        id: null,
        aggregation: [10_000, 12_000],
        change: {
          ratio: 0.2,
          amount: 2_000,
        },
        entities: {
          SKU: [
            {
              id: 'Sample SKU A',
              aggregation: [3_000, 4_000],
              change: {
                ratio: 0.333333,
                amount: 1_000,
              },
              entities: {},
            },
            {
              id: 'Sample SKU B',
              aggregation: [7_000, 8_000],
              change: {
                ratio: 0.14285714,
                amount: 1_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'pipeline-a',
        aggregation: [60_000, 70_000],
        change: {
          ratio: 0.16666666666666666,
          amount: 10_000,
        },
        entities: {
          SKU: [
            {
              id: 'Sample SKU A',
              aggregation: [20_000, 15_000],
              change: {
                ratio: -0.25,
                amount: -5_000,
              },
              entities: {},
            },
            {
              id: 'Sample SKU B',
              aggregation: [30_000, 35_000],
              change: {
                ratio: -0.16666666666666666,
                amount: -5_000,
              },
              entities: {},
            },
            {
              id: 'Sample SKU C',
              aggregation: [10_000, 20_000],
              change: {
                ratio: 1,
                amount: 10_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'pipeline-b',
        aggregation: [12_000, 8_000],
        change: {
          ratio: -0.33333,
          amount: -4_000,
        },
        entities: {
          SKU: [
            {
              id: 'Sample SKU A',
              aggregation: [4_000, 4_000],
              change: {
                ratio: 0,
                amount: 0,
              },
              entities: {},
            },
            {
              id: 'Sample SKU B',
              aggregation: [8_000, 4_000],
              change: {
                ratio: -0.5,
                amount: -4_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'pipeline-c',
        aggregation: [0, 10_000],
        change: {
          ratio: 10_000,
          amount: 10_000,
        },
        entities: {},
      },
    ],
  },
};

export const SampleCloudStorageInsights: Entity = {
  id: 'cloudStorage',
  aggregation: [45_000, 45_000],
  change: {
    ratio: 0,
    amount: 0,
  },
  entities: {
    bucket: [
      {
        id: 'bucket-a',
        aggregation: [15_000, 20_000],
        change: {
          ratio: 0.333,
          amount: 5_000,
        },
        entities: {
          SKU: [
            {
              id: 'Sample SKU A',
              aggregation: [10_000, 11_000],
              change: {
                ratio: 0.1,
                amount: 1_000,
              },
              entities: {},
            },
            {
              id: 'Sample SKU B',
              aggregation: [2_000, 5_000],
              change: {
                ratio: 1.5,
                amount: 3_000,
              },
              entities: {},
            },
            {
              id: 'Sample SKU C',
              aggregation: [3_000, 4_000],
              change: {
                ratio: 0.3333,
                amount: 1_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'bucket-b',
        aggregation: [30_000, 25_000],
        change: {
          ratio: -0.16666,
          amount: -5_000,
        },
        entities: {
          SKU: [
            {
              id: 'Sample SKU A',
              aggregation: [12_000, 13_000],
              change: {
                ratio: 0.08333333333333333,
                amount: 1_000,
              },
              entities: {},
            },
            {
              id: 'Sample SKU B',
              aggregation: [16_000, 12_000],
              change: {
                ratio: -0.25,
                amount: -4_000,
              },
              entities: {},
            },
            {
              id: 'Sample SKU C',
              aggregation: [2_000, 0],
              change: {
                ratio: -1,
                amount: -2000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'bucket-c',
        aggregation: [0, 0],
        change: {
          ratio: 0,
          amount: 0,
        },
        entities: {},
      },
    ],
  },
};

export const SampleComputeEngineInsights: Entity = {
  id: 'computeEngine',
  aggregation: [80_000, 90_000],
  change: {
    ratio: 0.125,
    amount: 10_000,
  },
  entities: {
    service: [
      {
        id: 'service-a',
        aggregation: [20_000, 10_000],
        change: {
          ratio: -0.5,
          amount: -10_000,
        },
        entities: {
          SKU: [
            {
              id: 'Sample SKU A',
              aggregation: [4_000, 2_000],
              change: {
                ratio: -0.5,
                amount: -2_000,
              },
              entities: {},
            },
            {
              id: 'Sample SKU B',
              aggregation: [7_000, 6_000],
              change: {
                ratio: -0.14285714285714285,
                amount: -1_000,
              },
              entities: {},
            },
            {
              id: 'Sample SKU C',
              aggregation: [9_000, 2_000],
              change: {
                ratio: -0.7777777777777778,
                amount: -7000,
              },
              entities: {},
            },
          ],
          deployment: [
            {
              id: 'Compute Engine',
              aggregation: [7_000, 6_000],
              change: {
                ratio: -0.5,
                amount: -2_000,
              },
              entities: {},
            },
            {
              id: 'Kubernetes',
              aggregation: [4_000, 2_000],
              change: {
                ratio: -0.14285714285714285,
                amount: -1_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'service-b',
        aggregation: [10_000, 20_000],
        change: {
          ratio: 1,
          amount: 10_000,
        },
        entities: {
          SKU: [
            {
              id: 'Sample SKU A',
              aggregation: [1_000, 2_000],
              change: {
                ratio: 1,
                amount: 1_000,
              },
              entities: {},
            },
            {
              id: 'Sample SKU B',
              aggregation: [4_000, 8_000],
              change: {
                ratio: 1,
                amount: 4_000,
              },
              entities: {},
            },
            {
              id: 'Sample SKU C',
              aggregation: [5_000, 10_000],
              change: {
                ratio: 1,
                amount: 5_000,
              },
              entities: {},
            },
          ],
          deployment: [
            {
              id: 'Compute Engine',
              aggregation: [7_000, 6_000],
              change: {
                ratio: -0.5,
                amount: -2_000,
              },
              entities: {},
            },
            {
              id: 'Kubernetes',
              aggregation: [4_000, 2_000],
              change: {
                ratio: -0.14285714285714285,
                amount: -1_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'service-c',
        aggregation: [0, 10_000],
        change: {
          ratio: 10_000,
          amount: 10_000,
        },
        entities: {},
      },
    ],
  },
};

export const SampleEventsInsights: Entity = {
  id: 'events',
  aggregation: [20_000, 10_000],
  change: {
    ratio: -0.5,
    amount: -10_000,
  },
  entities: {
    event: [
      {
        id: 'event-a',
        aggregation: [15_000, 7_000],
        change: {
          ratio: -0.53333333333,
          amount: -8_000,
        },
        entities: {
          product: [
            {
              id: 'Sample Product A',
              aggregation: [5_000, 2_000],
              change: {
                ratio: -0.6,
                amount: -3_000,
              },
              entities: {},
            },
            {
              id: 'Sample Product B',
              aggregation: [7_000, 2_500],
              change: {
                ratio: -0.64285714285,
                amount: -4_500,
              },
              entities: {},
            },
            {
              id: 'Sample Product C',
              aggregation: [3_000, 2_500],
              change: {
                ratio: -0.16666666666,
                amount: -500,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'event-b',
        aggregation: [5_000, 3_000],
        change: {
          ratio: -0.4,
          amount: -2_000,
        },
        entities: {
          product: [
            {
              id: 'Sample Product A',
              aggregation: [2_000, 1_000],
              change: {
                ratio: -0.5,
                amount: -1_000,
              },
              entities: {},
            },
            {
              id: 'Sample Product B',
              aggregation: [1_000, 1_500],
              change: {
                ratio: 0.5,
                amount: 500,
              },
              entities: {},
            },
            {
              id: 'Sample Product C',
              aggregation: [2_000, 500],
              change: {
                ratio: -0.75,
                amount: -1_500,
              },
              entities: {},
            },
          ],
        },
      },
    ],
  },
};

export function entityOf(product: string): Entity {
  switch (product) {
    case 'computeEngine':
      return SampleComputeEngineInsights;
    case 'cloudDataflow':
      return SampleCloudDataflowInsights;
    case 'cloudStorage':
      return SampleCloudStorageInsights;
    case 'bigQuery':
      return SampleBigQueryInsights;
    case 'events':
      return SampleEventsInsights;
    default:
      throw new Error(
        `Cannot get insights for ${product}. Make sure product matches product property in app-info.yaml`,
      );
  }
}

export const getGroupedProducts = (intervals: string) => [
  {
    id: 'Cloud Dataflow',
    aggregation: aggregationFor(intervals, 1_700),
  },
  {
    id: 'Compute Engine',
    aggregation: aggregationFor(intervals, 350),
  },
  {
    id: 'Cloud Storage',
    aggregation: aggregationFor(intervals, 1_300),
  },
  {
    id: 'BigQuery',
    aggregation: aggregationFor(intervals, 2_000),
  },
  {
    id: 'Cloud SQL',
    aggregation: aggregationFor(intervals, 750),
  },
  {
    id: 'Cloud Spanner',
    aggregation: aggregationFor(intervals, 50),
  },
  {
    id: 'Cloud Pub/Sub',
    aggregation: aggregationFor(intervals, 1_000),
  },
  {
    id: 'Cloud Bigtable',
    aggregation: aggregationFor(intervals, 250),
  },
];

export const getGroupedProjects = (intervals: string) => [
  {
    id: 'project-a',
    aggregation: aggregationFor(intervals, 1_700),
  },
  {
    id: 'project-b',
    aggregation: aggregationFor(intervals, 350),
  },
  {
    id: 'project-c',
    aggregation: aggregationFor(intervals, 1_300),
  },
];
