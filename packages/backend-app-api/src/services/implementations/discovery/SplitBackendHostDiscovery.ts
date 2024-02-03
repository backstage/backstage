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
import Cache from 'node-cache';
import { readHttpServerOptions } from '@backstage/backend-app-api';
import { NotFoundError } from '@backstage/errors';

export class SplitBackendHostDiscovery implements DiscoveryService {
  #urls: { internal: string; external: string };
  #gatewayUrl: string;
  #cache: Cache;
  #plugins: Record<string, { internal: string; external: string }> = {};
  #isGateway: boolean;
  #discovery: DiscoveryService;
  #rootFeatureRegistry: RootFeatureRegistryService;
  #isInitialized = false;

  static fromConfig(
    config: Config,
    options: {
      rootFeatureRegistry: RootFeatureRegistryService;
      basePath?: string;
    },
  ) {
    const externalBaseUrl = config
      .getString('backend.baseUrl')
      .replace(/\/+$/, '');

    const {
      listen: { host: listenHost = '::', port: listenPort },
    } = readHttpServerOptions(config.getConfig('backend'));
    const protocol = config.has('backend.https') ? 'https' : 'http';

    // Translate bind-all to localhost, and support IPv6
    let host = listenHost;
    if (host === '::' || host === '') {
      // We use localhost instead of ::1, since IPv6-compatible systems should default
      // to using IPv6 when they see localhost, but if the system doesn't support IPv6
      // things will still work.
      host = 'localhost';
    } else if (host === '0.0.0.0') {
      host = '127.0.0.1';
    }
    if (host.includes(':')) {
      host = `[${host}]`;
    }

    const internalBaseUrl = `${protocol}://${host}:${listenPort}`;

    return new SplitBackendHostDiscovery({
      instanceUrl: config.getString('backend.baseUrl'),
      gatewayUrl: config.getOptionalString('backend.gatewayUrl'),
      rootFeatureRegistry: options.rootFeatureRegistry,
      internalBaseUrl,
      externalBaseUrl,
      discovery: HostDiscovery.fromConfig(config),
    });
  }

  constructor(options: {
    instanceUrl: string;
    gatewayUrl?: string;
    rootFeatureRegistry: RootFeatureRegistryService;
    discovery: DiscoveryService;
    internalBaseUrl: string;
    externalBaseUrl: string;
  }) {
    this.#gatewayUrl = options.gatewayUrl || options.externalBaseUrl;
    this.#isGateway = this.#gatewayUrl === options.externalBaseUrl;
    this.#cache = new Cache({ stdTTL: 60 * 5 });
    this.#urls = {
      internal: options.internalBaseUrl,
      external: options.externalBaseUrl,
    };
    this.#discovery = options.discovery;
    this.#rootFeatureRegistry = options.rootFeatureRegistry;
  }

  async initialize() {
    const features = await this.#rootFeatureRegistry.getFeatures();
    const pluginIds = new Set(features.map(e => e.pluginId));
    const plugins: Record<string, { internal: string; external: string }> = {};
    for (const pluginId of pluginIds) {
      plugins[pluginId] = {
        internal: await this.#discovery.getBaseUrl(pluginId),
        external: await this.#discovery.getExternalBaseUrl(pluginId),
      };
    }
    this.addPlugins(plugins);
  }

  addPlugins(plugins: Record<string, { internal: string; external: string }>) {
    for (const [pluginId, urls] of Object.entries(plugins)) {
      this.#plugins[pluginId] = urls;
    }
  }

  get plugins() {
    return this.#plugins;
  }

  get isGateway() {
    return this.#isGateway;
  }

  async getUrl(pluginId: string, key: 'external' | 'internal') {
    if (!this.#isInitialized) {
      await this.initialize();
      this.#isInitialized = true;
    }
    if (this.#plugins[pluginId]?.[key] === this.#urls[key]) {
      return this.#discovery.getBaseUrl(pluginId);
    } else if (this.#plugins[pluginId]) {
      return this.#plugins[pluginId][key];
    }
    if (this.#isGateway) {
      const cacheValue = this.#cache.get<{
        internal: string;
        external: string;
      }>(pluginId);
      if (cacheValue) {
        return cacheValue[key];
      }
    } else {
      const response = await fetch(
        `${this.#gatewayUrl}/api/discovery/installed`,
      );

      if (response.ok) {
        const plugins = (await response.json()) as Record<
          string,
          { external: string; internal: string }
        >;
        if (plugins[pluginId]) {
          return plugins[pluginId][key];
        }
      }
    }
    throw new NotFoundError('Not found.');
  }

  async getBaseUrl(pluginId: string): Promise<string> {
    return this.getUrl(pluginId, 'internal');
  }
  async getExternalBaseUrl(pluginId: string): Promise<string> {
    console.log(this.plugins, pluginId);
    return this.getUrl(pluginId, 'external');
  }
}
