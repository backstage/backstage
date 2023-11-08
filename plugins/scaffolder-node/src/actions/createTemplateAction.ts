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

import { ActionContext, TemplateAction } from './types';
import { z } from 'zod';
import { Schema } from 'jsonschema';
import zodToJsonSchema from 'zod-to-json-schema';
import { JsonObject } from '@backstage/types';

/** @public */
export type TemplateExample = {
  description: string;
  example: string;
};

/** @public */
export type TemplateActionOptions<
  TActionInput extends JsonObject = {},
  TActionOutput extends JsonObject = {},
  TInputSchema extends Schema | z.ZodType = {},
  TOutputSchema extends Schema | z.ZodType = {},
> = {
  id: string;
  description?: string;
  examples?: TemplateExample[];
  supportsDryRun?: boolean;
  schema?: {
    input?: TInputSchema;
    output?: TOutputSchema;
  };
  handler: (ctx: ActionContext<TActionInput, TActionOutput>) => Promise<void>;
};

/**
 * This function is used to create new template actions to get type safety.
 * Will convert zod schemas to json schemas for use throughout the system.
 * @public
 */
export const createTemplateAction = <
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
  action: TemplateActionOptions<
    TActionInput,
    TActionOutput,
    TInputSchema,
    TOutputSchema
  >,
): TemplateAction<TActionInput, TActionOutput> => {
  const inputSchema =
    action.schema?.input && 'safeParseAsync' in action.schema.input
      ? zodToJsonSchema(action.schema.input)
      : action.schema?.input;

  const outputSchema =
    action.schema?.output && 'safeParseAsync' in action.schema.output
      ? zodToJsonSchema(action.schema.output)
      : action.schema?.output;

  return {
    ...action,
    schema: {
      ...action.schema,
      input: inputSchema as TInputSchema,
      output: outputSchema as TOutputSchema,
    },
  };
};
