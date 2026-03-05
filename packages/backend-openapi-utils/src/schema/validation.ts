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
import { CompletedRequest, CompletedResponse } from 'mockttp';
import { OpenAPIObject, OperationObject } from 'openapi3-ts';
import Ajv from 'ajv';
import Parser from '@apidevtools/swagger-parser';
import { Operation, Validator, ValidatorParams } from './types';
import { ParameterValidator } from './parameter-validation';
import { OperationError } from './errors';
import { RequestBodyParser } from './request-body-validation';
import { mockttpToFetchRequest, mockttpToFetchResponse } from './utils';
import { ResponseBodyParser } from './response-body-validation';

const ajv = new Ajv({ allErrors: true });

class RequestBodyValidator implements Validator {
  schema: OpenAPIObject;
  constructor(schema: OpenAPIObject) {
    this.schema = schema;
  }

  async validate({ pair, operation }: ValidatorParams) {
    const { request, response } = pair;
    if (response.statusCode === 400) {
      // If the response is a 400, then the request is invalid and we shouldn't validate the parameters
      return;
    }

    // NOTE: There may be a worthwhile optimization here to cache these results to avoid re-parsing the schema for every request. As is, I don't think this is a big deal.
    const parser = RequestBodyParser.fromOperation(operation, { ajv });
    const fetchRequest = mockttpToFetchRequest(request);
    await parser.parse(fetchRequest);
  }
}

class ResponseBodyValidator implements Validator {
  schema: OpenAPIObject;
  constructor(schema: OpenAPIObject) {
    this.schema = schema;
  }

  async validate({ pair, operation }: ValidatorParams) {
    const { response } = pair;
    // NOTE: There may be a worthwhile optimization here to cache these results to avoid re-parsing the schema for every request. As is, I don't think this is a big deal.
    const parser = ResponseBodyParser.fromOperation(operation, { ajv });
    const fetchResponse = mockttpToFetchResponse(response);
    await parser.parse(fetchResponse);
  }
}

/**
 * Find an operation in an OpenAPI schema that matches a request. This is done by comparing the request URL to the paths in the schema.
 * @param openApiSchema - The OpenAPI schema to search for the operation in.
 * @param request - The request to find the operation for.
 * @returns A tuple of the path and the operation object that matches the request.
 */
export function findOperationByRequest(
  openApiSchema: OpenAPIObject,
  request: CompletedRequest,
): [string, OperationObject] | undefined {
  const { url } = request;
  const { pathname } = new URL(url);

  const parts = pathname.split('/');
  for (const [path, schema] of Object.entries(openApiSchema.paths)) {
    const pathParts = path.split('/');
    if (parts.length !== pathParts.length) {
      continue;
    }
    let found = true;
    for (let i = 0; i < parts.length; i++) {
      if (pathParts[i] === parts[i]) {
        continue;
      }
      // If the path part is a parameter, we can count it as a match. eg /api/{id} will match /api/1
      if (pathParts[i].startsWith('{') && pathParts[i].endsWith('}')) {
        continue;
      }
      found = false;
      break;
    }
    if (!found) {
      continue;
    }
    let matchingOperationType: OperationObject | undefined = undefined;
    for (const [operationType, operation] of Object.entries(schema)) {
      if (operationType === request.method.toLowerCase()) {
        matchingOperationType = operation as OperationObject;
        break;
      }
    }
    if (!matchingOperationType) {
      continue;
    }
    return [path, matchingOperationType];
  }

  return undefined;
}

export class OpenApiProxyValidator {
  schema: OpenAPIObject | undefined;
  validators: Validator[] | undefined;

  async initialize(url: string) {
    this.schema = (await Parser.dereference(url)) as unknown as OpenAPIObject;
    this.validators = [
      new ParameterValidator(this.schema),
      new RequestBodyValidator(this.schema),
      new ResponseBodyValidator(this.schema),
    ];
  }

  async validate(request: CompletedRequest, response: CompletedResponse) {
    const operationPathTuple = findOperationByRequest(this.schema!, request);
    if (!operationPathTuple) {
      throw new OperationError(
        { path: request.path, method: request.method } as Operation,
        `No operation schema found for ${request.url}`,
      );
    }

    const [path, operationSchema] = operationPathTuple;
    const operation = { path, method: request.method, schema: operationSchema };

    const validators = this.validators!;
    await Promise.all(
      validators.map(validator =>
        validator.validate({
          pair: { request, response },
          operation,
        }),
      ),
    );
  }
}
