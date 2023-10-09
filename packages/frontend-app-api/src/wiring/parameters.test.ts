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
import {
  createExtensionOverrides,
  createPlugin,
  Extension,
} from '@backstage/frontend-plugin-api';
import { JsonValue } from '@backstage/types';
import {
  expandShorthandExtensionParameters,
  mergeExtensionParameters,
  readAppExtensionParameters,
} from './parameters';

function makeExt(
  id: string,
  status: 'disabled' | 'enabled' = 'enabled',
  attachId: string = 'root',
) {
  return {
    id,
    attachTo: { id: attachId, input: 'default' },
    disabled: status === 'disabled',
  } as Extension<unknown>;
}

describe('mergeExtensionParameters', () => {
  it('should filter out disabled extension instances', () => {
    expect(
      mergeExtensionParameters({
        features: [],
        builtinExtensions: [makeExt('a', 'disabled')],
        parameters: [],
      }),
    ).toEqual([]);
  });

  it('should pass through extension instances', () => {
    const a = makeExt('a');
    const b = makeExt('b');
    expect(
      mergeExtensionParameters({
        features: [],
        builtinExtensions: [a, b],
        parameters: [],
      }),
    ).toEqual([
      { extension: a, attachTo: { id: 'root', input: 'default' } },
      { extension: b, attachTo: { id: 'root', input: 'default' } },
    ]);
  });

  it('should override attachment points', () => {
    const a = makeExt('a');
    const b = makeExt('b');
    const pluginA = createPlugin({ id: 'test', extensions: [a] });
    expect(
      mergeExtensionParameters({
        features: [pluginA],
        builtinExtensions: [b],
        parameters: [
          {
            id: 'b',
            attachTo: { id: 'derp', input: 'default' },
          },
        ],
      }),
    ).toEqual([
      {
        extension: a,
        attachTo: { id: 'root', input: 'default' },
        source: pluginA,
      },
      { extension: b, attachTo: { id: 'derp', input: 'default' } },
    ]);
  });

  it('should fully override configuration and duplicate', () => {
    const a = makeExt('a');
    const b = makeExt('b');
    const plugin = createPlugin({ id: 'test', extensions: [a, b] });
    expect(
      mergeExtensionParameters({
        features: [plugin],
        builtinExtensions: [],
        parameters: [
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
      }),
    ).toEqual([
      {
        extension: a,
        attachTo: { id: 'root', input: 'default' },
        source: plugin,
        config: { foo: { bar: 1 } },
      },
      {
        extension: b,
        attachTo: { id: 'root', input: 'default' },
        source: plugin,
        config: { foo: { qux: 3 } },
      },
    ]);
  });

  it('should place enabled instances in the order that they were enabled', () => {
    const a = makeExt('a', 'disabled');
    const b = makeExt('b', 'disabled');
    expect(
      mergeExtensionParameters({
        features: [createPlugin({ id: 'empty', extensions: [] })],
        builtinExtensions: [a, b],
        parameters: [
          {
            id: 'b',
            disabled: false,
          },
          {
            id: 'a',
            disabled: false,
          },
        ],
      }),
    ).toEqual([
      { extension: b, attachTo: { id: 'root', input: 'default' } },
      { extension: a, attachTo: { id: 'root', input: 'default' } },
    ]);
  });

  it('should apply extension overrides', () => {
    const a = makeExt('a');
    const b = makeExt('b');
    const plugin = createPlugin({ id: 'test', extensions: [a, b] });
    const aOverride = makeExt('a', 'enabled', 'other');
    const bOverride = makeExt('b', 'disabled', 'other');
    const cOverride = makeExt('c');

    const result = mergeExtensionParameters({
      features: [
        plugin,
        createExtensionOverrides({
          extensions: [aOverride, bOverride, cOverride],
        }),
      ],
      builtinExtensions: [],
      parameters: [],
    });

    expect(result.length).toBe(2);
    expect(result[0].extension).toBe(aOverride);
    expect(result[0].attachTo).toEqual({ id: 'other', input: 'default' });
    expect(result[0].config).toEqual(undefined);
    expect(result[0].source).toBe(plugin);

    expect(result[1]).toEqual({
      extension: cOverride,
      attachTo: { id: 'root', input: 'default' },
      config: undefined,
      source: undefined,
    });
  });

  it('should use order from configuration when rather than overrides', () => {
    const a = makeExt('a', 'disabled');
    const b = makeExt('b', 'disabled');
    const c = makeExt('c', 'disabled');
    const aOverride = makeExt('c', 'disabled');
    const bOverride = makeExt('b', 'disabled');
    const cOverride = makeExt('a', 'disabled');

    const result = mergeExtensionParameters({
      features: [
        createPlugin({ id: 'test', extensions: [a, b, c] }),
        createExtensionOverrides({
          extensions: [cOverride, bOverride, aOverride],
        }),
      ],
      builtinExtensions: [],
      parameters: ['b', 'c', 'a'].map(id => ({ id, disabled: false })),
    });

    expect(result.map(r => r.extension.id)).toEqual(['b', 'c', 'a']);
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
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[0], extension ID must not contain slashes; got 'core.router/routes', did you mean 'core.router'?"`,
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
    expect(run('core.router')).toEqual({
      id: 'core.router',
      disabled: false,
    });
    expect(() => run('')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], extension ID must not be empty or contain whitespace"`,
    );
    expect(() => run(' a')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], extension ID must not be empty or contain whitespace"`,
    );
    expect(() => run('core.router/routes')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], extension ID must not contain slashes; got 'core.router/routes', did you mean 'core.router'?"`,
    );
  });

  it('supports null value', () => {
    // this is the result of typing:
    // - core.router:
    // The missing value is interpreted as null by the yaml parser so we deal with that
    expect(run({ 'core.router': null })).toEqual({
      id: 'core.router',
      disabled: false,
    });
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
      `"Invalid extension configuration at app.extensions[1][core.router].id, unknown parameter; expected one of 'attachTo', 'disabled', 'config'"`,
    );
  });

  it('supports object attachTo', () => {
    expect(
      run({
        'core.router': { attachTo: { id: 'other.root', input: 'inputs' } },
      }),
    ).toEqual({
      id: 'core.router',
      attachTo: { id: 'other.root', input: 'inputs' },
    });
    expect(() =>
      run({
        'core.router': {
          id: 'other-id',
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][core.router].id, unknown parameter; expected one of 'attachTo', 'disabled', 'config'"`,
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
      `"Invalid extension configuration at app.extensions[1][core.router].foo, unknown parameter; expected one of 'attachTo', 'disabled', 'config'"`,
    );
  });
});
