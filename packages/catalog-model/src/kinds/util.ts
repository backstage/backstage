/*
 * Copyright 2020 Spotify AB
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

import Ajv, { AnySchema } from 'ajv';
import * as yup from 'yup';
import { KindValidator } from './types';

/**
 * @deprecated We no longer use yup for the catalog model. This utility method will be removed.
 */
export function schemaValidator(
  kind: string,
  apiVersion: readonly string[],
  schema: yup.Schema<any>,
): KindValidator {
  return {
    async check(envelope) {
      if (kind !== envelope.kind || !apiVersion.includes(envelope.apiVersion)) {
        return false;
      }
      await schema.validate(envelope, { strict: true });
      return true;
    },
  };
}

export function ajvCompiledJsonSchemaValidator(
  kind: string,
  apiVersion: readonly string[],
  schema: AnySchema,
  extraSchemas?: AnySchema[],
): KindValidator {
  const ajv = new Ajv({ allowUnionTypes: true });
  if (extraSchemas) {
    ajv.addSchema(extraSchemas, undefined, undefined, true);
  }
  const validate = ajv.compile(schema);

  return {
    async check(envelope) {
      if (kind !== envelope.kind || !apiVersion.includes(envelope.apiVersion)) {
        return false;
      }

      const result = validate(envelope);
      if (result === true) {
        return true;
      }

      const [error] = validate.errors || [];
      if (!error) {
        throw new TypeError(`Malformed ${kind}, Unknown error`);
      }

      throw new TypeError(
        `Malformed ${kind}, ${error.dataPath || '<root>'} ${error.message}`,
      );
    },
  };
}
