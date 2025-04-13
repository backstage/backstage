/*
 * Copyright 2020 The Backstage Authors
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

import { DEFAULT_NAMESPACE, Entity } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import { DbSearchRow } from '../../tables';

// These are excluded in the generic loop, either because they do not make sense
// to index, or because they are special-case always inserted whether they are
// null or not
const SPECIAL_KEYS = [
  'attachments',
  'relations',
  'status',
  'metadata.name',
  'metadata.namespace',
  'metadata.uid',
  'metadata.etag',
];

// The maximum length allowed for search values. These columns are indexed, and
// database engines do not like to index on massive values. For example,
// postgres will balk after 8191 byte line sizes.
const MAX_KEY_LENGTH = 200;
const MAX_VALUE_LENGTH = 200;

type Kv = {
  key: string;
  value: unknown;
};

// Helper for traversing through a nested structure and outputting a list of
// path->value entries of the leaves.
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
// "a", 1
// "b.c", null
// "b.e": "f"
// "b.e.f": true
// "b.e": "g"
// "b.e.g": true
// "h.i": 1
// "h.j": "k"
// "h.i": 2
// "h.j": "l"
export function traverse(root: unknown): Kv[] {
  const output: Kv[] = [];

  function visit(path: string, current: unknown) {
    if (SPECIAL_KEYS.includes(path)) {
      return;
    }

    // empty or scalar
    if (
      current === undefined ||
      current === null ||
      ['string', 'number', 'boolean'].includes(typeof current)
    ) {
      output.push({ key: path, value: current });
      return;
    }

    // unknown
    if (typeof current !== 'object') {
      return;
    }

    // array
    if (Array.isArray(current)) {
      for (const item of current) {
        // NOTE(freben): The reason that these are output in two different ways,
        // is to support use cases where you want to express that MORE than one
        // tag is present in a list. Since the EntityFilters structure is a
        // record, you can't have several entries of the same key. Therefore
        // you will have to match on
        //
        // { "a.b": ["true"], "a.c": ["true"] }
        //
        // rather than
        //
        // { "a": ["b", "c"] }
        //
        // because the latter means EITHER b or c has to be present.
        visit(path, item);
        if (typeof item === 'string') {
          const pathKey = `${path}.${item}`;
          if (
            !output.some(
              kv =>
                kv.key.toLocaleLowerCase('en-US') ===
                pathKey.toLocaleLowerCase('en-US'),
            )
          ) {
            output.push({ key: pathKey, value: true });
          }
        }
      }
      return;
    }

    // object
    for (const [key, value] of Object.entries(current!)) {
      visit(path ? `${path}.${key}` : key, value);
    }
  }

  visit('', root);

  return output;
}

// Translates a number of raw data rows to search table rows
export function mapToRows(input: Kv[], entityId: string): DbSearchRow[] {
  const result: DbSearchRow[] = [];

  for (const { key: rawKey, value: rawValue } of input) {
    const key = rawKey.toLocaleLowerCase('en-US');
    if (key.length > MAX_KEY_LENGTH) {
      continue;
    }
    if (rawValue === undefined || rawValue === null) {
      result.push({
        entity_id: entityId,
        key,
        original_value: null,
        value: null,
      });
    } else {
      const value = String(rawValue).toLocaleLowerCase('en-US');
      if (value.length <= MAX_VALUE_LENGTH) {
        result.push({
          entity_id: entityId,
          key,
          original_value: String(rawValue),
          value: value,
        });
      } else {
        result.push({
          entity_id: entityId,
          key,
          original_value: null,
          value: null,
        });
      }
    }
  }

  return result;
}

/**
 * Generates all of the search rows that are relevant for this entity.
 *
 * @param entityId - The uid of the entity
 * @param entity - The entity
 * @returns A list of entity search rows
 */
export function buildEntitySearch(
  entityId: string,
  entity: Entity,
): DbSearchRow[] {
  // Visit the base structure recursively
  const raw = traverse(entity);

  // Start with some special keys that are always present because you want to
  // be able to easily search for null specifically
  raw.push({ key: 'metadata.name', value: entity.metadata.name });
  raw.push({ key: 'metadata.namespace', value: entity.metadata.namespace });
  raw.push({ key: 'metadata.uid', value: entity.metadata.uid });

  // Namespace not specified has the default value "default", so we want to
  // match on that as well
  if (!entity.metadata.namespace) {
    raw.push({ key: 'metadata.namespace', value: DEFAULT_NAMESPACE });
  }

  // Visit relations
  for (const relation of entity.relations ?? []) {
    raw.push({
      key: `relations.${relation.type}`,
      value: relation.targetRef,
    });
  }

  // This validates that there are no keys that vary only in casing, such
  // as `spec.foo` and `spec.Foo`.
  const keys = new Set(raw.map(r => r.key));
  const lowerKeys = new Set(raw.map(r => r.key.toLocaleLowerCase('en-US')));
  if (keys.size !== lowerKeys.size) {
    const difference = [];
    for (const key of keys) {
      const lower = key.toLocaleLowerCase('en-US');
      if (!lowerKeys.delete(lower)) {
        difference.push(lower);
      }
    }
    const badKeys = `'${difference.join("', '")}'`;
    throw new InputError(
      `Entity has duplicate keys that vary only in casing, ${badKeys}`,
    );
  }

  return mapToRows(raw, entityId);
}
