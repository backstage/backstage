/*
 * Copyright 2023 The Backstage Authors
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
import { Schema } from 'jsonschema';

/** @public */
export type TemplateFilter = (...args: JsonValue[]) => JsonValue | undefined;

/** @public */
export type TemplateFilterSchema = {
  input?: Schema;
  arguments?: Schema[];
  output?: Schema;
};

/** @public */
export type TemplateFilterMetadata = {
  description?: string;
  schema?: TemplateFilterSchema;
  examples?: { description?: string; example: string; notes?: string }[];
};

/** @public */
export type TemplateGlobal =
  | ((...args: JsonValue[]) => JsonValue | undefined)
  | JsonValue;

/** @public */
export type TemplateGlobalValueMetadata = {
  description?: string;
  value: JsonValue;
};

/** @public */
export type TemplateGlobalFunctionSchema = {
  arguments?: Schema[];
  output?: Schema;
};

/** @public */
export type TemplateGlobalFunctionMetadata = {
  description?: string;
  schema?: TemplateGlobalFunctionSchema;
  examples?: { description?: string; example: string; notes?: string }[];
};

/** @public */
export type TemplateGlobalElement = { name: string } & (
  | TemplateGlobalValueMetadata
  | (TemplateGlobalFunctionMetadata & {
      fn: Exclude<TemplateGlobal, JsonValue>;
    })
);
