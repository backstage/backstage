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

import {
  CompoundEntityRef,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  EntityPresentationApi,
  EntityRefPresentationSnapshot,
} from './EntityPresentationApi';
import { defaultEntityPresentation } from './defaultEntityPresentation';

/**
 * Returns a synchronous presentation snapshot for an entity in non-React
 * contexts.
 *
 * @remarks
 *
 * This is the synchronous, non-React counterpart to
 * {@link useEntityPresentation}. It handles `Entity`, `CompoundEntityRef`,
 * and string ref inputs uniformly, using the provided
 * {@link EntityPresentationApi} when available and falling back to
 * {@link defaultEntityPresentation} otherwise.
 *
 * Because this function is synchronous, it uses cached data from the
 * presentation API (via `.snapshot`). If the entity has been seen before,
 * the snapshot will contain the full resolved title; otherwise it falls
 * back to what can be extracted from the ref alone. This is the correct
 * trade-off for sort comparators, column factories, filter callbacks, and
 * data mappers where a synchronous return value is required.
 *
 * In async contexts such as data loaders where you can `await`, prefer
 * using the {@link EntityPresentationApi} directly via
 * `forEntity().promise` for the richest possible presentation.
 *
 * @public
 * @param entityOrRef - An entity, a compound entity ref, or a string entity ref.
 * @param context - Optional context that may affect the presentation.
 * @param entityPresentationApi - Optional presentation API instance. When not
 *   provided, falls back to {@link defaultEntityPresentation}.
 */
export function entityPresentationSnapshot(
  entityOrRef: Entity | CompoundEntityRef | string,
  context?: { defaultKind?: string; defaultNamespace?: string },
  entityPresentationApi?: EntityPresentationApi,
): EntityRefPresentationSnapshot {
  if (entityPresentationApi) {
    const ref =
      typeof entityOrRef === 'string' || 'metadata' in entityOrRef
        ? entityOrRef
        : stringifyEntityRef(entityOrRef);
    return entityPresentationApi.forEntity(ref, context).snapshot;
  }
  return defaultEntityPresentation(entityOrRef, context);
}
