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
import { Expand, JsonObject } from '@backstage/types';
import { parseSchemas } from './util';

/** @public */
export type TemplateExample = {
  description: string;
  example: string;
};

/** @public */
export type TemplateActionOptions<
  TActionInput extends JsonObject = {},
  TActionOutput extends JsonObject = {},
  TInputSchema extends
    | JsonObject
    | z.ZodType
    | { [key in string]: (zImpl: typeof z) => z.ZodType } = JsonObject,
  TOutputSchema extends
    | JsonObject
    | z.ZodType
    | { [key in string]: (zImpl: typeof z) => z.ZodType } = JsonObject,
  TSchemaType extends 'v1' | 'v2' = 'v1' | 'v2',
> = {
  id: string;
  description?: string;
  examples?: TemplateExample[];
  supportsDryRun?: boolean;
  schema?: {
    input?: TInputSchema;
    output?: TOutputSchema;
  };
  handler: (
    ctx: ActionContext<TActionInput, TActionOutput, TSchemaType>,
  ) => Promise<void>;
};

/**
 * @ignore
 */
type FlattenOptionalProperties<T extends { [key in string]: unknown }> = Expand<
  {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K];
  } & {
    [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
  }
>;

/**
 * @public
 * @deprecated migrate to using the new built in zod schema definitions for schemas
 */
export function createTemplateAction<
  TInputParams extends JsonObject = JsonObject,
  TOutputParams extends JsonObject = JsonObject,
  TInputSchema extends JsonObject = JsonObject,
  TOutputSchema extends JsonObject = JsonObject,
  TActionInput extends JsonObject = TInputParams,
  TActionOutput extends JsonObject = TOutputParams,
>(
  action: TemplateActionOptions<
    TActionInput,
    TActionOutput,
    TInputSchema,
    TOutputSchema,
    'v1'
  >,
): TemplateAction<TActionInput, TActionOutput, 'v1'>;
/**
 * @public
 * @deprecated migrate to using the new built in zod schema definitions for schemas
 */
export function createTemplateAction<
  TInputParams extends JsonObject = JsonObject,
  TOutputParams extends JsonObject = JsonObject,
  TInputSchema extends z.ZodType = z.ZodType,
  TOutputSchema extends z.ZodType = z.ZodType,
  TActionInput extends JsonObject = z.infer<TInputSchema>,
  TActionOutput extends JsonObject = z.infer<TOutputSchema>,
>(
  action: TemplateActionOptions<
    TActionInput,
    TActionOutput,
    TInputSchema,
    TOutputSchema,
    'v1'
  >,
): TemplateAction<TActionInput, TActionOutput, 'v1'>;
/**
 * This function is used to create new template actions to get type safety.
 * Will convert zod schemas to json schemas for use throughout the system.
 * @public
 */
export function createTemplateAction<
  TInputSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType },
  TOutputSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType },
>(
  action: TemplateActionOptions<
    {
      [key in keyof TInputSchema]: z.infer<ReturnType<TInputSchema[key]>>;
    },
    {
      [key in keyof TOutputSchema]: z.infer<ReturnType<TOutputSchema[key]>>;
    },
    TInputSchema,
    TOutputSchema,
    'v2'
  >,
): TemplateAction<
  FlattenOptionalProperties<{
    [key in keyof TInputSchema]: z.output<ReturnType<TInputSchema[key]>>;
  }>,
  FlattenOptionalProperties<{
    [key in keyof TOutputSchema]: z.output<ReturnType<TOutputSchema[key]>>;
  }>,
  'v2'
>;
export function createTemplateAction<
  TInputParams extends JsonObject = JsonObject,
  TOutputParams extends JsonObject = JsonObject,
  TInputSchema extends
    | JsonObject
    | z.ZodType
    | { [key in string]: (zImpl: typeof z) => z.ZodType } = JsonObject,
  TOutputSchema extends
    | JsonObject
    | z.ZodType
    | { [key in string]: (zImpl: typeof z) => z.ZodType } = JsonObject,
  TActionInput extends JsonObject = TInputSchema extends z.ZodType<
    any,
    any,
    infer IReturn
  >
    ? IReturn
    : TInputSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType }
    ? Expand<{
        [key in keyof TInputSchema]: z.infer<ReturnType<TInputSchema[key]>>;
      }>
    : TInputParams,
  TActionOutput extends JsonObject = TOutputSchema extends z.ZodType<
    any,
    any,
    infer IReturn
  >
    ? IReturn
    : TOutputSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType }
    ? Expand<{
        [key in keyof TOutputSchema]: z.infer<ReturnType<TOutputSchema[key]>>;
      }>
    : TOutputParams,
>(
  action: TemplateActionOptions<
    TActionInput,
    TActionOutput,
    TInputSchema,
    TOutputSchema
  >,
): TemplateAction<
  TActionInput,
  TActionOutput,
  TInputSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType }
    ? 'v2'
    : 'v1'
> {
  const { inputSchema, outputSchema } = parseSchemas(
    action as TemplateActionOptions<any, any, any>,
  );

  return {
    ...action,
    schema: {
      ...action.schema,
      input: inputSchema,
      output: outputSchema,
    },
  };
}
