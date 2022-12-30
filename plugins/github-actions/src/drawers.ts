/*
 * Copyright 2022 The Backstage Authors
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

import { drawerStore } from '@backstage/plugin-interactive-drawers';
import { createComponentExtension } from '@backstage/core-plugin-api';

import { rootRouteRef, buildRouteRef } from './routes';
import { githubActionsPlugin } from './plugin';

const WorkflowRunsDrawer = githubActionsPlugin.provide(
  createComponentExtension({
    name: 'EntityDrawerLatestWorkflowRuns',
    component: {
      lazy: () =>
        import('./components/drawers/WorkflowRuns').then(
          m => m.WorkflowRunsDrawer,
        ),
    },
  }),
);

const WorkflowRunDrawer = githubActionsPlugin.provide(
  createComponentExtension({
    name: 'EntityDrawerLatestWorkflowRun',
    component: {
      lazy: () =>
        import('./components/drawers/WorkflowRun').then(
          m => m.WorkflowRunDrawer,
        ),
    },
  }),
);

export function registerDrawers() {
  drawerStore.registerRouteRef(rootRouteRef, { content: WorkflowRunsDrawer });
  drawerStore.registerRouteRef(buildRouteRef, { content: WorkflowRunDrawer });
}
