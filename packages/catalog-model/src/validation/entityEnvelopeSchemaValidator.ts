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

import { EntityEnvelope } from '../entity/EntityEnvelope';
import entityEnvelopeSchema from '../schema/EntityEnvelope.schema.json';
import { compileSchema, throwSchemaError } from './compileSchema';
import { cfworkerSchemaEngine } from './engine/cfworkerSchemaEngine';
import { SchemaEngine } from './engine/types';

/**
 * Creates a validation function that takes some arbitrary data, and either
 * returns that data cast to an {@link EntityEnvelope} (or the given subtype)
 * if it matches that schema, or throws a {@link globals#TypeError} describing the
 * errors.
 *
 * @remarks
 *
 * Note that this validator is only meant for applying the base schema checks;
 * it does not take custom policies or additional processor based validation
 * into account.
 *
 * By default, the plain `EntityEnvelope` schema is used. If you pass in your
 * own, it may contain `$ref` references to the following, which are resolved
 * automatically for you:
 *
 * - {@link EntityEnvelope}
 * - {@link Entity}
 * - {@link EntityMeta}
 * - `common#<id>`
 *
 * See also {@link https://github.com/backstage/backstage/tree/master/packages/catalog-model/src/schema}
 *
 * @public
 *
 */
export function entityEnvelopeSchemaValidator<
  T extends EntityEnvelope = EntityEnvelope,
>(schema?: unknown): (data: unknown) => T {
  return createEntityEnvelopeSchemaValidator<T>(cfworkerSchemaEngine, schema);
}

export function createEntityEnvelopeSchemaValidator<
  T extends EntityEnvelope = EntityEnvelope,
>(engine: SchemaEngine, schema?: unknown): (data: unknown) => T {
  const validate = compileSchema(
    engine,
    schema ? (schema as object) : entityEnvelopeSchema,
  );

  return data => {
    const errors = validate(data);
    if (!errors) {
      return data as T;
    }

    throw throwSchemaError(errors);
  };
}
