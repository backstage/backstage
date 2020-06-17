/*
 * Copyright 2020 Spotify AB
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

import { ConfigReader } from './reader';

const DATA = {
  zero: 0,
  one: 1,
  true: true,
  false: false,
  null: null,
  string: 'string',
  emptyString: '',
  strings: ['string1', 'string2'],
  badStrings: ['string1', ''],
  worseStrings: ['string1', 3] as string[],
  worstStrings: ['string1', 'string2', {}] as string[],
  nested: {
    one: 1,
    string: 'string',
    strings: ['string1', 'string2'],
  },
  nestlings: [{ boolean: true }, { string: 'string' }, { number: 42 }] as {}[],
};

function expectValidValues(config: ConfigReader) {
  expect(config.getNumber('zero')).toBe(0);
  expect(config.getNumber('one')).toBe(1);
  expect(config.getBoolean('true')).toBe(true);
  expect(config.getBoolean('false')).toBe(false);
  expect(config.getString('string')).toBe('string');
  expect(config.getStringArray('strings')).toEqual(['string1', 'string2']);
  expect(config.getConfig('nested').getNumber('one')).toBe(1);
  expect(config.getConfig('nested').getString('string')).toBe('string');
  expect(config.getConfig('nested').getStringArray('strings')).toEqual([
    'string1',
    'string2',
  ]);
  expect(config.mustNumber('zero')).toBe(0);
  expect(config.mustBoolean('true')).toBe(true);
  expect(config.mustString('string')).toBe('string');
  expect(config.mustStringArray('strings')).toEqual(['string1', 'string2']);

  const [config1, config2, config3] = config.getConfigArray('nestlings');
  expect(config1.getBoolean('boolean')).toBe(true);
  expect(config2.getString('string')).toBe('string');
  expect(config3.getNumber('number')).toBe(42);
}

function expectInvalidValues(config: ConfigReader) {
  expect(() => config.getBoolean('string')).toThrow(
    'Invalid type in config for key string, got string, wanted boolean',
  );
  expect(() => config.getNumber('string')).toThrow(
    'Invalid type in config for key string, got string, wanted number',
  );
  expect(() => config.getString('one')).toThrow(
    'Invalid type in config for key one, got number, wanted string',
  );
  expect(() => config.getNumber('true')).toThrow(
    'Invalid type in config for key true, got boolean, wanted number',
  );
  expect(() => config.getStringArray('null')).toThrow(
    'Invalid type in config for key null, got null, wanted string-array',
  );
  expect(() => config.getString('emptyString')).toThrow(
    'Invalid type in config for key emptyString, got empty-string, wanted string',
  );
  expect(() => config.getStringArray('badStrings')).toThrow(
    'Invalid type in config for key badStrings[1], got empty-string, wanted string',
  );
  expect(() => config.getStringArray('worseStrings')).toThrow(
    'Invalid type in config for key worseStrings[1], got number, wanted string',
  );
  expect(() => config.getStringArray('worstStrings')).toThrow(
    'Invalid type in config for key worstStrings[2], got object, wanted string',
  );
  expect(() => config.getConfig('one')).toThrow(
    'Invalid type in config for key one, got number, wanted object',
  );
  expect(() => config.getConfigArray('one')).toThrow(
    'Invalid type in config for key one, got number, wanted object-array',
  );
  expect(() => config.mustBoolean('missing')).toThrow(
    "Missing required config value at 'missing'",
  );
  expect(() => config.mustNumber('missing')).toThrow(
    "Missing required config value at 'missing'",
  );
  expect(() => config.mustString('missing')).toThrow(
    "Missing required config value at 'missing'",
  );
  expect(() => config.mustStringArray('missing')).toThrow(
    "Missing required config value at 'missing'",
  );
}

describe('ConfigReader', () => {
  it('should read empty config with valid keys', () => {
    const config = new ConfigReader({});
    expect(config.getString('x')).toBeUndefined();
    expect(config.getString('x_x')).toBeUndefined();
    expect(config.getString('x-X')).toBeUndefined();
    expect(config.getString('x0')).toBeUndefined();
    expect(config.getString('X-x2')).toBeUndefined();
    expect(config.getString('x0_x0')).toBeUndefined();
    expect(config.getString('x_x-x_x')).toBeUndefined();
  });

  it('should throw on invalid keys', () => {
    const config = new ConfigReader({});

    expect(() => config.getString('.')).toThrow(/^Invalid config key/);
    expect(() => config.getString('0')).toThrow(/^Invalid config key/);
    expect(() => config.getString('(')).toThrow(/^Invalid config key/);
    expect(() => config.getString('z-_')).toThrow(/^Invalid config key/);
    expect(() => config.getString('-')).toThrow(/^Invalid config key/);
    expect(() => config.getString('.a')).toThrow(/^Invalid config key/);
    expect(() => config.getString('0.a')).toThrow(/^Invalid config key/);
    expect(() => config.getString('0a')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a.0a')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a..a')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a.')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a...')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a.a.a.a.')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a._')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a.-.a')).toThrow(/^Invalid config key/);
  });

  it('should read valid values', () => {
    const config = new ConfigReader(DATA);
    expectValidValues(config);
  });

  it('should fail to read invalid values', () => {
    const config = new ConfigReader(DATA);
    expectInvalidValues(config);
  });
});

describe('ConfigReader with fallback', () => {
  it('should behave as if without fallback', () => {
    const config = new ConfigReader({}, new ConfigReader(DATA));
    expect(config.getString('x')).toBeUndefined();
    expect(() => config.getString('.')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a.')).toThrow(/^Invalid config key/);
  });

  it('should read values from itself', () => {
    const config = new ConfigReader(DATA, new ConfigReader({}));
    expectValidValues(config);
    expectInvalidValues(config);
  });

  it('should read values from a fallback', () => {
    const config = new ConfigReader({}, new ConfigReader(DATA));
    expectValidValues(config);
    expectInvalidValues(config);
  });

  it('should read values from multiple levels of fallbacks', () => {
    const config = new ConfigReader(
      {},
      new ConfigReader({}, new ConfigReader({}, new ConfigReader(DATA))),
    );
    expectValidValues(config);
    expectInvalidValues(config);
  });

  it('should read merged objects', () => {
    const a = {
      merged: {
        x: 'x',
        z: 'z1',
        arr: ['a', 'b'],
        config: { d: 'd' },
        configs: [{ a: 'a' }],
      },
    };
    const b = {
      merged: {
        y: 'y',
        z: 'z2',
        arr: ['c'],
        config: { e: 'e' },
        configs: [{ b: 'b' }],
      },
    };

    const config = new ConfigReader(a, new ConfigReader(b));

    expect(config.getString('merged.x')).toBe('x');
    expect(config.getString('merged.y')).toBe('y');
    expect(config.getString('merged.z')).toBe('z1');
    expect(config.getConfig('merged').getString('x')).toBe('x');
    expect(config.getConfig('merged').getString('y')).toBe('y');
    expect(config.getConfig('merged').getString('z')).toBe('z1');
    expect(config.getString('merged.config.d')).toBe('d');
    expect(config.getString('merged.config.e')).toBe('e');
    expect(config.getConfig('merged').getString('config.d')).toBe('d');
    expect(config.getConfig('merged').getString('config.e')).toBe('e');
    expect(config.getConfig('merged').getConfig('config').getString('d')).toBe(
      'd',
    );
    expect(config.getConfig('merged').getConfig('config').getString('e')).toBe(
      'e',
    );

    // Arrays are not merged
    expect(config.getStringArray('merged.arr')).toEqual(['a', 'b']);
    expect(config.getConfig('merged').getStringArray('arr')).toEqual([
      'a',
      'b',
    ]);

    // Config arrays aren't merged either
    expect(config.getConfigArray('merged.configs').length).toBe(1);
    expect(config.getConfigArray('merged.configs')[0].getString('a')).toBe('a');
    expect(config.getConfigArray('merged.configs')[0].mustString('a')).toBe(
      'a',
    );
    expect(() =>
      config.getConfigArray('merged.configs')[0].mustString('missing'),
    ).toThrow("Missing required config value at 'missing'");
    expect(
      config.getConfigArray('merged.configs')[0].getString('b'),
    ).toBeUndefined();

    // Config arrays aren't merged either
    expect(config.getConfig('merged').getConfigArray('configs').length).toBe(1);
    expect(
      config.getConfig('merged').getConfigArray('configs')[0].getString('a'),
    ).toBe('a');
    expect(
      config.getConfig('merged').getConfigArray('configs')[0].getString('b'),
    ).toBeUndefined();
  });
});
