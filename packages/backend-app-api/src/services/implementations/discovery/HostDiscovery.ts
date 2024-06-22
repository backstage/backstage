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
import { DiscoveryService } from '@backstage/backend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { HostDiscovery as _HostDiscovery } from '../../../../../backend-defaults/src/entrypoints/discovery';

/**
 * HostDiscovery is a basic PluginEndpointDiscovery implementation
 * that can handle plugins that are hosted in a single or multiple deployments.
 *
 * The deployment may be scaled horizontally, as long as the external URL
 * is the same for all instances. However, internal URLs will always be
 * resolved to the same host, so there won't be any balancing of internal traffic.
 *
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/discovery` instead.
 */
export class HostDiscovery implements DiscoveryService {
  /**
   * Creates a new HostDiscovery discovery instance by reading
   * from the `backend` config section, specifically the `.baseUrl` for
   * discovering the external URL, and the `.listen` and `.https` config
   * for the internal one.
   *
   * Can be overridden in config by providing a target and corresponding plugins in `discovery.endpoints`.
   * eg.
   * ```yaml
   * discovery:
   *  endpoints:
   *    - target: https://internal.example.com/internal-catalog
   *      plugins: [catalog]
   *    - target: https://internal.example.com/secure/api/{{pluginId}}
   *      plugins: [auth, permission]
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
    return new HostDiscovery(_HostDiscovery.fromConfig(config, options));
  }

  private constructor(private readonly impl: _HostDiscovery) {}

  async getBaseUrl(pluginId: string): Promise<string> {
    return this.impl.getBaseUrl(pluginId);
  }

  async getExternalBaseUrl(pluginId: string): Promise<string> {
    return this.impl.getExternalBaseUrl(pluginId);
  }
}
