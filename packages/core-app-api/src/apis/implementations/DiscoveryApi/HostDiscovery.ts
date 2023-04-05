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
import { Config } from '@backstage/config';
import { DiscoveryApi } from '@backstage/core-plugin-api';

type Target = string | { internal: string; external: string };

/**
 * HostDiscovery is a config driven DiscoveryApi implementation.
 * It uses the app-config to determine the url for a plugin.
 *
 * @public
 */
export class HostDiscovery implements DiscoveryApi {
  /**
   * Creates a new HostDiscovery discovery instance by reading
   * from the `discovery.endpoints` config section. If both internal and external exist, then external is used.
   *
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
   * If a plugin is not declared in the config, the baseUrl is used, defaulting to "/api" unless `basePath` is provided in the options.
   */
  static fromConfig(config: Config, options?: { basePath?: string }) {
    const basePath = options?.basePath ?? '/api';
    const baseUrl = config.getString('backend.baseUrl');

    return new HostDiscovery(
      baseUrl + basePath,
      config.getOptionalConfig('discovery'),
    );
  }

  private constructor(
    private readonly baseUrl: string,
    private readonly discoveryConfig: Config | undefined,
  ) {}

  async getBaseUrl(pluginId: string): Promise<string> {
    const endpoints = this.discoveryConfig?.getOptionalConfigArray('endpoints');

    const target = endpoints
      ?.find(endpoint => endpoint.getStringArray('plugins').includes(pluginId))
      ?.get<Target>('target');

    if (!target) {
      return `${this.baseUrl}/${encodeURIComponent(pluginId)}`;
    }

    if (typeof target === 'string') {
      return target.replace(
        /\{\{\s*pluginId\s*\}\}/g,
        encodeURIComponent(pluginId),
      );
    }

    return target.external.replace(
      /\{\{\s*pluginId\s*\}\}/g,
      encodeURIComponent(pluginId),
    );
  }
}
