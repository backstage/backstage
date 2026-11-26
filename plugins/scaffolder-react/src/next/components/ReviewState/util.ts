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

/**
 * Escapes a property name for use as a segment in a JSON Pointer, as required
 * by RFC 6901 (`~` becomes `~0`, `/` becomes `~1`). The segment is also
 * percent-encoded since the pointers are resolved in URI fragment identifier
 * representation (`#/...`), which URI-decodes each segment before matching it
 * to a property name.
 */
export function escapeJsonPointerSegment(segment: string): string {
  return encodeURIComponent(segment.replace(/~/g, '~0').replace(/\//g, '~1'));
}

// Inverts escapeJsonPointerSegment so a pointer path can be humanized.
// Segments that are not percent-encoded (e.g. raw keys from external callers)
// are used as-is.
function unescapeJsonPointerSegment(segment: string): string {
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    // not percent-encoded
  }
  return decoded.replace(/~1/g, '/').replace(/~0/g, '~');
}

// Helper function to format a JSON Pointer path into a human-readable string
export function formatKey(key: string): string {
  const parts = key.split('/');
  return parts
    .filter(Boolean)
    .map(part => startCase(unescapeJsonPointerSegment(part)))
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
      pointer: `#/${escapeJsonPointerSegment(key)}`,
      data,
    });

    if (!!res) {
      return step;
    }
  }

  return null; // Return null if the key isn't found in any schema
}
