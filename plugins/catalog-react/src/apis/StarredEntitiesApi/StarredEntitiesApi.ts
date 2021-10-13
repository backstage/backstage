/*
 * Copyright 2021 The Backstage Authors
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

import { ApiRef, createApiRef, Observable } from '@backstage/core-plugin-api';

/**
 * An API to store starred entities
 *
 * @public
 */
export const starredEntitiesApiRef: ApiRef<StarredEntitiesApi> = createApiRef({
  id: 'catalog-react.starred-entities',
});

/**
 * An API to store and retrieve starred entities
 *
 * @public
 */
export interface StarredEntitiesApi {
  /**
   * Toggle the star state of the entity
   *
   * @param entityRef - an entity reference to toggle
   */
  toggleStarred(entityRef: string): Promise<void>;

  /**
   * Observe the set of starred entity references.
   */
  starredEntitie$(): Observable<Set<string>>;
}
