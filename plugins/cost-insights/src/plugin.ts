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

import {
  createPlugin,
  createRouteRef,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import {
  CostInsightsInputPluginOptions,
  CostInsightsPluginOptions,
} from './options';

export const rootRouteRef = createRouteRef({
  id: 'cost-insights',
});

export const projectGrowthAlertRef = createRouteRef({
  id: 'cost-insights:investigating-growth',
});

export const unlabeledDataflowAlertRef = createRouteRef({
  id: 'cost-insights:labeling-jobs',
});

/** @public */
export const costInsightsPlugin = createPlugin({
  id: 'cost-insights',
  featureFlags: [{ name: 'cost-insights-currencies' }],
  routes: {
    root: rootRouteRef,
    growthAlerts: projectGrowthAlertRef,
    unlabeledDataflowAlerts: unlabeledDataflowAlertRef,
  },
  __experimentalConfigure(
    options?: CostInsightsInputPluginOptions,
  ): CostInsightsPluginOptions {
    const defaultOptions = {
      hideTrendLine: false,
    };
    return { ...defaultOptions, ...options };
  },
});

/** @public */
export const CostInsightsPage = costInsightsPlugin.provide(
  createRoutableExtension({
    name: 'CostInsightsPage',
    component: () =>
      import('./components/CostInsightsPage').then(m => m.CostInsightsPage),
    mountPoint: rootRouteRef,
  }),
);

/**
 * An extension for displaying costs on an entity page.
 *
 * @public
 */
export const EntityCostInsightsContent = costInsightsPlugin.provide(
  createRoutableExtension({
    name: 'EntityCostInsightsContent',
    component: () =>
      import('./components/EntityCosts').then(m => m.EntityCosts),
    mountPoint: rootRouteRef,
  }),
);

/** @public */
export const CostInsightsProjectGrowthInstructionsPage =
  costInsightsPlugin.provide(
    createRoutableExtension({
      name: 'CostInsightsProjectGrowthInstructionsPage',
      component: () =>
        import('./components/ProjectGrowthInstructionsPage').then(
          m => m.ProjectGrowthInstructionsPage,
        ),
      mountPoint: projectGrowthAlertRef,
    }),
  );

/** @public */
export const CostInsightsLabelDataflowInstructionsPage =
  costInsightsPlugin.provide(
    createRoutableExtension({
      name: 'CostInsightsLabelDataflowInstructionsPage',
      component: () =>
        import('./components/LabelDataflowInstructionsPage').then(
          m => m.LabelDataflowInstructionsPage,
        ),
      mountPoint: unlabeledDataflowAlertRef,
    }),
  );
