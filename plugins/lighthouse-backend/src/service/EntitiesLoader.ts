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

import {
  CatalogClient,
  CATALOG_FILTER_EXISTS,
} from '@backstage/catalog-client';
import { TokenManager } from '@backstage/backend-common';

export async function loadLighthouseEntities(
  catalogClient: CatalogClient,
  tokenManager: TokenManager,
) {
  const filter: Record<string, symbol | string> = {
    kind: 'Component',
    'spec.type': 'website',
    ['lighthouse.com/website-url']: CATALOG_FILTER_EXISTS,
  };

  const { token } = await tokenManager.getToken();

  return await catalogClient.getEntities(
    {
      filter: [filter],
    },
    { token },
  );
}
