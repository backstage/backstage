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

import { OpenAPIObject, ParameterObject, SchemaObject } from 'openapi3-ts';
import {
  Operation,
  ParserOptions,
  RequestParser,
  Validator,
  ValidatorParams,
} from './types';
import Ajv from 'ajv';
import { OperationError, OperationParsingError } from './errors';
import { mockttpToFetchRequest } from './utils';

type ReferencelessSchemaObject = SchemaObject & { $ref?: never };

type ReferencelessParameterObject = Omit<ParameterObject, 'schema'> & {
  schema: ReferencelessSchemaObject;
};

class BaseParameterParser {
  ajv: Ajv;
  operation: Operation;
  parameters: Record<string, ReferencelessParameterObject> = {};
  constructor(
    parameterIn: string,
    operation: Operation,
    options: ParserOptions,
  ) {
    this.ajv = options.ajv;
    this.operation = operation;
    const { schema, path, method } = operation;
    const parameters = schema.parameters || [];
    for (const parameter of parameters) {
      if ('$ref' in parameter) {
        throw new Error(
          `[(${method}) ${path}] Reference objects are not supported`,
        );
      }

      if (!parameter.schema) {
        throw new OperationError(
          operation,
          'Schema not found for path parameter',
        );
      }
      if ('$ref' in parameter.schema) {
        throw new OperationError(
          this.operation,
          'Reference objects are not supported for parameters',
        );
      }
      if (parameter.in === parameterIn) {
        this.parameters[parameter.name] =
          parameter as ReferencelessParameterObject;
      }
    }
  }

  optimisticallyParseValue(value: string, schema: SchemaObject) {
    if (schema.type === 'integer') {
      return parseInt(value, 10);
    }
    if (schema.type === 'number') {
      return parseFloat(value);
    }
    return value;
  }
}

export class QueryParameterParser
  extends BaseParameterParser
  implements RequestParser<Record<string, any>>
{
  constructor(operation: Operation, options: ParserOptions) {
    super('query', operation, options);
  }
  async parse(request: Request) {
    const { searchParams } = new URL(request.url);
    const remainingQueryParameters = new Set<string>(searchParams.keys());
    const queryParameters: Record<string, any> = {};
    const parameterIterator = Object.entries(this.parameters).toSorted(
      ([_, parameter]) => {
        if (parameter.schema.type !== 'object') {
          return -1;
        }
        if (parameter.style === 'form' || !parameter.style) {
          if (parameter.explode || typeof parameter.explode === 'undefined') {
            return 1;
          }
          return 0;
        }
        return 0;
      },
    );
    for (const [name, parameter] of parameterIterator) {
      if (!parameter.schema) {
        throw new OperationError(
          this.operation,
          'Schema not found for query parameter',
        );
      }
      if ('$ref' in parameter.schema) {
        throw new OperationError(
          this.operation,
          'Reference objects are not supported for parameters',
        );
      }
      // eslint-disable-next-line prefer-const
      let [param, indices]: [any | null, string[]] = this.#findQueryParameters(
        this.parameters,
        queryParameters,
        searchParams,
        name,
      );
      if (!!param) {
        indices.forEach(index => remainingQueryParameters.delete(index));
      }
      if (parameter.schema.type !== 'array' && Array.isArray(param)) {
        param = param.length > 0 ? param[0] : undefined;
      }
      if (
        parameter.required &&
        !indices.some(index => searchParams.has(index))
      ) {
        throw new OperationError(
          this.operation,
          `Required query parameter ${name} not found`,
        );
      } else if (!param && !parameter.required) {
        continue;
      }
      if (param) {
        param = this.optimisticallyParseValue(param, parameter.schema);
      }
      const validate = this.ajv.compile(parameter.schema);
      const valid = validate(param);
      if (!valid) {
        throw new OperationParsingError(
          this.operation,
          'Query parameter',
          validate.errors!,
        );
      }
      queryParameters[name] = param;
    }
    if (remainingQueryParameters.size > 0) {
      throw new OperationError(
        this.operation,
        `Unexpected query parameters: ${Array.from(
          remainingQueryParameters,
        ).join(', ')}`,
      );
    }
    return queryParameters;
  }

  #findQueryParameters(
    parameters: Record<string, ParameterObject>,
    currentQueryParameters: Record<string, any>,
    searchParams: URLSearchParams,
    name: string,
  ): [any | null, string[]] {
    const parameter = parameters[name];
    const schema = parameter.schema as SchemaObject;

    const getIfExists = (key: string) =>
      searchParams.has(key) ? searchParams.getAll(key) : null;

    if (schema.type === 'array') {
      if (parameter.style === 'form' || !parameter.style) {
        if (parameter.explode || typeof parameter.explode === 'undefined') {
          if (!searchParams.has(name) && searchParams.has(`${name}[0]`)) {
            const values: string[] = [];
            const indices: string[] = [];
            let index = 0;
            while (searchParams.has(`${name}[${index}]`)) {
              values.push(searchParams.get(`${name}[${index}]`)!);
              indices.push(`${name}[${index}]`);
              index++;
            }
            return [values, indices];
          }
          return [getIfExists(name), [name]];
        }
        if (!searchParams.has(name) && searchParams.has(`${name}[]`)) {
          return [searchParams.get(`${name}[]`)?.split(','), [`${name}[]`]];
        }
        if (searchParams.has(name) && searchParams.getAll(name).length > 1) {
          throw new OperationError(
            this.operation,
            'Array parameter should not have multiple values',
          );
        }
        return [searchParams.get(name)?.split(','), [name]];
      } else if (parameter.style === 'spaceDelimited') {
        return [searchParams.get(name)?.split(' '), [name]];
      } else if (parameter.style === 'pipeDelimited') {
        return [searchParams.get(name)?.split('|'), [name]];
      }
      throw new OperationError(
        this.operation,
        'Unsupported style for array parameter',
      );
    }
    if (schema.type === 'object') {
      if (parameter.style === 'form' || !parameter.style) {
        if (parameter.explode) {
          const obj: Record<string, string> = {};
          const indices: string[] = [];
          for (const [key, value] of searchParams.entries()) {
            if (
              this.#matchesOtherQueryParameters(currentQueryParameters, key)
            ) {
              continue;
            }
            indices.push(key);
            obj[key] = value;
          }
          return [obj, indices];
        }
        const obj: Record<string, string> = {};
        const value = searchParams.get(name);
        if (value) {
          const parts = value.split(',');
          if (parts.length % 2 !== 0) {
            throw new OperationError(
              this.operation,
              'Invalid object parameter',
            );
          }
          for (let i = 0; i < parts.length; i += 2) {
            obj[parts[i]] = parts[i + 1];
          }
        }
        return [obj, [name]];
      } else if (parameter.style === 'deepObject') {
        const obj: Record<string, any> = {};
        const indices: string[] = [];
        for (const [key, value] of searchParams.entries()) {
          if (key.startsWith(`${name}[`)) {
            indices.push(key);
            const parts = key.split('[');
            let currentLayer = obj;
            for (let partIndex = 1; partIndex < parts.length - 1; partIndex++) {
              const part = parts[partIndex];
              if (!part.includes(']')) {
                throw new OperationError(
                  this.operation,
                  'Invalid object parameter',
                );
              }
              const objKey = part.split(']')[0];
              if (!currentLayer[objKey]) {
                currentLayer[objKey] = {};
              }
              currentLayer = currentLayer[objKey];
            }
            const lastPart = parts[parts.length - 1];
            if (!lastPart.includes(']')) {
              throw new OperationError(
                this.operation,
                'Invalid object parameter',
              );
            }
            currentLayer[lastPart.split(']')[0]] = value;
          }
        }
        return [obj, indices];
      }
      throw new OperationError(
        this.operation,
        'Unsupported style for object parameter',
      );
    }
    // For everything else, just return the value.
    return [getIfExists(name), [name]];
  }

  #matchesOtherQueryParameters(
    parameters: Record<string, any>,
    nameToMatch: string,
  ) {
    for (const [name] of Object.entries(parameters)) {
      if (name === nameToMatch) {
        return true;
      }
    }
    return false;
  }
}

export class HeaderParameterParser
  extends BaseParameterParser
  implements RequestParser<Record<string, any>>
{
  constructor(operation: Operation, options: ParserOptions) {
    super('header', operation, options);
  }
  async parse(request: Request) {
    const headerParameters: Record<string, any> = {};
    for (const [name, parameter] of Object.entries(this.parameters)) {
      const header = request.headers.get(name);
      if (!header) {
        if (parameter.required) {
          throw new OperationError(
            this.operation,
            `Header parameter ${name} not found`,
          );
        }
        continue;
      }
      if (!parameter.schema) {
        throw new OperationError(
          this.operation,
          'Schema not found for header parameter',
        );
      }
      if ('$ref' in parameter.schema) {
        throw new OperationError(
          this.operation,
          'Reference objects are not supported for parameters',
        );
      }
      const validate = this.ajv.compile(parameter.schema);
      const valid = validate(header);

      if (!valid) {
        throw new OperationParsingError(
          this.operation,
          'Header parameter',
          validate.errors!,
        );
      }
      headerParameters[name] = header;
    }
    return headerParameters;
  }
}

export class PathParameterParser
  extends BaseParameterParser
  implements RequestParser<Record<string, any>>
{
  constructor(operation: Operation, options: ParserOptions) {
    super('path', operation, options);
  }
  async parse(request: Request) {
    const { pathname } = new URL(request.url);
    const params = PathParameterParser.parsePath({
      operation: this.operation,
      path: pathname,
      schema: this.operation.path,
    });
    const pathParameters: Record<string, any> = {};
    for (const [name, parameter] of Object.entries(this.parameters)) {
      let param: string | number = params[name];
      if (!param && parameter.required) {
        throw new OperationError(
          this.operation,
          `Path parameter ${name} not found`,
        );
      } else if (!params[name] && !parameter.required) {
        continue;
      }

      if (param) {
        param = this.optimisticallyParseValue(param, parameter.schema);
      }

      const validate = this.ajv.compile(parameter.schema);
      const valid = validate(param);

      if (!valid) {
        throw new OperationParsingError(
          this.operation,
          'Path parameter',
          validate.errors!,
        );
      }
      pathParameters[name] = param;
    }
    return pathParameters;
  }

  static parsePath({
    operation,
    schema,
    path,
  }: {
    operation: Operation;
    schema: string;
    path: string;
  }) {
    const parts = path.split('/');
    const pathParts = schema.split('/');
    if (parts.length !== pathParts.length) {
      throw new OperationError(operation, 'Path parts do not match');
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
}

export class ParameterValidator implements Validator {
  schema: OpenAPIObject;
  cache: Record<string, any> = {};
  constructor(schema: OpenAPIObject) {
    this.schema = schema;
  }

  async validate({ pair: { request, response }, operation }: ValidatorParams) {
    if (response.statusCode === 400) {
      // If the response is a 400, then the request is invalid and we shouldn't validate the parameters
      return;
    }

    const ajv = new Ajv();
    const queryParser = new QueryParameterParser(operation, { ajv });
    const headerParser = new HeaderParameterParser(operation, { ajv });
    const pathParser = new PathParameterParser(operation, { ajv });

    const fetchRequest = mockttpToFetchRequest(request);

    await Promise.all([
      queryParser.parse(fetchRequest),
      headerParser.parse(fetchRequest),
      pathParser.parse(fetchRequest),
    ]);
  }
}
