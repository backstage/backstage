/*
 * Copyright 2026 The Backstage Authors
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

// Adapted from @rjsf/validator-cfworker 6.11.0 (Apache-2.0) for use with RJSF 5.
// See the package README for details.

import type {
  OutputUnit,
  Schema,
  SchemaDraft,
  Validator,
} from '@cfworker/json-schema';

/** The type describing a function that checks whether a string satisfies a custom format */
export type CFWorkerFormatChecker = (value: string) => boolean;

/** The type describing the value for the `suppressDuplicateFiltering` option */
export type SuppressDuplicateFilteringType = 'anyOf' | 'oneOf' | 'all' | 'none';

/** Options for the `@cfworker/json-schema` backed validator. */
export interface CustomValidatorOptionsType {
  /** Additional schemas registered for cross-schema `$ref` resolution. */
  additionalMetaSchemas?: readonly Schema[];

  /** Custom format checkers installed in the engine's format registry. */
  customFormats?: Record<string, string | RegExp | CFWorkerFormatChecker>;

  /** JSON Schema dialect used by the engine. Defaults to `7`, matching the draft that `@rjsf/validator-ajv8` uses. */
  draft?: SchemaDraft;

  /** Hook for applying additional setup to each constructed validator. */
  extenderFn?: (validator: Validator) => Validator;

  /** Stop after the first validation error. Defaults to `false`. */
  shortCircuit?: boolean;

  /** Controls duplicate `anyOf`/`oneOf` error filtering. */
  suppressDuplicateFiltering?: SuppressDuplicateFilteringType;
}

/** Error object returned by `@cfworker/json-schema`. */
export type CFWorkerValidationError = OutputUnit;
