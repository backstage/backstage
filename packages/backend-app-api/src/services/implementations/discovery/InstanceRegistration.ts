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
import { Config } from '@backstage/config';
import { TokenManager } from '@backstage/backend-common';

export class InstanceRegistration {
  #rootFeatureRegistry: RootFeatureRegistryService;
  #discovery: DiscoveryService;
  #tokenManager: TokenManager;

  #gatewayUrl: string;
  #instanceUrl: string;
  #registrationIntervalId: NodeJS.Timeout | undefined;
  #plugins: Record<string, { internal: string; external: string }> = {};

  static fromConfig(
    config: Config,
    options: {
      rootFeatureRegistry: RootFeatureRegistryService;
      discovery: DiscoveryService;
      tokenManager: TokenManager;
    },
  ) {
    return new InstanceRegistration({
      rootFeatureRegistry: options.rootFeatureRegistry,
      gatewayUrl: config.getString('discovery.gatewayUrl'),
      instanceUrl: config.getString('backend.baseUrl'),
      discovery: options.discovery,
      tokenManager: options.tokenManager,
    });
  }

  constructor(options: {
    rootFeatureRegistry: RootFeatureRegistryService;
    discovery: DiscoveryService;
    tokenManager: TokenManager;
    gatewayUrl: string;
    instanceUrl: string;
  }) {
    this.#discovery = options.discovery;
    this.#rootFeatureRegistry = options.rootFeatureRegistry;
    this.#gatewayUrl = options.gatewayUrl;
    this.#instanceUrl = options.instanceUrl;
    this.#tokenManager = options.tokenManager;
  }

  private async submitRegistration(plugins: PluginRegistrations) {
    try {
      const response = await fetch(
        `${this.#gatewayUrl}/api/discovery/register`,
        {
          method: 'POST',
          body: JSON.stringify({ instanceUrl: this.#instanceUrl, plugins }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await this.#tokenManager.getToken()}`,
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
    this.#registrationIntervalId = this.intervalWithImmediateExecution(
      async () => {
        const registered = await this.submitRegistration(this.#plugins);
        console.log('registered', registered, this.#plugins);
        if (registered) {
          clearInterval(this.#registrationIntervalId);
          this.#registrationIntervalId = undefined;
        }
        // The interval numbers will _definitely_ need tweaking.
      },
      10000,
    );
  }

  private async heartbeat() {
    try {
      const response = await fetch(`${this.#gatewayUrl}/api/discovery/check`, {
        method: 'POST',
        body: JSON.stringify({
          instanceUrl: this.#instanceUrl,
          plugins: Object.keys(this.#plugins),
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.#tokenManager.getToken()}`,
        },
      });
      if (response.ok) {
        return true;
      }
    } catch (err) {
      // skip network errors.
    }
    return false;
  }

  intervalWithImmediateExecution(cb: () => void, ms = 10000) {
    cb();
    return setInterval(cb, ms);
  }

  /**
   * Primary entry point for setting up instances. This will create a heartbeat. The heartbeat then handles
   *    registration both initially and whenever the primary server loses the heartbeat.
   */
  async startHeartbeat() {
    const features = await this.#rootFeatureRegistry.getFeatures();
    const pluginIds = new Set(features.map(e => e.pluginId));
    for (const pluginId of pluginIds) {
      this.#plugins[pluginId] = {
        external: await this.#discovery.getExternalBaseUrl(pluginId),
        internal: await this.#discovery.getBaseUrl(pluginId),
      };
    }
    this.intervalWithImmediateExecution(async () => {
      const heartbeat = await this.heartbeat();
      console.log('heartbeat', heartbeat);
      if (!heartbeat && !this.#registrationIntervalId) {
        this.register();
      }
      // The interval numbers will _definitely_ need tweaking.
    }, 5000);
  }
}
