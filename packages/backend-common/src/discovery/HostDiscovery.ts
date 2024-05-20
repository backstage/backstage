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

import { HostDiscovery as _HostDiscovery } from '@backstage/backend-app-api';

export type { DiscoveryService as PluginEndpointDiscovery } from '@backstage/backend-plugin-api';

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
export const HostDiscovery = _HostDiscovery;

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
export const SingleHostDiscovery = _HostDiscovery;
