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

import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { ScaffolderAction, ScaffolderActionContext } from './types';

/** @public */
export type ScaffolderExample = {
  description: string;
  example: string;
};

/** @public */
export type ScaffolderActionOptions<
  TInputParams extends JsonObject,
  TOutputParams extends JsonObject,
  TInputSchema extends Schema | z.ZodType,
  TOutputSchema extends Schema | z.ZodType,
  TActionInput extends JsonObject = TInputSchema extends z.ZodType<
    any,
    any,
    infer IReturn
  >
    ? IReturn
    : TInputParams,
  TActionOutput extends JsonObject = TOutputSchema extends z.ZodType<
    any,
    any,
    infer IReturn
  >
    ? IReturn
    : TOutputParams,
> = {
  id: string;
  description?: string;
  examples?: ScaffolderExample[];
  supportsDryRun?: boolean;
  schema?: {
    input?: TInputSchema;
    output?: TOutputSchema;
  };
  handler: (
    ctx: ScaffolderActionContext<TActionInput, TActionOutput>,
  ) => Promise<void>;
};

function isZod(schema?: Schema | z.ZodType): schema is z.ZodType {
  return !!(schema && 'safeParseAsync' in schema);
}

/**
 * This function is used to create new template actions to get type safety.
 * Will convert zod schemas to json schemas for use throughout the system.
 * @public
 */
export const createScaffolderAction = <
  TInputParams extends JsonObject = JsonObject,
  TOutputParams extends JsonObject = JsonObject,
  TInputSchema extends Schema | z.ZodType = {},
  TOutputSchema extends Schema | z.ZodType = {},
  TActionInput extends JsonObject = TInputSchema extends z.ZodType<
    any,
    any,
    infer IReturn
  >
    ? IReturn
    : TInputParams,
  TActionOutput extends JsonObject = TOutputSchema extends z.ZodType<
    any,
    any,
    infer IReturn
  >
    ? IReturn
    : TOutputParams,
>(
  action: ScaffolderActionOptions<
    TInputParams,
    TOutputParams,
    TInputSchema,
    TOutputSchema,
    TActionInput,
    TActionOutput
  >,
): ScaffolderAction<TActionInput, TActionOutput> => {
  const inputSchema = isZod(action.schema?.input)
    ? (zodToJsonSchema(action.schema.input) as Schema)
    : action.schema?.input;

  const outputSchema = isZod(action.schema?.output)
    ? (zodToJsonSchema(action.schema.output) as Schema)
    : action.schema?.output;

  return {
    ...action,
    schema: {
      ...action.schema,
      input: inputSchema,
      output: outputSchema,
    },
  };
};
