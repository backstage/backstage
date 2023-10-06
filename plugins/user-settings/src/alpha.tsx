import { createRouteRef } from '@backstage/core-plugin-api';
import {
  createExtensionDataRef,
  createExtensionInput,
  createPageExtension,
  createPlugin,
} from '@backstage/frontend-plugin-api';

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

export * from './translation';

/**
 * @alpha
 */
export const userSettingsRouteRef = createRouteRef({
  id: 'plugin.user-settings.page',
});

/**
 * @alpha
 */
export const userSettingsProviderSettingsExtensionData =
  createExtensionDataRef<JSX.Element>(
    'plugin.user-settings.page.providerSettings',
  );

/**
 * @alpha
 */
export const UserSettingsPage = createPageExtension({
  id: 'plugin.user-settings.page',
  defaultPath: '/settings/*',
  routeRef: userSettingsRouteRef,
  inputs: {
    providerSettings: createExtensionInput(
      {
        component: userSettingsProviderSettingsExtensionData,
      },
      { singleton: true },
    ),
  },
  loader: ({ inputs }) =>
    import('./components/SettingsPage').then(m => (
      <m.SettingsPage providerSettings={inputs.providerSettings.component} />
    )),
});

/**
 * @alpha
 */
export default createPlugin({
  id: 'user-settings',
  extensions: [UserSettingsPage],
});
