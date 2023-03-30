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

import { BackstageEvent } from '@backstage/backend-common';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';

export function createInsertEvent(entity: Entity): BackstageEvent;
export function createInsertEvent(entityRef: string): BackstageEvent;
export function createInsertEvent(
  entityOrRef: Entity | string,
): BackstageEvent {
  const entityRef =
    typeof entityOrRef === 'string'
      ? entityOrRef
      : stringifyEntityRef(entityOrRef);

  return {
    topic: 'backstage',
    eventPayload: {
      type: 'catalog.entity.insert',
    },
    originatingEntityRef: entityRef,
  };
}

export function createUpdateEvent(entity: Entity): BackstageEvent;
export function createUpdateEvent(entityRef: string): BackstageEvent;
export function createUpdateEvent(
  entityOrRef: Entity | string,
): BackstageEvent {
  const entityRef =
    typeof entityOrRef === 'string'
      ? entityOrRef
      : stringifyEntityRef(entityOrRef);

  return {
    topic: 'backstage',
    eventPayload: {
      type: 'catalog.entity.update',
    },
    originatingEntityRef: entityRef,
  };
}

export function createDeleteEvent(entity: Entity): BackstageEvent;
export function createDeleteEvent(entityRef: string): BackstageEvent;
export function createDeleteEvent(
  entityOrRef: Entity | string,
): BackstageEvent {
  const entityRef =
    typeof entityOrRef === 'string'
      ? entityOrRef
      : stringifyEntityRef(entityOrRef);

  return {
    topic: 'backstage',
    eventPayload: {
      type: 'catalog.entity.delete',
    },
    originatingEntityRef: entityRef,
  };
}
