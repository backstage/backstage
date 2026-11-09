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

import * as errors from './common';
import { CustomErrorBase } from './CustomErrorBase';
import { isErrorWithName } from './assertion';

describe('common', () => {
  it('recognizes fixed-name errors without shared constructor identity', () => {
    const { ForwardedError, ...namedErrors } = { ...errors };
    for (const [name, E] of Object.entries(namedErrors)) {
      const cause = { name: 'OtherError', message: 'cause' };
      const value: unknown = { name, message: 'message', cause };
      expect(value).not.toBeInstanceOf(E);
      expect(E.is(value)).toBe(true);
      expect([null, value, new Error('other')].filter(E.is)).toEqual([value]);
      if (!E.is(value)) {
        throw new Error('Expected a matching error');
      }
      const narrowed: InstanceType<typeof E> = value;
      expect(narrowed.cause).toBe(cause);
      expect(E.is({ name, message: '' })).toBe(true);
      expect(E.is(new E('message'))).toBe(true);
      expect(E.is(new E('message', cause))).toBe(true);
      expect(E.is(new ForwardedError('context', new E('message')))).toBe(true);

      for (const invalid of [
        undefined,
        null,
        false,
        42,
        name,
        [],
        Object.assign([], { name, message: 'message' }),
        {},
        new Error('message'),
        { name: 'OtherError', message: 'message' },
        { name },
        { name, message: 42 },
        { name, message: 'message', cause: null },
        { name, message: 'message', cause: 'cause' },
        { name, message: 'message', cause: {} },
      ]) {
        expect(E.is(invalid)).toBe(false);
      }
    }
  });

  it('supports custom guards without inheriting a public base guard', () => {
    class DetailedError extends CustomErrorBase {
      name = 'DetailedError' as const;
      readonly detail = 'details';

      static is(value: unknown): value is DetailedError {
        return (
          isErrorWithName(value, 'DetailedError') &&
          'detail' in value &&
          typeof value.detail === 'string'
        );
      }
    }

    expect('is' in CustomErrorBase).toBe(false);
    expect('is' in errors.ForwardedError).toBe(false);
    expect(DetailedError.is(new DetailedError('message'))).toBe(true);
    const value: unknown = {
      name: 'DetailedError',
      message: 'message',
      detail: 'details',
    };
    expect(DetailedError.is(value)).toBe(true);
    if (!DetailedError.is(value)) {
      throw new Error('Expected a DetailedError');
    }
    const narrowed: DetailedError = value;
    expect(narrowed.detail).toBe('details');
    expect(DetailedError.is({ name: 'DetailedError', message: '' })).toBe(
      false,
    );
    expect(
      DetailedError.is({ name: 'DetailedError', message: '', detail: 42 }),
    ).toBe(false);
    expect(
      DetailedError.is({ name: 'OtherError', message: '', detail: 'details' }),
    ).toBe(false);
    expect(
      DetailedError.is({ ...new DetailedError('message'), cause: 'invalid' }),
    ).toBe(false);
  });

  it('extends Error properly', () => {
    const { ForwardedError: _, ...optionalCauseErrors } = { ...errors };
    for (const [name, E] of Object.entries(optionalCauseErrors)) {
      const error = new E('abcdef');
      expect(error.name).toBe(name);
      expect(error.message).toBe('abcdef');
      expect(error.stack).toContain('common.test.ts');
      expect(error.toString()).toContain(name);
      expect(error.toString()).toContain('abcdef');
    }
  });

  it('supports causes', () => {
    const cause = new Error('hello');
    const { ForwardedError, ...otherErrors } = { ...errors };
    for (const [name, E] of Object.entries(otherErrors)) {
      const error = new E('abcdef', cause);
      expect(error.cause).toBe(cause);
      expect(error.toString()).toContain(
        `${name}: abcdef; caused by Error: hello`,
      );
    }

    const error = new ForwardedError('abcdef', cause);
    expect(error.cause).toBe(cause);
    expect(error.toString()).toContain('Error: abcdef; caused by Error: hello');
  });

  it('avoids [object Object]', () => {
    const cause = { name: 'SillyError', message: 'oh no' };
    const error = new errors.ForwardedError('abcdef', cause);
    expect(error.cause).toBe(cause);
    expect(String(error)).toBe(
      'SillyError: abcdef; caused by SillyError: oh no',
    );
  });
});
