/*
 * Copyright 2021 The Backstage Authors
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

/**
 * A type representing all allowed JSON primitive values.
 *
 * @public
 */
export type JsonPrimitive = number | string | boolean | null;

/**
 * A type representing all allowed JSON object values.
 *
 * @public
 */
export type JsonObject = { [key in string]?: JsonValue };

/**
 * A type representing all allowed JSON array values.
 *
 * @public
 */
export interface JsonArray extends Array<JsonValue> {}

/**
 * A type representing all allowed JSON values.
 *
 * @public
 */
export type JsonValue = JsonObject | JsonArray | JsonPrimitive;

/**
 * Attempts to merge two JsonObjects together. In the case of collisions, this function
 * prefers values from b, unless the value is an object, in which case it recursively
 * merges the values.
 *
 * @param a - The base object
 * @param b - The object to merge into a
 * @returns The merged object
 * @public
 */
export const mergeJson = (a: JsonObject, b: JsonObject): JsonObject => {
  const final: JsonObject = {};
  const bKeys = new Set(Object.keys(b));
  const aKeys = new Set(Object.keys(a));
  const intersectingKeys = new Set([...aKeys].filter(x => bKeys.has(x)));

  // add all mutually exclusive keys to the final object
  for (const key of aKeys.values()) {
    if (!intersectingKeys.has(key)) {
      final[key] = a[key];
      continue;
    }
  }
  for (const key of bKeys.values()) {
    if (!intersectingKeys.has(key)) {
      final[key] = b[key];
      continue;
    }
  }

  // values now are all overlapping and are either primitives, arrays, or objects.
  // for all primitives and arrays, we want to assign the value from b
  // for all objects, we want to recursively merge the values
  for (const key of intersectingKeys.values()) {
    // check if value is an array or primitive
    const value = b[key];
    if (Array.isArray(value) || typeof value !== 'object') {
      final[key] = value;
      continue;
    }

    // check if either value is undefined and default to the defined one
    const aValue = a[key];
    const bValue = b[key];
    if (!aValue) {
      final[key] = bValue;
      continue;
    }
    if (!bValue) {
      final[key] = aValue;
      continue;
    }

    // recursively merge the values
    final[key] = mergeJson(aValue as JsonObject, bValue as JsonObject);
  }
  return final;
};
