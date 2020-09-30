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

import { createApiRef } from '@backstage/core';
import { Alert, Cost, Duration, Group, Project, ProductCost } from '../types';

export type CostInsightsApi = {
  /**
   * Get a list of groups the given user belongs to. These may be LDAP groups or similar
   * organizational groups. Cost Insights is designed to show costs based on group membership;
   * if a user has multiple groups, they are able to switch between groups to see costs for each.
   *
   * This method should be removed once the Backstage identity plugin provides the same concept.
   */
  getUserGroups(userId: string): Promise<Group[]>;

  /**
   * Get a list of cloud billing entities that belong to this group (projects in GCP, AWS has a
   * similar concept in billing accounts). These act as filters for the displayed costs, users can
   * choose whether they see all costs for a group, or those from a particular owned project.
   */
  getGroupProjects(group: string): Promise<Project[]>;

  /**
   * Get daily cost aggregations for a given group and interval timeframe.
   *
   * The return type includes an array of daily cost aggregations as well as statistics about the
   * change in cost over the intervals. Calculating these statistics requires us to bucket costs
   * into two or more time periods, hence a repeating interval format rather than just a start and
   * end date.
   *
   * The rate of change in this comparison allows teams to reason about their cost growth (or
   * reduction) and compare it to metrics important to the business.
   *
   * @param group The group id from getUserGroups or query parameters
   * @param metric A metric from the cost-insights configuration in app-config.yaml. The backend
   *   should divide the actual daily cost by the corresponding metric for the same date.
   * @param intervals An ISO 8601 repeating interval string, such as R2/P1M/2020-09-01
   *   https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
   */
  getGroupDailyCost(
    group: string,
    metric: string | null,
    intervals: string,
  ): Promise<Cost>;

  /**
   * Get daily cost aggregations for a given billing entity (project in GCP, AWS has a similar
   * concept in billing accounts) and interval timeframe.
   *
   * The return type includes an array of daily cost aggregations as well as statistics about the
   * change in cost over the intervals. Calculating these statistics requires us to bucket costs
   * into two or more time periods, hence a repeating interval format rather than just a start and
   * end date.
   *
   * The rate of change in this comparison allows teams to reason about the project's cost growth
   * (or reduction) and compare it to metrics important to the business.
   *
   * @param project The project id from getGroupProjects or query parameters
   * @param metric A metric from the cost-insights configuration in app-config.yaml. The backend
   *   should divide the actual daily cost by the corresponding metric for the same date.
   * @param intervals An ISO 8601 repeating interval string, such as R2/P1M/2020-09-01
   *   https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
   */
  getProjectDailyCost(
    project: string,
    metric: string | null,
    intervals: string,
  ): Promise<Cost>;

  /**
   * Get cost aggregations for a particular cloud product and interval timeframe. This includes
   * total cost for the product, as well as a breakdown of particular entities that incurred cost
   * in this product. The type of entity depends on the product - it may be deployed services,
   * storage buckets, managed database instances, etc.
   *
   * The time period is supplied as a Duration rather than intervals, since this is always expected
   * to return data for two bucketed time period (e.g. month vs month, or quarter vs quarter).
   *
   * @param product The product from the cost-insights configuration in app-config.yaml
   * @param group
   * @param duration A time duration, such as P1M. See the Duration type for a detailed explanation
   *    of how the durations are interpreted in Cost Insights.
   */
  getProductInsights(
    product: string,
    group: string,
    duration: Duration,
  ): Promise<ProductCost>;

  /**
   * Get current cost alerts for a given group. These show up as Action Items for the group on the
   * Cost Insights page. Alerts may include cost-saving recommendations, such as infrastructure
   * migrations, or cost-related warnings, such as an unexpected billing anomaly.
   */
  getAlerts(group: string): Promise<Alert[]>;
};

export const costInsightsApiRef = createApiRef<CostInsightsApi>({
  id: 'plugin.costinsights.service',
  description: 'Provides cost data and alerts for the cost-insights plugin',
});
