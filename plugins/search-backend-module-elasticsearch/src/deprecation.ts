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

import type { LoggerService } from '@backstage/backend-plugin-api';

let hasWarned = false;

/**
 * Logs a single migration warning for the OpenSearch providers that remain in
 * the Elasticsearch module for backwards compatibility.
 *
 * @internal
 */
export function warnLegacyOpenSearchProvider(
  logger: LoggerService,
  provider: 'opensearch' | 'aws',
): void {
  if (hasWarned) {
    return;
  }
  hasWarned = true;
  logger.warn(
    `The '${provider}' provider of @backstage/plugin-search-backend-module-elasticsearch is deprecated. ` +
      'OpenSearch is now provided by @backstage/plugin-search-backend-module-opensearch. ' +
      'Move your configuration from search.elasticsearch to search.opensearch when you migrate. ' +
      'The legacy provider continues to work until it is removed in a future release.',
  );
}
