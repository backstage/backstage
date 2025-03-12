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
import { UrlPatternDiscovery } from './UrlPatternDiscovery';

/**
 * FrontendHostDiscovery is a config driven DiscoveryApi implementation.
 * It uses the app-config to determine the url for a plugin.
 *
 * @public
 */
export class FrontendHostDiscovery implements DiscoveryApi {
  /**
   * Creates a new FrontendHostDiscovery discovery instance by reading
   * the external target URL from the `discovery.endpoints` config section.
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
   * If a plugin is not declared in the config, the discovery will fall back to using the baseUrl with
   * the provided `pathPattern` appended. The default path pattern is `"/api/{{ pluginId }}"`.
   */
  static fromConfig(config: Config, options?: { pathPattern?: string }) {
    const path = options?.pathPattern ?? '/api/{{ pluginId }}';
    const baseUrl = config.getString('backend.baseUrl');

    const endpoints = config
      .getOptionalConfigArray('discovery.endpoints')
      ?.flatMap(e => {
        const target =
          typeof e.get('target') === 'object'
            ? e.getOptionalString('target.external')
            : e.getString('target');
        if (!target) {
          return [];
        }
        const discovery = UrlPatternDiscovery.compile(target);
        return e
          .getStringArray('plugins')
          .map(pluginId => [pluginId, discovery] as const);
      });

    return new FrontendHostDiscovery(
      new Map(endpoints),
      UrlPatternDiscovery.compile(`${baseUrl}${path}`),
    );
  }

  private constructor(
    private readonly endpoints: Map<string, DiscoveryApi>,
    private readonly defaultEndpoint: DiscoveryApi,
  ) {}

  async getBaseUrl(pluginId: string): Promise<string> {
    const endpoint = this.endpoints.get(pluginId);
    if (endpoint) {
      return endpoint.getBaseUrl(pluginId);
    }
    return this.defaultEndpoint.getBaseUrl(pluginId);
  }
}
