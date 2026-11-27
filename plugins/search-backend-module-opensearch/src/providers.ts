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
import type { Config } from '@backstage/config';
import type { AwsCredentialProvider } from '@backstage/integration-aws-node';
import type { LoggerService } from '@backstage/backend-plugin-api';
import type { OpenSearchClientOptions } from './engines/OpenSearchClientOptions';
import type { OpenSearchAuthProvider } from './auth';

/**
 * Context given to a provider when it creates client options.
 *
 * @public
 */
export interface OpenSearchProviderContext {
  /** The `search.opensearch` configuration. */
  config: Config;
  /** Logger scoped to the search module. */
  logger: LoggerService;
  /** AWS credentials for the configured account, when available. */
  credentialProvider?: AwsCredentialProvider;
  /** Custom authentication provider, when one has been registered. */
  authProvider?: OpenSearchAuthProvider;
}

/**
 * Supplies the connection and authentication settings for an OpenSearch
 * client.
 *
 * @remarks
 *
 * Providers are selected with `search.opensearch.provider`. The module ships
 * with `default` and `aws` providers. A provider with any other id can be
 * registered through {@link opensearchProviderExtensionPoint} without changes
 * to the core module.
 *
 * @public
 */
export interface OpenSearchProvider {
  /** The id used by `search.opensearch.provider` to select this provider. */
  readonly id: string;
  /** Creates the options passed to the OpenSearch client constructor. */
  createClientOptions(
    context: OpenSearchProviderContext,
  ): Promise<OpenSearchClientOptions>;
}

/**
 * Extension point for adding OpenSearch providers.
 *
 * @remarks
 *
 * A provider can replace a built-in id, which allows adopters to customize
 * connection or authentication behavior for `default` or `aws` as well.
 *
 * @example
 *
 * ```ts
 * import { createBackendModule } from '@backstage/backend-plugin-api';
 * import { opensearchProviderExtensionPoint } from '@backstage/plugin-search-backend-module-opensearch';
 *
 * export default createBackendModule({
 *   pluginId: 'search',
 *   moduleId: 'opensearch-my-provider',
 *   register(env) {
 *     env.registerInit({
 *       deps: {
 *         opensearchProviders: opensearchProviderExtensionPoint,
 *       },
 *       async init({ opensearchProviders }) {
 *         opensearchProviders.addProvider({
 *           id: 'my-provider',
 *           async createClientOptions({ config }) {
 *             return {
 *               node: config.getString('node'),
 *               headers: { Authorization: await getToken() },
 *             };
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
export interface OpenSearchProviderExtensionPoint {
  /** Adds a provider. Adding the same id twice is an error. */
  addProvider(provider: OpenSearchProvider): void;
}

/**
 * Extension point used to add OpenSearch providers.
 *
 * @public
 */
export const opensearchProviderExtensionPoint =
  createExtensionPoint<OpenSearchProviderExtensionPoint>({
    id: 'search.opensearchEngine.provider',
  });
