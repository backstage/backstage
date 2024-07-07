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

import { JsonObject } from '@backstage/types';
import { Operation, ParserOptions, RequestParser } from './types';
import { ValidateFunction } from 'ajv';
import { OperationError } from './errors';

export class RequestBodyParser
  implements RequestParser<JsonObject | undefined>
{
  operation: Operation;
  validate:
    | { fn: ValidateFunction; disabled: false }
    | {
        fn: undefined;
        disabled: true;
      };
  constructor(operation: Operation, options: ParserOptions) {
    this.operation = operation;
    const { schema: operationSchema } = this.operation;
    const requestBody = operationSchema.requestBody;
    if (!requestBody) {
      this.validate = { disabled: true, fn: undefined };
      return;
    }

    if ('$ref' in requestBody!) {
      throw new OperationError(
        this.operation,
        'Reference objects are not supported',
      );
    }
    if (!requestBody!.content) {
      throw new OperationError(
        this.operation,
        'No content found in request body',
      );
    }
    if (!requestBody!.content['application/json']) {
      throw new OperationError(
        this.operation,
        'No application/json content type found in request body',
      );
    }
    const schema = requestBody!.content['application/json'].schema;
    if (!schema) {
      throw new OperationError(
        this.operation,
        'No JSON schema found in request body',
      );
    }
    if ('$ref' in schema) {
      throw new OperationError(
        this.operation,
        'Reference objects are not supported',
      );
    }
    this.validate = {
      disabled: false,
      fn: options.ajv.compile(operation.schema),
    };
  }
  async parse(request: Request): Promise<JsonObject | undefined> {
    const { disabled, fn } = this.validate;
    const bodyText = await request.text();
    if (!disabled && bodyText?.length) {
      throw new OperationError(
        this.operation,
        `No request body found for ${request.url}`,
      );
    } else if (disabled && !bodyText?.length) {
      // If there is no request body in the schema and no body in the request, then the request is valid
      return undefined;
    } else if (disabled && bodyText?.length) {
      throw new OperationError(
        this.operation,
        'Received a body but no schema was found',
      );
    }

    const contentType =
      request.headers.get('content-type') || 'application/json';
    if (contentType !== 'application/json') {
      throw new OperationError(
        this.operation,
        'Content type is not application/json',
      );
    }
    const body = (await request.json()) as JsonObject;
    const valid = fn!(body);
    if (!valid) {
      console.log(body);
      console.error(fn!.errors);
      throw new OperationError(
        this.operation,
        `Request body validation failed.`,
      );
    }
    return body;
  }
}
