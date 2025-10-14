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
  ApiBlueprint,
  coreExtensionData,
  createExtensionInput,
  createFrontendPlugin,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  identityApiRef,
  NavItemBlueprint,
  PageBlueprint,
  storageApiRef,
} from '@backstage/frontend-plugin-api';
import {
  compatWrapper,
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import SettingsIcon from '@material-ui/icons/Settings';
import { settingsRouteRef } from './plugin';
import { UserSettingsStorage } from './apis';
import { signalApiRef } from '@backstage/plugin-signals-react';

export * from './translation';

const userSettingsStorageApi = ApiBlueprint.make({
  name: 'storage',
  params: defineParams =>
    defineParams({
      api: storageApiRef,
      deps: {
        fetchApi: fetchApiRef,
        discoveryApi: discoveryApiRef,
        errorApi: errorApiRef,
        identityApi: identityApiRef,
        signalApi: signalApiRef,
      },
      factory: ({ fetchApi, discoveryApi, errorApi, identityApi, signalApi }) =>
        UserSettingsStorage.create({
          fetchApi,
          discoveryApi,
          errorApi,
          identityApi,
          signalApi,
        }),
    }),
});

const userSettingsPage = PageBlueprint.makeWithOverrides({
  inputs: {
    providerSettings: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
      optional: true,
    }),
  },
  factory(originalFactory, { inputs }) {
    return originalFactory({
      path: '/settings',
      routeRef: convertLegacyRouteRef(settingsRouteRef),
      loader: () =>
        import('./components/SettingsPage').then(m =>
          compatWrapper(
            <m.SettingsPage
              providerSettings={inputs.providerSettings?.get(
                coreExtensionData.reactElement,
              )}
            />,
          ),
        ),
    });
  },
});

/** @alpha */
export const settingsNavItem = NavItemBlueprint.make({
  params: {
    routeRef: convertLegacyRouteRef(settingsRouteRef),
    title: 'Settings',
    icon: SettingsIcon,
  },
});

/**
 * @alpha
 */
export default createFrontendPlugin({
  pluginId: 'user-settings',
  info: { packageJson: () => import('../package.json') },
  extensions: [userSettingsStorageApi, userSettingsPage, settingsNavItem],
  routes: convertLegacyRouteRefs({
    root: settingsRouteRef,
  }),
});
