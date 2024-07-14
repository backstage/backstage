/* eslint-disable no-console */
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
import { ParsedTemplateSchema } from '../../hooks';

export function isJsonObject(value?: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function processEntry(
  key: string,
  value: JsonValue | undefined,
  schema: ParsedTemplateSchema,
  formState: JsonObject,
): [string, JsonValue | undefined][] {
  const parsedSchema = new JSONSchema(schema.mergedSchema);
  const definitionInSchema = parsedSchema.getSchema({
    pointer: `#/${key}`,
    data: formState,
  });

  if (definitionInSchema) {
    const backstageReviewOptions = definitionInSchema['ui:backstage']?.review;
    if (backstageReviewOptions) {
      if (backstageReviewOptions.mask) {
        return [[getLastKey(key), backstageReviewOptions.mask]];
      }
      if (backstageReviewOptions.show === false) {
        return [];
      }
    }

    if (isJsonObject(value)) {
      // Process nested objects
      return Object.entries(value).flatMap(([nestedKey, nestedValue]) =>
        processEntry(`${key}/${nestedKey}`, nestedValue, schema, formState),
      );
    }

    if (definitionInSchema['ui:widget'] === 'password') {
      return [[getLastKey(key), '******']];
    }

    if (definitionInSchema.enum && definitionInSchema.enumNames) {
      return [
        [
          getLastKey(key),
          definitionInSchema.enumNames[
            definitionInSchema.enum.indexOf(value)
          ] || value,
        ],
      ];
    }
  }

  return [[getLastKey(key), value]];
}

// Helper function to get the last part of the key
function getLastKey(key: string): string {
  const parts = key.split('/');
  return parts[parts.length - 1];
}
