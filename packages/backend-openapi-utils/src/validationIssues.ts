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

import type { ValidationIssue } from '@backstage/errors';
import type { ErrorObject } from 'ajv';

const OPENAPI_VALIDATION_CODE_SUFFIX = '.openapi.validation';

/**
 * The keywords whose ajv errors point at the parent object, with the name of
 * the offending property in `params`.
 */
const PROPERTY_PARAMS: Record<string, string> = {
  required: 'missingProperty',
  additionalProperties: 'additionalProperty',
  unevaluatedProperties: 'unevaluatedProperty',
};

/**
 * Escapes a single segment for use in a JSON Pointer (RFC 6901).
 */
export function escapeJsonPointerSegment(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}

function unescapeJsonPointerSegment(segment: string): string {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

/**
 * How many candidate parent objects to check when locating a property name
 * that contains slashes. Each check costs time proportional to the length of
 * the path, so this bounds the total work for long paths.
 */
const MAX_PARENT_CANDIDATES = 8;

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
    const paramName = PROPERTY_PARAMS[error.keyword];
    const property = paramName ? error.params?.[paramName] : undefined;
    if (property !== undefined) {
      path += `/${escapeJsonPointerSegment(String(property))}`;
    }
    return {
      path,
      message: error.message ?? `must pass "${error.keyword}" validation`,
      code: `${error.keyword}${OPENAPI_VALIDATION_CODE_SUFFIX}`,
    };
  });
}

/**
 * The parts of a request that express-openapi-validator validates, keyed the
 * same way as the root of its error paths.
 */
export type ValidatedRequestData = {
  body?: unknown;
  query?: unknown;
  headers?: unknown;
  params?: unknown;
  cookies?: unknown;
};

/**
 * express-openapi-validator joins the escaped instance path from ajv with the
 * raw property name for some keywords, such as `/body/a~1b/x/y` for a missing
 * `x/y` property. This finds where the raw property name starts and escapes it.
 */
function fixPropertyPath(
  path: string,
  keyword: string,
  message: string,
  data: ValidatedRequestData,
): string {
  if (keyword === 'required') {
    const match = /^must have required property '(.*)'$/.exec(message);
    const property = match?.[1];
    if (property !== undefined && path.endsWith(`/${property}`)) {
      const parent = path.slice(0, path.length - property.length - 1);
      return `${parent}/${escapeJsonPointerSegment(property)}`;
    }
    return path;
  }

  // The property exists in the request, so look for the parent object that
  // has it. The path and the request both come from the client, so this walks
  // the path once and only checks a bounded number of candidate parents,
  // keeping the work linear in the length of the path.
  const segments = path.split('/');
  if (segments[0] !== '' || segments.length < 2) {
    return path;
  }

  // parents[depth] is the value at the pointer made of the first `depth`
  // segments, and offsets[depth] is the length of that pointer in `path`.
  const parents: unknown[] = [data];
  const offsets: number[] = [0];
  let node: unknown = data;
  for (let depth = 1; depth < segments.length - 1; depth++) {
    if (!node || typeof node !== 'object') {
      break;
    }
    const key = unescapeJsonPointerSegment(segments[depth]);
    if (!Object.prototype.hasOwnProperty.call(node, key)) {
      break;
    }
    node = (node as Record<string, unknown>)[key];
    parents.push(node);
    offsets.push(offsets[depth - 1] + 1 + segments[depth].length);
  }

  // Start with the deepest parent, since the property name is usually a
  // single segment.
  const lowestDepth = Math.max(0, parents.length - MAX_PARENT_CANDIDATES);
  for (let depth = parents.length - 1; depth >= lowestDepth; depth--) {
    const parent = parents[depth];
    const property = path.slice(offsets[depth] + 1);
    if (
      parent &&
      typeof parent === 'object' &&
      Object.prototype.hasOwnProperty.call(parent, property)
    ) {
      return `${path.slice(0, offsets[depth])}/${escapeJsonPointerSegment(
        property,
      )}`;
    }
  }
  return path;
}

/**
 * Converts the error items of an express-openapi-validator error into
 * validation issues with valid JSON Pointer paths.
 *
 * @param error - The error passed on by the validator middleware.
 * @param data - The parts of the request that were validated.
 * @returns The issues, or `undefined` if the error has no error items.
 */
export function validationIssuesFromValidatorError(
  error: Error,
  data: ValidatedRequestData,
): ValidationIssue[] | undefined {
  const items: unknown = (error as { errors?: unknown }).errors;
  if (!Array.isArray(items)) {
    return undefined;
  }
  return items.map(item => {
    const rawPath = typeof item?.path === 'string' ? item.path : '';
    const message = String(item?.message ?? '');
    const code =
      typeof item?.errorCode === 'string' ? item.errorCode : undefined;

    let path: string;
    if (code?.endsWith(OPENAPI_VALIDATION_CODE_SUFFIX)) {
      // Schema validation errors from ajv, which are rooted at the request
      // data, for example `/body/location`.
      const keyword = code.slice(0, -OPENAPI_VALIDATION_CODE_SUFFIX.length);
      path = PROPERTY_PARAMS[keyword]
        ? fixPropertyPath(rawPath, keyword, message, data)
        : rawPath;
    } else if (rawPath.startsWith('/query/')) {
      path = `/query/${escapeJsonPointerSegment(rawPath.slice(7))}`;
    } else if (rawPath.startsWith('.query.')) {
      path = `/query/${escapeJsonPointerSegment(rawPath.slice(7))}`;
    } else {
      // Other errors, such as an unsupported media type, carry the URL path
      // of the request rather than a location in it, so they refer to the
      // request as a whole.
      path = '';
    }

    const issue: ValidationIssue = { path, message };
    if (code !== undefined) {
      issue.code = code;
    }
    return issue;
  });
}
