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
import { InputError } from '@backstage/errors';
import { validateAgainstMetaSchema } from '../../validation/engine/cfworkerSchemaEngine';
import { SchemaValidationError } from '../../validation/engine/types';

/**
 * Validates that the schema is valid according to known JSON Schema meta
 * schemas - does not perform any semantic validation beyond that.
 */
export function validateMetaSchema(schema: unknown): schema is JsonObject {
  if (!isJsonObject(schema) || typeof schema.then === 'function') {
    throw new InputError('Invalid JSON schema: must be an object');
  }

  // Only draft-07 is supported by the schema engines
  if (
    schema.$schema !== undefined &&
    !/^https?:\/\/json-schema\.org\/draft-07\/schema#?$/.test(
      String(schema.$schema),
    )
  ) {
    throw new InputError(
      `Invalid JSON schema: unsupported $schema ${JSON.stringify(
        schema.$schema,
      )}, only draft-07 is supported`,
    );
  }

  // The full set of errors is typically too complex to report; just pick the
  // first one.
  let error: SchemaValidationError | undefined;
  try {
    error = validateAgainstMetaSchema(schema);
  } catch (e) {
    throw new InputError(`Invalid JSON schema: ${e}`);
  }

  if (error) {
    throw new InputError(
      `Invalid JSON schema, error at path ${error.instancePath}: ${error.message}`,
    );
  }

  return true;
}
