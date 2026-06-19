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
import { createApiRef } from '@backstage/core-plugin-api';

/**
 * An API to retrieve star counts for entities
 *
 * @public
 */
export interface CatalogStarsApi {
  /**
   * Get the total number of stars for a given entity reference.
   */
  getStarCount(entityRef: string): Promise<number>;
}

/**
 * ApiRef for the CatalogStarsApi
 *
 * @public
 */
export const catalogStarsApiRef = createApiRef<CatalogStarsApi>({
  id: 'catalog.stars',
});
