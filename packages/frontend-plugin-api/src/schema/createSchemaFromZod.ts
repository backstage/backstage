/*
 * Copyright 2023 The Backstage Authors
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
import { z, ZodSchema, ZodTypeDef } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { PortableSchema } from './types';

/**
 * @internal
 */
export function createSchemaFromZod<TOutput, TInput>(
  schemaCreator: (zImpl: typeof z) => ZodSchema<TOutput, ZodTypeDef, TInput>,
): PortableSchema<TOutput, TInput> {
  const schema = schemaCreator(z);
  return {
    // TODO: Types allow z.array etc here but it will break stuff
    parse: input => {
      const result = schema.safeParse(input);
      if (result.success) {
        return result.data;
      }

      throw new Error(result.error.issues.map(formatIssue).join('; '));
    },
    // TODO: Verify why we are not compatible with the latest zodToJsonSchema.
    schema: zodToJsonSchema(schema) as JsonObject,
  };
}

function formatIssue(issue: z.ZodIssue): string {
  if (issue.code === 'invalid_union') {
    return formatIssue(issue.unionErrors[0].issues[0]);
  }
  let message = issue.message;
  if (message === 'Required') {
    message = `Missing required value`;
  }
  if (issue.path.length) {
    message += ` at '${issue.path.join('.')}'`;
  }
  return message;
}
