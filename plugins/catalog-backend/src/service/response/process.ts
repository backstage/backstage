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

// Bound consecutive projection work, not the page size. A single batch can
// still take longer than this, since its JSON parsing and serialization are synchronous.
const PROJECTION_TIME_SLICE_MS = 5;
const PROJECTION_BATCH_SIZE = 100;
// String lengths are cheap to inspect without encoding or parsing the input.
// This limits aggregation of large entities, not the size of any single entity.
const PROJECTION_BATCH_MAX_CHARACTERS = 1_000_000;

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
    // Keep single-entity lookups on the existing raw response path.
    if (serializedEntities.length <= 1) {
      return {
        type: 'raw',
        entities: serializedEntities.map(entity =>
          entity === null
            ? null
            : JSON.stringify(transform(JSON.parse(entity))),
        ),
      };
    }

    const batches: string[] = [];
    let sliceStart = performance.now();

    let index = 0;
    while (index < serializedEntities.length) {
      const entities: (Entity | null)[] = [];
      let characters = 0;
      while (
        index < serializedEntities.length &&
        entities.length < PROJECTION_BATCH_SIZE
      ) {
        const entity = serializedEntities[index];
        const length = entity?.length ?? 0;
        if (
          entities.length > 0 &&
          characters + length > PROJECTION_BATCH_MAX_CHARACTERS
        ) {
          break;
        }
        entities.push(entity === null ? null : transform(JSON.parse(entity)));
        characters += length;
        ++index;
      }
      // One serialization per batch amortizes setup and allocation costs without
      // synchronously serializing the whole page. Writers strip the outer brackets.
      batches.push(JSON.stringify(entities));

      if (
        index < serializedEntities.length &&
        performance.now() - sliceStart >= PROJECTION_TIME_SLICE_MS
      ) {
        // A resolved promise only yields to microtasks, not other requests.
        await setImmediate();
        sliceStart = performance.now();
      }
    }

    return {
      type: 'raw-batches',
      batches,
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
  if (response.type === 'raw-batches') {
    return response.batches.flatMap(batch => JSON.parse(batch));
  }
  return response.entities.map(e => (e !== null ? JSON.parse(e) : e));
}
