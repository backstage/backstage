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
import withJsonResponseBody from './__fixtures__/schemas/withJsonResponseBody.json';
import { Operation, ResponseParser } from './types';
import { ResponseBodyParser } from './response-body-validation';
import Ajv from 'ajv';
import { OperationObject, ResponsesObject } from 'openapi3-ts';
import _ from 'lodash';

const ajv = new Ajv();

function toResponse(body?: object): Response {
  return {
    json: async () => body,
    text: async () => JSON.stringify(body),
    status: 200,
  } as Response;
}

describe('response body', () => {
  let operation: Operation;
  let parser: ResponseParser<JsonObject | undefined>;
  let schema: (typeof withJsonResponseBody)['paths']['/api/search']['get'];
  beforeEach(() => {
    schema = _.cloneDeep(withJsonResponseBody.paths['/api/search'].get);
    operation = {
      path: '/api/search',
      method: 'get',
      schema: schema as OperationObject,
    };
    parser = ResponseBodyParser.fromOperation(operation, {
      ajv,
    });
  });

  it('should validate response body', async () => {
    const responseBody = {
      results: [{ id: 'test' }],
    };
    const result = await parser.parse(toResponse(responseBody));
    expect(result).toEqual(responseBody);
  });

  it('should throw error if response body is not valid', async () => {
    const responseBody = {
      result: 1,
    };
    await expect(parser.parse(toResponse(responseBody))).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      "["GET /api/search" (200)]: Response body validation failed.
       - The "result" property is not allowed"
    `);
  });

  it('should throw error if response body is required but missing', async () => {
    (schema.responses as ResponsesObject)['200'].required = true;
    parser = ResponseBodyParser.fromOperation(operation, {
      ajv,
    });
    await expect(
      parser.parse(toResponse()),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"["GET /api/search" (200)]: Response body is required but missing"`,
    );
  });
});
