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

import _ from 'lodash';
import withQueryParameter from './__fixtures__/schemas/withQueryParameter.json';
import withPathParameter from './__fixtures__/schemas/withPathParameter.json';
import {
  PathParameterParser,
  QueryParameterParser,
} from './parameter-validation';
import { OperationObject, ParameterObject } from 'openapi3-ts';
import Ajv from 'ajv';
import { Operation } from './types';

const ajv = new Ajv();

describe('query parameters', () => {
  let operation: Operation;
  let parser: QueryParameterParser;
  let schema: (typeof withQueryParameter)['paths']['/api/search']['get'];

  beforeEach(() => {
    schema = _.cloneDeep(withQueryParameter.paths['/api/search'].get);
    operation = {
      schema: schema as OperationObject,
      path: '/api/search',
      method: 'get',
    };
    parser = new QueryParameterParser(operation, { ajv });
  });
  describe('primitives', () => {
    describe('string', () => {
      it('should parse a string', async () => {
        const request = {
          url: 'http://localhost:8080/api/search?param=hello',
        } as Request;
        const result = await parser.parse(request);
        expect(result.param).toBe('hello');
      });

      it('should throw an error if there are extra parameters', async () => {
        const request = {
          url: 'http://localhost:8080/api/search?param=hello&extra=world',
        } as Request;
        await expect(
          parser.parse(request),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"["GET /api/search"] Unexpected query parameters: extra"`,
        );
      });

      it('should throw an error if the parameter is required but missing', async () => {
        (schema.parameters![0] as ParameterObject).required = true;
        const request = {
          url: 'http://localhost:8080/api/search',
        } as Request;
        await expect(
          parser.parse(request),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"["GET /api/search"] Required query parameter param not found"`,
        );
      });
    });

    describe('number', () => {
      beforeEach(() => {
        schema.parameters![0].schema.type = 'number';
      });
      it('should parse a number', async () => {
        const request = {
          url: 'http://localhost:8080/api/search?param=42',
        } as Request;
        const result = await parser.parse(request);
        expect(result.param).toBe(42);
      });

      it('should throw an error if the parameter is not a number', async () => {
        const request = {
          url: 'http://localhost:8080/api/search?param=hello',
        } as Request;
        await expect(parser.parse(request)).rejects
          .toThrowErrorMatchingInlineSnapshot(`
          "["GET /api/search"] Query parameter validation failed.
           - Value should be of type number"
        `);
      });
    });
  });

  describe('arrays', () => {
    beforeEach(() => {
      schema.parameters![0].schema.type = 'array';
    });
    describe('form', () => {
      beforeEach(() => {
        (schema.parameters![0] as ParameterObject).style = 'form';
      });
      describe('explode=true', () => {
        beforeEach(() => {
          (schema.parameters![0] as ParameterObject).explode = true;
        });
        it('should parse a form array with a single element', async () => {
          const request = {
            url: 'http://localhost:8080/api/search?param=hello',
          } as Request;
          const result = await parser.parse(request);
          expect(result.param).toEqual(['hello']);
        });

        it('should parse a form array with multiple elements', async () => {
          const request = {
            url: 'http://localhost:8080/api/search?param=hello&param=world',
          } as Request;
          const result = await parser.parse(request);
          expect(result.param).toEqual(['hello', 'world']);
        });

        it('should throw for missing required parameters', async () => {
          (schema.parameters![0] as ParameterObject).required = true;
          const request = {
            url: 'http://localhost:8080/api/search',
          } as Request;
          await expect(
            parser.parse(request),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Required query parameter param not found"`,
          );
        });

        it('should throw for extra parameters', async () => {
          const request = {
            url: 'http://localhost:8080/api/search?param=hello&extra=world',
          } as Request;
          await expect(
            parser.parse(request),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Unexpected query parameters: extra"`,
          );
        });
      });

      describe('explode=false', () => {
        beforeEach(() => {
          (schema.parameters![0] as ParameterObject).explode = false;
        });

        it('should parse a form array with a single element', async () => {
          const request = {
            url: 'http://localhost:8080/api/search?param=hello',
          } as Request;
          const result = await parser.parse(request);
          expect(result.param).toEqual(['hello']);
        });

        it('should parse a form array with multiple elements', async () => {
          const request = {
            url: 'http://localhost:8080/api/search?param=hello,world',
          } as Request;
          const result = await parser.parse(request);
          expect(result.param).toEqual(['hello', 'world']);
        });

        it('should throw for missing required parameters', async () => {
          (schema.parameters![0] as ParameterObject).required = true;
          const request = {
            url: 'http://localhost:8080/api/search',
          } as Request;
          await expect(
            parser.parse(request),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Required query parameter param not found"`,
          );
        });

        it('should throw for extra parameters', async () => {
          const request = {
            url: 'http://localhost:8080/api/search?param=hello&extra=world',
          } as Request;
          await expect(
            parser.parse(request),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Unexpected query parameters: extra"`,
          );
        });
      });
    });

    describe('spaceDelimited', () => {
      beforeEach(() => {
        (schema.parameters![0] as ParameterObject).style = 'spaceDelimited';
      });

      it('should parse a space separated array', async () => {
        const request = {
          url: 'http://localhost:8080/api/search?param=hello%20world',
        } as Request;
        const result = await parser.parse(request);
        expect(result.param).toEqual(['hello', 'world']);
      });

      it('should throw for missing required parameters', async () => {
        (schema.parameters![0] as ParameterObject).required = true;
        const request = {
          url: 'http://localhost:8080/api/search',
        } as Request;
        await expect(
          parser.parse(request),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"["GET /api/search"] Required query parameter param not found"`,
        );
      });

      it('should throw for extra parameters', async () => {
        const request = {
          url: 'http://localhost:8080/api/search?param=hello%20world&extra=world',
        } as Request;
        await expect(
          parser.parse(request),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"["GET /api/search"] Unexpected query parameters: extra"`,
        );
      });
    });

    describe('pipeDelimited', () => {
      beforeEach(() => {
        (schema.parameters![0] as ParameterObject).style = 'pipeDelimited';
      });

      it('should parse a pipe separated array', async () => {
        const request = {
          url: 'http://localhost:8080/api/search?param=hello|world',
        } as Request;
        const result = await parser.parse(request);
        expect(result.param).toEqual(['hello', 'world']);
      });

      it('should throw for missing required parameters', async () => {
        (schema.parameters![0] as ParameterObject).required = true;
        const request = {
          url: 'http://localhost:8080/api/search',
        } as Request;
        await expect(
          parser.parse(request),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"["GET /api/search"] Required query parameter param not found"`,
        );
      });

      it('should throw for extra parameters', async () => {
        const request = {
          url: 'http://localhost:8080/api/search?param=hello|world&extra=world',
        } as Request;
        await expect(
          parser.parse(request),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"["GET /api/search"] Unexpected query parameters: extra"`,
        );
      });
    });
  });

  describe('objects', () => {
    describe('form', () => {
      beforeEach(() => {
        schema.parameters![0].schema.type = 'object';
      });

      describe('explode=true', () => {
        beforeEach(() => {
          (schema.parameters![0] as ParameterObject).explode = true;
        });

        it('should parse a form object with a single key', async () => {
          const request = {
            url: 'http://localhost:8080/api/search?key=value',
          } as Request;
          const result = await parser.parse(request);
          expect(result.param).toEqual({ key: 'value' });
        });

        it('should parse a form object with multiple keys', async () => {
          const request = {
            url: 'http://localhost:8080/api/search?key1=value1&key2=value2',
          } as Request;
          const result = await parser.parse(request);
          expect(result.param).toEqual({ key1: 'value1', key2: 'value2' });
        });

        it('should throw for missing required parameters', async () => {
          (schema.parameters![0] as ParameterObject).required = true;
          const request = {
            url: 'http://localhost:8080/api/search',
          } as Request;
          await expect(
            parser.parse(request),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Required query parameter param not found"`,
          );
        });

        it('should respect other parameter encodings', async () => {
          const parameter = {
            name: 'extra',
            in: 'query',
            style: 'form',
            explode: false,
            schema: { type: 'array' },
            required: false,
          } as ParameterObject;
          schema.parameters!.push(parameter as any);
          parser = new QueryParameterParser(operation, { ajv });
          const request = {
            url: 'http://localhost:8080/api/search?key=value&otherkey=value2&extra=hello,world',
          } as Request;

          const result = await parser.parse(request);
          expect(result.param).toEqual({
            key: 'value',
            otherkey: 'value2',
          });
          expect(result.extra).toEqual(['hello', 'world']);
        });

        it('should respect other object encodings', async () => {
          const parameter = {
            name: 'extra',
            in: 'query',
            style: 'deepObject',
            explode: true,
            schema: { type: 'object' },
            required: false,
          } as ParameterObject;
          schema.parameters!.push(parameter as any);
          parser = new QueryParameterParser(operation, { ajv });
          const request = {
            url: 'http://localhost:8080/api/search?key=value&otherkey=value2&extra[hello]=world',
          } as Request;

          const result = await parser.parse(request);
          expect(result.param).toEqual({
            key: 'value',
            otherkey: 'value2',
          });
          expect(result.extra).toEqual({ hello: 'world' });
        });

        it('should throw if there are 2 form explode parameters', async () => {
          const parameter = {
            name: 'extra',
            in: 'query',
            style: 'form',
            explode: true,
            schema: { type: 'object' },
            required: false,
          } as ParameterObject;
          schema.parameters!.push(parameter as any);
          parser = new QueryParameterParser(operation, { ajv });
          const request = {
            url: 'http://localhost:8080/api/search?key=value&otherkey=value2&extra[hello]=world',
          } as Request;

          await expect(() =>
            parser.parse(request),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Ambiguous query parameters, you cannot have 2 form explode parameters"`,
          );
        });
      });

      describe('explode=false', () => {
        beforeEach(() => {
          (schema.parameters![0] as ParameterObject).explode = false;
        });

        it('should parse a form object with a single key', async () => {
          const request = {
            url: 'http://localhost:8080/api/search?param=key,value',
          } as Request;
          const result = await parser.parse(request);
          expect(result.param).toEqual({ key: 'value' });
        });

        it('should parse a form object with multiple keys', async () => {
          const request = {
            url: 'http://localhost:8080/api/search?param=key1,value1,key2,value2',
          } as Request;
          const result = await parser.parse(request);
          expect(result.param).toEqual({ key1: 'value1', key2: 'value2' });
        });

        it('should throw for missing required parameters', async () => {
          (schema.parameters![0] as ParameterObject).required = true;
          const request = {
            url: 'http://localhost:8080/api/search',
          } as Request;
          await expect(
            parser.parse(request),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Required query parameter param not found"`,
          );
        });

        it('should throw for extra parameters', async () => {
          const request = {
            url: 'http://localhost:8080/api/search?param=key,value&extra=world',
          } as Request;
          await expect(
            parser.parse(request),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Unexpected query parameters: extra"`,
          );
        });
      });
    });

    describe('deepObject', () => {
      beforeEach(() => {
        (schema.parameters![0] as ParameterObject).style = 'deepObject';
        (schema.parameters![0] as ParameterObject).explode = true;
        (schema.parameters![0] as ParameterObject).schema = {
          type: 'object',
          properties: {
            key: {
              type: 'string',
            },
          },
        };
      });

      it('should parse a deep object', async () => {
        const request = {
          url: 'http://localhost:8080/api/search?param[key]=value',
        } as Request;
        const result = await parser.parse(request);
        expect(result.param).toEqual({ key: 'value' });
      });

      it('should parse a deep object with multiple keys', async () => {
        const request = {
          url: 'http://localhost:8080/api/search?param[key1]=value1&param[key2]=value2',
        } as Request;
        const result = await parser.parse(request);
        expect(result.param).toEqual({ key1: 'value1', key2: 'value2' });
      });

      it('should throw for missing required parameters', async () => {
        (schema.parameters![0] as ParameterObject).required = true;
        const request = {
          url: 'http://localhost:8080/api/search',
        } as Request;
        await expect(
          parser.parse(request),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"["GET /api/search"] Required query parameter param not found"`,
        );
      });

      it('should throw for extra parameters', async () => {
        const request = {
          url: 'http://localhost:8080/api/search?param[key]=value&extra=world',
        } as Request;
        await expect(
          parser.parse(request),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"["GET /api/search"] Unexpected query parameters: extra"`,
        );
      });

      it('should handle nested objects', async () => {
        (schema.parameters![0] as ParameterObject).schema = {
          type: 'object',
          properties: {
            key: {
              type: 'object',
              properties: {
                subkey: {
                  type: 'string',
                },
              },
              required: ['subkey'],
            },
          },
        };
        parser = new QueryParameterParser(operation, { ajv });
        const request = {
          url: 'http://localhost:8080/api/search?param[key][subkey]=value',
        } as Request;
        const result = await parser.parse(request);
        expect(result.param).toEqual({ key: { subkey: 'value' } });
      });
    });
  });
});

describe('path parameters', () => {
  let operation: Operation;
  let parser: PathParameterParser;
  let schema: (typeof withPathParameter)['paths']['/api/item/{id}']['get'];

  beforeEach(() => {
    schema = _.cloneDeep(withPathParameter.paths['/api/item/{id}'].get);
    operation = {
      schema: schema as OperationObject,
      path: '/api/item/{id}',
      method: 'get',
    };
    parser = new PathParameterParser(operation, { ajv });
  });
  describe('primitives', () => {
    describe('string', () => {
      it('should parse a string', async () => {
        const request = {
          url: 'http://localhost:8080/api/item/test',
        } as Request;
        const result = await parser.parse(request);
        expect(result.id).toBe('test');
      });

      it('should throw an error if the parameter is required but missing', async () => {
        (schema.parameters![0] as ParameterObject).required = true;
        const request = {
          url: 'http://localhost:8080/api/item',
        } as Request;
        await expect(
          parser.parse(request),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"["GET /api/item/{id}"] Path parts do not match"`,
        );
      });
    });

    describe('number', () => {
      beforeEach(() => {
        schema.parameters![0].schema.type = 'number';
      });
      it('should parse a number', async () => {
        const request = {
          url: 'http://localhost:8080/api/item/42',
        } as Request;
        const result = await parser.parse(request);
        expect(result.id).toBe(42);
      });

      it('should throw an error if the parameter is not a number', async () => {
        const request = {
          url: 'http://localhost:8080/api/item/hello',
        } as Request;
        await expect(parser.parse(request)).rejects
          .toThrowErrorMatchingInlineSnapshot(`
          "["GET /api/item/{id}"] Path parameter validation failed.
           - Value should be of type number"
        `);
      });
    });
  });

  describe('path parsing', () => {
    it('should parse a path with a single parameters', async () => {
      const parsedPath = PathParameterParser.parsePath({
        operation,
        schema: '/api/item/{id}',
        path: '/api/item/test123',
      });
      expect(parsedPath).toEqual({ id: 'test123' });
    });
    it('should parse a path with multiple parameters', async () => {
      const parsedPath = PathParameterParser.parsePath({
        operation,
        schema: '/api/item/{id}/{name}',
        path: '/api/item/42/test',
      });
      // the string is expected here, but will be optimistically parsed as a number where it makes sense.
      expect(parsedPath).toEqual({ id: '42', name: 'test' });
    });

    it('should throw an error if the path does not have enough parts', async () => {
      expect(() =>
        PathParameterParser.parsePath({
          operation,
          schema: '/api/item/{id}',
          path: '/api/item',
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"["GET /api/item/{id}"] Path parts do not match"`,
      );
    });

    it('should throw an error if the path has too many parts', async () => {
      expect(() =>
        PathParameterParser.parsePath({
          operation,
          schema: '/api/item/{id}',
          path: '/api/item/test/123',
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"["GET /api/item/{id}"] Path parts do not match"`,
      );
    });
  });
});
