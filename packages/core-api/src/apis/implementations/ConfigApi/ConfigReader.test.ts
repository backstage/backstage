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

import { ConfigReader } from './ConfigReader';

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

    const [config1, config2, config3] = config.getConfigArray('nestlings');
    expect(config1.getBoolean('boolean')).toBe(true);
    expect(config2.getString('string')).toBe('string');
    expect(config3.getNumber('number')).toBe(42);
  });

  it('should fail to read invalid values', () => {
    const config = new ConfigReader(DATA);

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
  });
});
