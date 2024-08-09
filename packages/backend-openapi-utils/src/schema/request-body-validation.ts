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
import { OperationError, OperationParsingError } from './errors';
import { RequestBodyObject, SchemaObject } from 'openapi3-ts';

class DisabledRequestBodyParser
  implements RequestParser<JsonObject | undefined>
{
  operation: Operation;
  constructor(operation: Operation) {
    this.operation = operation;
  }
  async parse(request: Request): Promise<JsonObject | undefined> {
    const bodyText = await request.text();
    if (bodyText?.length) {
      throw new OperationError(
        this.operation,
        'Received a body but no schema was found',
      );
    }
    return undefined;
  }
}
export class RequestBodyParser
  implements RequestParser<JsonObject | undefined>
{
  operation: Operation;
  disabled: boolean = false;
  validate!: ValidateFunction;
  schema!: SchemaObject;
  requestBodySchema!: RequestBodyObject;

  static fromOperation(operation: Operation, options: ParserOptions) {
    return operation.schema.requestBody
      ? new RequestBodyParser(operation, options)
      : new DisabledRequestBodyParser(operation);
  }

  constructor(operation: Operation, options: ParserOptions) {
    this.operation = operation;
    const { schema: operationSchema } = this.operation;
    const requestBody = operationSchema.requestBody;

    if (!requestBody) {
      throw new OperationError(
        this.operation,
        'No request body found in operation',
      );
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
    const contentTypes = requestBody!.content;
    const jsonContentType = Object.keys(contentTypes).find(contentType =>
      contentType.split(';').includes('application/json'),
    );
    if (!jsonContentType) {
      throw new OperationError(
        this.operation,
        'No application/json content type found in request body',
      );
    }
    const schema = requestBody!.content[jsonContentType].schema;
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
    this.validate = options.ajv.compile(schema);
    this.schema = schema;
    this.requestBodySchema = requestBody;
  }
  async parse(request: Request): Promise<JsonObject | undefined> {
    const bodyText = await request.text();
    if (this.requestBodySchema.required && !bodyText?.length) {
      throw new OperationError(
        this.operation,
        `No request body found for ${request.url}`,
      );
    }

    const contentType =
      request.headers.get('content-type') || 'application/json';
    if (!contentType.split(';').includes('application/json')) {
      throw new OperationError(
        this.operation,
        'Content type is not application/json',
      );
    }
    const body = (await request.json()) as JsonObject;
    const valid = this.validate(body);
    if (!valid) {
      throw new OperationParsingError(
        this.operation,
        `Request body`,
        this.validate.errors!,
      );
    }
    return body;
  }
}
