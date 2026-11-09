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
 * The closed list of codes that a {@link ValidationIssue} can have.
 *
 * @remarks
 *
 * The names follow the issue codes of zod v4, regardless of which validator
 * reported the failure:
 *
 * - `invalid_type`: the value has the wrong type, or is missing.
 * - `too_small`: a number, string, array or object is below its minimum.
 * - `too_big`: a number, string, array or object is above its maximum.
 * - `invalid_format`: a string does not match its format or pattern.
 * - `invalid_value`: the value is not one of the allowed values.
 * - `not_multiple_of`: a number is not a multiple of the required step.
 * - `unrecognized_keys`: an object has properties that are not allowed.
 * - `invalid_union`: the value matches none, or too many, of the alternatives.
 * - `custom`: any other failure.
 *
 * @public
 */
export type ValidationIssueCode =
  | 'invalid_type'
  | 'too_small'
  | 'too_big'
  | 'invalid_format'
  | 'invalid_value'
  | 'not_multiple_of'
  | 'unrecognized_keys'
  | 'invalid_union'
  | 'custom';

/**
 * Maps the issue codes of zod v3 and v4 onto {@link ValidationIssueCode}.
 * Codes that are not listed, including those of other zod versions, become
 * `custom`.
 */
const ZOD_CODES: Record<string, ValidationIssueCode> = {
  invalid_type: 'invalid_type',
  too_small: 'too_small',
  too_big: 'too_big',
  invalid_format: 'invalid_format',
  invalid_value: 'invalid_value',
  not_multiple_of: 'not_multiple_of',
  unrecognized_keys: 'unrecognized_keys',
  invalid_union: 'invalid_union',
  custom: 'custom',
  // zod v3 codes that were renamed in v4
  invalid_string: 'invalid_format',
  invalid_enum_value: 'invalid_value',
  invalid_literal: 'invalid_value',
  invalid_date: 'invalid_type',
  invalid_union_discriminator: 'invalid_union',
  invalid_arguments: 'invalid_type',
  invalid_return_type: 'invalid_type',
  not_finite: 'invalid_type',
  invalid_intersection_types: 'custom',
};

/**
 * A single validation failure for one value in a request.
 *
 * The member names follow zod issues, except that `path` is always a JSON
 * Pointer string rather than an array of path segments.
 *
 * @public
 */
export type ValidationIssue = {
  /**
   * The location of the value that failed validation, as a JSON Pointer
   * (RFC 6901) string such as `/body/entity/metadata/name` or `/query/limit`.
   * An empty string refers to the whole input.
   */
  path: string;
  /** A human readable explanation of why the value is invalid. */
  message: string;
  /**
   * A machine readable code for the failure, from a closed list that follows
   * the issue codes of zod v4. See {@link ValidationIssueCode}.
   */
  code?: ValidationIssueCode;
};

/**
 * Escapes a single path segment for use in a JSON Pointer.
 */
function escapePointerSegment(segment: PropertyKey): string {
  return String(segment).replace(/~/g, '~0').replace(/\//g, '~1');
}

/**
 * Converts a list of path segments into a JSON Pointer.
 */
function toJsonPointer(
  segments: ReadonlyArray<PropertyKey>,
  prefix: string = '',
): string {
  return `${prefix}${segments
    .map(segment => `/${escapePointerSegment(segment)}`)
    .join('')}`;
}

/**
 * Converts the issues of a zod error into validation issues.
 *
 * @remarks
 *
 * The error is matched by its shape, so both zod v3 and zod v4 errors are
 * supported without depending on zod directly. Issue codes are converted to
 * the zod v4 names, and codes without a v4 equivalent become `custom`.
 *
 * @public
 * @param error - A zod error, or any object with a matching `issues` array.
 * @param options - Optional conversion options.
 */
export function validationIssuesFromZod(
  error: {
    issues: ReadonlyArray<{
      path: ReadonlyArray<PropertyKey>;
      message: string;
      code?: string;
    }>;
  },
  options?: {
    /** A JSON Pointer to prepend to every issue, for example `/body`. */
    pathPrefix?: string;
  },
): ValidationIssue[] {
  return error.issues.map(issue => {
    const item: ValidationIssue = {
      path: toJsonPointer(issue.path, options?.pathPrefix),
      message: issue.message,
    };
    if (issue.code !== undefined) {
      item.code = ZOD_CODES[issue.code] ?? 'custom';
    }
    return item;
  });
}
