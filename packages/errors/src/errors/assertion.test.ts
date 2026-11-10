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

import { assertError, isError, isErrorWithName, toError } from './assertion';
import { NotFoundError } from './common';
import { CustomErrorBase } from './CustomErrorBase';

const areErrors = [
  { name: 'e', message: '' },
  new Error(),
  new NotFoundError(),
  Object.create({ name: 'e', message: '' }),
  Object.assign(Object.create({ name: 'e' }), {
    get message() {
      return '';
    },
  }),
  new (class extends class {
    message = '';
  } {
    name = 'e';
  })(),
  new (class SubclassError extends CustomErrorBase {})(),
  new (class SubclassError extends NotFoundError {})(),
];

const notErrors = [
  null,
  0,
  'loller',
  Symbol(),
  [],
  BigInt(0),
  false,
  true,
  { name: 'e' },
  { message: '' },
  { name: '', message: 'oh no' },
  new (class {})(),
];

describe('assertError', () => {
  it.each(areErrors)('should assert that things are errors %#', error => {
    expect(assertError(error)).toBeUndefined();
  });

  it.each(notErrors)(
    'should assert that things are not errors %#',
    notError => {
      expect(() => assertError(notError)).toThrow();
    },
  );
});

describe('isError', () => {
  it.each(areErrors)('should assert that things are errors %#', error => {
    expect(isError(error)).toBe(true);
  });

  it.each(notErrors)(
    'should assert that things are not errors %#',
    notError => {
      expect(isError(notError)).toBe(false);
    },
  );
});

describe('isErrorWithName', () => {
  it('checks explicit names and optional causes without constructor identity', () => {
    const cause = { name: 'Cause', message: '' };
    const value: unknown = { name: 'CustomError', message: '', cause };
    expect(isErrorWithName(value, 'CustomError')).toBe(true);
    if (!isErrorWithName(value, 'CustomError')) {
      throw new Error('Expected a named error');
    }
    const name: 'CustomError' = value.name;
    const narrowedCause: Error | undefined = value.cause;
    expect(name).toBe('CustomError');
    expect(narrowedCause).toBe(cause);
    expect(isErrorWithName({ name: 'CustomError', message: '' }, name)).toBe(
      true,
    );
    expect(isErrorWithName(new NotFoundError(), 'NotFoundError')).toBe(true);
    expect(isErrorWithName(value, 'OtherError')).toBe(false);

    for (const invalid of [
      undefined,
      ...notErrors,
      Object.assign([], { name: 'CustomError', message: '' }),
      { name: 'CustomError', message: 42 },
      { name: 'CustomError', message: '', cause: null },
      { name: 'CustomError', message: '', cause: 'cause' },
      { name: 'CustomError', message: '', cause: {} },
    ]) {
      expect(isErrorWithName(invalid, 'CustomError')).toBe(false);
    }
  });
});

describe('toError', () => {
  it.each(areErrors)(
    'should pass through error-like values as-is %#',
    error => {
      expect(toError(error)).toBe(error);
    },
  );

  it('should preserve the original error instance', () => {
    const original = new NotFoundError('not found');
    expect(toError(original)).toBe(original);
  });

  it('should use strings directly as the error message', () => {
    const result = toError('something went wrong');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('something went wrong');
  });

  it('should handle empty strings', () => {
    const result = toError('');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('');
  });

  it('should wrap undefined', () => {
    const result = toError(undefined);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("unknown error 'undefined'");
  });

  it('should wrap null', () => {
    const result = toError(null);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("unknown error 'null'");
  });

  it('should wrap numbers', () => {
    expect(toError(0).message).toBe("unknown error '0'");
    expect(toError(42).message).toBe("unknown error '42'");
  });

  it('should wrap booleans', () => {
    expect(toError(false).message).toBe("unknown error 'false'");
    expect(toError(true).message).toBe("unknown error 'true'");
  });

  it('should wrap plain objects', () => {
    expect(toError({ name: 'e' }).message).toBe(
      "unknown error '[object Object]'",
    );
    expect(toError({}).message).toBe("unknown error '[object Object]'");
  });

  it('should wrap arrays', () => {
    expect(toError([]).message).toBe("unknown error ''");
    expect(toError([1, 2]).message).toBe("unknown error '1,2'");
  });

  it('should handle objects with a custom toString', () => {
    const obj = { toString: () => 'custom string' };
    expect(toError(obj).message).toBe("unknown error 'custom string'");
  });

  it('should handle symbols', () => {
    const result = toError(Symbol('test'));
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("unknown error of type 'symbol'");
  });

  it('should handle BigInt', () => {
    expect(toError(BigInt(42)).message).toBe("unknown error '42'");
  });

  it('should not throw for objects with a throwing toString', () => {
    const obj = Object.create(null);
    const result = toError(obj);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("unknown error of type 'object'");
  });

  it('should not throw for circular objects', () => {
    const obj: { self?: unknown } = {};
    obj.self = obj;
    const result = toError(obj);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("unknown error '[object Object]'");
  });
});
