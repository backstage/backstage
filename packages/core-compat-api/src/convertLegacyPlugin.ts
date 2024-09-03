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

import { BackstagePlugin as LegacyBackstagePlugin } from '@backstage/core-plugin-api';
import {
  ApiBlueprint,
  ExtensionDefinition,
  FrontendPlugin as NewBackstagePlugin,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';
import { convertLegacyRouteRefs } from './convertLegacyRouteRef';

/** @public */
export function convertLegacyPlugin(
  legacyPlugin: LegacyBackstagePlugin,
  options: { extensions: ExtensionDefinition[] },
): NewBackstagePlugin {
  const apiExtensions = Array.from(legacyPlugin.getApis()).map(factory =>
    ApiBlueprint.make({ name: factory.api.id, params: { factory } }),
  );
  return createFrontendPlugin({
    id: legacyPlugin.getId(),
    featureFlags: [...legacyPlugin.getFeatureFlags()],
    routes: convertLegacyRouteRefs(legacyPlugin.routes ?? {}),
    externalRoutes: convertLegacyRouteRefs(legacyPlugin.externalRoutes ?? {}),
    extensions: [...apiExtensions, ...options.extensions],
  });
}
