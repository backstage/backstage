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

import {
  createExtensionOverrides,
  createPlugin,
  Extension,
} from '@backstage/frontend-plugin-api';
import { resolveAppNodeSpecs } from './resolveAppNodeSpecs';

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

describe('resolveAppNodeSpecs', () => {
  it('should filter out disabled extension instances', () => {
    expect(
      resolveAppNodeSpecs({
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
      resolveAppNodeSpecs({
        features: [],
        builtinExtensions: [a, b],
        parameters: [],
      }),
    ).toEqual([
      {
        id: 'a',
        extension: a,
        attachTo: { id: 'root', input: 'default' },
        disabled: false,
      },
      {
        id: 'b',
        extension: b,
        attachTo: { id: 'root', input: 'default' },
        disabled: false,
      },
    ]);
  });

  it('should override attachment points', () => {
    const a = makeExt('a');
    const b = makeExt('b');
    const pluginA = createPlugin({ id: 'test', extensions: [a] });
    expect(
      resolveAppNodeSpecs({
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
        id: 'a',
        extension: a,
        attachTo: { id: 'root', input: 'default' },
        source: pluginA,
        disabled: false,
      },
      {
        id: 'b',
        extension: b,
        attachTo: { id: 'derp', input: 'default' },
        disabled: false,
      },
    ]);
  });

  it('should fully override configuration and duplicate', () => {
    const a = makeExt('a');
    const b = makeExt('b');
    const plugin = createPlugin({ id: 'test', extensions: [a, b] });
    expect(
      resolveAppNodeSpecs({
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
        id: 'a',
        extension: a,
        attachTo: { id: 'root', input: 'default' },
        source: plugin,
        config: { foo: { bar: 1 } },
        disabled: false,
      },
      {
        id: 'b',
        extension: b,
        attachTo: { id: 'root', input: 'default' },
        source: plugin,
        config: { foo: { qux: 3 } },
        disabled: false,
      },
    ]);
  });

  it('should place enabled instances in the order that they were enabled', () => {
    const a = makeExt('a', 'disabled');
    const b = makeExt('b', 'disabled');
    expect(
      resolveAppNodeSpecs({
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
      {
        id: 'b',
        extension: b,
        attachTo: { id: 'root', input: 'default' },
        disabled: false,
      },
      {
        id: 'a',
        extension: a,
        attachTo: { id: 'root', input: 'default' },
        disabled: false,
      },
    ]);
  });

  it('should apply extension overrides', () => {
    const a = makeExt('a');
    const b = makeExt('b');
    const plugin = createPlugin({ id: 'test', extensions: [a, b] });
    const aOverride = makeExt('a', 'enabled', 'other');
    const bOverride = makeExt('b', 'disabled', 'other');
    const cOverride = makeExt('c');

    const result = resolveAppNodeSpecs({
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
      id: 'c',
      extension: cOverride,
      attachTo: { id: 'root', input: 'default' },
      config: undefined,
      source: undefined,
      disabled: false,
    });
  });

  it('should use order from configuration when rather than overrides', () => {
    const a = makeExt('a', 'disabled');
    const b = makeExt('b', 'disabled');
    const c = makeExt('c', 'disabled');
    const aOverride = makeExt('c', 'disabled');
    const bOverride = makeExt('b', 'disabled');
    const cOverride = makeExt('a', 'disabled');

    const result = resolveAppNodeSpecs({
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

  it('throws an error when a forbidden extension is overridden by a plugin', () => {
    expect(() =>
      resolveAppNodeSpecs({
        features: [
          createPlugin({ id: 'test', extensions: [makeExt('forbidden')] }),
        ],
        builtinExtensions: [],
        parameters: [],
        forbidden: new Set(['forbidden']),
      }),
    ).toThrow(
      "It is forbidden to override the following extension(s): 'forbidden', which is done by the following plugin(s): 'test'",
    );
  });

  it('throws an error when a forbidden extension is overridden by overrides', () => {
    expect(() =>
      resolveAppNodeSpecs({
        features: [
          createExtensionOverrides({ extensions: [makeExt('forbidden')] }),
        ],
        builtinExtensions: [],
        parameters: [],
        forbidden: new Set(['forbidden']),
      }),
    ).toThrow(
      "It is forbidden to override the following extension(s): 'forbidden', which is done by one or more extension overrides",
    );
  });

  it('throws an error when a forbidden extension is parametrized', () => {
    expect(() =>
      resolveAppNodeSpecs({
        features: [],
        builtinExtensions: [],
        parameters: [{ id: 'forbidden', disabled: false }],
        forbidden: new Set(['forbidden']),
      }),
    ).toThrow("Configuration of the 'forbidden' extension is forbidden");
  });
});
