/*
 * Copyright 2025 The Backstage Authors
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
import { JsonValue } from '@backstage/types';
import { z } from 'zod';
import { TemplateGlobal } from '../../types';

export type { TemplateGlobal } from '../../types';

/** @alpha */
export type CreatedTemplateGlobalValue<T extends JsonValue = JsonValue> = {
  id: string;
  value: T;
  description?: string;
};

/** @alpha */
export type TemplateGlobalFunctionSchema<
  Args extends z.ZodTuple<
    [] | [z.ZodType<JsonValue>, ...(z.ZodType<JsonValue> | z.ZodUnknown)[]],
    z.ZodType<JsonValue> | z.ZodUnknown | null
  >,
  Result extends z.ZodType<JsonValue> | z.ZodUndefined,
> = (zod: typeof z) => z.ZodFunction<Args, Result>;

/** @alpha */
export type TemplateGlobalFunctionExample = {
  description?: string;
  example: string;
  notes?: string;
};

/** @alpha */
export type CreatedTemplateGlobalFunction<
  TSchema extends
    | TemplateGlobalFunctionSchema<any, any>
    | undefined
    | unknown = unknown,
  TFilterSchema extends TSchema extends TemplateGlobalFunctionSchema<any, any>
    ? z.infer<ReturnType<TSchema>>
    : TSchema extends unknown
    ? unknown
    : Exclude<
        TemplateGlobal,
        JsonValue
      > = TSchema extends TemplateGlobalFunctionSchema<any, any>
    ? z.infer<ReturnType<TSchema>>
    : TSchema extends unknown
    ? unknown
    : Exclude<TemplateGlobal, JsonValue>,
> = {
  id: string;
  description?: string;
  examples?: TemplateGlobalFunctionExample[];
  schema?: TSchema;
  fn: TFilterSchema;
};

/** @alpha */
export type CreatedTemplateGlobal =
  | CreatedTemplateGlobalValue
  | CreatedTemplateGlobalFunction<unknown, unknown>;
