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

/**
 * Escapes a single segment for use in a JSON Pointer (RFC 6901).
 */
export function escapeJsonPointerSegment(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}

/**
 * Converts ajv errors into validation issues.
 *
 * @param errors - The errors of a failed ajv validation.
 * @param pathPrefix - A JSON Pointer to the validated value, for example
 * `/body` or `/query/limit`.
 */
export function validationIssuesFromAjv(
  errors: ReadonlyArray<ErrorObject>,
  pathPrefix: string = '',
): ValidationIssue[] {
  return errors.map(error => {
    // ajv escapes the instance path, but not the property names in params.
    let path = `${pathPrefix}${error.instancePath}`;
    const { code, param } = keywordInfo(error.keyword);
    const property = param ? error.params?.[param] : undefined;
    if (property !== undefined) {
      path += `/${escapeJsonPointerSegment(String(property))}`;
    }
    return {
      path,
      message: error.message ?? `must pass "${error.keyword}" validation`,
      code,
    };
  });
}

/**
 * Converts the error items of an express-openapi-validator error into
 * validation issues with JSON Pointer paths.
 *
 * @remarks
 *
 * express-openapi-validator appends the name of a missing or unknown property
 * to the path without escaping it. The name of a missing property is read
 * from the message and escaped. The name of an unknown property cannot be
 * told apart from the rest of the path, so a name that contains `/` or `~`
 * may be misplaced in the path until express-openapi-validator escapes it.
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
    let path: string;
    const query = /^(?:\/query\/|\.query\.)(.*)$/.exec(rawPath);
    if (errorCode?.endsWith(OPENAPI_VALIDATION_CODE_SUFFIX)) {
      // Schema validation errors from ajv, which are rooted at the request
      // data, for example `/body/location`.
      const keyword = errorCode.slice(
        0,
        -OPENAPI_VALIDATION_CODE_SUFFIX.length,
      );
      code = keywordInfo(keyword).code;
      path = rawPath;
      if (keyword === 'required') {
        const property = /^must have required property '(.*)'$/.exec(
          message,
        )?.[1];
        if (property !== undefined && path.endsWith(`/${property}`)) {
          path = `${path.slice(
            0,
            path.length - property.length,
          )}${escapeJsonPointerSegment(property)}`;
        }
      }
    } else if (query) {
      path = `/query/${escapeJsonPointerSegment(query[1])}`;
    } else {
      // Other errors, such as an unsupported media type, carry the URL path
      // of the request rather than a location in it, so they refer to the
      // request as a whole. They are not schema failures, so they are `custom`.
      path = '';
    }

    return { path, message, code };
  });
}
