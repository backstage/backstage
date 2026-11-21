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

import { stringifyLogValue } from './formats';

describe('stringifyLogValue', () => {
  it('escapes strings and handles primitives, omitted properties and array holes', () => {
    const controls = Array.from({ length: 32 }, (_, index) =>
      String.fromCharCode(index),
    ).join('');
    for (const value of [
      '',
      'a simple string',
      '"quotes" \\ slash',
      controls,
      '\ud800 and \udfff and 😀',
      'x'.repeat(4999),
      'x'.repeat(5000),
    ]) {
      expect(stringifyLogValue(value)).toBe(JSON.stringify(value));
      expect(stringifyLogValue({ [value]: value })).toBe(
        JSON.stringify({ [value]: value }),
      );
    }

    const array: unknown[] = new Array(1);
    array.push(
      undefined,
      () => undefined,
      Symbol('ignored'),
      NaN,
      Infinity,
      BigInt(17),
      null,
    );
    expect(stringifyLogValue(array)).toBe(
      '[null,null,null,null,null,null,"17",null]',
    );
    expect(
      stringifyLogValue({
        missing: undefined,
        callable: () => undefined,
        symbol: Symbol('ignored'),
        [Symbol('key')]: 'ignored',
        null: null,
        false: false,
        true: true,
        nan: NaN,
        infinity: -Infinity,
        zero: -0,
        bigint: BigInt('12345678901234567890'),
      }),
    ).toBe(
      '{"bigint":"12345678901234567890","false":false,"infinity":null,"nan":null,"null":null,"true":true,"zero":0}',
    );
    for (const value of [undefined, () => undefined, Symbol('ignored')]) {
      expect(stringifyLogValue(value)).toBeUndefined();
    }
  });

  it('sorts object keys deterministically for small and large objects', () => {
    expect(stringifyLogValue({ 2: 'two', 10: 'ten', 0: 'zero' })).toBe(
      '{"0":"zero","10":"ten","2":"two"}',
    );
    for (const count of [0, 5, 200, 201]) {
      const fields = Array.from(
        { length: count },
        (_, index) => `field${count - index}`,
      );
      const namedFields = Object.fromEntries(
        fields.map(field => [field, field]),
      );
      const encodedNames = stringifyLogValue(namedFields)!;
      expect(JSON.parse(encodedNames)).toEqual(namedFields);
      expect(Object.keys(JSON.parse(encodedNames))).toEqual([...fields].sort());
      const value = {
        ...namedFields,
        ...JSON.parse(
          '{"0":0,"2":2,"10":10,"4294967294":1,"4294967295":2,"00":3,"__proto__":"literal","constructor":true}',
        ),
      };
      const encoded = stringifyLogValue(value)!;
      expect(JSON.parse(encoded)).toEqual(value);
      expect(Object.keys(JSON.parse(encoded))).toEqual([
        '0',
        '2',
        '10',
        '4294967294',
        '00',
        '4294967295',
        '__proto__',
        'constructor',
        ...fields.sort(),
      ]);
    }
  });

  it('marks ancestor cycles while serializing repeated references without mutating them', () => {
    const shared = { value: 42 };
    const circular: { shared: typeof shared; self?: unknown } = { shared };
    circular.self = circular;
    const array: unknown[] = [shared];
    array.push(array);

    expect(
      stringifyLogValue({ first: shared, second: shared, circular, array }),
    ).toBe(
      '{"array":[{"value":42},"[Circular]"],"circular":{"self":"[Circular]","shared":{"value":42}},"first":{"value":42},"second":{"value":42}}',
    );
    expect(circular.self).toBe(circular);
    expect(array[1]).toBe(array);
    expect(shared).toEqual({ value: 42 });
  });

  it('honors toJSON once per value and recovers from serialization failures', () => {
    const replacement = { value: BigInt(7), toJSON: jest.fn(() => 'again') };
    const toJSON = jest.fn(() => replacement);
    expect(
      stringifyLogValue({
        converted: { toJSON },
        date: new Date('2026-11-18T00:00:00.000Z'),
        invalid: new Date(NaN),
      }),
    ).toBe(
      '{"converted":{"value":"7"},"date":"2026-11-18T00:00:00.000Z","invalid":null}',
    );
    expect(toJSON).toHaveBeenCalledTimes(1);
    expect(toJSON).toHaveBeenCalledWith('converted');
    expect(replacement.toJSON).not.toHaveBeenCalled();

    expect(
      stringifyLogValue({
        get broken() {
          throw new Error('broken getter');
        },
        kept: true,
      }),
    ).toBe('"[field value not castable to string]"');
    expect(
      stringifyLogValue({
        toJSON() {
          throw new Error('broken serialization');
        },
      }),
    ).toBe('"[field value not castable to string]"');
    expect(stringifyLogValue({ kept: true })).toBe('{"kept":true}');
  });
});
