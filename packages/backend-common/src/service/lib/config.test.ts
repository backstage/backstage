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
import { readCorsOptions, readCspOptions } from './config';

describe('config', () => {
  describe('readCspOptions', () => {
    it('reads valid values', () => {
      const config = new ConfigReader({ csp: { key: ['value'] } });
      expect(readCspOptions(config)).toEqual(
        expect.objectContaining({
          key: ['value'],
        }),
      );
    });

    it('accepts false', () => {
      const config = new ConfigReader({ csp: { key: false } });
      expect(readCspOptions(config)).toEqual(
        expect.objectContaining({
          key: false,
        }),
      );
    });

    it('rejects invalid value types', () => {
      const config = new ConfigReader({ csp: { key: [4] } });
      expect(() => readCspOptions(config)).toThrow(/wanted string-array/);
    });
  });

  describe('readCorsOptions', () => {
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
  });
});
