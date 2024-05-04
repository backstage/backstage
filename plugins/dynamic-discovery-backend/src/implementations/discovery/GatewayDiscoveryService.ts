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
  FeatureMetadata,
  InstanceMetadataService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { DynamicDiscoveryService } from '../../interfaces/DynamicDiscoveryService';
import { LocalDiscoveryService } from './LocalDiscoveryService';

export class GatewayDiscoveryService implements DynamicDiscoveryService {
  isGateway = true;
  $$type: 'backstage.dynamic-discovery-service' =
    'backstage.dynamic-discovery-service';
  #pluginLocations: Map<string, { internalUrl: string; externalUrl: string }> =
    new Map();

  #featuresByLocation: Map<
    { internalUrl: string; externalUrl: string },
    Set<FeatureMetadata>
  > = new Map();

  #features: Set<FeatureMetadata> = new Set();
  #localDiscovery: LocalDiscoveryService;

  static async fromConfig(
    config: RootConfigService,
    options: { instanceMetadata: InstanceMetadataService },
  ) {
    const discoveryService = new GatewayDiscoveryService({
      localDiscovery: LocalDiscoveryService.fromConfig(config),
    });
    for (const feature of options.instanceMetadata.getInstalledFeatures()) {
      await discoveryService.registerLocal(feature);
    }
    return discoveryService;
  }

  constructor(options: { localDiscovery: LocalDiscoveryService }) {
    this.#localDiscovery = options.localDiscovery;
  }

  register(
    instanceLocation: { internalUrl: string; externalUrl: string },
    feature: FeatureMetadata,
    featureLocation: { internalUrl: string; externalUrl: string },
  ): void {
    this.#pluginLocations.set(feature.pluginId, featureLocation);

    if (!this.#featuresByLocation.has(instanceLocation)) {
      this.#featuresByLocation.set(instanceLocation, new Set());
    }
    this.#featuresByLocation.get(instanceLocation)!.add(feature);
    this.#features.add(feature);
  }

  async registerLocal(feature: FeatureMetadata) {
    this.register(
      {
        internalUrl: this.#localDiscovery.internalBaseUrl,
        externalUrl: this.#localDiscovery.externalBaseUrl,
      },
      feature,
      {
        internalUrl: await this.#localDiscovery.getBaseUrl(feature.pluginId),
        externalUrl: await this.#localDiscovery.getExternalBaseUrl(
          feature.pluginId,
        ),
      },
    );
  }

  async getBaseUrl(pluginId: string): Promise<string> {
    const plugin = this.#pluginLocations.get(pluginId);
    if (!plugin) {
      throw new Error(`No internal URL found for plugin ${pluginId}`);
    }
    console.log('getting internal url for', plugin);
    return plugin.internalUrl;
  }

  async getExternalBaseUrl(pluginId: string): Promise<string> {
    const plugin = this.#pluginLocations.get(pluginId);
    if (!plugin) {
      throw new Error(`No external URL found for plugin ${pluginId}`);
    }
    return plugin.externalUrl;
  }

  async listFeatures(): Promise<FeatureMetadata[]> {
    return [...this.#features.values()];
  }
}
