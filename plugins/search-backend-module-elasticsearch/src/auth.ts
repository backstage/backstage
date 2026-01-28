/*
 * Copyright 2026 The Backstage Authors
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

/**
 * A provider that supplies authentication headers for Elasticsearch/OpenSearch requests.
 *
 * @remarks
 *
 * This interface allows for dynamic authentication mechanisms such as bearer tokens
 * that need to be refreshed or rotated. The `getAuthHeaders` method is called before
 * each request to the Elasticsearch/OpenSearch cluster, allowing for just-in-time
 * token retrieval and automatic rotation.
 *
 * @example
 *
 * ```ts
 * const authProvider: ElasticSearchAuthProvider = {
 *   async getAuthHeaders() {
 *     const token = await myTokenService.getToken();
 *     return { Authorization: `Bearer ${token}` };
 *   },
 * };
 * ```
 *
 * @public
 */
export interface ElasticSearchAuthProvider {
  /**
   * Returns authentication headers to be included in requests to Elasticsearch/OpenSearch.
   *
   * @remarks
   *
   * This method is called before each request, allowing for dynamic token refresh
   * and rotation. Implementations should handle caching internally if needed to
   * avoid excessive token generation.
   *
   * @returns A promise that resolves to a record of header names and values
   */
  getAuthHeaders(): Promise<Record<string, string>>;
}

/**
 * Extension point for providing custom authentication to the Elasticsearch search engine.
 *
 * @remarks
 *
 * Use this extension point to provide dynamic authentication mechanisms such as
 * bearer tokens with automatic rotation. When an auth provider is set, it takes
 * precedence over any static authentication configured in app-config.yaml.
 *
 * @example
 *
 * ```ts
 * import { createBackendModule } from '@backstage/backend-plugin-api';
 * import { elasticsearchAuthExtensionPoint } from '@backstage/plugin-search-backend-module-elasticsearch';
 *
 * export default createBackendModule({
 *   pluginId: 'search',
 *   moduleId: 'elasticsearch-custom-auth',
 *   register(env) {
 *     env.registerInit({
 *       deps: {
 *         elasticsearchAuth: elasticsearchAuthExtensionPoint,
 *       },
 *       async init({ elasticsearchAuth }) {
 *         elasticsearchAuth.setAuthProvider({
 *           async getAuthHeaders() {
 *             const token = await fetchTokenFromIdentityService();
 *             return { Authorization: `Bearer ${token}` };
 *           },
 *         });
 *       },
 *     });
 *   },
 * });
 * ```
 *
 * @public
 */
export interface ElasticSearchAuthExtensionPoint {
  /**
   * Sets the authentication provider for the Elasticsearch search engine.
   *
   * @remarks
   *
   * This method can only be called once. Subsequent calls will throw an error.
   * The auth provider takes precedence over static authentication configuration.
   *
   * @param provider - The authentication provider to use
   */
  setAuthProvider(provider: ElasticSearchAuthProvider): void;
}

/**
 * Extension point used to customize Elasticsearch/OpenSearch authentication.
 *
 * @public
 */
export const elasticsearchAuthExtensionPoint =
  createExtensionPoint<ElasticSearchAuthExtensionPoint>({
    id: 'search.elasticsearchEngine.auth',
  });
