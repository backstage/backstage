/*
 * Copyright 2025 The Backstage Authors
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

import {
  InputError,
  NotFoundError,
  NotAllowedError,
  ForwardedError,
  ResponseError,
} from '@backstage/errors';
import { handleErrors } from './handleErrors';

describe('handleErrors', () => {
  it('should return the error description for a known error', async () => {
    const result = await handleErrors(async () => {
      throw new InputError('bad input');
    });

    expect(result).toEqual({
      content: [{ type: 'text', text: 'InputError: bad input' }],
      isError: true,
    });
  });

  it('should return the error description for a NotFoundError', async () => {
    const result = await handleErrors(async () => {
      throw new NotFoundError('entity not found');
    });

    expect(result).toEqual({
      content: [{ type: 'text', text: 'NotFoundError: entity not found' }],
      isError: true,
    });
  });

  it('should return the error description for a NotAllowedError', async () => {
    const result = await handleErrors(async () => {
      throw new NotAllowedError('forbidden');
    });

    expect(result).toEqual({
      content: [{ type: 'text', text: 'NotAllowedError: forbidden' }],
      isError: true,
    });
  });

  it('should rethrow an unknown error', async () => {
    await expect(
      handleErrors(async () => {
        throw new Error('unknown problem');
      }),
    ).rejects.toThrow('unknown problem');
  });

  it('should handle a ForwardedError that inherits the cause name', async () => {
    const result = await handleErrors(async () => {
      throw new ForwardedError(
        'wrapper message',
        new InputError('original error'),
      );
    });

    // ForwardedError inherits name from cause and CustomErrorBase
    // concatenates the cause message into the full message
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: 'InputError: wrapper message; caused by InputError: original error',
        },
      ],
      isError: true,
    });
  });

  it('should extract the cause from a ResponseError', async () => {
    const response = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers({ 'content-type': 'application/json' }),
      text: async () =>
        JSON.stringify({
          error: { name: 'InputError', message: 'bad value' },
          response: { statusCode: 400 },
        }),
    };

    const responseError = await ResponseError.fromResponse(response as any);

    const result = await handleErrors(async () => {
      throw responseError;
    });

    expect(result).toEqual({
      content: [{ type: 'text', text: 'InputError: bad value' }],
      isError: true,
    });
  });

  it('should recursively extract through nested ResponseErrors', async () => {
    const innerResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers({ 'content-type': 'application/json' }),
      text: async () =>
        JSON.stringify({
          error: {
            name: 'ResponseError',
            message: 'Request failed with 400 Bad Request',
            cause: { name: 'InputError', message: 'deeply nested error' },
          },
          response: { statusCode: 400 },
        }),
    };

    const responseError = await ResponseError.fromResponse(
      innerResponse as any,
    );

    const result = await handleErrors(async () => {
      throw responseError;
    });

    expect(result).toEqual({
      content: [{ type: 'text', text: 'InputError: deeply nested error' }],
      isError: true,
    });
  });
});
