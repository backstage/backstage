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
import { LocalDiscoveryService } from './LocalDiscoveryService';
import fetch from 'node-fetch';
import { DynamicDiscoveryService } from '../../interfaces/DynamicDiscoveryService';

export class LeafNodeDiscoveryService implements DynamicDiscoveryService {
  #instancePlugins: Set<string>;
  #localDiscovery;
  #gatewayUrl;
  isGateway = false;
  $$type: 'backstage.dynamic-discovery-service' =
    'backstage.dynamic-discovery-service';

  static fromConfig(
    config: RootConfigService,
    options: { instanceMetadata: InstanceMetadataService },
  ) {
    return new LeafNodeDiscoveryService({
      instancePlugins: options.instanceMetadata
        .getInstalledFeatures()
        .filter(e => e.type === 'plugin')
        .map(e => e.pluginId),
      localDiscovery: LocalDiscoveryService.fromConfig(config),
      gatewayUrl: config.getOptional('discovery.gateway.internalUrl'),
    });
  }

  constructor(options: {
    instancePlugins: string[];
    localDiscovery: LocalDiscoveryService;
    gatewayUrl?: string;
  }) {
    this.#instancePlugins = new Set(options.instancePlugins);
    this.#localDiscovery = options.localDiscovery;
    this.#gatewayUrl = options.gatewayUrl;
  }

  async #gatewayFetch(path: string, pluginId?: string) {
    if (!this.#gatewayUrl) {
      throw new Error(
        `${
          pluginId ? `Plugin ${pluginId}` : ''
        } is not available on this instance. No gateway URL configured.`,
      );
    }
    const response = await fetch(
      `${this.#gatewayUrl}/api/dynamic-discovery${path}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}, ${response.statusText}`);
    }
    return response.json();
  }

  async getBaseUrl(pluginId: string): Promise<string> {
    if (this.#instancePlugins.has(pluginId)) {
      return this.#localDiscovery.getBaseUrl(pluginId);
    }
    return (
      await this.#gatewayFetch(`/by-plugin/${pluginId}/base-url`, pluginId)
    ).baseUrl;
  }
  async getExternalBaseUrl(pluginId: string): Promise<string> {
    if (this.#instancePlugins.has(pluginId)) {
      return this.#localDiscovery.getExternalBaseUrl(pluginId);
    }
    return (
      await this.#gatewayFetch(
        `/by-plugin/${pluginId}/external-base-url`,
        pluginId,
      )
    ).externalBaseUrl;
  }

  async listFeatures(): Promise<FeatureMetadata[]> {
    return this.#gatewayFetch(`/registrations`);
  }
}
