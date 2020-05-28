/*
 * Copyright 2020 Spotify AB
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

import type { Entity } from '@backstage/catalog-model';
import type { DbEntitiesSearchRow } from './types';

// Search entries that start with these prefixes, also get a shorthand without
// that prefix
const SHORTHAND_KEY_PREFIXES = [
  'metadata.',
  'metadata.labels.',
  'metadata.annotations.',
  'spec.',
];

// These are exluded in the generic loop, either because they do not make sense
// to index, or because they are special-case always inserted whether they are
// null or not
const SPECIAL_KEYS = [
  'metadata.name',
  'metadata.namespace',
  'metadata.uid',
  'metadata.etag',
  'metadata.generation',
];

function toValue(current: any): string | null {
  if (current === undefined || current === null) {
    return null;
  }

  return String(current);
}

// Helper for iterating through a nested structure and outputting a list of
// path->value entries.
//
// For example, this yaml structure
//
// a: 1
// b:
//   c: null
//   e: [f, g]
// h:
//  - i: 1
//    j: k
//  - i: 2
//    j: l
//
// will result in
//
// "a", "1"
// "b.c", null
// "b.e": "f"
// "b.e": "g"
// "h.i": "1"
// "h.j": "k"
// "h.i": "2"
// "h.j": "l"
export function visitEntityPart(
  entityId: string,
  path: string,
  current: any,
  output: DbEntitiesSearchRow[],
) {
  // ignored
  if (SPECIAL_KEYS.includes(path)) {
    return;
  }

  // empty or scalar
  if (
    current === undefined ||
    current === null ||
    ['string', 'number', 'boolean'].includes(typeof current)
  ) {
    output.push({ entity_id: entityId, key: path, value: toValue(current) });
    return;
  }

  // unknown
  if (typeof current !== 'object') {
    return;
  }

  // array
  if (Array.isArray(current)) {
    for (const item of current) {
      visitEntityPart(entityId, path, item, output);
    }
    return;
  }

  // object
  for (const [key, value] of Object.entries(current)) {
    visitEntityPart(entityId, path ? `${path}.${key}` : key, value, output);
  }
}

/**
 * Generates all of the search rows that are relevant for this entity.
 *
 * @param entityId The uid of the entity
 * @param entity The entity
 * @returns A list of entity search rows
 */
export function buildEntitySearch(
  entityId: string,
  entity: Entity,
): DbEntitiesSearchRow[] {
  // Start with some special keys that are always present because you want to
  // be able to easily search for null specifically
  const result: DbEntitiesSearchRow[] = [
    {
      entity_id: entityId,
      key: 'metadata.name',
      value: toValue(entity.metadata.name),
    },
    {
      entity_id: entityId,
      key: 'metadata.namespace',
      value: toValue(entity.metadata.namespace),
    },
    {
      entity_id: entityId,
      key: 'metadata.uid',
      value: toValue(entity.metadata.uid),
    },
  ];

  // Visit the entire structure recursively
  visitEntityPart(entityId, '', entity, result);

  // Generate shorthands for fields directly under some common collections
  for (const row of result.slice()) {
    for (const stripPrefix of SHORTHAND_KEY_PREFIXES) {
      if (row.key.startsWith(stripPrefix)) {
        result.push({ ...row, key: row.key.substr(stripPrefix.length) });
      }
    }
  }

  return result;
}
