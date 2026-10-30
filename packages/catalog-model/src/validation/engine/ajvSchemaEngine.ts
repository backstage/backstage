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

import Ajv, { ErrorObject } from 'ajv';
import { SchemaEngine, SchemaValidationError } from './types';

function convertErrors(
  errors: ErrorObject[] | null | undefined,
): SchemaValidationError[] {
  return (errors ?? []).map(error => ({
    instancePath: error.instancePath,
    keyword: error.keyword,
    message: error.message ?? 'Unknown error',
    params: error.params,
  }));
}

/**
 * A schema engine based on `ajv`, which compiles schemas to code. This is
 * considerably faster, but requires `unsafe-eval` in browser environments.
 */
export const ajvSchemaEngine: SchemaEngine = {
  compile({ schema, extraSchemas, allErrors }) {
    const ajv = new Ajv({
      allowUnionTypes: true,
      allErrors,
      validateSchema: true,
    });
    if (extraSchemas.length) {
      ajv.addSchema(extraSchemas, undefined, undefined, true);
    }
    const validate = ajv.compile(schema);

    return data => {
      if (validate(data) === true) {
        return undefined;
      }
      return convertErrors(validate.errors);
    };
  },
};
