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

/** @public */
export type TemplateFilter = (
  arg: JsonValue,
  ...rest: JsonValue[]
) => JsonValue | undefined;

/** @public */
export type TemplateFilterSchema = {
  [K in 'input' | 'arguments' | 'output']?: (zImpl: typeof z) => z.ZodType;
};

/** @public */
export type TemplateFilterExample = {
  description?: string;
  example: string;
  notes?: string;
};

/** @public */
export type TemplateFilterFunction<T extends TemplateFilterSchema> =
  z.ZodFunction<
    z.ZodTuple<
      [
        T['input'] extends (zImpl: typeof z) => z.ZodType
          ? ReturnType<T['input']>
          : z.ZodAny,
        ...(T['arguments'] extends (zImpl: typeof z) => z.ZodTuple<infer Items>
          ? Items
          : [ReturnType<NonNullable<T['arguments']>>]),
      ]
    >,
    T['output'] extends (zImpl: typeof z) => z.ZodType
      ? ReturnType<T['output']>
      : z.ZodUnknown
  >;

/** @public */
export type CreatedTemplateFilter<
  TSchema extends TemplateFilterSchema | undefined = undefined,
  TFilterSchema extends TSchema extends TemplateFilterSchema
    ? TemplateFilterFunction<TSchema>
    : (
        arg: JsonValue,
        ...rest: JsonValue[]
      ) => JsonValue | undefined = TSchema extends TemplateFilterSchema
    ? TemplateFilterFunction<TSchema>
    : (arg: JsonValue, ...rest: JsonValue[]) => JsonValue | undefined,
> = {
  id: string;
  description?: string;
  examples?: TemplateFilterExample[];
  schema?: TSchema;
  filter: TFilterSchema;
};
