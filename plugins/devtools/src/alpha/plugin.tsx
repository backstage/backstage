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

import React from 'react';
import {
  createApiExtension,
  createApiFactory,
  createNavItemExtension,
  createPageExtension,
  createPlugin,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/frontend-plugin-api';

import { devToolsApiRef, DevToolsClient } from '../api';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import BuildIcon from '@material-ui/icons/Build';
import { rootRouteRef } from '../routes';

/** @alpha */
export const devToolsApi = createApiExtension({
  factory: createApiFactory({
    api: devToolsApiRef,
    deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
    factory: ({ discoveryApi, identityApi }) =>
      new DevToolsClient({ discoveryApi, identityApi }),
  }),
});

/** @alpha */
export const devToolsPage = createPageExtension({
  defaultPath: '/devtools',
  routeRef: convertLegacyRouteRef(rootRouteRef),
  loader: () =>
    import('../components/DevToolsPage').then(m =>
      compatWrapper(<m.DevToolsPage />),
    ),
});

/** @alpha */
export const devToolsNavItem = createNavItemExtension({
  title: 'DevTools',
  routeRef: convertLegacyRouteRef(rootRouteRef),
  icon: BuildIcon,
});

/** @alpha */
export default createPlugin({
  id: 'devtools',
  routes: {
    root: convertLegacyRouteRef(rootRouteRef),
  },
  extensions: [devToolsApi, devToolsPage, devToolsNavItem],
});
