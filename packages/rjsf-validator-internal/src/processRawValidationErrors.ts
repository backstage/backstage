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
  CustomValidator,
  ErrorTransformer,
  FormContextType,
  RJSFSchema,
  RJSFValidationError,
  StrictRJSFSchema,
  UiSchema,
  ValidatorType,
} from '@rjsf/utils';
import {
  ANY_OF_KEY,
  createErrorHandler,
  getDefaultFormState,
  getUiOptions,
  ONE_OF_KEY,
  PROPERTIES_KEY,
  toErrorSchema,
  unwrapErrorHandler,
  validationDataMerge,
} from '@rjsf/utils';
import get from 'lodash/get';
import toPath from 'lodash/toPath';

import type {
  CFWorkerValidationError,
  SuppressDuplicateFilteringType,
} from './types';

/** The raw validation results produced by the underlying engine, before conversion into RJSF's error formats. */
export interface RawValidationErrorsType<Result = any> {
  /** The raw errors returned by the engine's validation run, when any. */
  errors?: Result[];

  /** The error thrown when the engine could not run validation, such as on an invalid schema. */
  validationError?: Error;
}

/** Decodes one URI-encoded JSON pointer segment, as emitted by cfworker. */
function decodeSegment(segment: string): string {
  return decodeURIComponent(segment).replace(/~1/g, '/').replace(/~0/g, '~');
}

/** Appends a property name to an RJSF property path, using bracket notation
 * for names that dot notation can not represent.
 *
 * @param property - The RJSF property path to append to
 * @param name - The literal property name
 * @returns - The extended RJSF property path
 */
function appendProperty(property: string, name: string): string {
  if (/^[^.[\]'"\\]+$/.test(name)) {
    return `${property}.${name}`;
  }
  return `${property}[${JSON.stringify(name)}]`;
}

/** Converts a cfworker instance location into RJSF's dot-separated property path.
 *
 * @param instanceLocation - The instance location emitted by `@cfworker/json-schema`
 * @returns - The corresponding RJSF property path
 */
function instanceLocationToProperty(instanceLocation: string): string {
  const trimmed = instanceLocation.replace(/^#?\/?/, '');
  if (!trimmed) {
    return '';
  }
  return trimmed
    .split('/')
    .map(decodeSegment)
    .reduce((property, name) => appendProperty(property, name), '');
}

/** Extracts the missing property name from a cfworker `required` error.
 *
 * @param error - The cfworker validation error to inspect
 * @returns - The missing property name when the error describes one
 */
function extractMissingProperty(
  error: CFWorkerValidationError,
): string | undefined {
  if (error.keyword !== 'required') {
    return undefined;
  }
  return error.error.match(/required property "(.*)"\.$/)?.[1];
}

/** Keywords that `@cfworker/json-schema` reports a summary error for whenever
 * one of their subschemas fails, such as `Property "x" does not match schema.`
 * AJV does not report these, so they are dropped when a more specific error
 * from beneath them is also present.
 */
const SUMMARY_KEYWORDS = new Set([
  '$ref',
  'additionalItems',
  'additionalProperties',
  'allOf',
  'dependencies',
  'dependentSchemas',
  'items',
  'patternProperties',
  'prefixItems',
  'properties',
  'unevaluatedItems',
  'unevaluatedProperties',
]);

/** Keywords whose failures AJV reports for the parent instance, rather than
 * for the subschema that failed.
 */
const PARENT_REPORTED_KEYWORDS = new Set([
  'additionalItems',
  'additionalProperties',
  'unevaluatedItems',
  'unevaluatedProperties',
]);

/** Encodes a JSON pointer segment the same way that cfworker does. */
function encodePointerSegment(segment: string): string {
  return encodeURI(segment.replace(/~/g, '~0').replace(/\//g, '~1'));
}

/** Finds the instance location that a summary error is about.
 *
 * @param error - The summary error
 * @returns - The instance location, ending with a slash when it covers several children
 */
function summaryChildLocation(error: CFWorkerValidationError): string {
  const property = error.error.match(
    /^Property "(.*)" (does not|matches)/,
  )?.[1];
  if (property !== undefined) {
    return `${error.instanceLocation}/${encodePointerSegment(property)}`;
  }
  if (error.error.startsWith('Items did not match')) {
    return `${error.instanceLocation}/`;
  }
  return error.instanceLocation;
}

/** Checks whether an instance location is at or beneath another. */
function isWithin(instanceLocation: string, location: string): boolean {
  return location.endsWith('/')
    ? instanceLocation.startsWith(location)
    : instanceLocation === location ||
        instanceLocation.startsWith(`${location}/`);
}

/** Finds the keyword location beneath which a summary error's subschema errors are reported.
 *
 * @param error - The summary error
 * @returns - The keyword location, or undefined when the error is a direct failure
 */
function summaryKeywordLocation(
  error: CFWorkerValidationError,
): string | undefined {
  if (
    error.keyword !== 'dependencies' &&
    error.keyword !== 'dependentSchemas'
  ) {
    return error.keywordLocation;
  }
  // These keywords also report direct failures, such as a missing dependent
  // property, and only summarize the errors of a dependent schema
  const key = error.error.match(
    /^Instance has "(.*)" but does not match dependant schema\.$/,
  )?.[1];
  return key === undefined
    ? undefined
    : `${error.keywordLocation}/${encodePointerSegment(key)}`;
}

/** Gives an error for a `false` subschema the keyword location of that
 * subschema. cfworker reports its instance location instead, which loses the
 * schema ancestry needed to find custom messages.
 *
 * @param error - The error for the `false` subschema
 * @param errors - All errors, including the summary error of the keyword that holds the subschema
 * @returns - The error with its keyword location, when it could be found
 */
function withFalseSchemaLocation(
  error: CFWorkerValidationError,
  errors: CFWorkerValidationError[],
): CFWorkerValidationError {
  for (const summary of errors) {
    if (summaryChildLocation(summary) !== error.instanceLocation) {
      continue;
    }
    if (summary.keyword === 'properties') {
      const key = summary.error.match(/^Property "(.*)" does not/)?.[1];
      return {
        ...error,
        keywordLocation: `${summary.keywordLocation}/${encodePointerSegment(
          key!,
        )}`,
      };
    }
    if (summary.keyword === 'patternProperties') {
      const pattern = summary.error.match(/matches pattern "(.*)" but/)?.[1];
      if (pattern !== undefined) {
        return {
          ...error,
          keywordLocation: `${summary.keywordLocation}/${encodePointerSegment(
            pattern,
          )}`,
        };
      }
    }
    if (summary.keyword === 'additionalProperties') {
      return { ...error, keywordLocation: summary.keywordLocation };
    }
  }
  return error;
}

/** Removes summary errors that only repeat more specific errors beneath them,
 * and errors for `false` subschemas that AJV reports for the parent keyword.
 * This is a Backstage addition that is not part of `@rjsf/validator-cfworker`.
 *
 * @param errors - The cfworker errors to filter
 * @returns - The errors without redundant ones
 */
export function removeSummaryErrors(
  rawErrors: CFWorkerValidationError[],
): CFWorkerValidationError[] {
  const errors = rawErrors.map(error =>
    error.keyword === 'false'
      ? withFalseSchemaLocation(error, rawErrors)
      : error,
  );
  const summaries = errors.filter(error => {
    const location = SUMMARY_KEYWORDS.has(error.keyword)
      ? summaryKeywordLocation(error)
      : undefined;
    if (location === undefined) {
      return false;
    }
    const child = summaryChildLocation(error);
    return errors.some(
      other =>
        other !== error &&
        isWithin(other.instanceLocation, child) &&
        // The keyword location of a `false` error is its instance location
        (other.keyword === 'false'
          ? !PARENT_REPORTED_KEYWORDS.has(error.keyword)
          : other.keywordLocation.startsWith(`${location}/`)),
    );
  });

  const parentReported = errors.filter(
    error =>
      PARENT_REPORTED_KEYWORDS.has(error.keyword) && !summaries.includes(error),
  );
  return errors.filter(
    error =>
      !summaries.includes(error) &&
      !(
        error.keyword === 'false' &&
        parentReported.some(parent =>
          isWithin(error.instanceLocation, summaryChildLocation(parent)),
        )
      ),
  );
}

/** Filters duplicate errors from `anyOf`/`oneOf` schema paths according to the `suppressDuplicateFiltering` flag.
 *
 * @param errorList - The list of RJSF validation errors to filter
 * @param [suppressDuplicateFiltering='none'] - Controls which duplicate filtering is suppressed
 * @returns - The filtered list of validation errors
 */
export function filterDuplicateErrors(
  errorList: RJSFValidationError[],
  suppressDuplicateFiltering: SuppressDuplicateFilteringType = 'none',
): RJSFValidationError[] {
  if (suppressDuplicateFiltering === 'all') {
    return errorList;
  }
  return errorList.reduce<RJSFValidationError[]>((acc, error) => {
    const { message, property, schemaPath } = error;
    const anyOfIndex =
      suppressDuplicateFiltering !== 'anyOf'
        ? schemaPath?.indexOf(`/${ANY_OF_KEY}/`)
        : undefined;
    const oneOfIndex =
      suppressDuplicateFiltering !== 'oneOf'
        ? schemaPath?.indexOf(`/${ONE_OF_KEY}/`)
        : undefined;
    let schemaPrefix: string | undefined;
    if (anyOfIndex && anyOfIndex >= 0) {
      schemaPrefix = schemaPath?.substring(0, anyOfIndex);
    } else if (oneOfIndex && oneOfIndex >= 0) {
      schemaPrefix = schemaPath?.substring(0, oneOfIndex);
    }
    const duplicate = schemaPrefix
      ? acc.find(
          candidate =>
            candidate.message === message &&
            candidate.property === property &&
            candidate.schemaPath?.startsWith(schemaPrefix),
        )
      : undefined;
    if (!duplicate) {
      acc.push(error);
    }
    return acc;
  }, []);
}

/** Converts `@cfworker/json-schema` output units into RJSF validation errors.
 *
 * @param errors - The cfworker errors to convert
 * @param [uiSchema] - The uiSchema used to resolve field titles
 * @param [suppressDuplicateFiltering] - Controls which duplicate filtering is suppressed
 * @param [schema] - The schema used to resolve field titles
 * @returns - The converted RJSF validation errors
 */
export function transformRJSFValidationErrors<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(
  errors: CFWorkerValidationError[] = [],
  uiSchema?: UiSchema<T, S, F>,
  suppressDuplicateFiltering?: SuppressDuplicateFilteringType,
  schema?: S,
): RJSFValidationError[] {
  const errorList = removeSummaryErrors(errors).map(error => {
    const { instanceLocation, keyword, keywordLocation } = error;
    let { error: message } = error;
    message ||= `Validation failed for keyword "${keyword}"`;
    let property = instanceLocationToProperty(instanceLocation);
    let stack = `${property} ${message}`.trim();
    let uiTitle = '';
    const missingProperty = extractMissingProperty(error);

    if (missingProperty) {
      // Like the ajv validator, missing root properties have no leading dot
      const path =
        property || !/^[^.[\]'"\\]+$/.test(missingProperty)
          ? appendProperty(property, missingProperty)
          : missingProperty;
      const { title: directTitle } = getUiOptions(
        get(uiSchema, toPath(path).filter(Boolean)),
      );
      let title = directTitle;
      if (title === undefined) {
        const uiSchemaPath = keywordLocation
          .replace(/\/properties\//g, '/')
          .split('/')
          .slice(1, -1)
          .concat([missingProperty]);
        title = getUiOptions(get(uiSchema, uiSchemaPath)).title;
      }
      if (title === undefined && schema) {
        const propertyParts = toPath(property).filter(Boolean);
        const schemaPath: (string | number)[] = [];
        for (const part of propertyParts) {
          schemaPath.push(PROPERTIES_KEY, part);
        }
        schemaPath.push(PROPERTIES_KEY, missingProperty, 'title');
        title = get(schema, schemaPath);
      }
      if (title) {
        message = message.replace(`"${missingProperty}"`, `'${title}'`);
        uiTitle = title;
      }
      property = path;
      stack = message;
    } else {
      const propertyParts = toPath(property).filter(Boolean);
      const uiSchemaTitle = getUiOptions<T, S, F>(
        get(uiSchema, propertyParts),
      ).title;
      const schemaTitle = schema
        ? get(
            schema,
            propertyParts
              .flatMap(part => [PROPERTIES_KEY, part])
              .concat(['title']),
          )
        : undefined;
      const title = uiSchemaTitle ?? schemaTitle;
      if (title) {
        stack = `'${title}' ${message}`.trim();
        uiTitle = title;
      }
    }

    return {
      name: keyword,
      property,
      message,
      params: missingProperty ? { missingProperty } : {},
      stack,
      schemaPath: keywordLocation,
      title: uiTitle,
    };
  });
  return filterDuplicateErrors(errorList, suppressDuplicateFiltering);
}

/** Processes raw validation errors and applies optional error transforms and custom validation.
 *
 * @param validator - The validator used to derive default form state for custom validation
 * @param rawErrors - The raw cfworker errors and any engine exception
 * @param formData - The form data being validated
 * @param schema - The schema against which the form data is validated
 * @param [customValidate] - A function that adds application-specific validation errors
 * @param [transformErrors] - A function that transforms errors before custom validation
 * @param [uiSchema] - The uiSchema passed to error transformation and custom validation
 * @param [suppressDuplicateFiltering] - Controls which duplicate filtering is suppressed
 * @returns - The processed validation errors and error schema
 */
export default function processRawValidationErrors<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(
  validator: ValidatorType<T, S, F>,
  rawErrors: RawValidationErrorsType<CFWorkerValidationError>,
  formData: T | undefined,
  schema: S,
  customValidate?: CustomValidator<T, S, F>,
  transformErrors?: ErrorTransformer<T, S, F>,
  uiSchema?: UiSchema<T, S, F>,
  suppressDuplicateFiltering?: SuppressDuplicateFilteringType,
) {
  const { validationError } = rawErrors;
  let errors = transformRJSFValidationErrors<T, S, F>(
    rawErrors.errors,
    uiSchema,
    suppressDuplicateFiltering,
    schema,
  );
  if (validationError) {
    errors = [...errors, { stack: validationError.message }];
  }
  if (typeof transformErrors === 'function') {
    errors = transformErrors(errors, uiSchema);
  }

  let errorSchema = toErrorSchema<T>(errors);
  if (validationError) {
    errorSchema = {
      ...errorSchema,
      $schema: { __errors: [validationError.message] },
    };
  }
  if (typeof customValidate !== 'function') {
    return { errors, errorSchema };
  }

  const newFormData = getDefaultFormState<T, S, F>(
    validator,
    schema,
    formData,
    schema,
    true,
  ) as T;
  const errorHandler = customValidate(
    newFormData,
    createErrorHandler<T>(newFormData),
    uiSchema,
  );
  const userErrorSchema = unwrapErrorHandler<T>(errorHandler);
  return validationDataMerge<T>({ errors, errorSchema }, userErrorSchema);
}
