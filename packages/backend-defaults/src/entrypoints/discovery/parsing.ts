/*
 * Copyright 2025 The Backstage Authors
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
import type { HostDiscoveryEndpoint } from './HostDiscovery';

export function getEndpoints(config: Config): HostDiscoveryEndpoint[] {
  const endpoints: HostDiscoveryEndpoint[] = [];
  // Allow config to override the default endpoints
  const endpointConfigs = config.getOptionalConfigArray('discovery.endpoints');
  for (const endpointConfig of endpointConfigs ?? []) {
    if (typeof endpointConfig.get('target') === 'string') {
      endpoints.push({
        target: endpointConfig.getString('target'),
        plugins: endpointConfig.getStringArray('plugins'),
      });
    } else {
      endpoints.push({
        target: {
          internal: endpointConfig.getOptionalString('target.internal'),
          external: endpointConfig.getOptionalString('target.external'),
        },
        plugins: endpointConfig.getStringArray('plugins'),
      });
    }
  }
  return endpoints;
}
