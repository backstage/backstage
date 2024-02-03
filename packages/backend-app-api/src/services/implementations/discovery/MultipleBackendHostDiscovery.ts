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

import { HostDiscovery } from '@backstage/backend-common';
import {
  DiscoveryService,
  RootFeatureRegistryService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import fetch from 'node-fetch';
import { NotFoundError } from '@backstage/errors';

/** @public */
export interface DiscoveryUrl {
  internal: string;
  external: string;
}

/** @public */
export type PluginRegistrations = Record<string, DiscoveryUrl>;

/** @public */
export class MultipleBackendHostDiscovery implements DiscoveryService {
  #gatewayUrl: string;
  #instanceUrl: string;

  #isGateway: boolean;
  #isInitialized = false;

  #discovery: DiscoveryService;
  #rootFeatureRegistry: RootFeatureRegistryService;

  // A map of plugin to URLs.
  #plugins: PluginRegistrations = {};
  // A map of instance URL to plugin.
  #instancePlugins: Record<string, Set<string>> = {};

  static fromConfig(
    config: Config,
    options: {
      rootFeatureRegistry: RootFeatureRegistryService;
      basePath?: string;
    },
  ) {
    return new MultipleBackendHostDiscovery({
      instanceUrl: config.getString('backend.baseUrl'),
      gatewayUrl: config.getOptionalString('discovery.gatewayUrl'),
      rootFeatureRegistry: options.rootFeatureRegistry,
      discovery: HostDiscovery.fromConfig(config),
    });
  }

  constructor(options: {
    instanceUrl: string;
    gatewayUrl?: string;
    rootFeatureRegistry: RootFeatureRegistryService;
    discovery: DiscoveryService;
  }) {
    this.#gatewayUrl = options.gatewayUrl || options.instanceUrl;
    this.#instanceUrl = options.instanceUrl;
    this.#isGateway = !options.gatewayUrl;
    this.#discovery = options.discovery;
    this.#rootFeatureRegistry = options.rootFeatureRegistry;
  }

  async initialize() {
    if (this.#isInitialized) {
      throw new Error('Can not initialize twice.');
    }
    const features = await this.#rootFeatureRegistry.getFeatures();
    const pluginIds = features
      .filter(e => e.type === 'plugin')
      .map(e => e.pluginId);
    const plugins: PluginRegistrations = {};
    for (const pluginId of pluginIds) {
      plugins[pluginId] = {
        internal: await this.#discovery.getBaseUrl(pluginId),
        external: await this.#discovery.getExternalBaseUrl(pluginId),
      };
    }
    this.addPlugins(this.#instanceUrl, plugins);
  }

  addPlugins(instanceUrl: string, plugins: PluginRegistrations) {
    for (const [pluginId, urls] of Object.entries(plugins)) {
      this.#plugins[pluginId] = urls;
      if (!this.#instancePlugins[instanceUrl]) {
        this.#instancePlugins[instanceUrl] = new Set();
      }
      this.#instancePlugins[instanceUrl].add(pluginId);
    }
  }

  get plugins() {
    return this.#plugins;
  }

  get instancePlugins() {
    return this.#instancePlugins;
  }

  get isGateway() {
    return this.#isGateway;
  }

  async getUrl(pluginId: string, key: 'external' | 'internal') {
    // Because of how the services are initialized, lazy load the features when we first need them.
    if (!this.#isInitialized) {
      await this.initialize();
      this.#isInitialized = true;
    }
    // If this instance knows about this plugin, return the value.
    // The Gateway should have all plugins registered, individual instances will have just their
    //  registered plugins.
    if (this.#plugins[pluginId]) {
      return this.#plugins[pluginId][key];
    }
    console.log(this.#isGateway, this.#plugins);
    if (this.#isGateway) {
      /**
       * If we get here, either
       *  a) we're requesting a route to a pluginId that hasn't been registered yet.
       *  b) we're requesting a plugin that doesn't exist.
       *
       * Given the current design with a decentralized gateway definition, we don't know how many
       *    nodes need to be registered. We could add a wait check here to allow for registration,
       *    but this feels more like user error than anything, ie didn't configure backend A and
       *    backend B correctly.
       */
    } else {
      // As an instance plugin, fetch the registered plugins on the gateway URL.
      const response = await fetch(
        `${this.#gatewayUrl}/api/discovery/registered`,
      );

      if (response.ok) {
        const plugins = (await response.json()) as PluginRegistrations;
        // Check the list of registered plugins, if it doesn't exist there, there's a good chance it
        //  doesn't exist at all.
        console.log(plugins);
        if (plugins[pluginId]) {
          return plugins[pluginId][key];
        }
      }
    }
    throw new NotFoundError(`Plugin ${pluginId} not registered.`);
  }

  async getBaseUrl(pluginId: string): Promise<string> {
    return this.getUrl(pluginId, 'internal');
  }
  async getExternalBaseUrl(pluginId: string): Promise<string> {
    console.log(this.plugins, pluginId);
    return this.getUrl(pluginId, 'external');
  }
}
