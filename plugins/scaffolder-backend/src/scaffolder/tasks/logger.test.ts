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

import { WinstonLogger } from './logger';
import { MESSAGE } from 'triple-beam';
import { TaskRedacter } from './TaskRedacter';

describe('WinstonLogger', () => {
  describe('redacter', () => {
    describe('add method', () => {
      it('should redact configured values from plain strings', () => {
        const { add, redact } = WinstonLogger.redacter();

        add(['valid-secret']);

        expect(redact('This contains valid-secret')).toBe('This contains ***');
      });

      it('should redact overlapping values longest first', () => {
        const { add, redact } = WinstonLogger.redacter();

        add(['secret', 'secret-suffix']);

        expect(redact('This contains secret-suffix')).toBe('This contains ***');
      });

      it('should redact shifted overlapping values as one range', () => {
        const { add, redact } = WinstonLogger.redacter();

        add(['abc', 'bcdef']);

        expect(redact('abcdef')).toBe('***');
      });

      it('should safely redact immutable errors', () => {
        const { add, redactError } = WinstonLogger.redacter();
        const error = Object.freeze({
          name: 'SecretError',
          message: 'Failed with valid-secret',
          stack: 'SecretError: Failed with valid-secret',
        });

        add(['Secret', 'valid-secret']);

        expect(redactError(error)).toMatchObject({
          name: '***Error',
          message: 'Failed with ***',
          stack: '***Error: Failed with ***',
        });
      });

      it('should fall back when error setters do not update values', () => {
        const { add, redactError } = WinstonLogger.redacter();
        const error = {
          get name() {
            return 'SecretError';
          },
          set name(_value: string) {},
          get message() {
            return 'Failed with valid-secret';
          },
          set message(_value: string) {},
          get stack() {
            return 'SecretError: Failed with valid-secret';
          },
          set stack(_value: string | undefined) {},
        };

        add(['Secret', 'valid-secret']);

        const result = redactError(error);
        expect(result).not.toBe(error);
        expect(result).toMatchObject({
          name: '***Error',
          message: 'Failed with ***',
          stack: '***Error: Failed with ***',
        });
      });

      it('should safely handle a non-string stack', () => {
        const { add, redactError } = WinstonLogger.redacter();
        const error = {
          name: 'SecretError',
          message: 'Failed with valid-secret',
          stack: null,
        } as any;

        add(['Secret', 'valid-secret']);

        expect(redactError(error)).toMatchObject({
          name: '***Error',
          message: 'Failed with ***',
        });
      });

      it('should describe non-Error throws without stringifying values', () => {
        const { redactError } = WinstonLogger.redacter();

        expect(redactError(42)).toMatchObject({
          name: 'Error',
          message: 'Task failed with thrown value of type number',
        });
      });

      it('should safely handle errors with throwing getters', () => {
        const { add, redactError } = WinstonLogger.redacter();
        const error = {
          get name(): string {
            throw new Error('valid-secret');
          },
          message: 'Failed with valid-secret',
        } as any;

        add(['valid-secret']);

        expect(redactError(error)).toMatchObject({
          name: 'Error',
          message: 'Task failed',
        });
      });

      it('should detach sanitized errors from stateful getters', () => {
        const { add, redactError } = WinstonLogger.redacter();
        let messageReads = 0;
        const error = {
          name: 'Error',
          get message() {
            messageReads += 1;
            return messageReads === 1 ? 'Safe failure' : 'valid-secret';
          },
          stack: 'Error: Safe failure',
        };

        add(['valid-secret']);

        const result = redactError(error);
        expect(result).not.toBe(error);
        expect(result).toMatchObject({
          name: 'Error',
          message: 'Safe failure',
          stack: 'Error: Safe failure',
        });
      });

      it('should detach Error instances from stateful getters', () => {
        const { add, redactError } = WinstonLogger.redacter();
        const error = new Error('placeholder');
        let messageReads = 0;
        Object.defineProperty(error, 'message', {
          configurable: true,
          get() {
            messageReads += 1;
            return messageReads === 1 ? 'Safe failure' : 'valid-secret';
          },
        });

        add(['valid-secret']);

        const result = redactError(error);
        const messageReadsAfterRedaction = messageReads;
        expect(result).not.toBe(error);
        expect(result.message).toBe('Safe failure');
        expect(messageReads).toBe(messageReadsAfterRedaction);
      });

      it('should discard attached fields from native errors', () => {
        const { add, redactError } = WinstonLogger.redacter();
        const secret = 'valid-secret';
        const nestedError = new Error(`Nested ${secret}`);
        const error = new AggregateError([nestedError], 'Safe failure', {
          cause: nestedError,
        }) as AggregateError & { custom?: string };
        error.custom = secret;

        add([secret]);

        const result = redactError(error);
        expect(result).not.toBe(error);
        expect(result).toMatchObject({
          name: 'AggregateError',
          message: 'Safe failure',
        });
        expect(result).not.toHaveProperty('cause');
        expect(result).not.toHaveProperty('errors');
        expect(result).not.toHaveProperty('custom');
      });

      it('should safely handle errors with a throwing prototype trap', () => {
        const { add, redactError } = WinstonLogger.redacter();
        const error = new Proxy(
          {
            name: 'Error',
            message: 'Safe failure',
            stack: 'Error: Safe failure',
          },
          {
            getPrototypeOf() {
              throw new Error('valid-secret');
            },
          },
        );

        add(['valid-secret']);

        expect(redactError(error)).toMatchObject({
          name: 'Error',
          message: 'Safe failure',
          stack: 'Error: Safe failure',
        });
      });

      it('should detach proxy-wrapped Errors', () => {
        const { add, redactError } = WinstonLogger.redacter();
        let messageReads = 0;
        const error = new Proxy(new Error('Safe failure'), {
          get(target, property, receiver) {
            if (property === 'message') {
              messageReads += 1;
              return messageReads === 1 ? 'Safe failure' : 'valid-secret';
            }
            if (property === 'stack') {
              return 'Error: Safe failure';
            }
            return Reflect.get(target, property, receiver);
          },
          defineProperty() {
            return true;
          },
        });

        add(['valid-secret']);

        const result = redactError(error);
        expect(result).not.toBe(error);
        expect(result).toMatchObject({
          name: 'Error',
          message: 'Safe failure',
          stack: 'Error: Safe failure',
        });
      });

      it('should handle null and undefined values in newRedactions without crashing', () => {
        const redacter = new TaskRedacter();
        const redactionFormat = WinstonLogger.redacter(redacter);

        expect(() => {
          redacter.add([null as any, undefined as any, 'valid-secret']);
        }).not.toThrow();

        const testObj = {
          level: 'info',
          message: 'This contains valid-secret and should be redacted',
          [MESSAGE]: 'This contains valid-secret and should be redacted',
        };
        const result = redactionFormat.transform(testObj);
        expect((result as any)?.[MESSAGE]).toBe(
          'This contains *** and should be redacted',
        );
      });

      it('should skip empty and single character redactions', () => {
        const redacter = new TaskRedacter();
        const redactionFormat = WinstonLogger.redacter(redacter);

        redacter.add(['', 'x', 'valid-secret-123']);

        // MESSAGE symbol is where Winston stores the formatted message for redaction
        const testObj = {
          level: 'info',
          message: 'This contains valid-secret-123 and should be redacted',
          [MESSAGE]: 'This contains valid-secret-123 and should be redacted',
        };

        const result = redactionFormat.transform(testObj);
        expect((result as any)?.[MESSAGE]).toBe(
          'This contains *** and should be redacted',
        );
      });

      it('should trim whitespace from redactions', () => {
        const redacter = new TaskRedacter();
        const redactionFormat = WinstonLogger.redacter(redacter);

        redacter.add(['  secret-with-spaces  \n', '  another-secret\t']);

        const testObj = {
          level: 'info',
          message: 'This contains secret-with-spaces and another-secret',
          [MESSAGE]: 'This contains secret-with-spaces and another-secret',
        };

        const result = redactionFormat.transform(testObj);
        expect((result as any)?.[MESSAGE]).toBe('This contains *** and ***');
      });
    });
  });
});
