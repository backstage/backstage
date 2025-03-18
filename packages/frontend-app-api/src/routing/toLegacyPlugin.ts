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

import { FrontendPlugin } from '@backstage/frontend-plugin-api';
import { BackstagePlugin as LegacyBackstagePlugin } from '@backstage/core-plugin-api';
import { getOrCreateGlobalSingleton } from '@backstage/version-bridge';

// Make sure that we only convert each new plugin instance to its legacy equivalent once
const legacyPluginStore = getOrCreateGlobalSingleton(
  'legacy-plugin-compatibility-store',
  () => new WeakMap<FrontendPlugin, LegacyBackstagePlugin>(),
);

export function toLegacyPlugin(plugin: FrontendPlugin): LegacyBackstagePlugin {
  let legacy = legacyPluginStore.get(plugin);
  if (legacy) {
    return legacy;
  }

  const errorMsg = 'Not implemented in legacy plugin compatibility layer';
  const notImplemented = () => {
    throw new Error(errorMsg);
  };

  legacy = {
    getId(): string {
      return plugin.id;
    },
    get routes() {
      return {};
    },
    get externalRoutes() {
      return {};
    },
    getApis: notImplemented,
    getFeatureFlags: notImplemented,
    provide: notImplemented,
  };

  legacyPluginStore.set(plugin, legacy);
  return legacy;
}
