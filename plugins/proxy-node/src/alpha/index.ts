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
import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { Options } from 'http-proxy-middleware';

/**
 * http-proxy-middleware proxy config interface.
 *
 * @alpha
 */
export interface ProxyConfig extends Options {
  allowedMethods?: string[];
  allowedHeaders?: string[];
  reviveRequestBody?: boolean;
  credentials?: 'require' | 'forward' | 'dangerously-allow-unauthenticated';
}

/**
 * Extension point interface for managing proxy endpoints.
 *
 * @alpha
 */
export interface ProxyEndpointsExtensionPoint {
  addProxyEndpoints(endpoints: Record<string, string | ProxyConfig>): void;
}

/**
 * Extension point for managing proxy endpoints.
 *
 * @alpha
 */
export const proxyEndpointsExtensionPoint =
  createExtensionPoint<ProxyEndpointsExtensionPoint>({
    id: 'proxy.endpoints',
  });
