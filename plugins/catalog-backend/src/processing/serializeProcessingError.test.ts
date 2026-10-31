/*
 * Copyright 2026 The Backstage Authors
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

import { InputError, serializeError } from '@backstage/errors';
import {
  MAX_ERROR_STRING_LENGTH,
  MAX_SERIALIZED_ERROR_LENGTH,
  serializeProcessingError,
} from './serializeProcessingError';

class HttpError extends Error {
  readonly status = 503;
  readonly response: { status: number; data: unknown };

  constructor(data: unknown) {
    super(typeof data === 'string' ? data : 'Service Unavailable');
    this.name = 'HttpError';
    this.response = { status: 503, data };
  }
}

describe('serializeProcessingError', () => {
  it('leaves small errors untouched', () => {
    const error = new InputError('Processor threw', new Error('boom'));

    expect(serializeProcessingError(error)).toEqual(serializeError(error));
  });

  it('truncates long strings throughout the cause chain', () => {
    const body = '<html>'.padEnd(1_000_000, 'x');
    const error = new InputError(
      'Processor threw an error while preprocessing',
      new HttpError(body),
    );

    const result = serializeProcessingError(error) as any;

    expect(JSON.stringify(result).length).toBeLessThanOrEqual(
      MAX_SERIALIZED_ERROR_LENGTH,
    );
    expect(result.name).toBe('InputError');
    expect(result.message).toMatch(
      /^Processor threw an error while preprocessing; caused by HttpError: <html>x+\.\.\. \(\d+ characters truncated\)$/,
    );
    expect(result.cause.name).toBe('HttpError');
    expect(result.cause.status).toBe(503);
    expect(result.cause.message.length).toBeLessThan(
      MAX_ERROR_STRING_LENGTH + 50,
    );
    expect(result.cause.response.data).toBe(
      `${body.slice(0, MAX_ERROR_STRING_LENGTH)}... (${
        body.length - MAX_ERROR_STRING_LENGTH
      } characters truncated)`,
    );
  });

  it('falls back to name, message and code for large structured payloads', () => {
    const data = Object.fromEntries(
      Array.from({ length: 10_000 }, (_, i) => [`key${i}`, `value${i}`]),
    );
    const cause = new HttpError(data);
    const error = Object.assign(new InputError('Processor threw', cause), {
      code: 'E_PROCESSING',
    });

    expect(serializeProcessingError(error)).toEqual({
      name: 'InputError',
      message: 'Processor threw; caused by HttpError: Service Unavailable',
      code: 'E_PROCESSING',
    });
  });
});
