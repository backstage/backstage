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

import { JsonObject } from '@backstage/types';
import isEqual from 'lodash/isEqual';
import { isJsonObject } from './util';

// Values under these keywords are maps of names to schemas, not schemas
// themselves. In particular, a property named "type" is not a type keyword.
const schemaMapKeywords = new Set([
  'properties',
  'patternProperties',
  'definitions',
  '$defs',
  'dependencies',
  'dependentSchemas',
]);

const schemaKeywords = new Set([
  'additionalProperties',
  'additionalItems',
  'items',
  'contains',
  'propertyNames',
  'not',
  'if',
  'then',
  'else',
  'unevaluatedProperties',
  'unevaluatedItems',
  'contentSchema',
]);

/**
 * Merges two JSON schemas into a single schema.
 *
 * @alpha
 * @remarks
 *
 * This function deep merges two JSON schemas into a new, single schema. Both
 * `source` and `target` are left unchanged.
 *
 * Properties from the `source` schema will override properties from the
 * `target` schema. The `target` schema is assumed to be a pre-validated fully
 * valid JSON Schema. The `source` schema is similar, but with one addition -
 * object fields can have the special value `null` which leads to a deletion of
 * the corresponding property in `target` if it existed. The `const` and
 * `default` keywords contain literal JSON data and are replaced as-is,
 * including literal `null` values.
 *
 * If a property `type` is defined in the `source` schema and different from the
 * one explicitly declared in the `target` schema, a full replacement happens
 * at that schema node. Property-name maps are merged without applying this
 * rule to properties named `type`. Updates that only define `description` and
 * similar keywords are merged into the existing definition if any.
 *
 * @param target - The schema to merge into (left unchanged).
 * @param source - The schema to merge from (left unchanged).
 * @returns The merged schema.
 */
export function mergeJsonSchemas(
  target: JsonObject,
  source: JsonObject,
): JsonObject {
  return mergeObjects(target, source, 'schema');
}

function mergeObjects(
  target: JsonObject,
  source: JsonObject,
  context: 'schema' | 'map' | 'data',
): JsonObject {
  const replacesType =
    context === 'schema' &&
    source.type !== undefined &&
    source.type !== null &&
    target.type !== undefined &&
    !isEqual([source.type].flat().sort(), [target.type].flat().sort());
  const result: JsonObject = replacesType ? {} : { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (context === 'schema' && (key === 'const' || key === 'default')) {
      // Literal data is not a schema patch, even when it contains nulls or
      // properties with names such as "type".
      result[key] = value;
    } else if (value === null) {
      // null means delete the property
      delete result[key];
    } else if (isJsonObject(value)) {
      let childContext: 'schema' | 'map' | 'data' = 'data';
      if (
        context === 'map' ||
        (context === 'schema' && schemaKeywords.has(key))
      ) {
        childContext = 'schema';
      } else if (context === 'schema' && schemaMapKeywords.has(key)) {
        childContext = 'map';
      }
      result[key] = mergeObjects(
        isJsonObject(result[key]) ? result[key] : {},
        value,
        childContext,
      );
    } else {
      // Scalar or array — source overrides target
      result[key] = value;
    }
  }

  return result;
}
