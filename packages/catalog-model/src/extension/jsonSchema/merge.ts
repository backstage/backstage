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
import { isJsonObject } from './util';

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
 * the corresponding property in `target` if it existed.
 *
 * If a property `type` is defined in the `source` schema and different from the
 * one in the `target` schema, a full replacement happens at that point. But you
 * can also just define just for example `description` and similar; those just
 * get merged into the existing definition if any.
 *
 * @param target - The schema to merge into (left unchanged).
 * @param source - The schema to merge from (left unchanged).
 * @returns The merged schema.
 */
export function mergeJsonSchemas(
  target: JsonObject,
  source: JsonObject,
): JsonObject {
  // If the type field differs, the source schema fully replaces target
  if ('type' in source && source.type !== target.type) {
    return { ...source };
  }

  const result: JsonObject = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value === null) {
      // null means delete the property
      delete result[key];
    } else if (isJsonObject(value) && isJsonObject(result[key])) {
      // Both sides are objects — recurse
      result[key] = mergeJsonSchemas(result[key], value);
    } else {
      // Scalar or array — source overrides target
      result[key] = value;
    }
  }

  return result;
}
