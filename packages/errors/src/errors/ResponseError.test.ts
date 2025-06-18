/*
 * Copyright 2021 The Backstage Authors
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

import { ErrorResponseBody } from '../serialization';
import { ResponseError } from './ResponseError';

describe('ResponseError', () => {
  it('constructs itself from a response', async () => {
    const body: ErrorResponseBody = {
      error: { name: 'Fours', message: 'Expected fives', stack: 'lines' },
      request: { method: 'GET', url: '/' },
      response: { statusCode: 444 },
    };

    const response: Partial<Response> = {
      status: 444,
      statusText: 'Fours',
      text: async () => JSON.stringify(body),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };

    const e = await ResponseError.fromResponse(response as Response);
    expect(e.name).toEqual('ResponseError');
    expect(e.message).toEqual('Request failed with 444 Fours');
    expect(e.statusCode).toEqual(444);
    expect(e.statusText).toEqual('Fours');
    expect(e.cause.name).toEqual('Fours');
    expect(e.cause.message).toEqual('Expected fives');
    expect(e.cause.stack).toEqual('lines');
  });

  it('correctly parses cause', async () => {
    const body: ErrorResponseBody = {
      error: {
        name: 'ResponseError',
        message: 'Request failed with 409 Conflict',
        response: {
          size: 0,
          timeout: 0,
        },
        body: {
          error: {
            name: 'ConflictError',
            message: 'Conflict message',
          },
          request: {
            method: 'POST',
            url: '/locations',
          },
          response: {
            statusCode: 409,
          },
        },
        cause: {
          name: 'ConflictError',
          message:
            'Location url:https://backstage/backstage/blob/master/catalog-info.yaml already exists',
        },
        statusCode: 409,
        statusText: 'Conflict',
      },
      request: {
        method: 'POST',
        url: '/v1/locations',
      },
      response: {
        statusCode: 409,
      },
    };

    const response: Partial<Response> = {
      status: 409,
      statusText: 'Conflict',
      text: async () => JSON.stringify(body),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };

    const e = await ResponseError.fromResponse(response as Response);
    expect(e.name).toEqual('ResponseError');
    expect(e.cause.name).toEqual('ConflictError');
    expect(e.cause.message).toEqual(
      'Location url:https://backstage/backstage/blob/master/catalog-info.yaml already exists',
    );
  });
});
