/*
 * Copyright 2024 The Backstage Authors
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
import { performance } from 'node:perf_hooks';
import { setImmediate } from 'node:timers/promises';
import { EntitiesResponseItems } from '../../catalog/types';

// Bound consecutive projection work, not the page size. A single entity can
// still take longer than this, since its JSON parsing and serialization are synchronous.
const PROJECTION_TIME_SLICE_MS = 3;

/**
 * Keeps full entities serialized, and projects requested fields in bounded work
 * slices. Serialization finishes before returning the page, so response writers
 * can stream it without repeating the JSON work or encountering projection errors.
 */
export async function processRawEntitiesResult(
  serializedEntities: (string | null)[],
  transform?: (entity: Entity) => Entity,
): Promise<EntitiesResponseItems> {
  if (transform) {
    const entities: (string | null)[] = [];
    let sliceStart = performance.now();

    for (const [index, entity] of serializedEntities.entries()) {
      // Serialize individually so response writers can use the raw path rather
      // than synchronously serializing the entire projected page again.
      entities.push(
        entity === null ? null : JSON.stringify(transform(JSON.parse(entity))),
      );

      if (
        index + 1 < serializedEntities.length &&
        performance.now() - sliceStart >= PROJECTION_TIME_SLICE_MS
      ) {
        // A resolved promise only yields to microtasks, not other requests.
        await setImmediate();
        sliceStart = performance.now();
      }
    }

    return {
      type: 'raw',
      entities,
    };
  }

  return {
    type: 'raw',
    entities: serializedEntities,
  };
}

export function entitiesResponseToObjects(
  response: EntitiesResponseItems,
): (Entity | null)[] {
  if (response.type === 'object') {
    return response.entities;
  }
  return response.entities.map(e => (e !== null ? JSON.parse(e) : e));
}
