/*
 * Copyright 2023 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import {
  ApiRef,
  IconComponent,
  createApiRef,
} from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';

/**
 * An API that handles how to represent entities in the interface.
 *
 * @public
 */
export const entityPresentationApiRef: ApiRef<EntityPresentationApi> =
  createApiRef({
    id: 'catalog-react.entity-presentation',
  });

/**
 * The visual presentation of an entity reference at some point in time.
 *
 * @public
 */
export interface EntityRefPresentationSnapshot {
  entityRef: string;
  entity?: Entity | undefined;
  primaryTitle: string;
  secondaryTitle?: string;
  Icon?: IconComponent | undefined;
}

/**
 * The visual presentation of an entity reference.
 *
 * @public
 */
export interface EntityRefPresentation {
  /**
   * The representation that's suitable to use for this entity right now.
   */
  snapshot: EntityRefPresentationSnapshot;
  /**
   * Some presentation implementations support emitting updated snapshots over
   * time, for example after retrieving additional data from the catalog or
   * elsewhere.
   */
  update$?: Observable<EntityRefPresentationSnapshot>;
}

/**
 * An API that decides how to visually represent entities in the interface.
 *
 * @remarks
 *
 * Most consumers will want to use the {@link useEntityPresentation} hook
 * instead of this interface directly.
 *
 * @public
 */
export interface EntityPresentationApi {
  /**
   * Fetches the presentation for an entity.
   *
   * @param entityOrRef - Either an entity, or a string ref to it. If you pass
   *   in an entity, it is assumed that it is not a partial one - i.e. only pass
   *   in an entity if you know that it was fetched in such a way that it
   *   contains all of the fields that the representation renderer needs.
   * @param context - Contextual information that may affect the presentation.
   */
  forEntity(
    entityOrRef: Entity | string,
    context?: {
      defaultKind?: string;
      defaultNamespace?: string;
    },
  ): EntityRefPresentation;
}
