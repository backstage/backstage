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

import { InternalPlugin } from './plugins/types';
import { ServiceRegistry } from './services/ServiceRegistry';
import { ServiceRef } from './services/types';

interface UninitializedFeature {
  deps: Record<string, ServiceRef<unknown>>;
  init(deps: Record<string, unknown>): Promise<void>;
}

export class FeatureRegistry {
  private readonly uninitializedFeatures = new Map<
    string,
    UninitializedFeature
  >();
  private readonly features = new Map<string, InternalPlugin>();
  private readonly dependencies = new Map<string, string[]>();
  private readonly serviceRegistry: ServiceRegistry;

  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
  }

  async register(plugin: InternalPlugin): Promise<void> {
    if (this.features.has(plugin.id)) {
      throw new Error(`Plugin with ID ${plugin.id} is already registered`);
    }
    await plugin.register({
      registerInit: async registrationPoint => {
        this.uninitializedFeatures.set(plugin.id, registrationPoint);
        this.features.set(plugin.id, plugin);

        this.dependencies.set(
          plugin.id,
          Object.values(registrationPoint.deps).map(dep => dep.id),
        );
      },
    });
  }

  async initialize() {
    for (const [pluginId, feature] of this.uninitializedFeatures) {
      await feature.init(
        Object.fromEntries(
          Object.entries(feature.deps).map(([name, ref]) => [
            name,
            this.serviceRegistry.get(ref),
          ]),
        ),
      );
      this.uninitializedFeatures.delete(pluginId);
    }
  }

  get(pluginId: string): InternalPlugin {
    const plugin = this.features.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin with ID ${pluginId} is not registered`);
    }
    return plugin;
  }
}
