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

import { ConfigReader } from '@backstage/config';
import { JsonValue } from '@backstage/types';
import {
  expandShorthandExtensionParameters,
  readAppExtensionsConfig,
} from './readAppExtensionsConfig';

describe('readAppExtensionsConfig', () => {
  it('should disable extension with shorthand notation', () => {
    expect(
      readAppExtensionsConfig(
        new ConfigReader({ app: { extensions: [{ 'app/router': false }] } }),
      ),
    ).toEqual([
      {
        id: 'app/router',
        disabled: true,
      },
    ]);
    expect(
      readAppExtensionsConfig(
        new ConfigReader({
          app: { extensions: [{ 'app/router': { disabled: true } }] },
        }),
      ),
    ).toEqual([
      {
        at: undefined,
        config: undefined,
        disabled: true,
        id: 'app/router',
      },
    ]);
  });

  it('should enable extension with shorthand notation', () => {
    expect(
      readAppExtensionsConfig(
        new ConfigReader({ app: { extensions: ['app/router'] } }),
      ),
    ).toEqual([
      {
        id: 'app/router',
        disabled: false,
      },
    ]);
    expect(
      readAppExtensionsConfig(
        new ConfigReader({ app: { extensions: [{ 'app/router': true }] } }),
      ),
    ).toEqual([
      {
        id: 'app/router',
        disabled: false,
      },
    ]);
    expect(
      readAppExtensionsConfig(
        new ConfigReader({
          app: { extensions: [{ 'app/router': { disabled: false } }] },
        }),
      ),
    ).toEqual([
      {
        id: 'app/router',
        disabled: false,
      },
    ]);
  });

  it('should not allow string keys', () => {
    expect(() =>
      readAppExtensionsConfig(
        new ConfigReader({
          app: {
            extensions: [{ 'app/router': 'some-string' }],
          },
        }),
      ),
    ).toThrow(
      'Invalid extension configuration at app.extensions[0][app/router], value must be a boolean or object',
    );
  });

  it('should not allow invalid keys', () => {
    expect(() =>
      readAppExtensionsConfig(
        new ConfigReader({
          app: {
            extensions: [
              {
                '': {
                  extension: 'example-package#MyPage',
                  config: { foo: 'bar' },
                },
              },
            ],
          },
        }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[0], extension ID must not be empty or contain whitespace"`,
    );
  });
});

describe('expandShorthandExtensionParameters', () => {
  const run = (value: JsonValue) => {
    return expandShorthandExtensionParameters(value, 1);
  };

  it('rejects unknown keys', () => {
    expect(() => run(null)).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], must be a string or an object"`,
    );
    expect(() => run(1)).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], must be a string or an object"`,
    );
    expect(() => run([])).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], must be a string or an object"`,
    );
  });

  it('rejects the wrong number of keys', () => {
    expect(() => run({})).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], must have exactly one key, got none"`,
    );
    expect(() => run({ a: {}, b: {} })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], must have exactly one key, got 'a', 'b'"`,
    );
  });

  it('rejects unknown values', () => {
    expect(() => run({ a: 1 })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][a], value must be a boolean or object"`,
    );
    expect(() => run({ a: [] })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][a], value must be a boolean or object"`,
    );
  });

  it('supports string key', () => {
    expect(run('app/router')).toEqual({
      id: 'app/router',
      disabled: false,
    });
    expect(() => run('')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], extension ID must not be empty or contain whitespace"`,
    );
    expect(() => run(' a')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], extension ID must not be empty or contain whitespace"`,
    );
  });

  it('supports null value', () => {
    // this is the result of typing:
    // - app/router:
    // The missing value is interpreted as null by the yaml parser so we deal with that
    expect(run({ 'app/router': null })).toEqual({
      id: 'app/router',
      disabled: false,
    });
  });

  it('supports boolean value', () => {
    expect(run({ 'app/router': true })).toEqual({
      id: 'app/router',
      disabled: false,
    });
    expect(run({ 'app/router': false })).toEqual({
      id: 'app/router',
      disabled: true,
    });
  });

  it('should not support string values', () => {
    expect(() =>
      run({ 'app/router': 'example-package#MyRouter' }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/router], value must be a boolean or object"`,
    );
  });

  it('supports object id only in the key', () => {
    expect(() =>
      run({ 'app/router': { id: 'some.id' } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/router].id, unknown parameter; expected one of 'attachTo', 'disabled', 'config'"`,
    );
  });

  it('supports object attachTo', () => {
    expect(
      run({
        'app/router': { attachTo: { id: 'other.root', input: 'inputs' } },
      }),
    ).toEqual({
      id: 'app/router',
      attachTo: { id: 'other.root', input: 'inputs' },
    });
    expect(() =>
      run({
        'app/router': {
          id: 'other-id',
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/router].id, unknown parameter; expected one of 'attachTo', 'disabled', 'config'"`,
    );
  });

  it('supports object disabled', () => {
    expect(run({ 'app/router': { disabled: true } })).toEqual({
      id: 'app/router',
      disabled: true,
    });
    expect(run({ 'app/router': { disabled: false } })).toEqual({
      id: 'app/router',
      disabled: false,
    });
    expect(() =>
      run({ 'app/router': { disabled: 0 } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/router].disabled, must be a boolean"`,
    );
  });

  it('supports object config', () => {
    expect(
      run({ 'app/router': { config: { disableRedirects: true } } }),
    ).toEqual({
      id: 'app/router',
      config: { disableRedirects: true },
    });
    expect(() =>
      run({ 'app/router': { config: 0 } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/router].config, must be an object"`,
    );
  });

  it('rejects unknown object keys', () => {
    expect(() =>
      run({ 'app/router': { foo: { settings: true } } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/router].foo, unknown parameter; expected one of 'attachTo', 'disabled', 'config'"`,
    );
  });
});
