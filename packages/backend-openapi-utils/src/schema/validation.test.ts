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

import { findOperationByRequest, OpenApiProxyValidator } from './validation';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { registerMswTestHooks } from '@backstage/test-utils';
import { CompletedBody, CompletedRequest, CompletedResponse } from 'mockttp';
import withResponseBody from './__fixtures__/schemas/withJsonResponseBody.json';
import withQueryParameter from './__fixtures__/schemas/withQueryParameter.json';
import _ from 'lodash';
import { OpenAPIObject, ParameterObject } from 'openapi3-ts';

const server = setupServer();

function createMockttpRequest(request: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: object;
}): CompletedRequest {
  return {
    method: request.method,
    url: `http://localhost:8080${request.url}`,
    headers: { 'content-type': 'application/json', ...request.headers },
    body: {
      getText: async () => JSON.stringify(request.body),
      getJson: async () => request.body,
    } as CompletedBody,
  } as CompletedRequest;
}

function createMockttpResponse(response: {
  statusCode: number;
  headers?: Record<string, string>;
  body?: object;
}): CompletedResponse {
  return {
    statusCode: response.statusCode,
    headers: response.headers,
    body: response.body
      ? ({
          getText: async () => JSON.stringify(response.body),
          getJson: async () => response.body,
        } as CompletedBody)
      : undefined,
  } as CompletedResponse;
}

describe('OpenApiProxyValidator', () => {
  registerMswTestHooks(server);
  let validator: OpenApiProxyValidator;

  async function mockSchema(schema: any) {
    server.use(
      rest.get('http://localhost:7000/openapi.json', (_req, res, ctx) =>
        res(ctx.json(schema)),
      ),
    );
    await validator.initialize('http://localhost:7000/openapi.json');
  }

  beforeEach(async () => {
    validator = new OpenApiProxyValidator();
  });

  describe('request body', () => {
    it('validates a JSON request body', async () => {
      await mockSchema(withResponseBody);
      const request = createMockttpRequest({
        method: 'GET',
        url: '/api/search',
      });
      const response = createMockttpResponse({
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: { results: [] },
      });

      expect(await validator.validate(request, response)).toBeUndefined();
    });

    it('throws for missing request body per schema', async () => {
      await mockSchema(withResponseBody);
      const request = createMockttpRequest({
        method: 'GET',
        url: '/api/search',
        body: { id: '123' },
      });
      const response = createMockttpResponse({
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: { results: [] },
      });

      await expect(
        async () => await validator.validate(request, response),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"["GET /api/search"] Received a body but no schema was found"`,
      );
    });
  });

  describe('query parameters', () => {
    describe('primitives', () => {
      describe('string', () => {
        it('accepts valid parameter', async () => {
          await mockSchema(withQueryParameter);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?param=abc',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          expect(await validator.validate(request, response)).toBeUndefined();
        });
      });
      describe('number', () => {
        const schema = _.cloneDeep(withQueryParameter);
        schema.paths['/api/search'].get.parameters[0].schema.type = 'number';
        it('throws for a missing required parameter', async () => {
          await mockSchema(schema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?test=123',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          await expect(
            async () => await validator.validate(request, response),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Unexpected query parameters: test"`,
          );
        });

        it('throws for invalid parameter', async () => {
          await mockSchema(schema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?param=abc',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          await expect(async () => await validator.validate(request, response))
            .rejects.toThrowErrorMatchingInlineSnapshot(`
            "["GET /api/search"] Query parameter validation failed.
             - Value should be of type number"
          `);
        });

        it('accepts valid parameter', async () => {
          await mockSchema(schema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?param=123',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          expect(await validator.validate(request, response)).toBeUndefined();
        });
      });
    });

    describe('object', () => {
      describe('deepObject', () => {
        const schema = _.cloneDeep(withQueryParameter);
        schema.paths['/api/search'].get.parameters[0].schema.type = 'object';
        (
          schema.paths['/api/search'].get.parameters[0] as ParameterObject
        ).style = 'deepObject';
        it('throws for invalid parameter (not an object)', async () => {
          await mockSchema(schema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?param=123',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          await expect(
            async () => await validator.validate(request, response),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Unexpected query parameters: param"`,
          );
        });

        it('throws for missing required property', async () => {
          const requiredSchema = _.cloneDeep(schema);
          requiredSchema.paths['/api/search'].get.parameters[0].required = true;
          await mockSchema(requiredSchema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          await expect(
            async () => await validator.validate(request, response),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Required query parameter param not found"`,
          );
        });

        it('throws for invalid format', async () => {
          await mockSchema(schema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?param[t=123',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          await expect(
            async () => await validator.validate(request, response),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Invalid object parameter, missing closing bracket for key "param[t""`,
          );
        });
      });

      describe('form', () => {
        const schema = _.cloneDeep(withQueryParameter);
        schema.paths['/api/search'].get.parameters[0].schema.type = 'object';
        (
          schema.paths['/api/search'].get.parameters[0] as ParameterObject
        ).style = 'form';
        it('throws for invalid parameter (not an object)', async () => {
          await mockSchema(schema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?param[t=123',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          await expect(
            async () => await validator.validate(request, response),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Unexpected query parameters: param[t"`,
          );
        });

        it('throws for missing required property', async () => {
          const requiredSchema = _.cloneDeep(schema);
          requiredSchema.paths['/api/search'].get.parameters[0].required = true;
          await mockSchema(requiredSchema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          await expect(
            async () => await validator.validate(request, response),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Required query parameter param not found"`,
          );
        });

        it('throws for invalid format', async () => {
          await mockSchema(schema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?param=123',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });
          await expect(
            async () => await validator.validate(request, response),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Invalid object query parameter, must have an even number of key-value pairs"`,
          );
        });
        describe('explode', () => {
          const explodeSchema = _.cloneDeep(schema);
          (
            explodeSchema.paths['/api/search'].get
              .parameters[0] as ParameterObject
          ).explode = true;
          it('accepts valid parameter', async () => {
            await mockSchema(explodeSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?param=123,test,456',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            expect(await validator.validate(request, response)).toBeUndefined();
          });

          it('accepts multiple parameters', async () => {
            await mockSchema(explodeSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?test=123&myparam=test&otherparam=456',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            expect(await validator.validate(request, response)).toBeUndefined();
          });
        });

        describe('no explode', () => {
          const noExplodeSchema = _.cloneDeep(schema);
          (
            noExplodeSchema.paths['/api/search'].get
              .parameters[0] as ParameterObject
          ).explode = false;
          it('accepts valid parameter', async () => {
            await mockSchema(schema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?param=123,test,456,param',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            expect(await validator.validate(request, response)).toBeUndefined();
          });

          it('throws for invalid parameter', async () => {
            await mockSchema(schema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?param=123,test,456',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            await expect(
              async () => await validator.validate(request, response),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
              `"["GET /api/search"] Invalid object query parameter, must have an even number of key-value pairs"`,
            );
          });
        });
      });
    });

    describe('array', () => {
      const arraySchema = _.cloneDeep(withQueryParameter);
      arraySchema.paths['/api/search'].get.parameters[0].schema.type = 'array';
      describe('form', () => {
        describe('explode', () => {
          const explodeSchema = _.cloneDeep(arraySchema);
          (
            explodeSchema.paths['/api/search'].get
              .parameters[0] as ParameterObject
          ).explode = true;

          it('accepts single parameter', async () => {
            await mockSchema(explodeSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?param=123',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            expect(await validator.validate(request, response)).toBeUndefined();
          });

          it('accepts multiple parameters', async () => {
            await mockSchema(explodeSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?param=123&param=test&param=456',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            expect(await validator.validate(request, response)).toBeUndefined();
          });

          it('throws for missing required parameter', async () => {
            const requiredSchema = _.cloneDeep(explodeSchema);
            requiredSchema.paths['/api/search'].get.parameters[0].required =
              true;
            await mockSchema(requiredSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            await expect(
              async () => await validator.validate(request, response),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
              `"["GET /api/search"] Required query parameter param not found"`,
            );
          });

          it('throws for invalid parameter', async () => {
            await mockSchema(explodeSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?param[]=123',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            await expect(
              async () => await validator.validate(request, response),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
              `"["GET /api/search"] Unexpected query parameters: param[]"`,
            );
          });
        });

        describe('no explode', () => {
          const noExplodeSchema = _.cloneDeep(arraySchema);
          (
            noExplodeSchema.paths['/api/search'].get
              .parameters[0] as ParameterObject
          ).explode = false;

          it('accepts single parameter', async () => {
            await mockSchema(noExplodeSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?param=123',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            expect(await validator.validate(request, response)).toBeUndefined();
          });

          it('accepts multiple parameters', async () => {
            await mockSchema(noExplodeSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?param=123,456,789',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            expect(await validator.validate(request, response)).toBeUndefined();
          });

          it('throws for missing required parameter', async () => {
            const requiredSchema = _.cloneDeep(noExplodeSchema);
            requiredSchema.paths['/api/search'].get.parameters[0].required =
              true;
            await mockSchema(requiredSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            await expect(
              async () => await validator.validate(request, response),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
              `"["GET /api/search"] Required query parameter param not found"`,
            );
          });

          it('throws for invalid parameter', async () => {
            await mockSchema(noExplodeSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?param=123&param=456',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            await expect(
              async () => await validator.validate(request, response),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
              `"["GET /api/search"] Arrays must be comma separated in non-explode mode"`,
            );
          });
        });

        describe('compatible with qs', () => {
          const noExplodeSchema = _.cloneDeep(arraySchema);
          (
            noExplodeSchema.paths['/api/search'].get
              .parameters[0] as ParameterObject
          ).explode = false;

          const explodeSchema = _.cloneDeep(arraySchema);
          (
            explodeSchema.paths['/api/search'].get
              .parameters[0] as ParameterObject
          ).explode = true;
          it('accepts the [] syntax', async () => {
            await mockSchema(noExplodeSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?param[]=123,456,789',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            expect(await validator.validate(request, response)).toBeUndefined();
          });

          it('accepts the array index syntax', async () => {
            await mockSchema(explodeSchema);
            const request = createMockttpRequest({
              method: 'GET',
              url: '/api/search?param[0]=123&param[1]=456&param[2]=789',
            });
            const response = createMockttpResponse({
              statusCode: 200,
            });

            expect(await validator.validate(request, response)).toBeUndefined();
          });
        });
      });

      describe('spaceDelimited', () => {
        const spaceDelimitedSchema = _.cloneDeep(arraySchema);
        (
          spaceDelimitedSchema.paths['/api/search'].get
            .parameters[0] as ParameterObject
        ).style = 'spaceDelimited';

        it('accepts single parameter', async () => {
          await mockSchema(spaceDelimitedSchema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?param=123',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          expect(await validator.validate(request, response)).toBeUndefined();
        });

        it('accepts multiple parameters', async () => {
          await mockSchema(spaceDelimitedSchema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?param=123 test 456',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          expect(await validator.validate(request, response)).toBeUndefined();
        });

        it('throws for missing required parameter', async () => {
          const requiredSchema = _.cloneDeep(spaceDelimitedSchema);
          requiredSchema.paths['/api/search'].get.parameters[0].required = true;
          await mockSchema(requiredSchema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          await expect(
            async () => await validator.validate(request, response),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Required query parameter param not found"`,
          );
        });
      });

      describe('pipeDelimited', () => {
        const pipeDelimitedSchema = _.cloneDeep(arraySchema);
        (
          pipeDelimitedSchema.paths['/api/search'].get
            .parameters[0] as ParameterObject
        ).style = 'pipeDelimited';

        it('accepts single parameter', async () => {
          await mockSchema(pipeDelimitedSchema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?param=123',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          expect(await validator.validate(request, response)).toBeUndefined();
        });

        it('accepts multiple parameters', async () => {
          await mockSchema(pipeDelimitedSchema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search?param=123|test|456',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          expect(await validator.validate(request, response)).toBeUndefined();
        });

        it('throws for missing required parameter', async () => {
          const requiredSchema = _.cloneDeep(pipeDelimitedSchema);
          requiredSchema.paths['/api/search'].get.parameters[0].required = true;
          await mockSchema(requiredSchema);
          const request = createMockttpRequest({
            method: 'GET',
            url: '/api/search',
          });
          const response = createMockttpResponse({
            statusCode: 200,
          });

          await expect(
            async () => await validator.validate(request, response),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"["GET /api/search"] Required query parameter param not found"`,
          );
        });
      });
    });
  });

  describe('response body', () => {
    it('validates a JSON response body', async () => {
      await mockSchema(withResponseBody);
      const request = createMockttpRequest({
        method: 'GET',
        url: '/api/search',
      });
      const response = createMockttpResponse({
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: { results: [] },
      });

      expect(await validator.validate(request, response)).toBeUndefined();
    });

    it('throws for missing response body per schema', async () => {
      await mockSchema(withResponseBody);
      const request = createMockttpRequest({
        method: 'GET',
        url: '/api/search',
      });
      const response = createMockttpResponse({
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
        },
      });

      await expect(
        async () => await validator.validate(request, response),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"["GET /api/search" (200)]: Response body is required but missing"`,
      );
    });
  });
});

describe('findOperationByRequest', () => {
  it('finds an operation by request', () => {
    const schema = {
      openapi: '3.0.0',
      info: {
        title: 'Test',
        version: '1.0.0',
      },
      paths: {
        '/api/search': {
          get: {
            parameters: [],
          },
        },
      },
    };
    const request = {
      method: 'GET',
      url: 'http://localhost:8080/api/search',
    } as CompletedRequest;
    expect(findOperationByRequest(schema as OpenAPIObject, request)).toEqual([
      '/api/search',
      schema.paths['/api/search'].get,
    ]);
  });

  it('finds an operation by request when there are multiple other paths', () => {
    const schema = {
      openapi: '3.0.0',
      info: {
        title: 'Test',
        version: '1.0.0',
      },
      paths: {
        '/api/search': {
          get: {
            parameters: [],
          },
        },
        '/api/catalog/by-ref': {
          get: {
            parameters: [],
          },
        },
      },
    };
    const request = {
      method: 'GET',
      url: 'http://localhost:8080/api/search',
    } as CompletedRequest;
    expect(findOperationByRequest(schema as OpenAPIObject, request)).toEqual([
      '/api/search',
      schema.paths['/api/search'].get,
    ]);
  });

  it('finds an operation by request when there are path parameters', () => {
    const schema = {
      openapi: '3.0.0',
      info: {
        title: 'Test',
        version: '1.0.0',
      },
      paths: {
        '/api/catalog/by-id/{id}': {
          get: {
            parameters: [],
          },
        },
      },
    };
    const request = {
      method: 'GET',
      url: 'http://localhost:8080/api/catalog/by-id/123',
    } as CompletedRequest;
    expect(findOperationByRequest(schema as OpenAPIObject, request)).toEqual([
      '/api/catalog/by-id/{id}',
      schema.paths['/api/catalog/by-id/{id}'].get,
    ]);
  });

  it('finds an operation by request when there are somewhat overlapping path parameters', () => {
    const schema = {
      openapi: '3.0.0',
      info: {
        title: 'Test',
        version: '1.0.0',
      },
      paths: {
        '/api/catalog/by-id/{id}': {
          get: {
            parameters: [],
          },
        },
        '/api/catalog/by-id': {
          get: {
            parameters: [],
          },
        },
      },
    };
    const request = {
      method: 'GET',
      url: 'http://localhost:8080/api/catalog/by-id/123',
    } as CompletedRequest;
    expect(findOperationByRequest(schema as OpenAPIObject, request)).toEqual([
      '/api/catalog/by-id/{id}',
      schema.paths['/api/catalog/by-id/{id}'].get,
    ]);
  });
});
