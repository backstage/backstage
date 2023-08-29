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
    at: 'foo/bar',
    extension: {} as Extension<unknown>,
    disabled: status === 'disabled',
  };
}

describe('mergeExtensionParameters', () => {
  it('should filter out disabled extension instances', () => {
    expect(mergeExtensionParameters([makeExt('a', 'disabled')], [])).toEqual(
      [],
    );
  });

  it('should pass through extension instances', () => {
    expect(mergeExtensionParameters([makeExt('a'), makeExt('b')], [])).toEqual([
      makeExt('a'),
      makeExt('b'),
    ]);
  });

  it('should override extension instances', () => {
    expect(
      mergeExtensionParameters(
        [makeExt('a'), makeExt('b')],
        [
          {
            id: 'b',
            extension: { ext: 'other' } as unknown as Extension<unknown>,
          },
        ],
      ),
    ).toEqual([makeExt('a'), { ...makeExt('b'), extension: { ext: 'other' } }]);
  });

  it('should override attachment points', () => {
    expect(
      mergeExtensionParameters(
        [makeExt('a'), makeExt('b')],
        [
          {
            id: 'b',
            at: 'derp',
          },
        ],
      ),
    ).toEqual([makeExt('a'), { ...makeExt('b'), at: 'derp' }]);
  });

  it('should fully override configuration', () => {
    expect(
      mergeExtensionParameters(
        [
          { ...makeExt('a'), config: { foo: { bar: 1 } } },
          { ...makeExt('b'), config: { foo: { bar: 2 } } },
        ],
        [
          {
            id: 'b',
            config: { foo: { qux: 3 } },
          },
        ],
      ),
    ).toEqual([
      { ...makeExt('a'), config: { foo: { bar: 1 } } },
      { ...makeExt('b'), config: { foo: { qux: 3 } } },
    ]);
  });

  it('should place enabled instances in the order that they were enabled', () => {
    expect(
      mergeExtensionParameters(
        [makeExt('a', 'disabled'), makeExt('b', 'disabled')],
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
    ).toEqual([makeExt('b'), makeExt('a')]);
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

  it('should support extension implementation shorthand', () => {
    expect(
      readAppExtensionParameters(
        new ConfigReader({
          app: {
            extensions: [{ 'core.router': 'example-package#CustomRouter' }],
          },
        }),
        ref => ({ ref } as unknown as Extension<unknown>),
      ),
    ).toEqual([
      {
        id: 'core.router',
        extension: { ref: 'example-package#CustomRouter' },
      },
    ]);
  });

  it('should support attachment shorthand', () => {
    expect(
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
        ref => ({ ref } as unknown as Extension<unknown>),
      ),
    ).toEqual([
      {
        id: 'generated.1',
        at: 'core.router/routes',
        extension: { ref: 'example-package#MyPage' },
        config: { foo: 'bar' },
      },
    ]);
  });

  it('should support attachment with extension shorthand', () => {
    expect(
      readAppExtensionParameters(
        new ConfigReader({
          app: {
            extensions: [{ 'core.router/routes': 'example-package#MyPage' }],
          },
        }),
        ref => ({ ref } as unknown as Extension<unknown>),
      ),
    ).toEqual([
      {
        id: 'generated.1',
        at: 'core.router/routes',
        extension: { ref: 'example-package#MyPage' },
      },
    ]);
  });

  it('should reject attachment shorthand with explicit attachment', () => {
    expect(() =>
      readAppExtensionParameters(
        new ConfigReader({
          app: {
            extensions: [
              {
                'core.router/routes': {
                  at: 'other/input',
                },
              },
            ],
          },
        }),
      ),
    ).toThrow(
      `Invalid extension configuration at app.extensions[0][core.router/routes], must not redundantly specify 'at' when the extension input ID form of the key is used (with a slash); the 'at' is already implicitly 'core.router/routes'`,
    );
  });
});

describe('expandShorthandExtensionParameters', () => {
  const resolveExtensionRef = jest.fn(
    ref => ({ ref } as unknown as Extension<unknown>),
  );
  const generateExtensionId = jest.fn(() => 'generated.1');
  const run = (value: JsonValue) => {
    return expandShorthandExtensionParameters(
      value,
      1,
      resolveExtensionRef,
      generateExtensionId,
    );
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
      `"Invalid extension configuration at app.extensions[1][a], value must be a boolean, string, or object"`,
    );
    expect(() => run({ a: 1 })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][a], value must be a boolean, string, or object"`,
    );
    expect(() => run({ a: [] })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][a], value must be a boolean, string, or object"`,
    );
  });

  it('supports string key', () => {
    expect(run('core.router')).toEqual({
      id: 'core.router',
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
    expect(() =>
      run({ 'core.router/routes': false }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][core.router/routes], cannot target an extension instance input (key cannot contain slashes; did you mean 'core.router'?)"`,
    );
  });

  it('supports string values', () => {
    expect(run({ 'core.router': 'example-package#MyRouter' })).toEqual({
      id: 'core.router',
      extension: { ref: 'example-package#MyRouter' },
    });
    expect(run({ 'core.router/routes': 'example-package#MyRouter' })).toEqual({
      id: 'generated.1',
      at: 'core.router/routes',
      extension: { ref: 'example-package#MyRouter' },
    });
  });

  it('supports object id only in the key', () => {
    expect(() =>
      run({ 'core.router/routes': { id: 'some.id' } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][core.router/routes].id, must not specify 'id' when the extension input ID form of the key is used (with a slash); please replace the key 'core.router/routes' with the id instead, and put that key in the 'at' field"`,
    );
    expect(() =>
      run({
        'core.router/routes': {
          id: 'example-package#MyRouter',
          at: 'core.router/routes',
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][core.router/routes], must not redundantly specify 'at' when the extension input ID form of the key is used (with a slash); the 'at' is already implicitly 'core.router/routes'"`,
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
      `"Invalid extension configuration at app.extensions[1][core.router], must not redundantly specify 'id' when the extension instance ID form of the key is used (without a slash); the 'id' is already implicitly 'core.router'"`,
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

  it('supports object extension', () => {
    expect(
      run({ 'core.router/routes': { extension: 'example-package#MyRouter' } }),
    ).toEqual({
      id: 'generated.1',
      at: 'core.router/routes',
      extension: { ref: 'example-package#MyRouter' },
    });
    expect(() =>
      run({ 'core.router/routes': { extension: 0 } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][core.router/routes].extension, must be a string"`,
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
      `"Invalid extension configuration at app.extensions[1][core.router].foo, unknown parameter; expected one of 'at', 'disabled', 'extension', 'config'"`,
    );
  });
});
