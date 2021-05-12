/*
 * Copyright 2020 Spotify AB
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

import { useApi, configApiRef } from '@backstage/core-api';

export type CatalogConfig = {
  apiMenu: boolean;
};

const DEFAULT_CATALOG_CONFIG: CatalogConfig = {
  apiMenu: true,
};

export function useCatalogConfig(): CatalogConfig {
  const config = useApi(configApiRef);
  const catalogConfig = config.getOptionalConfig('app.catalog');

  if (!catalogConfig) {
    return DEFAULT_CATALOG_CONFIG;
  }

  return {
    apiMenu: catalogConfig?.getBoolean('apiMenu'),
  };
}
