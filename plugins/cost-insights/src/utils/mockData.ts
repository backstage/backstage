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

import {
  DefaultLoadingAction,
  Duration,
  Entity,
  findAlways,
  getDefaultState,
  Product,
  ProductCost,
  ProjectGrowthData,
  UnlabeledDataflowAlertProject,
  UnlabeledDataflowData,
} from '../types';
import { Config } from '@backstage/config';
import { ConfigApi } from '@backstage/core';

type mockAlertRenderer<T> = (alert: T) => T;
type mockEntityRenderer<T> = (entity: T) => T;

export const createMockEntity = (
  callback?: mockEntityRenderer<Entity>,
): Entity => {
  const defaultEntity: Entity = {
    id: 'test-entity',
    aggregation: [100, 200],
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

export const createMockProductCost = (
  callback?: mockEntityRenderer<ProductCost>,
): ProductCost => {
  const defaultProduct: ProductCost = {
    entities: [],
    aggregation: [0, 0],
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
    periodStart: '2019-10-01',
    periodEnd: '2020-03-31',
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

export const MockProductFilters = Object.keys(
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

export const mockDefaultState = getDefaultState(MockLoadingActions);

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
