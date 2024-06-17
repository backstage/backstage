/*
 * Copyright 2023 The Backstage Authors
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

import { format } from 'logform';
import { WinstonLogger } from './WinstonLogger';
import Transport from 'winston-transport';
import { MESSAGE } from 'triple-beam';
import { RedactionsService } from '@backstage/backend-plugin-api';

class MockRedactor implements RedactionsService {
  redact(input: string): string {
    return input.replace(/hello/g, '***');
  }

  addRedactions(): void {
    return;
  }
}

describe('WinstonLogger', () => {
  const redactions = new MockRedactor();

  it('creates a winston logger instance with default options', () => {
    const logger = WinstonLogger.create({});
    expect(logger).toBeInstanceOf(WinstonLogger);
  });

  it('creates a child logger', () => {
    const logger = WinstonLogger.create({});
    const childLogger = logger.child({ plugin: 'test-plugin' });
    expect(childLogger).toBeInstanceOf(WinstonLogger);
  });

  it('should use the redactor when provided', () => {
    const mockTransport = new Transport({
      log: jest.fn(),
      logv: jest.fn(),
    });

    const logger = WinstonLogger.create({
      format: format.json(),
      transports: [mockTransport],
      redactions,
    });

    logger.error('hello from this file');

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        [MESSAGE]: JSON.stringify({
          level: 'error',
          message: '*** from this file',
        }),
      }),
      expect.any(Function),
    );
  });

  it('should redact nested object', () => {
    const mockTransport = new Transport({
      log: jest.fn(),
      logv: jest.fn(),
    });

    const logger = WinstonLogger.create({
      format: format.json(),
      transports: [mockTransport],
      redactions,
    });

    logger.error('something went wrong', {
      null: null,
      nested: 'hello (world) from nested object',
      nullProto: Object.create(null, {
        foo: { value: 'hello foo', enumerable: true },
      }),
    });

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        [MESSAGE]: JSON.stringify({
          level: 'error',
          message: 'something went wrong',
          nested: '*** (world) from nested object',
          null: null,
          nullProto: {
            foo: '*** foo',
          },
        }),
      }),
      expect.any(Function),
    );
  });
});
