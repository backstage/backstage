/*
 * Copyright 2020 The Backstage Authors
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

import { Config } from '@backstage/config';
import { PluginEndpointDiscovery } from './types';
import { readHttpServerOptions } from '@backstage/backend-app-api';

type Target = string | { internal: string; external: string };

/**
 * HostDiscovery is a basic PluginEndpointDiscovery implementation
 * that assumes that all plugins are hosted in a single deployment.
 *
 * The deployment may be scaled horizontally, as long as the external URL
 * is the same for all instances. However, internal URLs will always be
 * resolved to the same host, so there won't be any balancing of internal traffic.
 *
 * @public
 */
export class HostDiscovery implements PluginEndpointDiscovery {
  /**
   * Creates a new HostDiscovery discovery instance by reading
   * from the `backend` config section, specifically the `.baseUrl` for
   * discovering the external URL, and the `.listen` and `.https` config
   * for the internal one.
   *
   * Can be overridden by in config by providing a target and corresponding plugin in `discovery.endpoint`.
   * eg.
   * ```yaml
   * discovery:
   *  endpoints:
   *    - target: https://internal.example.com/internal-catalog
   *      plugins: [catalog]
   *    - target: https://internal.example.com/secure/api/{{pluginId}}
   *      plugins: [auth, permissions]
   *    - target:
   *        internal: https://internal.example.com/search
   *        external: https://example.com/search
   *      plugins: [search]
   * ```
   *
   * The basePath defaults to `/api`, meaning the default full internal
   * path for the `catalog` plugin will be `http://localhost:7007/api/catalog`.
   */
  static fromConfig(config: Config, options?: { basePath?: string }) {
    const basePath = options?.basePath ?? '/api';
    const externalBaseUrl = config.getString('backend.baseUrl');

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

    return new HostDiscovery(
      internalBaseUrl + basePath,
      externalBaseUrl + basePath,
      config.getOptionalConfig('discovery'),
    );
  }

  private constructor(
    private readonly internalBaseUrl: string,
    private readonly externalBaseUrl: string,
    private readonly discoveryConfig: Config | undefined,
  ) {}

  private getTargetFromConfig(pluginId: string, type: 'internal' | 'external') {
    const endpoints = this.discoveryConfig?.getOptionalConfigArray('endpoints');

    const target = endpoints
      ?.find(endpoint => endpoint.getStringArray('plugins').includes(pluginId))
      ?.get<Target>('target');

    if (!target) {
      return null;
    }

    if (typeof target === 'string') {
      return target.replace(/\{\{\s*pluginId\s*\}\}/, pluginId);
    }

    return target[type].replace(/\{\{\s*pluginId\s*\}\}/, pluginId);
  }

  async getBaseUrl(pluginId: string): Promise<string> {
    const target = this.getTargetFromConfig(pluginId, 'internal');

    if (target) {
      return target;
    }

    return `${this.internalBaseUrl}/${pluginId}`;
  }

  async getExternalBaseUrl(pluginId: string): Promise<string> {
    const target = this.getTargetFromConfig(pluginId, 'external');

    if (target) {
      return target;
    }

    return `${this.externalBaseUrl}/${pluginId}`;
  }
}

/**
 * SingleHostDiscovery is a basic PluginEndpointDiscovery implementation
 * that assumes that all plugins are hosted in a single deployment.
 *
 * The deployment may be scaled horizontally, as long as the external URL
 * is the same for all instances. However, internal URLs will always be
 * resolved to the same host, so there won't be any balancing of internal traffic.
 *
 * @public
 * @deprecated Use {@link HostDiscovery} instead
 */
export const SingleHostDiscovery = HostDiscovery;
