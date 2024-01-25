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
  coreExtensionData,
  createExtensionInput,
  createNavItemExtension,
  createPageExtension,
  createPlugin,
} from '@backstage/frontend-plugin-api';
import {
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
  compatWrapper,
} from '@backstage/core-compat-api';
import SettingsIcon from '@material-ui/icons/Settings';
import { settingsRouteRef } from './plugin';

import React from 'react';

export * from './translation';

const userSettingsPage = createPageExtension({
  defaultPath: '/settings',
  routeRef: convertLegacyRouteRef(settingsRouteRef),
  inputs: {
    providerSettings: createExtensionInput(
      {
        element: coreExtensionData.reactElement,
      },
      { singleton: true, optional: true },
    ),
  },
  loader: ({ inputs }) =>
    import('./components/SettingsPage').then(m =>
      compatWrapper(
        <m.SettingsPage
          providerSettings={inputs.providerSettings?.output.element}
        />,
      ),
    ),
});

/** @alpha */
export const settingsNavItem = createNavItemExtension({
  routeRef: convertLegacyRouteRef(settingsRouteRef),
  title: 'Settings',
  icon: SettingsIcon,
});

/**
 * @alpha
 */
export default createPlugin({
  id: 'user-settings',
  extensions: [userSettingsPage, settingsNavItem],
  routes: convertLegacyRouteRefs({
    root: settingsRouteRef,
  }),
});
