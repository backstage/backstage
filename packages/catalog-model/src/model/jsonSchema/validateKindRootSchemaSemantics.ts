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

import { InputError } from '@backstage/errors';
import { JsonObject, JsonValue } from '@backstage/types';
import { isJsonObject, isJsonObjectDeep } from './util';

const FORBIDDEN_SCHEMA_ROOT_FIELDS = [
  'kind',
  'apiVersion',
  'metadata',
  '$ref',
] as const;
const FORBIDDEN_SCHEMA_STRUCTURAL_FIELDS = [
  'allOf',
  'oneOf',
  'anyOf',
  'if',
  'else',
  'then',
  'not',
  '$ref',
] as const;

/**
 * When declaring the JSON schema model for a kind, this is the type that you
 * should abide by.
 *
 * @alpha
 * @remarks
 *
 * It forbids some patterns that would make the schema hard or impossible to
 * inspect / merge properly.
 */
export interface CatalogModelKindRootSchema extends JsonObject {
  type: 'object';

  // NOTE: These should match the FORBIDDEN_SCHEMA_STRUCTURAL_FIELDS list above
  allOf?: never;
  anyOf?: never;
  oneOf?: never;
  if?: never;
  then?: never;
  else?: never;
  not?: never;
  $ref?: never;

  properties?:
    | undefined
    | {
        // NOTE: These should match the FORBIDDEN_SCHEMA_ROOT_FIELDS list above
        kind?: never;
        apiVersion?: never;
        metadata?: never;
        $ref?: never;

        [key: string]:
          | undefined
          | {
              // NOTE: These should match the FORBIDDEN_SCHEMA_STRUCTURAL_FIELDS list above
              allOf?: never;
              anyOf?: never;
              oneOf?: never;
              if?: never;
              then?: never;
              else?: never;
              not?: never;
              $ref?: never;

              [key: string]: JsonValue | undefined;
            };
      };

  [key: string]: JsonValue | undefined;
}

/**
 * Validates that the semantics of a schema describing a kind follows semantic
 * rules.
 *
 * @remarks
 *
 * It's expected that the input is a valid JSON Schema, as in having been
 * validated by `validateMetaSchema` already.
 *
 * The schema must not try to explicitly declare certain readonly root fields,
 * and neither the root nor the top level keys of fields may use certain
 * structural keywords that makes the schema hard or impossible to inspect /
 * merge properly.
 *
 * @param schema - The schema to validate.
 */
export function validateKindRootSchemaSemantics(
  schema: unknown,
): schema is CatalogModelKindRootSchema {
  if (!isJsonObjectDeep(schema)) {
    throw new InputError('Schema must be an object');
  }

  for (const field of FORBIDDEN_SCHEMA_STRUCTURAL_FIELDS) {
    if (field in schema) {
      throw new InputError(
        `Schema must not use "${field}" keyword in the root`,
      );
    }
  }

  const rootProperties = schema.properties;
  if (!isJsonObject(rootProperties)) {
    throw new InputError(
      'Schema must have a "properties" field that is an object',
    );
  }

  for (const field of FORBIDDEN_SCHEMA_ROOT_FIELDS) {
    if (field in rootProperties) {
      throw new InputError(
        `Schema must not try to declare the reserved root field "${field}"`,
      );
    }
  }

  for (const [fieldName, fieldSchema] of Object.entries(rootProperties)) {
    if (!isJsonObject(fieldSchema)) {
      throw new InputError(
        `Schema for root field "${fieldName}" must be an object`,
      );
    }
    for (const field of FORBIDDEN_SCHEMA_STRUCTURAL_FIELDS) {
      if (field in fieldSchema) {
        throw new InputError(
          `Schema for root field "${fieldName}" must not use "${field}" keyword`,
        );
      }
    }
  }

  return true;
}
