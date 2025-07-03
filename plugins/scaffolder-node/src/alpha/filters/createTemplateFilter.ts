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

import { ZodFunctionSchema } from '../types';
import { CreatedTemplateFilter, TemplateFilterExample } from './types';
import { z } from 'zod';

/**
 * This function is used to create new template filters in type-safe manner.
 * @alpha
 */
export const createTemplateFilter = <
  TFunctionArgs extends [z.ZodTypeAny, ...z.ZodTypeAny[]],
  TReturnType extends z.ZodTypeAny,
>(options: {
  id: string;
  description?: string;
  examples?: TemplateFilterExample[];
  schema?: ZodFunctionSchema<TFunctionArgs, TReturnType>;
  filter: (...args: z.infer<z.ZodTuple<TFunctionArgs>>) => z.infer<TReturnType>;
}): CreatedTemplateFilter<TFunctionArgs, TReturnType> => options;
