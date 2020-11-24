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
} from '../types';
import {
  DefaultLoadingAction,
  getDefaultState as getDefaultLoadingState,
} from '../utils/loading';
import { findAlways } from '../utils/assert';

type mockAlertRenderer<T> = (alert: T) => T;
type mockEntityRenderer<T> = (entity: T) => T;

export const createMockEntity = (
  callback?: mockEntityRenderer<Entity>,
): Entity => {
  const defaultEntity: Entity = {
    id: 'test-entity',
    aggregation: [100, 200],
    entities: [],
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
).map(productType => ({ duration: Duration.P1M, productType }));

export const MockProducts: Product[] = Object.keys(MockProductTypes).map(
  productType =>
    createMockProduct(() => ({
      kind: productType,
      name: MockProductTypes[productType],
    })),
);

export const MockLoadingActions = ([
  DefaultLoadingAction.UserGroups,
  DefaultLoadingAction.CostInsightsInitial,
  DefaultLoadingAction.CostInsightsPage,
] as string[]).concat(MockProducts.map(product => product.kind));

export const mockDefaultLoadingState = getDefaultLoadingState(
  MockLoadingActions,
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
