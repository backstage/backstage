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
    id: 'plugin.catalog.entity-presentation',
  });

/**
 * The visual presentation of an entity reference at some point in time.
 *
 * @public
 */
export interface EntityRefPresentationSnapshot {
  /**
   * The ref to the entity that this snapshot represents.
   *
   * @remarks
   *
   * Note that when the input data was broken or had missing vital pieces of
   * information, this string may contain placeholders such as "unknown". You
   * can therefore not necessarily assume that the ref is completely valid and
   * usable for example for forming a clickable link to the entity.
   */
  entityRef: string;
  /**
   * A string that can be used as a plain representation of the entity, for
   * example in a header or a link.
   *
   * @remarks
   *
   * The title may be short and not contain all of the information that the
   * entity holds. When rendering the primary title, you may also want to
   * make sure to add more contextual information nearby such as the icon or
   * secondary title, since the primary could for example just be the
   * `metadata.name` of the entity which might be ambiguous to the reader.
   */
  primaryTitle: string;
  /**
   * Optionally, some additional textual information about the entity, to be
   * used as a clarification on top of the primary title.
   *
   * @remarks
   *
   * This text can for example be rendered in a tooltip or be used as a
   * subtitle. It may not be sufficient to display on its own; it should
   * typically be used in conjunction with the primary title. It can contain
   * such information as the entity ref and/or a `spec.type` etc.
   */
  secondaryTitle?: string;
  /**
   * Optionally, an icon that represents the kind/type of entity.
   *
   * @remarks
   *
   * This icon should ideally be easily recognizable as the kind of entity, and
   * be used consistently throughout the Backstage interface. It can be rendered
   * both in larger formats such as in a header, or in smaller formats such as
   * inline with regular text, so bear in mind that the legibility should be
   * high in both cases.
   *
   * A value of `false` here indicates the desire to not have an icon present
   * for the given implementation. A value of `undefined` leaves it at the
   * discretion of the display layer to choose what to do (such as for example
   * showing a fallback icon).
   */
  Icon?: IconComponent | undefined | false;
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
  /**
   * A promise that resolves to a usable entity presentation.
   */
  promise: Promise<EntityRefPresentationSnapshot>;
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
