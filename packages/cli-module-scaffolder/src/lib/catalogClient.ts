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

import { CatalogClient } from '@backstage/catalog-client';

/**
 * Creates a {@link @backstage/catalog-client#CatalogClient} that talks
 * directly to the catalog plugin's REST API of the given Backstage instance.
 * Templates are catalog entities, so template listing goes through the
 * catalog's own API rather than the scaffolder's.
 */
export function createCatalogClient(baseUrl: string): CatalogClient {
  return new CatalogClient({
    discoveryApi: {
      async getBaseUrl(pluginId: string) {
        return new URL(`/api/${pluginId}`, baseUrl).toString();
      },
    },
  });
}
