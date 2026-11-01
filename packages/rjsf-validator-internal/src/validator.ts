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

import type { OutputUnit, Schema, Validator } from '@cfworker/json-schema';
import type {
  CustomValidator,
  ErrorSchema,
  ErrorTransformer,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  UiSchema,
  ValidationData,
  ValidatorType,
} from '@rjsf/utils';
import {
  deepEquals,
  hashForSchema,
  ID_KEY,
  ROOT_SCHEMA_PREFIX,
  toErrorList,
  withIdRefPrefix,
} from '@rjsf/utils';

import createCfworkerInstance from './createCfworkerInstance';
import type { RawValidationErrorsType } from './processRawValidationErrors';
import processRawValidationErrors, {
  removeSummaryErrors,
} from './processRawValidationErrors';
import { applyErrorMessages } from './errorMessage';
import type {
  CFWorkerValidationError,
  CustomValidatorOptionsType,
} from './types';

/** Cached schema-bound validator and the schemas used to construct it. */
interface CachedValidator {
  /** The schema-bound validator instance. */
  validator: Validator;

  /** The schema used to construct the validator. */
  schema: object;

  /** The root schema registered for cross-schema `$ref` resolution. */
  rootSchema?: object;
}

/** Converts JavaScript `undefined` values into JSON-compatible input.
 * Object members with undefined values are omitted so a `required` keyword
 * sees them as missing; array entries and a top-level undefined become null.
 *
 * @param data - The form data to normalize
 * @returns - The form data with `undefined` values converted to JSON-compatible values
 */
export function normalizeFormDataForValidation<D>(data: D): D {
  if (data === undefined) {
    return null as D;
  }
  if (Array.isArray(data)) {
    return data.map(value => normalizeFormDataForValidation(value)) as D;
  }
  if (data !== null && typeof data === 'object') {
    const normalized = Object.fromEntries(
      Object.entries(data).flatMap(([key, value]) =>
        value === undefined
          ? []
          : [[key, normalizeFormDataForValidation(value)]],
      ),
    );
    return normalized as D;
  }
  return data;
}

/** `ValidatorType` implementation backed by `@cfworker/json-schema`. */
export default class CFWorkerValidator<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
> implements ValidatorType<T, S, F>
{
  /** The resolved options used to configure this validator.
   *
   * @private
   */
  readonly options: CustomValidatorOptionsType;

  /** Per-schema-id cache of constructed `@cfworker/json-schema` validators. AJV uses a
   * single instance with a schema registry; cfworker is schema-bound, so this
   * class maintains the registry itself.
   *
   * @private
   */
  private readonly validators = new Map<string, CachedValidator>();

  /** The root schema registered under `ROOT_SCHEMA_PREFIX`, used to resolve prefixed `$ref` values.
   *
   * @private
   */
  private cachedRootSchema?: object;

  /** Most recent `rootSchema` reference processed by `handleSchemaUpdate`.
   *
   * @private
   */
  private lastSeenRootSchema?: S;

  /** True once a `rootSchema` has been registered with the engine in this lifecycle.
   *
   * @private
   */
  private hasRegisteredRootSchema = false;

  /** Constructs a `CFWorkerValidator` instance using the provided options.
   *
   * @param [options={}] - The options used to configure the cfworker validator
   */
  constructor(options: CustomValidatorOptionsType = {}) {
    this.options = { draft: '7', shortCircuit: false, ...options };
  }

  /** Converts an error schema into a list of errors. Required by RJSF 5, removed in RJSF 6.
   *
   * @param [errorSchema] - The error schema to convert
   * @param [fieldPath=[]] - The current field path
   * @returns - The list of errors
   */
  toErrorList(errorSchema?: ErrorSchema<T>, fieldPath: string[] = []) {
    return toErrorList<T>(errorSchema, fieldPath);
  }

  /** Clears all cached schema-bound validators and root-schema state. */
  reset(): void {
    this.validators.clear();
    this.cachedRootSchema = undefined;
    this.lastSeenRootSchema = undefined;
    this.hasRegisteredRootSchema = false;
  }

  /** Returns a cached schema-bound validator or builds and caches a new one.
   *
   * @param id - The cache key for the schema
   * @param schema - The schema to bind to the validator
   * @returns - The cached or newly constructed validator
   */
  private getOrBuild(id: string, schema: object): Validator {
    const rootSchema =
      this.cachedRootSchema && !deepEquals(this.cachedRootSchema, schema)
        ? this.cachedRootSchema
        : undefined;
    const cached = this.validators.get(id);
    if (
      cached &&
      deepEquals(cached.schema, schema) &&
      ((cached.rootSchema === undefined && rootSchema === undefined) ||
        deepEquals(cached.rootSchema, rootSchema))
    ) {
      return cached.validator;
    }

    const validator = createCfworkerInstance(
      schema as Schema,
      this.options,
      rootSchema as Schema | undefined,
    );
    this.validators.set(id, { validator, schema, rootSchema });
    return validator;
  }

  /** Runs validation without applying RJSF error transformation or custom validation.
   *
   * @param schema - The schema against which to validate the form data
   * @param [formData] - The form data to validate
   * @returns - The raw cfworker errors and any engine exception
   */
  rawValidation<Result = any>(
    schema: S,
    formData?: T,
  ): RawValidationErrorsType<Result> {
    let validationError: Error | undefined;
    let errors: OutputUnit[] | undefined;
    try {
      const id = schema[ID_KEY] ?? hashForSchema(schema);
      const validator = this.getOrBuild(id, schema);
      const result = validator.validate(
        normalizeFormDataForValidation(formData),
      );
      errors = result.valid ? undefined : result.errors;
      if (errors && this.options.errorMessage) {
        errors = applyErrorMessages(removeSummaryErrors(errors), schema);
      }
    } catch (error) {
      validationError = error as Error;
    }
    return { errors: errors as Result[] | undefined, validationError };
  }

  /** Validates form data and applies RJSF error transformation and custom validation.
   *
   * @param formData - The form data to validate
   * @param schema - The schema against which to validate the form data
   * @param [customValidate] - A function that adds application-specific validation errors
   * @param [transformErrors] - A function that transforms errors before custom validation
   * @param [uiSchema] - The uiSchema passed to error transformation and custom validation
   * @returns - The processed validation errors and error schema
   */
  validateFormData(
    formData: T | undefined,
    schema: S,
    customValidate?: CustomValidator<T, S, F>,
    transformErrors?: ErrorTransformer<T, S, F>,
    uiSchema?: UiSchema<T, S, F>,
  ): ValidationData<T> {
    const rawErrors = this.rawValidation<CFWorkerValidationError>(
      schema,
      formData,
    );
    return processRawValidationErrors(
      this,
      rawErrors,
      formData,
      schema,
      customValidate,
      transformErrors,
      uiSchema,
      this.options.suppressDuplicateFiltering,
    );
  }

  /** Registers a root schema when it changes so prefixed `$ref` values can be resolved.
   *
   * @param rootSchema - The root schema used to provide `$ref` resolutions
   */
  handleSchemaUpdate(rootSchema: S): void {
    if (
      this.lastSeenRootSchema === rootSchema &&
      this.hasRegisteredRootSchema
    ) {
      return;
    }
    // `withIdRefPrefix()` rewrites local refs to ROOT_SCHEMA_PREFIX, so the
    // root must be registered under that alias even when it has its own $id.
    const rootSchemaId = ROOT_SCHEMA_PREFIX;
    const rootWithId =
      rootSchema[ID_KEY] === rootSchemaId
        ? (rootSchema as object)
        : { ...(rootSchema as object), [ID_KEY]: rootSchemaId };

    if (
      this.cachedRootSchema &&
      !deepEquals(this.cachedRootSchema, rootWithId)
    ) {
      this.validators.clear();
    }
    this.cachedRootSchema = rootWithId;
    this.getOrBuild(rootSchemaId, rootWithId);
    this.lastSeenRootSchema = rootSchema;
    this.hasRegisteredRootSchema = true;
  }

  /** Validates data against a schema, returning false if the schema is invalid.
   *
   * @param schema - The schema against which to validate the form data
   * @param formData - The form data to validate
   * @param rootSchema - The root schema used to provide `$ref` resolutions
   * @returns - Whether the form data is valid
   */
  isValid(schema: S, formData: T | undefined, rootSchema: S): boolean {
    try {
      this.handleSchemaUpdate(rootSchema);
      const schemaWithIdRefPrefix = withIdRefPrefix<S>(schema) as S;
      const id =
        schemaWithIdRefPrefix[ID_KEY] ?? hashForSchema(schemaWithIdRefPrefix);
      const validator = this.getOrBuild(id, schemaWithIdRefPrefix);
      return validator.validate(normalizeFormDataForValidation(formData)).valid;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error encountered validating schema:', error);
      return false;
    }
  }
}
