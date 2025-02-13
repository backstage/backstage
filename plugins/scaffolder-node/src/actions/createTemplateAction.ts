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

import type { JsonObject, Expand } from '@backstage/types';
import type { Schema } from 'jsonschema';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import type {
  InferActionType,
  ActionContextV2,
  TemplateActionV2,
  ActionContextV1,
  TemplateActionV1,
  TemplateExample,
} from './types';

/**
 * @deprecated migrate to {@link TemplateActionOptionsV2}
 * @public
 */
export type TemplateActionOptionsV1<
  TInputParams extends JsonObject = JsonObject,
  TOutputParams extends JsonObject = JsonObject,
  TInputSchema extends Schema | z.ZodType = Schema,
  TOutputSchema extends Schema | z.ZodType = Schema,
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
  examples?: TemplateExample[];
  supportsDryRun?: boolean;
  schema?: {
    input?: TInputSchema;
    output?: TOutputSchema;
  };
  handler: (ctx: ActionContextV1<TActionInput, TActionOutput>) => Promise<void>;
};

/**
 * @public
 */
export type TemplateActionOptionsV2<
  TInputParams extends Record<
    PropertyKey,
    (zod: typeof z) => z.ZodType
  > = Record<PropertyKey, (zod: typeof z) => z.ZodType>,
  TOutputParams extends Record<
    PropertyKey,
    (zod: typeof z) => z.ZodType
  > = Record<PropertyKey, (zod: typeof z) => z.ZodType>,
> = {
  id: string;
  description?: string;
  examples?: TemplateExample[];
  supportsDryRun?: boolean;
  schema: {
    input: TInputParams;
    output: TOutputParams;
  };
  handler: (
    ctx: ActionContextV2<
      InferActionType<TInputParams>,
      InferActionType<TOutputParams>
    >,
  ) => Promise<void>;
};

/**
 * @deprecated migrate to {@link TemplateActionOptionsV2}
 * @public
 */
export type TemplateActionOptions<
  TInputParams extends JsonObject = JsonObject,
  TOutputParams extends JsonObject = JsonObject,
  TInputSchema extends Schema | z.ZodType = Schema,
  TOutputSchema extends Schema | z.ZodType = Schema,
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
> = TemplateActionOptionsV1<
  TInputParams,
  TOutputParams,
  TInputSchema,
  TOutputSchema,
  TActionInput,
  TActionOutput
>;

function isZod(schema?: Schema | z.ZodType): schema is z.ZodType {
  return !!(schema && 'safeParseAsync' in schema);
}

function transformZodRecordToObject(
  record: Record<PropertyKey, (zod: typeof z) => z.ZodType>,
): z.ZodObject<Record<PropertyKey, z.ZodType>> {
  return z.object(
    Object.fromEntries(Object.entries(record).map(([k, v]) => [k, v(z)])),
  );
}

/**
 * This function is used to create new template actions to get type safety.
 * Will convert zod schemas to json schemas for use throughout the system.
 * @deprecated migrate to {@link createTemplateActionV2}
 * @public
 */
export function createTemplateActionV1<
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
  action: TemplateActionOptionsV1<
    TInputParams,
    TOutputParams,
    TInputSchema,
    TOutputSchema,
    TActionInput,
    TActionOutput
  >,
): TemplateActionV1<TActionInput, TActionOutput> {
  const inputSchema =
    action.schema && action.schema.input && isZod(action.schema.input)
      ? (zodToJsonSchema(action.schema.input) as Schema)
      : action.schema?.input;

  const outputSchema =
    action.schema && action.schema.output && isZod(action.schema.output)
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
}

/**
 * This function is used to create new template actions to get type safety.
 * Will convert zod schemas to json schemas for use throughout the system.
 * @public
 */
export function createTemplateActionV2<
  TInputParams extends Record<PropertyKey, (zod: typeof z) => z.ZodType>,
  TOutputParams extends Record<PropertyKey, (zod: typeof z) => z.ZodType>,
>(
  action: TemplateActionOptionsV2<TInputParams, TOutputParams>,
): TemplateActionV2<
  InferActionType<TInputParams>,
  InferActionType<TOutputParams>
> {
  const input = transformZodRecordToObject(action.schema.input);
  const output = transformZodRecordToObject(action.schema.output);

  return {
    ...action,
    schema: {
      ...action.schema,
      input: zodToJsonSchema(input) as Schema,
      output: zodToJsonSchema(output) as Schema,
    },
  };
}

function isV1Action(
  action: TemplateActionOptionsV1 | TemplateActionOptionsV2,
): action is TemplateActionOptionsV1 {
  return (
    isZod(action.schema?.input) ||
    typeof action.schema?.input === 'string' ||
    isZod(action.schema?.output) ||
    typeof action.schema?.output === 'string'
  );
}

/**
 * This function is used to create new template actions to get type safety.
 * Will convert zod schemas to json schemas for use throughout the system.
 * @public
 */
export function createTemplateAction<
  TInputParams extends JsonObject = JsonObject,
  TOutputParams extends JsonObject = JsonObject,
  TAction extends
  | TemplateActionOptionsV1
  | TemplateActionOptionsV2 = TemplateActionOptionsV1,
  TReturn = TAction extends TemplateActionOptionsV1
  ? Expand<TemplateActionV1<TInputParams, TOutputParams>>
  : Expand<TemplateActionV2>,
>(action: TAction): TReturn {
  if (isV1Action(action)) {
    return createTemplateActionV1(action) as TReturn;
  }

  return createTemplateActionV2(action) as TReturn;
}
