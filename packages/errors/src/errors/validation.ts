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
  /** A machine readable code for the failure, such as `invalid_type`. */
  code?: string;
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
 * supported without depending on zod directly.
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
      item.code = issue.code;
    }
    return item;
  });
}
