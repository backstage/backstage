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

import { type SchemaObject } from 'ajv';
import { isJsonObject } from './util';
import { InputError } from '@backstage/errors';
import { getAjv } from './getAjv';

/**
 * Validates that the schema is valid according to known JSON Schema meta
 * schemas - does not perform any semantic validation beyond that.
 */
export function validateMetaSchema(schema: unknown): schema is SchemaObject {
  if (!isJsonObject(schema) || typeof schema.then === 'function') {
    throw new InputError('Invalid JSON schema: must be an object');
  }

  const ajv = getAjv();
  try {
    const result = ajv.validateSchema(schema);
    if (typeof result !== 'boolean') {
      // Should not happen; the function is expected to return a promise only
      // for async schemas, but since that's not enforced at the typescript
      // level we add the extra check just to be sure
      throw new InputError('Expected synchronous validation result');
    }
  } catch (error) {
    throw new InputError(`Invalid JSON schema: ${error}`);
  }

  // The full set of errors is typically too complex to report; just pick the
  // first one.
  const error = ajv.errors?.[0];
  if (error) {
    let message = error.message;
    if (Array.isArray(error?.params?.allowedValues)) {
      message += `, expected one of: ${error.params.allowedValues.join(', ')}`;
    }
    throw new InputError(
      `Invalid JSON schema, error at path ${error.instancePath}: ${message}`,
    );
  }

  return true;
}
