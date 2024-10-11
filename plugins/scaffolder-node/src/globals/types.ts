/*
 * Copyright 2024 The Backstage Authors
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

/** @alpha */
export type CreatedTemplateGlobalValue<T extends JsonValue = JsonValue> = {
  id: string;
  value: T;
  description?: string;
};

/** @alpha */
export type TemplateGlobalFunctionSchema = {
  [K in 'arguments' | 'output']?: (zImpl: typeof z) => z.ZodType;
};

/** @alpha */
export type SchemaCompliantTemplateGlobalFunction<
  T extends TemplateGlobalFunctionSchema,
> = z.ZodFunction<
  z.ZodTuple<
    [
      ...(T['arguments'] extends (zImpl: typeof z) => z.ZodTuple<infer Items>
        ? Items
        : [ReturnType<NonNullable<T['arguments']>>]),
    ]
  >,
  T['output'] extends (zImpl: typeof z) => z.ZodType
    ? ReturnType<T['output']>
    : z.ZodUnknown
>;

/** @alpha */
export type TemplateGlobalFunctionExample = {
  description?: string;
  example: string;
  notes?: string;
};

/** @alpha */
export type CreatedTemplateGlobalFunction<
  S extends TemplateGlobalFunctionSchema | undefined = undefined,
  F extends S extends TemplateGlobalFunctionSchema
    ? SchemaCompliantTemplateGlobalFunction<S>
    : (
        arg: JsonValue,
        ...rest: JsonValue[]
      ) => JsonValue = S extends TemplateGlobalFunctionSchema
    ? SchemaCompliantTemplateGlobalFunction<S>
    : (...args: JsonValue[]) => JsonValue,
> = {
  id: string;
  description?: string;
  examples?: TemplateGlobalFunctionExample[];
  schema?: S;
  fn: F;
};

/** @alpha */
export type CreatedTemplateGlobal =
  | CreatedTemplateGlobalValue<any>
  | CreatedTemplateGlobalFunction<any, any>;
