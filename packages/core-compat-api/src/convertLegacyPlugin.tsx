/*
 * Copyright 2024 The Backstage Authors
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
  BackstagePlugin as LegacyBackstagePlugin,
  getComponentData,
  RouteRef as LegacyRouteRef,
} from '@backstage/core-plugin-api';
import {
  ExtensionDefinition,
  BackstagePlugin as NewBackstagePlugin,
  createPageExtension,
  createPlugin,
} from '@backstage/frontend-plugin-api';
import kebabCase from 'lodash/kebabCase';
import {
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from './convertLegacyRouteRef';
import { ComponentType } from 'react';
import React from 'react';
import { compatWrapper } from './compatWrapper';

/** @internal */
export function convertLegacyExtension(
  LegacyExtension: ComponentType<{}>,
  legacyPlugin: LegacyBackstagePlugin,
): ExtensionDefinition<any, any> {
  const element = <LegacyExtension />;

  const plugin = getComponentData<LegacyBackstagePlugin>(
    element,
    'core.plugin',
  );
  if (legacyPlugin !== plugin) {
    throw new Error(
      `The extension does not belong to the same plugin, got ${plugin?.getId()}`,
    );
  }

  const name = getComponentData<string>(element, 'core.extensionName');
  if (!name) {
    throw new Error('Extension has no name');
  }

  const mountPoint = getComponentData<LegacyRouteRef>(
    element,
    'core.mountPoint',
  );

  if (name.endsWith('Page')) {
    return createPageExtension({
      defaultPath: kebabCase(name.slice(0, -'Page'.length)),
      routeRef: mountPoint && convertLegacyRouteRef(mountPoint),
      loader: () => Promise.resolve(compatWrapper(element)),
    });
  }
}

/** @public */
export function convertLegacyPlugin(
  legacyPlugin: LegacyBackstagePlugin,
  options: { extensions: ExtensionDefinition<any, any>[] },
): NewBackstagePlugin {
  return createPlugin({
    id: legacyPlugin.getId(),
    featureFlags: [...legacyPlugin.getFeatureFlags()],
    routes: convertLegacyRouteRefs(legacyPlugin.routes ?? {}),
    externalRoutes: convertLegacyRouteRefs(legacyPlugin.externalRoutes ?? {}),
    extensions: options.extensions,
  });
}
