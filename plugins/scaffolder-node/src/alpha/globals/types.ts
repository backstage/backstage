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
import { ZodFunctionSchema } from '../types';

export type { TemplateGlobal } from '../../types';

/** @alpha */
export type CreatedTemplateGlobalValue<T extends JsonValue = JsonValue> = {
  id: string;
  value: T;
  description?: string;
};

/** @alpha */
export type TemplateGlobalFunctionExample = {
  description?: string;
  example: string;
  notes?: string;
};

/** @alpha */
export type CreatedTemplateGlobalFunction<
  TFunctionArgs extends [z.ZodTypeAny, ...z.ZodTypeAny[]],
  TReturnType extends z.ZodTypeAny,
> = {
  id: string;
  description?: string;
  examples?: TemplateGlobalFunctionExample[];
  schema?: ZodFunctionSchema<TFunctionArgs, TReturnType>;
  fn: (...args: z.infer<z.ZodTuple<TFunctionArgs>>) => z.infer<TReturnType>;
};

/** @alpha */
export type CreatedTemplateGlobal =
  | CreatedTemplateGlobalValue
  | CreatedTemplateGlobalFunction<any, any>;
