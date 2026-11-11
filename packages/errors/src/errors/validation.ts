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
 * @remarks
 *
 * The type follows the `Issue` interface of
 * {@link https://standardschema.dev | Standard Schema}, so it can be used
 * wherever a Standard Schema issue is expected. The path segments are limited
 * to strings and numbers so that issues can be serialized as JSON.
 *
 * @public
 */
export type ValidationIssue = {
  /** A human readable explanation of why the value is invalid. */
  message: string;
  /**
   * The keys from the root of the input to the value that failed validation,
   * for example `['body', 'entity', 'metadata', 'name']` or
   * `['query', 'limit']`. Array indices are numbers. The path is omitted when
   * the issue refers to the whole input.
   */
  path?: ReadonlyArray<string | number>;
  /**
   * A machine readable code for the failure, from a closed list that follows
   * the issue codes of zod v4. See {@link ValidationIssueCode}.
   */
  code?: ValidationIssueCode;
};

/**
 * Converts a single issue path segment into a string or number key.
 */
function toPathSegment(
  segment: PropertyKey | { readonly key: PropertyKey },
): string | number {
  const key = typeof segment === 'object' ? segment.key : segment;
  return typeof key === 'symbol' ? String(key) : key;
}

/**
 * Converts the issues of a zod error into validation issues.
 *
 * @remarks
 *
 * The error is matched by its shape, so zod v3 and v4 errors are supported
 * without depending on zod directly, as are other lists of Standard Schema
 * issues. Issue codes are converted to the zod v4 names, and codes without a
 * v4 equivalent become `custom`. Symbol path segments are converted to
 * strings.
 *
 * @public
 * @param error - A zod error, or any object with a matching `issues` array.
 * @param options - Optional conversion options.
 */
export function validationIssuesFromZod(
  error: {
    issues: ReadonlyArray<{
      path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }>;
      message: string;
      code?: string;
    }>;
  },
  options?: {
    /** Keys to prepend to the path of every issue, for example `['body']`. */
    pathPrefix?: ReadonlyArray<string | number>;
  },
): ValidationIssue[] {
  return error.issues.map(issue => {
    const item: ValidationIssue = { message: issue.message };
    const path = [
      ...(options?.pathPrefix ?? []),
      ...(issue.path ?? []).map(toPathSegment),
    ];
    if (path.length > 0) {
      item.path = path;
    }
    if (issue.code !== undefined) {
      item.code = ZOD_CODES[issue.code] ?? 'custom';
    }
    return item;
  });
}
