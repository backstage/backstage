/*
 * Copyright 2022 The Backstage Authors
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

import { JsonObject, JsonValue } from '@backstage/types';
import { Draft07 as JSONSchema } from 'json-schema-library';

export function flattenObject(
  obj: JsonObject,
  prefix: string,
  schema: JSONSchema,
  formState: JsonObject,
): [string, JsonValue | undefined][] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const prefixedKey = prefix ? `${prefix}/${key}` : key;

    const definitionInSchema = schema.getSchema({
      pointer: `#/${prefixedKey}`,
      data: formState,
    });

    if (definitionInSchema) {
      const backstageReviewOptions = definitionInSchema['ui:backstage']?.review;

      // Recurse into nested objects
      if (backstageReviewOptions?.explode && isJsonObject(value)) {
        return flattenObject(value, prefixedKey, schema, formState);
      }
    }

    return [[key, value]];
  });
}

export function isJsonObject(value?: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
