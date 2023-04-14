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

import { CatalogEvent } from '@backstage/plugin-catalog-common';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';

export function createInsertEvent(entity: Entity): CatalogEvent;
export function createInsertEvent(entityRef: string): CatalogEvent;
export function createInsertEvent(entityOrRef: Entity | string): CatalogEvent {
  const entityRef =
    typeof entityOrRef === 'string'
      ? entityOrRef
      : stringifyEntityRef(entityOrRef);

  return {
    topic: 'backstage.catalog',
    eventPayload: {
      originatingEntityRef: entityRef,
      type: 'experimental.catalog.entity.insert',
    },
  };
}

export function createUpdateEvent(entity: Entity): CatalogEvent;
export function createUpdateEvent(entityRef: string): CatalogEvent;
export function createUpdateEvent(entityOrRef: Entity | string): CatalogEvent {
  const entityRef =
    typeof entityOrRef === 'string'
      ? entityOrRef
      : stringifyEntityRef(entityOrRef);

  return {
    topic: 'backstage.catalog',
    eventPayload: {
      originatingEntityRef: entityRef,
      type: 'experimental.catalog.entity.update',
    },
  };
}

export function createDeleteEvent(entity: Entity): CatalogEvent;
export function createDeleteEvent(entityRef: string): CatalogEvent;
export function createDeleteEvent(entityOrRef: Entity | string): CatalogEvent {
  const entityRef =
    typeof entityOrRef === 'string'
      ? entityOrRef
      : stringifyEntityRef(entityOrRef);

  return {
    topic: 'backstage.catalog',
    eventPayload: {
      originatingEntityRef: entityRef,
      type: 'experimental.catalog.entity.delete',
    },
  };
}
