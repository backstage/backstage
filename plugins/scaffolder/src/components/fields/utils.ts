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
import { JSONSchema7 } from 'json-schema';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

/**
 * @public
 * Utility function to convert zod schemas to JSON schemas with
 * type inference extraction that abstracts away zod typings
 */
export function makeJsonSchemaFromZod<T extends z.ZodType>(
  schema: T,
): {
  schema: JSONSchema7;
  type: T extends z.ZodType<any, any, infer I> ? I : never;
} {
  return {
    schema: zodToJsonSchema(schema) as JSONSchema7,
    type: null as any,
  };
}
