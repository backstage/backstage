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

import { readEnv } from './env';

describe('readEnv', () => {
  it('should return empty config for empty env', () => {
    expect(readEnv({})).toEqual([]);
  });

  it('should return empty config for no matching keys', () => {
    expect(
      readEnv({
        NODE_ENV: 'production',
        NOPE_ENV: 'development',
        APP_CONFIG: 'foo',
        APP__CONFIG_derp: 'herp',
      }),
    ).toEqual([]);
  });

  it('should create config from env', () => {
    expect(
      readEnv({
        NODE_ENV: 'production',
        APP_CONFIG_foo: '"bar"',
        APP_CONFIG_numbers_a: '1',
        APP_CONFIG_numbers_b: '2',
        APP_CONFIG_numbers_c: 'false',
        APP_CONFIG_numbers_d: undefined,
        APP_CONFIG_very_deep_nested_config_object: '{}',
      }),
    ).toEqual([
      {
        foo: 'bar',
        numbers: { a: 1, b: 2, c: false },
        very: { deep: { nested: { config: { object: {} } } } },
      },
    ]);
  });

  it.each([
    ['APP_CONFIG__foo'],
    ['APP_CONFIG_foo_'],
    ['APP_CONFIG_fo_0'],
    ['APP_CONFIG_fo/o'],
    ['APP_CONFIG_fo o'],
    ['APP_CONFIG_foo_(foo)_foo'],
  ])('should reject invalid key %p', key => {
    expect(() => readEnv({ [key]: '0' })).toThrow(
      `Invalid env config key '${key.replace('APP_CONFIG_', '')}'`,
    );
  });

  it.each([['hello'], ['"hello'], ['{'], ['}'], ['123abc']])(
    'should reject invalid value %p',
    value => {
      expect(() => readEnv({ APP_CONFIG_foo: value })).toThrow(
        /^Failed to parse JSON-serialized config value for key 'foo', SyntaxError: /,
      );
    },
  );

  it('should not allow null as a value', () => {
    expect(() =>
      readEnv({
        APP_CONFIG_foo: 'null',
      }),
    ).toThrow(
      "Failed to parse JSON-serialized config value for key 'foo', Error: value may not be null",
    );
  });

  it('should not allow duplicate values', () => {
    expect(() =>
      readEnv({
        APP_CONFIG_foo_bar: '1',
        APP_CONFIG_foo_bar_baz: '2',
      }),
    ).toThrow(
      "Could not nest config for key 'foo_bar_baz' under existing value 'foo_bar'",
    );
  });

  it('should not allow mixing of objects and other values', () => {
    expect(() =>
      readEnv({
        APP_CONFIG_nested_foo: '1',
        APP_CONFIG_nested: '2',
      }),
    ).toThrow("Refusing to override existing config at key 'nested'");
  });
});
