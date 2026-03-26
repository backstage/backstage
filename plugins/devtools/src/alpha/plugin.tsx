/*
 * Copyright 2023 The Backstage Authors
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
  createFrontendPlugin,
  coreExtensionData,
  discoveryApiRef,
  fetchApiRef,
  ApiBlueprint,
  PageBlueprint,
  NavItemBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';

import { devToolsApiRef, DevToolsClient } from '../api';
import BuildIcon from '@material-ui/icons/Build';
import { Content } from '@backstage/core-components';
import { rootRouteRef } from '../routes';
import {
  devToolsConfigReadPermission,
  devToolsInfoReadPermission,
} from '@backstage/plugin-devtools-common';
import { devToolsTaskSchedulerReadPermission } from '@backstage/plugin-devtools-common/alpha';
import { RequirePermission } from '@backstage/plugin-permission-react';

/** @alpha */
export const devToolsApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: devToolsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new DevToolsClient({ discoveryApi, fetchApi }),
    }),
});

/** @alpha */
export const devToolsPage = PageBlueprint.makeWithOverrides({
  factory(originalFactory, { inputs }) {
    const pages = [...inputs.pages].sort((left, right) => {
      const leftPath = left.get(coreExtensionData.routePath);
      const rightPath = right.get(coreExtensionData.routePath);

      if (leftPath === 'info' && rightPath !== 'info') {
        return -1;
      }
      if (leftPath !== 'info' && rightPath === 'info') {
        return 1;
      }

      return 0;
    });

    return originalFactory(
      {
        path: '/devtools',
        routeRef: rootRouteRef,
        title: 'DevTools',
      },
      {
        inputs: {
          pages,
        },
      },
    );
  },
});

/** @alpha */
export const devToolsInfoPage = SubPageBlueprint.make({
  name: 'info',
  params: {
    path: 'info',
    title: 'Info',
    loader: () =>
      import('../components/Content').then(m => (
        <Content>
          <RequirePermission permission={devToolsInfoReadPermission}>
            <m.InfoContent />
          </RequirePermission>
        </Content>
      )),
  },
});

/** @alpha */
export const devToolsConfigPage = SubPageBlueprint.make({
  name: 'config',
  params: {
    path: 'config',
    title: 'Config',
    loader: () =>
      import('../components/Content').then(m => (
        <Content>
          <RequirePermission permission={devToolsConfigReadPermission}>
            <m.ConfigContent />
          </RequirePermission>
        </Content>
      )),
  },
});

/** @alpha */
export const devToolsScheduledTasksPage = SubPageBlueprint.make({
  name: 'scheduled-tasks',
  params: {
    path: 'scheduled-tasks',
    title: 'Scheduled Tasks',
    loader: () =>
      import('../components/Content').then(m => (
        <Content>
          <RequirePermission permission={devToolsTaskSchedulerReadPermission}>
            <m.ScheduledTasksContent />
          </RequirePermission>
        </Content>
      )),
  },
});

/** @alpha */
export const devToolsNavItem = NavItemBlueprint.make({
  params: {
    title: 'DevTools',
    routeRef: rootRouteRef,
    icon: BuildIcon,
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'devtools',
  title: 'DevTools',
  icon: <BuildIcon fontSize="inherit" />,
  info: { packageJson: () => import('../../package.json') },
  routes: {
    root: rootRouteRef,
  },
  extensions: [
    devToolsApi,
    devToolsPage,
    devToolsInfoPage,
    devToolsConfigPage,
    devToolsScheduledTasksPage,
    devToolsNavItem,
  ],
});
