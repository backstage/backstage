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
import {
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  ResponseObject,
  SchemaObject,
} from 'openapi3-ts';
import Ajv from 'ajv';
import Parser from '@apidevtools/swagger-parser';

const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}

interface RequestResponsePair {
  request: CompletedRequest;
  response: CompletedResponse;
}

interface ValidatorParams {
  pair: RequestResponsePair;
  operationSchema: OperationObject;
  path: string;
}

interface Validator {
  validate(pair: ValidatorParams): Promise<void>;
}

class RequestErrorFactory {
  static createRequestError(request: CompletedRequest, message: string): Error {
    return new Error(`[${request.url} (${request.method})]: ${message}`);
  }
}

export class ParameterValidator implements Validator {
  schema: OpenAPIObject;
  cache: Record<string, any> = {};
  constructor(schema: OpenAPIObject) {
    this.schema = schema;
  }

  async validate({
    pair: { request, response },
    operationSchema,
    path,
  }: ValidatorParams) {
    if (response.statusCode === 400) {
      // If the response is a 400, then the request is invalid and we shouldn't validate the parameters
      return;
    }
    const parameters = operationSchema.parameters;
    const queryParameters: Record<string, ParameterObject> = {};
    const headerParameters: Record<string, ParameterObject> = {};
    const pathParameters: Record<string, ParameterObject> = {};
    for (const parameter of parameters || []) {
      if ('$ref' in parameter) {
        throw RequestErrorFactory.createRequestError(
          request,
          'Reference objects are not supported',
        );
      }
      if (parameter.in === 'query') {
        queryParameters[parameter.name] = parameter;
      }
      if (parameter.in === 'header') {
        headerParameters[parameter.name] = parameter;
      }
      if (parameter.in === 'path') {
        pathParameters[parameter.name] = parameter;
      }
    }
    this.validateQueryParameters(queryParameters, request);
    this.validateHeaderParameters(headerParameters, request);
    this.validatePathParameters(pathParameters, request, path);
  }

  validateQueryParameters(
    queryParameters: Record<string, ParameterObject>,
    request: CompletedRequest,
  ) {
    const { searchParams } = new URL(request.url);
    for (const [name, parameter] of Object.entries(queryParameters)) {
      if (!parameter.schema) {
        throw RequestErrorFactory.createRequestError(
          request,
          'Schema not found for query parameter',
        );
      }
      if ('$ref' in parameter.schema) {
        throw RequestErrorFactory.createRequestError(
          request,
          'Reference objects are not supported for parameters',
        );
      }
      let param: any | null = this.#findQueryParameters(
        request,
        queryParameters,
        searchParams,
        name,
      );
      if (parameter.schema.type !== 'array' && Array.isArray(param)) {
        param = param.length > 0 ? param[0] : undefined;
      }

      if (!param && parameter.required) {
        throw RequestErrorFactory.createRequestError(
          request,
          `Required query parameter ${name} not found`,
        );
      } else if (!param && !parameter.required) {
        continue;
      }
      if (parameter.schema.type === 'integer') {
        // Try to parse the integer as AJV won't do it for us.
        param = parseInt(param, 10);
      }
      const validate = ajv.compile(parameter.schema);
      const valid = validate(param);
      if (!valid) {
        console.log(param);
        console.error(validate.errors);
        throw RequestErrorFactory.createRequestError(
          request,
          'Query parameter validation failed',
        );
      }
    }
  }

  #findQueryParameters(
    request: CompletedRequest,
    parameters: Record<string, ParameterObject>,
    searchParams: URLSearchParams,
    name: string,
  ) {
    const parameter = parameters[name];
    const schema = parameter.schema as SchemaObject;
    if (schema.type === 'array') {
      if (parameter.style === 'form' || !parameter.style) {
        if (parameter.explode || typeof parameter.explode === 'undefined') {
          if (!searchParams.has(name) && searchParams.has(`${name}[0]`)) {
            const values: string[] = [];
            let index = 0;
            while (searchParams.has(`${name}[${index}]`)) {
              values.push(searchParams.get(`${name}[${index}]`)!);
              index++;
            }
            return values;
          }
          return searchParams.getAll(name);
        }
        if (!searchParams.has(name) && searchParams.has(`${name}[]`)) {
          return searchParams.getAll(`${name}[]`);
        }
        return searchParams.get(name)?.split(',');
      } else if (parameter.style === 'spaceDelimited') {
        return searchParams.get(name)?.split(' ');
      } else if (parameter.style === 'pipeDelimited') {
        return searchParams.get(name)?.split('|');
      }
      throw RequestErrorFactory.createRequestError(
        request,
        'Unsupported style for array parameter',
      );
    }
    if (schema.type === 'object') {
      if (parameter.style === 'form' || !parameter.style) {
        if (parameter.explode) {
          const obj: Record<string, string> = {};
          for (const [key, value] of searchParams.entries()) {
            if (this.#matchesOtherQueryParameters(parameters, key)) {
              continue;
            }
            obj[key] = value;
          }
          console.log(obj);
          return obj;
        }
        const obj: Record<string, string> = {};
        const value = searchParams.get(name);
        if (value) {
          const parts = value.split(',');
          if (parts.length % 2 !== 0) {
            throw RequestErrorFactory.createRequestError(
              request,
              'Invalid object parameter',
            );
          }
          for (let i = 0; i < parts.length; i += 2) {
            obj[parts[i]] = parts[i + 1];
          }
        }
        return obj;
      } else if (parameter.style === 'deepObject') {
        const obj: Record<string, any> = {};
        for (const [key, value] of searchParams.entries()) {
          if (key.startsWith(`${name}[`)) {
            const parts = key.split('[');
            let currentLayer = obj;
            for (let partIndex = 0; partIndex < parts.length - 1; partIndex++) {
              const part = parts[partIndex];
              const objKey = part.split(']')[0];
              if (!currentLayer[objKey]) {
                currentLayer[objKey] = {};
              }
              currentLayer = currentLayer[objKey];
            }
            currentLayer[parts[parts.length - 1].split(']')[0]] = value;
          }
        }
        return obj;
      }
      throw RequestErrorFactory.createRequestError(
        request,
        'Unsupported style for object parameter',
      );
    }
    // For everything else, just return the value.
    return searchParams.getAll(name);
  }

  #matchesOtherQueryParameters(
    parameters: Record<string, ParameterObject>,
    nameToMatch: string,
  ) {
    for (const [name] of Object.entries(parameters)) {
      if (name === nameToMatch) {
        return true;
      }
    }
    return false;
  }

  validateHeaderParameters(
    headerParameters: Record<string, ParameterObject>,
    request: CompletedRequest,
  ) {
    for (const [name, parameter] of Object.entries(headerParameters)) {
      if (!request.headers[name]) {
        throw RequestErrorFactory.createRequestError(
          request,
          `Header parameter ${name} not found`,
        );
      }
      if (!parameter.schema) {
        throw RequestErrorFactory.createRequestError(
          request,
          'Schema not found for path parameter',
        );
      }
      if ('$ref' in parameter.schema) {
        throw RequestErrorFactory.createRequestError(
          request,
          'Reference objects are not supported for parameters',
        );
      }
      const validate = ajv.compile(parameter.schema);
      const valid = validate(request.headers[name]);

      if (!valid) {
        console.log(request.headers[name]);
        console.error(validate.errors);
        throw RequestErrorFactory.createRequestError(
          request,
          'Header parameter validation failed',
        );
      }
    }
  }

  validatePathParameters(
    pathParameters: Record<string, ParameterObject>,
    request: CompletedRequest,
    path: string,
  ) {
    const { pathname } = new URL(request.url);
    const params = parsePath({ request, path: pathname, schema: path });
    for (const [name, parameter] of Object.entries(pathParameters)) {
      if (!params[name] && parameter.required) {
        throw RequestErrorFactory.createRequestError(
          request,
          `Path parameter ${name} not found`,
        );
      }
      if (!parameter.schema) {
        throw RequestErrorFactory.createRequestError(
          request,
          'Schema not found for path parameter',
        );
      }
      if ('$ref' in parameter.schema) {
        throw RequestErrorFactory.createRequestError(
          request,
          'Reference objects are not supported for parameters',
        );
      }

      const validate = ajv.compile(parameter.schema);
      const valid = validate(params[name]);

      if (!valid) {
        console.log(params);
        console.error(validate.errors);
        throw RequestErrorFactory.createRequestError(
          request,
          'Path parameter validation failed',
        );
      }
    }
  }
}

function parsePath({
  request,
  schema,
  path,
}: {
  request: CompletedRequest;
  schema: string;
  path: string;
}) {
  const parts = path.split('/');
  const pathParts = schema.split('/');
  if (parts.length !== pathParts.length) {
    throw RequestErrorFactory.createRequestError(
      request,
      'Path parts do not match',
    );
  }
  const params: Record<string, string> = {};
  for (let i = 0; i < parts.length; i++) {
    if (pathParts[i] === parts[i]) {
      continue;
    }
    if (pathParts[i].startsWith('{') && pathParts[i].endsWith('}')) {
      params[pathParts[i].slice(1, -1)] = parts[i];
      continue;
    }
    break;
  }
  return params;
}

export class RequestBodyValidator implements Validator {
  schema: OpenAPIObject;
  constructor(schema: OpenAPIObject) {
    this.schema = schema;
  }

  async validate({
    pair: { request, response },
    operationSchema,
  }: ValidatorParams) {
    if (response.statusCode === 400) {
      // If the response is a 400, then the request is invalid and we shouldn't validate the request body
      return;
    }
    const requestBody = operationSchema.requestBody;
    const bodyText = await request.body.getText();
    if (!requestBody && bodyText?.length) {
      throw RequestErrorFactory.createRequestError(
        request,
        `No request body found for ${request.url}`,
      );
    } else if (!requestBody && !bodyText?.length) {
      // If there is no request body in the schema and no body in the request, then the request is valid
      return;
    }
    if ('$ref' in requestBody!) {
      throw RequestErrorFactory.createRequestError(
        request,
        'Reference objects are not supported',
      );
    }
    if (!requestBody!.content) {
      throw RequestErrorFactory.createRequestError(
        request,
        'No content found in request body',
      );
    }
    if (!requestBody!.content['application/json']) {
      throw RequestErrorFactory.createRequestError(
        request,
        'No application/json content type found in request body',
      );
    }
    const contentType = request.headers['content-type'];
    if (!contentType) {
      throw RequestErrorFactory.createRequestError(
        request,
        'Content type not found in request',
      );
    }
    if (contentType !== 'application/json') {
      throw RequestErrorFactory.createRequestError(
        request,
        'Content type is not application/json',
      );
    }
    const schema = requestBody!.content['application/json'].schema;
    if (!schema) {
      throw RequestErrorFactory.createRequestError(
        request,
        'No schema found in request body',
      );
    }
    if ('$ref' in schema) {
      throw RequestErrorFactory.createRequestError(
        request,
        'Reference objects are not supported',
      );
    }

    const validate = ajv.compile(schema);
    const body = await request.body.getJson();
    const valid = validate(body);
    if (!valid) {
      console.log(body);
      console.error(validate.errors);
      throw RequestErrorFactory.createRequestError(
        request,
        `Request body validation failed.`,
      );
    }
  }
}

export class ResponseBodyValidator implements Validator {
  schema: OpenAPIObject;
  constructor(schema: OpenAPIObject) {
    this.schema = schema;
  }

  async validate(pair: ValidatorParams) {
    const {
      pair: { response, request },
      operationSchema,
    } = pair;
    const responseSchema = this.findResponseSchema(operationSchema, response);
    if (!responseSchema) {
      throw RequestErrorFactory.createRequestError(
        request,
        `No response schema found for ${response.statusCode}`,
      );
    }
    const body = await response.body.getText();
    if (!responseSchema.content && body?.length) {
      throw RequestErrorFactory.createRequestError(
        request,
        'No content found in response',
      );
    } else if (!responseSchema.content && !body?.length) {
      // If there is no content in the response schema and no body in the response, then the response is valid
      return;
    }
    if (!responseSchema.content!['application/json']) {
      throw RequestErrorFactory.createRequestError(
        request,
        'No application/json content type found in response',
      );
    }
    const schema = responseSchema.content!['application/json'].schema;
    if (!schema) {
      throw RequestErrorFactory.createRequestError(
        request,
        'No schema found in response',
      );
    }
    if ('$ref' in schema) {
      throw RequestErrorFactory.createRequestError(
        request,
        'Reference objects are not supported',
      );
    }

    const validate = ajv.compile(schema);
    const valid = validate(await response.body.getJson());
    if (!valid) {
      console.log(await response.body.getJson());
      console.error(validate.errors);
      throw RequestErrorFactory.createRequestError(
        request,
        'Response body validation failed',
      );
    }
  }

  private findResponseSchema(
    operationSchema: OperationObject,
    response: CompletedResponse,
  ): ResponseObject | undefined {
    const { statusCode } = response;
    return operationSchema.responses?.[statusCode];
  }
}

export class OpenApiProxyValidator {
  schema: OpenAPIObject | undefined;
  validators: Validator[] | undefined;

  async initialize(url: string) {
    this.schema = (await Parser.dereference(url)) as unknown as OpenAPIObject;
    this.validators = [
      new ParameterValidator(this.schema),
      new RequestBodyValidator(this.schema),
      //   new ResponseBodyValidator(this.schema),
    ];
  }

  validate(request: CompletedRequest, response: CompletedResponse) {
    const operation = this.findOperation(request);
    if (!operation) {
      throw RequestErrorFactory.createRequestError(
        request,
        `No operation schema found for ${request.url}`,
      );
    }

    const [path, operationSchema] = operation;

    const validators = this.validators!;
    for (const validator of validators) {
      validator.validate({
        pair: { request, response },
        operationSchema,
        path,
      });
    }
  }

  private findOperation(
    request: CompletedRequest,
  ): [string, OperationObject] | undefined {
    const { url } = request;
    const { pathname } = new URL(url);

    const parts = pathname.split('/');
    for (const [path, schema] of Object.entries(this.schema!.paths)) {
      const pathParts = path.split('/');
      if (parts.length !== pathParts.length) {
        continue;
      }
      let found = true;
      for (let i = 0; i < parts.length; i++) {
        if (pathParts[i] === parts[i]) {
          continue;
        }
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
}
