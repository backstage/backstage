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
  TemplateGlobalFunctionSchema,
} from './types';
import { JsonValue } from '@backstage/types';

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
  TSchema extends TemplateGlobalFunctionSchema<any, any> | undefined,
  TFilterSchema extends TSchema extends TemplateGlobalFunctionSchema<any, any>
    ? z.infer<ReturnType<TSchema>>
    : (...args: JsonValue[]) => JsonValue | undefined,
>(
  fn: CreatedTemplateGlobalFunction<TSchema, TFilterSchema>,
): CreatedTemplateGlobalFunction<any, any> => fn;
