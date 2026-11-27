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
 * Supplies authentication headers for OpenSearch requests.
 *
 * @remarks
 *
 * The headers are resolved before each request, which makes it possible to
 * use short-lived tokens that are refreshed or rotated. Implementations are
 * responsible for caching tokens if needed.
 *
 * @public
 */
export interface OpenSearchAuthProvider {
  /**
   * Returns the headers to include in the next request to OpenSearch.
   */
  getAuthHeaders(): Promise<Record<string, string>>;
}

/**
 * Extension point for providing custom authentication to the OpenSearch search
 * engine.
 *
 * @remarks
 *
 * A provider set here takes precedence over static authentication configured
 * in `app-config.yaml`. It is not used by the `aws` provider, which signs
 * requests with AWS SigV4 instead.
 *
 * @example
 *
 * ```ts
 * import { createBackendModule } from '@backstage/backend-plugin-api';
 * import { opensearchAuthExtensionPoint } from '@backstage/plugin-search-backend-module-opensearch';
 *
 * export default createBackendModule({
 *   pluginId: 'search',
 *   moduleId: 'opensearch-custom-auth',
 *   register(env) {
 *     env.registerInit({
 *       deps: {
 *         opensearchAuth: opensearchAuthExtensionPoint,
 *       },
 *       async init({ opensearchAuth }) {
 *         opensearchAuth.setAuthProvider({
 *           async getAuthHeaders() {
 *             const token = await myTokenService.getToken();
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
export interface OpenSearchAuthExtensionPoint {
  /**
   * Sets the authentication provider. This method may only be called once.
   */
  setAuthProvider(provider: OpenSearchAuthProvider): void;
}

/**
 * Extension point used to customize OpenSearch authentication.
 *
 * @public
 */
export const opensearchAuthExtensionPoint =
  createExtensionPoint<OpenSearchAuthExtensionPoint>({
    id: 'search.opensearchEngine.auth',
  });
