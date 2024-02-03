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
  DiscoveryService,
  RootFeatureRegistryService,
} from '@backstage/backend-plugin-api';
import fetch from 'node-fetch';
import { PluginRegistrations } from '../discovery/MultipleBackendHostDiscovery';

export class InstanceRegistration {
  #rootFeatureRegistry: RootFeatureRegistryService;
  #discovery: DiscoveryService;
  #gatewayUrl: string;
  #registrationIntervalId: NodeJS.Timeout | undefined;

  constructor(options: {
    rootFeatureRegistry: RootFeatureRegistryService;
    discovery: DiscoveryService;
    gatewayUrl: string;
  }) {
    this.#discovery = options.discovery;
    this.#rootFeatureRegistry = options.rootFeatureRegistry;
    this.#gatewayUrl = options.gatewayUrl;
  }

  private async submitRegistration(plugins: PluginRegistrations) {
    try {
      const response = await fetch(
        `${this.#gatewayUrl}/api/discovery/install`,
        {
          method: 'POST',
          body: JSON.stringify(plugins),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.ok) {
        return true;
      }
    } catch (err) {
      // skip network errors.
    }
    return false;
  }

  async register() {
    const features = await this.#rootFeatureRegistry.getFeatures();
    const pluginIds = new Set(features.map(e => e.pluginId));
    const pluginUrls: Record<string, { internal: string; external: string }> =
      {};
    for (const pluginId of pluginIds) {
      pluginUrls[pluginId] = {
        external: await this.#discovery.getExternalBaseUrl(pluginId),
        internal: await this.#discovery.getBaseUrl(pluginId),
      };
    }
    this.#registrationIntervalId = setInterval(async () => {
      const registered = await this.submitRegistration(pluginUrls);
      console.log('registered', registered, pluginUrls);
      if (registered) {
        clearInterval(this.#registrationIntervalId);
        this.#registrationIntervalId = undefined;
      }
      // The interval numbers will _definitely_ need tweaking.
    }, 60 * 1000);
  }

  private async heartbeat() {
    try {
      const response = await fetch(`${this.#gatewayUrl}/api/discovery/health`);
      if (response.ok) {
        return true;
      }
    } catch (err) {
      // skip network errors.
    }
    return false;
  }

  /**
   * Primary entry point for setting up instances. This will create a heartbeat. The heartbeat then handles
   *    registration both initially and whenever the primary server loses the heartbeat.
   */
  async startHeartbeat() {
    let lastHeartbeat = false;
    setInterval(async () => {
      const heartbeat = await this.heartbeat();
      //   console.log('heartbeat', heartbeat, lastHeartbeat);
      if (lastHeartbeat !== heartbeat && !this.#registrationIntervalId) {
        lastHeartbeat = heartbeat;
        this.register();
      }
      // The interval numbers will _definitely_ need tweaking.
    }, 30 * 1000);
  }
}
