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

import { Operation } from './types';
import { ErrorObject } from 'ajv';
import { humanifyAjvError } from './utils';

export class OperationError extends Error {
  constructor(operation: Operation, message: string) {
    super(
      `["${operation.method.toLocaleUpperCase('en-US')} ${
        operation.path
      }"] ${message}`,
    );
  }
}

export class OperationResponseError extends Error {
  constructor(operation: Operation, response: Response, message: string) {
    super(
      `["${operation.method.toLocaleUpperCase('en-US')} ${operation.path}" (${
        response.status
      })]: ${message}`,
    );
  }
}

export class OperationParsingError extends OperationError {
  constructor(operation: Operation, type: string, errors: ErrorObject[]) {
    super(
      operation,
      `${type} validation failed.\n - ${errors
        .map(humanifyAjvError)
        .join('\n - ')}`,
    );
  }
}

export class OperationParsingResponseError extends OperationResponseError {
  constructor(
    operation: Operation,
    response: Response,
    type: string,
    errors: ErrorObject[],
  ) {
    super(
      operation,
      response,
      `${type} validation failed.\n - ${errors
        .map(humanifyAjvError)
        .join('\n - ')}`,
    );
  }
}
