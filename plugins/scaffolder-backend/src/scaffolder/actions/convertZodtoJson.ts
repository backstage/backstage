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
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { Schema } from 'jsonschema';

interface TemplateActionSchema {
  readonly schema: {
    input?: Schema;
    output?: Schema;
  };
}

/** @public */
export function convertZodtoJson<
  TInputSchema extends z.ZodType = z.ZodType<any, any, {}>,
  TOutputSchema extends z.ZodType = z.ZodType<any, any, {}>,
>(
  zodInputSchema?: TInputSchema,
  zodOutputSchema?: TOutputSchema,
): TemplateActionSchema {
  return {
    schema: {
      input: zodInputSchema ? zodToJsonSchema(zodInputSchema) : undefined,
      output: zodOutputSchema ? zodToJsonSchema(zodOutputSchema) : undefined,
    },
  };
}
