/*
 * Copyright 2024 The Backstage Authors
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
import { Operation } from './types';
import { ErrorObject } from 'ajv';
import { humanifyAjvError } from './utils';
import { validationIssuesFromAjv } from '../validationIssues';

export class OperationError extends Error {
  constructor(operation: Operation, message: string) {
    super(`["${operation.method.toUpperCase()} ${operation.path}"] ${message}`);
  }
}

export class OperationResponseError extends Error {
  constructor(operation: Operation, response: Response, message: string) {
    super(
      `["${operation.method.toUpperCase()} ${operation.path}" (${
        response.status
      })]: ${message}`,
    );
  }
}

export class OperationParsingError extends OperationError {
  /**
   * The individual validation failures, with paths rooted at the request, for
   * example `['body', 'name']` or `['query', 'limit']`.
   */
  readonly issues: ValidationIssue[];

  constructor(
    operation: Operation,
    type: string,
    errors: ErrorObject[],
    pathPrefix: ReadonlyArray<string | number>,
  ) {
    super(
      operation,
      `${type} validation failed.\n - ${errors
        .map(humanifyAjvError)
        .join('\n - ')}`,
    );
    this.issues = validationIssuesFromAjv(errors, pathPrefix);
  }
}

export class OperationParsingResponseError extends OperationResponseError {
  /**
   * The individual validation failures, with paths rooted at the response, for
   * example `['body', 'items', 0, 'name']`.
   */
  readonly issues: ValidationIssue[];

  constructor(
    operation: Operation,
    response: Response,
    type: string,
    errors: ErrorObject[],
    pathPrefix: ReadonlyArray<string | number>,
  ) {
    super(
      operation,
      response,
      `${type} validation failed.\n - ${errors
        .map(humanifyAjvError)
        .join('\n - ')}`,
    );
    this.issues = validationIssuesFromAjv(errors, pathPrefix);
  }
}
