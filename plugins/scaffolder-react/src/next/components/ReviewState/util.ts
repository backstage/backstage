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

import { JsonObject, JsonValue } from '@backstage/types';
import { startCase } from 'lodash';
import { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';
import { Draft07 as JSONSchema } from 'json-schema-library';

export function isJsonObject(value?: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Helper function to format a key into a human-readable string
export function formatKey(key: string): string {
  const parts = key.split('/');
  return parts
    .filter(Boolean)
    .map(part => startCase(part))
    .join(' > ');
}

export function findSchemaForKey(
  key: string,
  schemas: ParsedTemplateSchema[],
  formState: Partial<{ [key: string]: JsonValue }>,
): ParsedTemplateSchema | null {
  for (const step of schemas) {
    /*
      To determine if a key is defined in a schema we need to call getSchema
      with an empty form state. Otherwise, it will never return undefined as it
      will fallback to a default schema based on the form state. 

      An exception to this is when your schema is dynamic i.e. using dependencies 
      because the form state is required for generating the schema. In this case,
      we add only the dependencies data to the getSchema call.
    */

    const schema = step.mergedSchema;

    // Declare data to be a subset of formState
    const data: typeof formState = {};

    if (schema.dependencies && isJsonObject(schema.dependencies)) {
      for (const dep in schema.dependencies) {
        if (formState.hasOwnProperty(dep)) {
          data[dep] = formState[dep]; // Add each dependency key from formState
        }
      }
    }

    const draft = new JSONSchema(schema);
    const res = draft.getSchema({
      pointer: `#/${key}`,
      data,
    });

    if (!!res) {
      return step;
    }
  }

  return null; // Return null if the key isn't found in any schema
}
