/*
 * Copyright 2020 The Backstage Authors
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

import { createEntityKindSchemaValidator } from '../validation/entityKindSchemaValidator';
import { cfworkerSchemaEngine } from '../validation/engine/cfworkerSchemaEngine';
import { SchemaEngine } from '../validation/engine/types';
import { KindValidator } from './types';

// TODO(freben): Left here as a compatibility helper. It would be nicer to
// just export the inner validator directly. However, all of the already
// exported kind validators have the `KindValidator` signature which is
// different. So let's postpone that change until a later time.
// The schema is compiled on first use, so that importing a kind module does
// not cause any upfront work.
export function ajvCompiledJsonSchemaValidator(
  schema: unknown,
  engine: SchemaEngine = cfworkerSchemaEngine,
): KindValidator {
  let validator: undefined | ((data: unknown) => any);
  return {
    async check(data) {
      if (!validator) {
        validator = createEntityKindSchemaValidator(engine, schema);
      }
      return validator(data) === data;
    },
  };
}
