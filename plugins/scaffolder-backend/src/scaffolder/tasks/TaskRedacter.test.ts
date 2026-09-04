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

import { JsonObject } from '@backstage/types';
import { TASK_REDACTION_OVERFLOW, TaskRedacter } from './TaskRedacter';

describe('TaskRedacter', () => {
  describe('strings', () => {
    it('adds exact values synchronously and ignores duplicates', () => {
      const redacter = new TaskRedacter();

      redacter.add(['first-secret', 'first-secret']);
      expect(redacter.redactString('value=first-secret')).toBe('value=***');

      redacter.add(['second-secret']);
      expect(redacter.redactString('first-secret then second-secret')).toBe(
        '*** then ***',
      );
    });

    it('handles pattern characters as literal secret data', () => {
      const redacter = new TaskRedacter();
      redacter.add(['a.*(secret)?[value]']);

      expect(redacter.redactString('x a.*(secret)?[value] y')).toBe('x *** y');
    });

    it('redacts the longest value first and merges shifted overlaps', () => {
      const redacter = new TaskRedacter();
      redacter.add(['token', 'token-with-suffix', 'abcdef', 'defghi']);

      expect(redacter.redactString('token-with-suffix token')).toBe('*** ***');
      expect(redacter.redactString('abcdefghi')).toBe('***');
    });

    it('merges a later match that bridges earlier disjoint ranges', () => {
      const redacter = new TaskRedacter();
      redacter.add(['ab', 'ef', 'bcdefg']);

      expect(redacter.redactString('abcdefg')).toBe('***');
    });

    it('trims surrounding whitespace and ignores short values', () => {
      const redacter = new TaskRedacter();
      redacter.add(['', 'x', '  secret-with-whitespace  \n']);

      expect(redacter.redactString('x secret-with-whitespace')).toBe('x ***');
    });

    it('fails closed when configured redaction limits are exceeded', () => {
      const redacter = new TaskRedacter({
        maxValues: 2,
        maxTotalLength: 100,
      });

      redacter.add(['first-secret', 'second-secret', 'third-secret']);

      expect(redacter.redactString('otherwise public')).toBe('***');
      expect(redacter.redactJson({ public: 'value' })).toEqual({
        '***': '***',
      });
      expect(redacter.redactBuffer(Buffer.from('otherwise public'))).toEqual(
        Buffer.from('***'),
      );
    });

    it('fails closed before retaining an oversized sensitive value', () => {
      const redacter = new TaskRedacter({ maxTotalLength: 5 });

      redacter.addJson({ nested: 'oversized-secret' });

      expect(redacter.redactString('otherwise public')).toBe('***');
    });

    it('fails closed when an input contains excessive disjoint matches', () => {
      const redacter = new TaskRedacter();
      redacter.add(['aa']);
      const input = 'aaX'.repeat(Math.ceil((10 * 1024 * 1024) / 3));

      const result = redacter.redactString(input);
      expect(result).toHaveLength(3);
      expect(result).toBe('***');
    });

    it('uses finite defaults and recognizes fail-closed overflow state', () => {
      const redacter = new TaskRedacter();

      redacter.add(
        Array.from({ length: 129 }, (_, index) => `sensitive-${index}`),
      );

      expect(redacter.redactsAll).toBe(true);
      expect(redacter.redactString('otherwise public')).toBe('***');
      const restored = new TaskRedacter();
      restored.add([TASK_REDACTION_OVERFLOW]);
      expect(restored.redactString('otherwise public')).toBe('***');
    });
  });

  describe('structured values', () => {
    it('redacts nested mapping keys and values without mutating the input', () => {
      const redacter = new TaskRedacter();
      redacter.add(['secret-key', 'secret-value']);
      const input = {
        'prefix-secret-key': {
          nested: ['secret-value', { value: 'prefix-secret-value-suffix' }],
        },
      };

      expect(redacter.redactJson(input)).toEqual({
        'prefix-***': {
          nested: ['***', { value: 'prefix-***-suffix' }],
        },
      });
      expect(input).toEqual({
        'prefix-secret-key': {
          nested: ['secret-value', { value: 'prefix-secret-value-suffix' }],
        },
      });
    });

    it('allows redacted mapping keys to collide without disclosing either key', () => {
      const redacter = new TaskRedacter();
      redacter.add(['secret-one', 'secret-two']);

      expect(
        redacter.redactJson({ 'secret-one': 'first', 'secret-two': 'second' }),
      ).toEqual({ '***': 'second' });
    });

    it('preserves __proto__ as a safe own mapping property', () => {
      const redacter = new TaskRedacter();
      const input = Object.fromEntries([
        ['__proto__', 'plain-value'],
      ]) as JsonObject;

      const result = redacter.redactJson(input) as JsonObject;

      expect(Object.hasOwn(result, '__proto__')).toBe(true);
      expect(Object.getOwnPropertyDescriptor(result, '__proto__')?.value).toBe(
        'plain-value',
      );
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    });

    it('redacts UTF-8 buffer copies without mutating the input', () => {
      const redacter = new TaskRedacter();
      redacter.add(['påssword']);
      const input = Buffer.from('before påssword after', 'utf8');

      const result = redacter.redactBuffer(input);

      expect(result.toString('utf8')).toBe('before *** after');
      expect(input.toString('utf8')).toBe('before påssword after');
    });

    it('preserves non-UTF-8 bytes while replacing exact secret bytes', () => {
      const redacter = new TaskRedacter();
      redacter.add(['secret']);
      const input = Buffer.from([0xff, ...Buffer.from('secret'), 0x00, 0xfe]);

      const result = redacter.redactBuffer(input);

      expect(result).toEqual(
        Buffer.from([0xff, ...Buffer.from('***'), 0x00, 0xfe]),
      );
      expect(input).toEqual(
        Buffer.from([0xff, ...Buffer.from('secret'), 0x00, 0xfe]),
      );
    });

    it('fails closed when a buffer contains excessive disjoint matches', () => {
      const redacter = new TaskRedacter({ maxMatches: 2 });
      redacter.add(['aa']);

      expect(redacter.redactBuffer(Buffer.from('aaXaaXaa'))).toEqual(
        Buffer.from('***'),
      );
    });
  });

  describe('errors', () => {
    it('always creates a native Error with only redacted selected fields', () => {
      const redacter = new TaskRedacter();
      redacter.add(['secret-value']);
      const original = new AggregateError(
        [new Error('nested secret-value')],
        'message secret-value',
        { cause: new Error('cause secret-value') },
      ) as AggregateError & { custom: string };
      original.name = 'InputError-secret-value';
      original.stack = 'InputError-secret-value: message secret-value\nstack';
      original.custom = 'custom secret-value';
      Object.defineProperty(original, Symbol.for('secret'), {
        value: 'secret-value',
      });

      const result = redacter.redactError(original);

      expect(result).not.toBe(original);
      expect(Object.getPrototypeOf(result)).toBe(Error.prototype);
      expect(result.name).toBe('InputError-***');
      expect(result.message).toBe('message ***');
      expect(result.stack).toBe('InputError-***: message ***\nstack');
      expect('cause' in result).toBe(false);
      expect('errors' in result).toBe(false);
      expect('custom' in result).toBe(false);
      expect(Object.getOwnPropertySymbols(result)).toEqual([]);
    });

    it('projects frozen errors without mutation', () => {
      const redacter = new TaskRedacter();
      redacter.add(['secret-value']);
      const original = Object.freeze(new Error('secret-value'));

      const result = redacter.redactError(original);

      expect(result).not.toBe(original);
      expect(result.message).toBe('***');
      expect(original.message).toBe('secret-value');
    });

    it('falls back safely for throwing getters and proxy traps', () => {
      const redacter = new TaskRedacter();
      const throwingGetter = Object.defineProperty({}, 'name', {
        get() {
          throw new Error('getter secret');
        },
      });
      const throwingProxy = new Proxy(
        {},
        {
          get() {
            throw new Error('proxy secret');
          },
        },
      );

      expect(redacter.redactError(throwingGetter)).toMatchObject({
        name: 'Error',
        message: 'Task failed',
      });
      expect(redacter.redactError(throwingProxy)).toMatchObject({
        name: 'Error',
        message: 'Task failed',
      });
    });

    it('projects strings and other thrown primitives without stringifying them', () => {
      const redacter = new TaskRedacter();
      redacter.add(['secret-value']);

      expect(redacter.redactError('secret-value').message).toBe('***');
      expect(redacter.redactError(42).message).toBe(
        'Task failed with thrown value of type number',
      );
      expect(redacter.redactError(null).message).toBe(
        'Task failed with thrown value of type null',
      );
    });
  });
});
