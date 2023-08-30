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
import { Extension } from '@backstage/frontend-plugin-api';
import { JsonValue } from '@backstage/types';
import {
  expandShorthandExtensionParameters,
  mergeExtensionParameters,
  readAppExtensionParameters,
} from './parameters';

function makeExt(id: string, status: 'disabled' | 'enabled' = 'enabled') {
  return {
    id,
    at: 'root',
    disabled: status === 'disabled',
  } as Extension<unknown>;
}

describe('mergeExtensionParameters', () => {
  it('should filter out disabled extension instances', () => {
    expect(mergeExtensionParameters([makeExt('a', 'disabled')], [])).toEqual(
      [],
    );
  });

  it('should pass through extension instances', () => {
    const a = makeExt('a');
    const b = makeExt('b');
    expect(mergeExtensionParameters([a, b], [])).toEqual([
      { extension: a, at: 'root' },
      { extension: b, at: 'root' },
    ]);
  });

  it('should override attachment points', () => {
    const a = makeExt('a');
    const b = makeExt('b');
    expect(
      mergeExtensionParameters(
        [a, b],
        [
          {
            id: 'b',
            at: 'derp',
          },
        ],
      ),
    ).toEqual([
      { extension: a, at: 'root' },
      { extension: b, at: 'derp' },
    ]);
  });

  it('should fully override configuration and duplicate', () => {
    const a = makeExt('a');
    const b = makeExt('b');
    expect(
      mergeExtensionParameters(
        [a, b],
        [
          {
            id: 'a',
            config: { foo: { bar: 1 } },
          },
          {
            id: 'b',
            config: { foo: { bar: 2 } },
          },
          {
            id: 'b',
            config: { foo: { qux: 3 } },
          },
        ],
      ),
    ).toEqual([
      { extension: a, at: 'root', config: { foo: { bar: 1 } } },
      { extension: b, at: 'root', config: { foo: { qux: 3 } } },
    ]);
  });

  it('should place enabled instances in the order that they were enabled', () => {
    const a = makeExt('a', 'disabled');
    const b = makeExt('b', 'disabled');
    expect(
      mergeExtensionParameters(
        [a, b],
        [
          {
            id: 'b',
            disabled: false,
          },
          {
            id: 'a',
            disabled: false,
          },
        ],
      ),
    ).toEqual([
      { extension: b, at: 'root' },
      { extension: a, at: 'root' },
    ]);
  });
});

describe('readAppExtensionParameters', () => {
  it('should disable extension with shorthand notation', () => {
    expect(
      readAppExtensionParameters(
        new ConfigReader({ app: { extensions: [{ 'core.router': false }] } }),
      ),
    ).toEqual([
      {
        id: 'core.router',
        disabled: true,
      },
    ]);
    expect(
      readAppExtensionParameters(
        new ConfigReader({
          app: { extensions: [{ 'core.router': { disabled: true } }] },
        }),
      ),
    ).toEqual([
      {
        at: undefined,
        config: undefined,
        disabled: true,
        id: 'core.router',
      },
    ]);
  });

  it('should enable extension with shorthand notation', () => {
    expect(
      readAppExtensionParameters(
        new ConfigReader({ app: { extensions: ['core.router'] } }),
      ),
    ).toEqual([
      {
        id: 'core.router',
        disabled: false,
      },
    ]);
    expect(
      readAppExtensionParameters(
        new ConfigReader({ app: { extensions: [{ 'core.router': true }] } }),
      ),
    ).toEqual([
      {
        id: 'core.router',
        disabled: false,
      },
    ]);
    expect(
      readAppExtensionParameters(
        new ConfigReader({
          app: { extensions: [{ 'core.router': { disabled: false } }] },
        }),
      ),
    ).toEqual([
      {
        id: 'core.router',
        disabled: false,
      },
    ]);
  });

  it('should not allow string keys', () => {
    expect(() =>
      readAppExtensionParameters(
        new ConfigReader({
          app: {
            extensions: [{ 'core.router': 'some-string' }],
          },
        }),
      ),
    ).toThrow(
      'Invalid extension configuration at app.extensions[0][core.router], value must be a boolean or object',
    );
  });

  it('should not allow invalid keys', () => {
    expect(() =>
      readAppExtensionParameters(
        new ConfigReader({
          app: {
            extensions: [
              {
                'core.router/routes': {
                  extension: 'example-package#MyPage',
                  config: { foo: 'bar' },
                },
              },
            ],
          },
        }),
      ),
    ).toThrow(
      'Invalid extension configuration at app.extensions[0], key must only contain letters, numbers and dots, got core.router/routes',
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
    expect(() => run({ a: null })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][a], value must be a boolean or object"`,
    );
    expect(() => run({ a: 1 })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][a], value must be a boolean or object"`,
    );
    expect(() => run({ a: [] })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][a], value must be a boolean or object"`,
    );
  });

  it('supports string key', () => {
    expect(run('core.router')).toEqual({
      id: 'core.router',
      disabled: false,
    });
    expect(() => run('')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], string shorthand cannot be the empty string"`,
    );
    expect(() => run('core.router/routes')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], cannot target an extension instance input with the string shorthand (key cannot contain slashes; did you mean 'core.router'?)"`,
    );
  });

  it('supports boolean value', () => {
    expect(run({ 'core.router': true })).toEqual({
      id: 'core.router',
      disabled: false,
    });
    expect(run({ 'core.router': false })).toEqual({
      id: 'core.router',
      disabled: true,
    });
  });

  it('should not support string values', () => {
    expect(() =>
      run({ 'core.router': 'example-package#MyRouter' }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][core.router], value must be a boolean or object"`,
    );
  });

  it('supports object id only in the key', () => {
    expect(() =>
      run({ 'core.router': { id: 'some.id' } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][core.router].id, unknown parameter; expected one of 'at', 'disabled', 'config'"`,
    );
  });

  it('supports object at', () => {
    expect(run({ 'core.router': { at: 'other.root/inputs' } })).toEqual({
      id: 'core.router',
      at: 'other.root/inputs',
    });
    expect(() =>
      run({
        'core.router': {
          id: 'other-id',
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][core.router].id, unknown parameter; expected one of 'at', 'disabled', 'config'"`,
    );
  });

  it('supports object disabled', () => {
    expect(run({ 'core.router': { disabled: true } })).toEqual({
      id: 'core.router',
      disabled: true,
    });
    expect(run({ 'core.router': { disabled: false } })).toEqual({
      id: 'core.router',
      disabled: false,
    });
    expect(() =>
      run({ 'core.router': { disabled: 0 } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][core.router].disabled, must be a boolean"`,
    );
  });

  it('supports object config', () => {
    expect(
      run({ 'core.router': { config: { disableRedirects: true } } }),
    ).toEqual({
      id: 'core.router',
      config: { disableRedirects: true },
    });
    expect(() =>
      run({ 'core.router': { config: 0 } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][core.router].config, must be an object"`,
    );
  });

  it('rejects unknown object keys', () => {
    expect(() =>
      run({ 'core.router': { foo: { settings: true } } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][core.router].foo, unknown parameter; expected one of 'at', 'disabled', 'config'"`,
    );
  });
});
