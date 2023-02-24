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

/** @public */
export type TemplateActionOptions<
  TActionInput = {},
  TInputSchema extends Schema | z.ZodType = {},
  TOutputSchema extends Schema | z.ZodType = {},
> = {
  id: string;
  description?: string;
  examples?: { description: string; example: string }[];
  supportsDryRun?: boolean;
  schema?: {
    input?: TInputSchema;
    output?: TOutputSchema;
  };
  handler: (ctx: ActionContext<TActionInput>) => Promise<void>;
};

/**
 * This function is used to create new template actions to get type safety.
 * Will convert zod schemas to json schemas for use throughout the system.
 * @public
 */
export const createTemplateAction = <
  TParams,
  TInputSchema extends Schema | z.ZodType = {},
  TOutputSchema extends Schema | z.ZodType = {},
  TActionInput = TInputSchema extends z.ZodType<any, any, infer IReturn>
    ? IReturn
    : TParams,
>(
  action: TemplateActionOptions<TActionInput, TInputSchema, TOutputSchema>,
): TemplateAction<TActionInput> => {
  const inputSchema =
    action.schema?.input && 'safeParseAsync' in action.schema.input
      ? zodToJsonSchema(action.schema.input)
      : action.schema?.input;

  const outputSchema =
    action.schema?.output && 'safeParseAsync' in action.schema.output
      ? zodToJsonSchema(action.schema.output)
      : action.schema?.output;

  const templateAction = {
    ...action,
    schema: {
      ...action.schema,
      input: inputSchema,
      output: outputSchema,
    },
  };

  return templateAction;
};
