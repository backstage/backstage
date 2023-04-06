/*
 * Copyright 2020 The Backstage Authors
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

// TODO: Split some of these up into `@backstage/plugin-cost-insights-react` for presentation types
//       and `@backstage/plugin-cost-insights-common` for data transfer object types.
export * from './Alert';
export * from './ChangeStatistic';
export * from './ChartData';
export * from './Currency';
export * from './CurrencyType';
export * from './DateFormat';
export * from './Duration';
export * from './Filters';
export * from './Icon';
export * from './Loading';
export * from './Theme';
export * from './Tooltip';

/**
 * Deprecated types moved to `@backstage/plugin-cost-insights-common`
 */
import * as common from '@backstage/plugin-cost-insights-common';

/**
 * @deprecated use the same type from `@backstage/plugin-cost-insights-common` instead
 * @public
 */
export type ChangeStatistic = common.ChangeStatistic;
/**
 * @deprecated use the same type from `@backstage/plugin-cost-insights-common` instead
 * @public
 */
export type Cost = common.Cost;
/**
 * @deprecated use the same type from `@backstage/plugin-cost-insights-common` instead
 * @public
 */
export type DateAggregation = common.DateAggregation;
/**
 * @deprecated use the same type from `@backstage/plugin-cost-insights-common` instead
 * @public
 */
export type Entity = common.Entity;
/**
 * @deprecated use the same type from `@backstage/plugin-cost-insights-common` instead
 * @public
 */
export type Group = common.Group;
/**
 * @deprecated use the same type from `@backstage/plugin-cost-insights-common` instead
 * @public
 */
export type Maybe<T> = common.Maybe<T>;
/**
 * @deprecated use the same type from `@backstage/plugin-cost-insights-common` instead
 * @public
 */
export type Metric = common.Metric;
/**
 * @deprecated use the same type from `@backstage/plugin-cost-insights-common` instead
 * @public
 */
export type MetricData = common.MetricData;
/**
 * @deprecated use the same type from `@backstage/plugin-cost-insights-common` instead
 * @public
 */
export type Product = common.Product;
/**
 * @deprecated use the same type from `@backstage/plugin-cost-insights-common` instead
 * @public
 */
export type Project = common.Project;
/**
 * @deprecated use the same type from `@backstage/plugin-cost-insights-common` instead
 * @public
 */
export type Trendline = common.Trendline;
