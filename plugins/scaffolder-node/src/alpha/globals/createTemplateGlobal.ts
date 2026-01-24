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

import { z } from 'zod';
import {
  CreatedTemplateGlobalFunction,
  CreatedTemplateGlobalValue,
  TemplateGlobalFunctionExample,
} from './types';
import { ZodFunctionSchema } from '../types';

/**
 * This function is used to create new template global values in type-safe manner.
 * @param t - CreatedTemplateGlobalValue | CreatedTemplateGlobalFunction
 * @returns t
 * @alpha
 */
export const createTemplateGlobalValue = (
  v: CreatedTemplateGlobalValue,
): CreatedTemplateGlobalValue => v;

/**
 * This function is used to create new template global functions in type-safe manner.
 * @param fn - CreatedTemplateGlobalFunction
 * @returns fn
 * @alpha
 */
export const createTemplateGlobalFunction = <
  TFunctionArgs extends [z.ZodTypeAny, ...z.ZodTypeAny[]],
  TReturnType extends z.ZodTypeAny,
>(options: {
  id: string;
  description?: string;
  examples?: TemplateGlobalFunctionExample[];
  schema?: ZodFunctionSchema<TFunctionArgs, TReturnType>;
  fn: (...args: z.infer<z.ZodTuple<TFunctionArgs>>) => z.infer<TReturnType>;
}): CreatedTemplateGlobalFunction<TFunctionArgs, TReturnType> => options;
