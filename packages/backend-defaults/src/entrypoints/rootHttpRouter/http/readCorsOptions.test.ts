/*
 * Copyright 2020 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { readCorsOptions } from './readCorsOptions';

describe('readCorsOptions', () => {
  it('should be disabled by default', () => {
    expect(readCorsOptions()).toEqual({
      origin: false,
    });
  });

  it('reads single string', () => {
    const mockCallback = jest.fn();
    const config = new ConfigReader({ cors: { origin: 'https://*.value*' } });
    const cors = readCorsOptions(config);
    expect(cors).toEqual(
      expect.objectContaining({
        origin: expect.any(Function),
      }),
    );
    const origin = cors?.origin as Function;
    origin('https://a.value', mockCallback); // valid origin
    origin('http://a.value', mockCallback); // invalid origin
    origin(undefined, mockCallback); // when not origin needs to reject the call

    expect(mockCallback.mock.calls[0][0]).toBe(null);
    expect(mockCallback.mock.calls[1][0]).toBe(null);

    expect(mockCallback.mock.calls[0][1]).toBe(true);
    expect(mockCallback.mock.calls[1][1]).toBe(false);
    expect(mockCallback.mock.calls[2][1]).toBe(false);
  });

  it('reads string array', () => {
    const mockCallback = jest.fn();
    const config = new ConfigReader({
      cors: {
        origin: ['http?(s)://*.value?(-+([0-9])).com', 'http://*.value'],
      },
    });
    const cors = readCorsOptions(config);
    expect(cors).toEqual(
      expect.objectContaining({
        origin: expect.any(Function),
      }),
    );
    const origin = cors?.origin as Function;
    origin('https://a.b.c.value-9.com', mockCallback);
    origin('http://a.value-999.com', mockCallback);
    origin('http://a.value', mockCallback);
    origin('http://a.valuex', mockCallback);

    expect(mockCallback.mock.calls[0][0]).toBe(null);
    expect(mockCallback.mock.calls[1][0]).toBe(null);
    expect(mockCallback.mock.calls[2][0]).toBe(null);
    expect(mockCallback.mock.calls[3][0]).toBe(null);

    expect(mockCallback.mock.calls[0][1]).toBe(true);
    expect(mockCallback.mock.calls[1][1]).toBe(true);
    expect(mockCallback.mock.calls[2][1]).toBe(true);
    expect(mockCallback.mock.calls[3][1]).toBe(false);
  });

  it('reads undefined origin', () => {
    const config = new ConfigReader({
      cors: {},
    });
    const cors = readCorsOptions(config);
    expect(cors).toEqual(expect.objectContaining({}));
    expect(cors?.origin).toBeUndefined();
  });

  it("get's undefined properties removed", () => {
    const config = new ConfigReader({
      cors: {
        methods: ['get'],
        maxAge: 100,
      },
    });
    const cors = readCorsOptions(config);
    expect(cors?.hasOwnProperty('origin')).toBeFalsy();
    expect(cors?.hasOwnProperty('methods')).toBeTruthy();
    expect(cors?.hasOwnProperty('allowedHeaders')).toBeFalsy();
    expect(cors?.hasOwnProperty('exposedHeaders')).toBeFalsy();
    expect(cors?.hasOwnProperty('credentials')).toBeFalsy();
    expect(cors?.hasOwnProperty('maxAge')).toBeTruthy();
    expect(cors?.hasOwnProperty('preflightContinue')).toBeFalsy();
    expect(cors?.hasOwnProperty('optionsSuccessStatus')).toBeFalsy();
  });

  it('does not have undefined optionsSuccessStatus', () => {
    const config = new ConfigReader({
      cors: {
        optionsSuccessStatus: undefined,
      },
    });
    const cors = readCorsOptions(config);
    expect(cors?.hasOwnProperty('optionsSuccessStatus')).toBeFalsy();
  });

  it('does have defined optionsSuccessStatus', () => {
    const config = new ConfigReader({
      cors: {
        optionsSuccessStatus: 200,
      },
    });
    const cors = readCorsOptions(config);
    expect(cors?.optionsSuccessStatus).toBe(200);
  });
});
