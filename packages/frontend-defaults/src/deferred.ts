/*
 * Copyright 2026 The Backstage Authors
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
  FrontendFeature,
  FrontendFeatureLoader,
} from '@backstage/frontend-plugin-api';
import {
  OpaqueDeferredFrontendFeature,
  OpaqueFrontendModule,
  OpaqueFrontendPlugin,
} from '@internal/frontend';

/**
 * Applies the features that are passed to the app explicitly to the deferred
 * plugins that feature loaders provided.
 *
 * @remarks
 *
 * A deferred plugin that is also passed explicitly is dropped, since the
 * explicit plugin replaces it. A deferred plugin that an explicit module
 * applies to is loaded before the app starts instead, so that the module
 * applies to the real plugin. All other deferred plugins are kept, and the
 * app installs a stand-in for each of them.
 *
 * @internal
 */
export async function applyExplicitFeatures(
  loadedFeatures: FrontendFeature[],
  explicitFeatures: (FrontendFeature | FrontendFeatureLoader)[],
): Promise<FrontendFeature[]> {
  const pluginIds = new Set<string>();
  const modulePluginIds = new Set<string>();
  for (const feature of explicitFeatures) {
    if (OpaqueFrontendPlugin.isType(feature)) {
      pluginIds.add(
        feature.pluginId ?? OpaqueFrontendPlugin.toInternal(feature).id,
      );
    } else if (OpaqueFrontendModule.isType(feature)) {
      modulePluginIds.add(feature.pluginId);
    }
  }

  return Promise.all(
    loadedFeatures.map(async feature => {
      if (!OpaqueDeferredFrontendFeature.isType(feature)) {
        return [feature];
      }
      const { name, manifest, load } =
        OpaqueDeferredFrontendFeature.toInternal(feature);
      if (pluginIds.has(manifest.pluginId)) {
        return [];
      }
      if (!modulePluginIds.has(manifest.pluginId)) {
        return [feature];
      }
      const { default: plugin } = await load();
      if (!OpaqueFrontendPlugin.isType(plugin)) {
        throw new Error(
          `The '${name}' package didn't provide a frontend plugin as its default export`,
        );
      }
      return [plugin];
    }),
  ).then(results => results.flat());
}
