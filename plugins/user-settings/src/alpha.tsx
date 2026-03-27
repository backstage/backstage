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
  createFrontendPlugin,
  PageBlueprint,
  NavItemBlueprint,
} from '@backstage/frontend-plugin-api';
import type { IconComponent } from '@backstage/frontend-plugin-api';
import { Settings } from 'lucide-react';
import { settingsRouteRef } from './plugin';

/** Map MUI-style fontSize values to Lucide pixel sizes */
const ICON_SIZE_MAP: Record<string, number> = {
  small: 20,
  medium: 24,
  large: 35,
  inherit: 24,
};

/**
 * Wrapper bridging lucide-react's ForwardRefExoticComponent to Backstage's
 * IconComponent type which expects ComponentType<{ fontSize?: ... }>.
 */
const SettingsIcon: IconComponent = ({ fontSize = 'medium', ...rest }) => (
  <Settings size={ICON_SIZE_MAP[fontSize] ?? 24} {...rest} />
);

export * from './translation';

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
      routeRef: settingsRouteRef,
      loader: () =>
        import('./components/SettingsPage').then(m => (
          <m.SettingsPage
            providerSettings={inputs.providerSettings?.get(
              coreExtensionData.reactElement,
            )}
          />
        )),
    });
  },
});

/** @alpha */
export const settingsNavItem = NavItemBlueprint.make({
  params: {
    routeRef: settingsRouteRef,
    title: 'Settings',
    icon: SettingsIcon,
  },
});

/**
 * @alpha
 */
export default createFrontendPlugin({
  pluginId: 'user-settings',
  title: 'Settings',
  icon: <SettingsIcon />,
  info: { packageJson: () => import('../package.json') },
  extensions: [userSettingsPage, settingsNavItem],
  routes: {
    root: settingsRouteRef,
  },
});
