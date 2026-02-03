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

  /**
   * Attempt to transform a string value to its expected type, this allows Ajv to perform validation. As these are parameters,
   *  support for edge cases like nested type casting is not currently supported.
   * @param value
   * @param schema
   * @returns
   */
  optimisticallyParseValue(value: string, schema: SchemaObject) {
    if (schema.type === 'integer') {
      return parseInt(value, 10);
    }
    if (schema.type === 'number') {
      return parseFloat(value);
    }
    if (schema.type === 'boolean') {
      if (['true', 'false'].includes(value)) {
        return value === 'true';
      }
      throw new Error('Invalid boolean value must be either "true" or "false"');
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

    let parameterIterator = Object.entries(this.parameters);

    const isFormExplode = (parameter: ReferencelessParameterObject) => {
      return (
        parameter.schema?.type === 'object' &&
        (parameter.style === 'form' || !parameter.style) &&
        parameter.explode
      );
    };

    const regularParameters = parameterIterator.filter(
      ([_, parameter]) => !isFormExplode(parameter),
    );

    const formExplodeParameters = parameterIterator.filter(([_, parameter]) =>
      isFormExplode(parameter),
    );

    if (formExplodeParameters.length > 1) {
      throw new OperationError(
        this.operation,
        'Ambiguous query parameters, you cannot have 2 form explode parameters',
      );
    }

    // Sort the parameters so that form explode parameters are processed last.
    parameterIterator = [...regularParameters, ...formExplodeParameters];

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
        remainingQueryParameters,
        searchParams,
        name,
      );
      if (!!param) {
        indices.forEach(index => remainingQueryParameters.delete(index));
      }

      // The query parameters can be either a single value or an array of values, try to wrangle them into the expected format if they're not explicitly an array.
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
        // We do this here because all query parameters are strings but the schema will expect the real value.
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
    remainingQueryParameters: Set<string>,
    searchParams: URLSearchParams,
    name: string,
  ): [any | null, string[]] {
    const parameter = parameters[name];
    const schema = parameter.schema as SchemaObject;

    // Since getAll will return an empty array if the key is not found, we need to check if the key exists first.
    const getIfExists = (key: string) =>
      searchParams.has(key) ? searchParams.getAll(key) : null;

    if (schema.type === 'array') {
      // Form is the default array format.
      if (
        parameter.style === 'form' ||
        typeof parameter.style === 'undefined'
      ) {
        // As is explode = true.
        if (parameter.explode || typeof parameter.explode === 'undefined') {
          // Support for qs explode format. Every value is stored as a separate query parameter.
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
          // If not qs format, grab all values with the same name from search params.
          return [getIfExists(name), [name]];
        }
        // Add support for qs non-standard array format. This is helpful for search-backend, since that uses qs still.
        if (!searchParams.has(name) && searchParams.has(`${name}[]`)) {
          return [searchParams.get(`${name}[]`)?.split(','), [`${name}[]`]];
        }
        // Non-explode arrays should be comma separated.
        if (searchParams.has(name) && searchParams.getAll(name).length > 1) {
          throw new OperationError(
            this.operation,
            'Arrays must be comma separated in non-explode mode',
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
      // Form is the default object format.
      if (
        parameter.style === 'form' ||
        typeof parameter.style === 'undefined'
      ) {
        if (parameter.explode) {
          // Object form/explode is a collection of disjoint keys, there's no mapping for what they are so we collect all of them.
          // This means we need to run this as the last query parameter that is processed.
          const obj: Record<string, string> = {};
          const indices: string[] = [];
          for (const [key, value] of searchParams.entries()) {
            // Have we processed this query parameter as part of another parameter parsing? If not, consider it to be a part of this object.
            if (!remainingQueryParameters.has(key)) {
              continue;
            }
            indices.push(key);
            obj[key] = value;
          }
          return [obj, indices];
        }
        // For non-explode, the schema is comma separated key,value "pairs", so filter=key1,value1,key2,value2 would parse to {key1: value1, key2: value2}.
        const obj: Record<string, string> = {};
        const value = searchParams.get(name);
        if (value) {
          const parts = value.split(',');
          if (parts.length % 2 !== 0) {
            throw new OperationError(
              this.operation,
              'Invalid object query parameter, must have an even number of key-value pairs',
            );
          }
          for (let i = 0; i < parts.length; i += 2) {
            obj[parts[i]] = parts[i + 1];
          }
        }
        return [obj, [name]];
      } else if (parameter.style === 'deepObject') {
        // Deep object is a nested object structure, so we need to parse the keys to build the object.
        // example: ?filter[key1]=value1&filter[key2]=value2 => { key1: value1, key2: value2 }
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
                  `Invalid object parameter, missing closing bracket for key "${key}"`,
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
                `Invalid object parameter, missing closing bracket for key "${key}"`,
              );
            }
            currentLayer[lastPart.split(']')[0]] = value;
          }
        }
        return [obj, indices];
      }
      throw new OperationError(
        this.operation,
        `Unsupported style for object parameter, "${parameter.style}"`,
      );
    }
    // For everything else, just return the value.
    return [getIfExists(name), [name]];
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
      let param: string | number | boolean = params[name];
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
