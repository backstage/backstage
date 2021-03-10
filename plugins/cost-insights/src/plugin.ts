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
  createPlugin,
  createRouteRef,
  createRoutableExtension,
} from '@backstage/core';
import { CostInsightsPage as CostInsightsPageComponent } from './components/CostInsightsPage';
import { ProjectGrowthInstructionsPage as ProjectGrowthInstructionsPageComponent } from './components/ProjectGrowthInstructionsPage';
import { LabelDataflowInstructionsPage as LabelDataflowInstructionsPageComponent } from './components/LabelDataflowInstructionsPage';

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

export const costInsightsPlugin = createPlugin({
  id: 'cost-insights',
  register({ router, featureFlags }) {
    router.addRoute(rootRouteRef, CostInsightsPageComponent);
    router.addRoute(
      projectGrowthAlertRef,
      ProjectGrowthInstructionsPageComponent,
    );
    router.addRoute(
      unlabeledDataflowAlertRef,
      LabelDataflowInstructionsPageComponent,
    );
    featureFlags.register('cost-insights-currencies');
  },
  routes: {
    root: rootRouteRef,
    growthAlerts: projectGrowthAlertRef,
    unlabeledDataflowAlerts: unlabeledDataflowAlertRef,
  },
});

export const CostInsightsPage = costInsightsPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/CostInsightsPage').then(m => m.CostInsightsPage),
    mountPoint: rootRouteRef,
  }),
);

export const CostInsightsProjectGrowthInstructionsPage = costInsightsPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/ProjectGrowthInstructionsPage').then(
        m => m.ProjectGrowthInstructionsPage,
      ),
    mountPoint: projectGrowthAlertRef,
  }),
);

export const CostInsightsLabelDataflowInstructionsPage = costInsightsPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/LabelDataflowInstructionsPage').then(
        m => m.LabelDataflowInstructionsPage,
      ),
    mountPoint: unlabeledDataflowAlertRef,
  }),
);
