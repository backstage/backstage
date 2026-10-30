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

/**
 * A single schema validation error, in an engine independent shape.
 */
export interface SchemaValidationError {
  /** JSON pointer to the failing part of the data, or an empty string for the root */
  instancePath: string;
  /** The JSON Schema keyword that failed, such as `type` or `enum` */
  keyword: string;
  /** A human readable description of the failure */
  message: string;
  /** Extra details about the failure, when the engine provides them */
  params?: Record<string, unknown>;
}

/**
 * A compiled schema; returns the validation errors for the given data, or
 * `undefined` if the data matches the schema. The list of errors may be empty
 * if the engine could not describe the failure.
 */
export type CompiledSchema = (
  data: unknown,
) => SchemaValidationError[] | undefined;

/**
 * An implementation of JSON Schema validation.
 *
 * @remarks
 *
 * Engines are registered process wide on `globalThis`, so that multiple copies
 * of this package agree on which one to use. Changes to this interface must
 * therefore stay compatible with older versions of the package.
 */
export interface SchemaEngine {
  /**
   * Compiles a schema. The extra schemas are made available for `$ref`
   * resolution by their `$id`.
   */
  compile(options: {
    schema: object;
    extraSchemas: object[];
    allErrors: boolean;
  }): CompiledSchema;

  /**
   * Validates a schema against the JSON Schema draft-07 meta schema, returning
   * the first error if any. May throw if the schema can not be processed at all.
   */
  validateSchema(schema: object): SchemaValidationError | undefined;
}
