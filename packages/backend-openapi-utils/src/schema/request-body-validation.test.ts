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

import withJsonRequestBody from './__fixtures__/schemas/withJsonRequestBody.json';
import { RequestBodyParser } from './request-body-validation';
import Ajv from 'ajv';
import { Operation, RequestParser } from './types';
import _ from 'lodash';
import {
  ContentObject,
  MediaTypeObject,
  OperationObject,
  RequestBodyObject,
} from 'openapi3-ts';
import { JsonObject } from '@backstage/types';

const ajv = new Ajv();

function toRequest(body?: object, headers?: Record<string, string>): Request {
  return {
    text: async () => JSON.stringify(body),
    json: async () => body,
    url: '/api/search',
    method: 'post',
    headers: new Headers({ 'content-type': 'application/json', ...headers }),
  } as Request;
}

describe('request body', () => {
  let operation: Operation;
  let parser: RequestParser<JsonObject | undefined>;
  let schema: (typeof withJsonRequestBody)['paths']['/api/search']['post'];
  beforeEach(() => {
    schema = _.cloneDeep(withJsonRequestBody.paths['/api/search'].post);
    operation = {
      method: 'post',
      schema: schema as OperationObject,
      path: '/api/search',
    };
    parser = new RequestBodyParser(operation, {
      ajv,
    });
  });
  it('should validate request body', async () => {
    const requestBody = {
      query: 'test',
    };
    const result = await parser.parse(toRequest(requestBody));
    expect(result).toEqual(requestBody);
  });

  it('should throw error if request body is not valid', async () => {
    const requestBody = {
      query: 1,
    };
    await expect(parser.parse(toRequest(requestBody))).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      "["POST /api/search"] Request body validation failed.
       - "/query" should be of type string"
    `);
  });

  it('should throw error if request body is required but missing', async () => {
    (schema.requestBody as RequestBodyObject).required = true;
    parser = RequestBodyParser.fromOperation(operation, {
      ajv,
    });
    await expect(
      parser.parse(toRequest()),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"["POST /api/search"] No request body found for /api/search"`,
    );
  });

  it('should throw error if request body is not application/json', async () => {
    const request = toRequest({}, { 'content-type': 'text/plain' });
    await expect(
      parser.parse(request),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"["POST /api/search"] Content type is not application/json"`,
    );
  });

  it('should NOT throw error if request body is not just application/json', async () => {
    (schema.requestBody.content as ContentObject)[
      'application/json; charset=utf-8'
    ] = schema.requestBody.content['application/json'] as MediaTypeObject;
    delete (schema.requestBody.content as ContentObject)['application/json'];
    parser = new RequestBodyParser(operation, {
      ajv,
    });
    const request = toRequest({});
    expect(await parser.parse(request)).toEqual({});
  });
});
