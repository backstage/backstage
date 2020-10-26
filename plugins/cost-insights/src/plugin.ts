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

import { createPlugin, createRouteRef } from '@backstage/core';
import { CostInsightsPage } from './components/CostInsightsPage';
import { ProjectGrowthInstructionsPage } from './components/ProjectGrowthInstructionsPage';
import { LabelDataflowInstructionsPage } from './components/LabelDataflowInstructionsPage';

export const rootRouteRef = createRouteRef({
  path: '/cost-insights',
  title: 'Cost Insights',
});

export const projectGrowthAlertRef = createRouteRef({
  path: '/cost-insights/investigating-growth',
  title: 'Investigating Growth',
});

export const unlabeledDataflowAlertRef = createRouteRef({
  path: '/cost-insights/labeling-jobs',
  title: 'Labeling Dataflow Jobs',
});

export const plugin = createPlugin({
  id: 'cost-insights',
  register({ router, featureFlags }) {
    router.addRoute(rootRouteRef, CostInsightsPage);
    router.addRoute(projectGrowthAlertRef, ProjectGrowthInstructionsPage);
    router.addRoute(unlabeledDataflowAlertRef, LabelDataflowInstructionsPage);
    featureFlags.register('cost-insights-currencies');
  },
});
