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

import type { ValidationIssue, ValidationIssueCode } from '@backstage/errors';
import type { ErrorObject } from 'ajv';

const OPENAPI_VALIDATION_CODE_SUFFIX = '.openapi.validation';

/**
 * How each ajv keyword is reported. `code` is the zod v4 issue code, where a
 * missing required property is `invalid_type`, the same as in zod. Keywords
 * that are not listed are `custom`. `param` is set for the keywords whose
 * errors point at the parent object, and names the entry in the ajv `params`
 * that holds the offending property.
 */
const KEYWORDS: Record<string, { code: ValidationIssueCode; param?: string }> =
  {
    type: { code: 'invalid_type' },
    required: { code: 'invalid_type', param: 'missingProperty' },
    minLength: { code: 'too_small' },
    minItems: { code: 'too_small' },
    minimum: { code: 'too_small' },
    exclusiveMinimum: { code: 'too_small' },
    minProperties: { code: 'too_small' },
    maxLength: { code: 'too_big' },
    maxItems: { code: 'too_big' },
    maximum: { code: 'too_big' },
    exclusiveMaximum: { code: 'too_big' },
    maxProperties: { code: 'too_big' },
    format: { code: 'invalid_format' },
    pattern: { code: 'invalid_format' },
    enum: { code: 'invalid_value' },
    const: { code: 'invalid_value' },
    multipleOf: { code: 'not_multiple_of' },
    additionalProperties: {
      code: 'unrecognized_keys',
      param: 'additionalProperty',
    },
    unevaluatedProperties: {
      code: 'unrecognized_keys',
      param: 'unevaluatedProperty',
    },
    oneOf: { code: 'invalid_union' },
    anyOf: { code: 'invalid_union' },
  };

function keywordInfo(keyword: string): {
  code: ValidationIssueCode;
  param?: string;
} {
  return Object.prototype.hasOwnProperty.call(KEYWORDS, keyword)
    ? KEYWORDS[keyword]
    : { code: 'custom' };
}

type PathSegment = string | number;

/**
 * Converts a JSON Pointer (RFC 6901) into a list of path segments. Segments
 * made only of digits become numbers, to match the array indices of zod.
 */
function pointerToSegments(pointer: string): PathSegment[] {
  if (pointer === '') {
    return [];
  }
  return pointer
    .split('/')
    .slice(1)
    .map(segment => {
      const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
      return /^(0|[1-9]\d*)$/.test(key) ? Number(key) : key;
    });
}

/**
 * Creates a validation issue, leaving out the path if it is empty.
 */
function toIssue(
  path: PathSegment[],
  message: string,
  code: ValidationIssueCode,
): ValidationIssue {
  return path.length > 0 ? { path, message, code } : { message, code };
}

/**
 * Converts ajv errors into validation issues.
 *
 * @param errors - The errors of a failed ajv validation.
 * @param pathPrefix - The keys of the validated value, for example
 * `['body']` or `['query', 'limit']`.
 */
export function validationIssuesFromAjv(
  errors: ReadonlyArray<ErrorObject>,
  pathPrefix: ReadonlyArray<PathSegment> = [],
): ValidationIssue[] {
  return errors.map(error => {
    const path = [...pathPrefix, ...pointerToSegments(error.instancePath)];
    const { code, param } = keywordInfo(error.keyword);
    const property = param ? error.params?.[param] : undefined;
    if (property !== undefined) {
      path.push(String(property));
    }
    return toIssue(
      path,
      error.message ?? `must pass "${error.keyword}" validation`,
      code,
    );
  });
}

/**
 * Converts the error items of an express-openapi-validator error into
 * validation issues.
 *
 * @remarks
 *
 * express-openapi-validator appends the name of a missing or unknown property
 * to the path without escaping it. The name of a missing property is read
 * from the message, so it is kept whole. The name of an unknown property
 * cannot be told apart from the rest of the path, so a name that contains `/`
 * or `~` may be split or misread until express-openapi-validator escapes it.
 *
 * @param error - The error passed on by the validator middleware.
 * @returns The issues, or `undefined` if the error has no error items.
 */
export function validationIssuesFromValidatorError(
  error: Error,
): ValidationIssue[] | undefined {
  const items: unknown = (error as { errors?: unknown }).errors;
  if (!Array.isArray(items)) {
    return undefined;
  }
  return items.map(item => {
    const rawPath = typeof item?.path === 'string' ? item.path : '';
    const message = String(item?.message ?? '');
    const errorCode: string | undefined =
      typeof item?.errorCode === 'string' ? item.errorCode : undefined;

    let code: ValidationIssueCode = 'custom';
    let path: PathSegment[];
    const query = /^(?:\/query\/|\.query\.)(.*)$/.exec(rawPath);
    if (errorCode?.endsWith(OPENAPI_VALIDATION_CODE_SUFFIX)) {
      // Schema validation errors from ajv, which are rooted at the request
      // data, for example `/body/location`.
      const keyword = errorCode.slice(
        0,
        -OPENAPI_VALIDATION_CODE_SUFFIX.length,
      );
      code = keywordInfo(keyword).code;
      path = pointerToSegments(rawPath);
      if (keyword === 'required') {
        const property = /^must have required property '(.*)'$/.exec(
          message,
        )?.[1];
        if (property !== undefined && rawPath.endsWith(`/${property}`)) {
          path = [
            ...pointerToSegments(
              rawPath.slice(0, rawPath.length - property.length - 1),
            ),
            property,
          ];
        }
      }
    } else if (query) {
      path = ['query', query[1]];
    } else {
      // Other errors, such as an unsupported media type, carry the URL path
      // of the request rather than a location in it, so they refer to the
      // request as a whole. They are not schema failures, so they are `custom`.
      path = [];
    }

    return toIssue(path, message, code);
  });
}
