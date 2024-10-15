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
import { z } from 'zod';
import { TemplateFilter } from '../../types';

export type { TemplateFilter } from '../../types';

/** @alpha */
export type TemplateFilterSchema = {
  [K in 'input' | 'arguments' | 'output']?: (zImpl: typeof z) => z.ZodType;
};

/** @alpha */
export type TemplateFilterExample = {
  description?: string;
  example: string;
  notes?: string;
};

/** @alpha */
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

/** @alpha */
export type CreatedTemplateFilter<
  TSchema extends TemplateFilterSchema | undefined | unknown = unknown,
  TFilterSchema extends TSchema extends TemplateFilterSchema
    ? TemplateFilterFunction<TSchema>
    : TSchema extends unknown
    ? unknown
    : TemplateFilter = TSchema extends TemplateFilterSchema
    ? TemplateFilterFunction<TSchema>
    : TSchema extends unknown
    ? unknown
    : TemplateFilter,
> = {
  id: string;
  description?: string;
  examples?: TemplateFilterExample[];
  schema?: TSchema;
  filter: TFilterSchema;
};
