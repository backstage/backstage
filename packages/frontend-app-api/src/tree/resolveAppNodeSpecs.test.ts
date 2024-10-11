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
  createFrontendModule,
  createFrontendPlugin,
  Extension,
  ExtensionDefinition,
} from '@backstage/frontend-plugin-api';
import { resolveAppNodeSpecs } from './resolveAppNodeSpecs';

function makeExt(
  id: string,
  status: 'disabled' | 'enabled' = 'enabled',
  attachId: string = 'root',
) {
  return {
    $$type: '@backstage/Extension',
    version: 'v1',
    id,
    attachTo: { id: attachId, input: 'default' },
    disabled: status === 'disabled',
    toString: expect.any(Function),
  } as Extension<unknown>;
}

function makeExtDef(
  name: string | undefined = undefined,
  status: 'disabled' | 'enabled' = 'enabled',
  attachId: string = 'root',
) {
  return {
    $$type: '@backstage/ExtensionDefinition',
    T: undefined as any,
    version: 'v1',
    name,
    attachTo: { id: attachId, input: 'default' },
    disabled: status === 'disabled',
    override: () => ({} as ExtensionDefinition),
  } as ExtensionDefinition;
}

describe('resolveAppNodeSpecs', () => {
  it('should not filter out disabled extension instances', () => {
    const a = makeExt('a', 'disabled');
    expect(
      resolveAppNodeSpecs({
        features: [],
        builtinExtensions: [a],
        parameters: [],
      }),
    ).toEqual([
      {
        id: 'a',
        extension: a,
        attachTo: { id: 'root', input: 'default' },
        disabled: true,
      },
    ]);
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
    const b = makeExt('b');
    const pluginA = createFrontendPlugin({
      id: 'test',
      extensions: [makeExtDef('a')],
    });
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
        id: 'b',
        extension: b,
        attachTo: { id: 'derp', input: 'default' },
        disabled: false,
      },
      {
        id: 'test/a',
        extension: makeExt('test/a'),
        attachTo: { id: 'root', input: 'default' },
        source: pluginA,
        disabled: false,
      },
    ]);
  });

  it('should fully override configuration and duplicate', () => {
    const a = makeExt('test/a');
    const b = makeExt('test/b');
    const plugin = createFrontendPlugin({
      id: 'test',
      extensions: [makeExtDef('a'), makeExtDef('b')],
    });
    expect(
      resolveAppNodeSpecs({
        features: [plugin],
        builtinExtensions: [],
        parameters: [
          {
            id: 'test/a',
            config: { foo: { bar: 1 } },
          },
          {
            id: 'test/b',
            config: { foo: { bar: 2 } },
          },
          {
            id: 'test/b',
            config: { foo: { qux: 3 } },
          },
        ],
      }),
    ).toEqual([
      {
        id: 'test/a',
        extension: a,
        attachTo: { id: 'root', input: 'default' },
        source: plugin,
        config: { foo: { bar: 1 } },
        disabled: false,
      },
      {
        id: 'test/b',
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
        features: [createFrontendPlugin({ id: 'empty', extensions: [] })],
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

  it('should place config-mentioned instances in the order that they were listed, irrespective of if the extension was enabled or not originally', () => {
    const a = makeExt('a', 'disabled');
    const b = makeExt('b', 'enabled');
    const c = makeExt('c', 'disabled');
    const d = makeExt('d', 'enabled');
    const e = makeExt('e', 'disabled');
    const f = makeExt('f', 'enabled');
    const g = makeExt('g', 'disabled');
    expect(
      resolveAppNodeSpecs({
        features: [createFrontendPlugin({ id: 'empty', extensions: [] })],
        builtinExtensions: [a, b, c, d, e, f, g],
        parameters: [
          { id: 'e', disabled: false },
          { id: 'd', disabled: false },
          { id: 'c', disabled: false },
        ],
      }),
    ).toEqual([
      {
        id: 'e',
        extension: e,
        attachTo: { id: 'root', input: 'default' },
        disabled: false,
      },
      {
        id: 'd',
        extension: d,
        attachTo: { id: 'root', input: 'default' },
        disabled: false,
      },
      {
        id: 'c',
        extension: c,
        attachTo: { id: 'root', input: 'default' },
        disabled: false,
      },
      {
        id: 'a',
        extension: a,
        attachTo: { id: 'root', input: 'default' },
        disabled: true,
      },
      {
        id: 'b',
        extension: b,
        attachTo: { id: 'root', input: 'default' },
        disabled: false,
      },
      {
        id: 'f',
        extension: f,
        attachTo: { id: 'root', input: 'default' },
        disabled: false,
      },
      {
        id: 'g',
        extension: g,
        attachTo: { id: 'root', input: 'default' },
        disabled: true,
      },
    ]);
  });

  it('should apply module overrides', () => {
    const plugin = createFrontendPlugin({
      id: 'test',
      extensions: [makeExtDef('a'), makeExtDef('b')],
    });
    const aOverride = makeExt('test/a', 'enabled', 'other');
    const bOverride = makeExt('test/b', 'disabled', 'other');
    const cOverride = makeExt('test/c');

    expect(
      resolveAppNodeSpecs({
        features: [
          plugin,
          createFrontendModule({
            pluginId: 'test',
            extensions: [
              makeExtDef('a', 'enabled', 'other'),
              makeExtDef('b', 'disabled', 'other'),
              makeExtDef('c'),
            ],
          }),
        ],
        builtinExtensions: [],
        parameters: [],
      }),
    ).toEqual([
      {
        id: 'test/a',
        extension: expect.objectContaining(aOverride),
        attachTo: { id: 'other', input: 'default' },
        source: plugin,
        disabled: false,
      },
      {
        id: 'test/b',
        extension: expect.objectContaining(bOverride),
        attachTo: { id: 'other', input: 'default' },
        source: plugin,
        disabled: true,
      },
      {
        id: 'test/c',
        extension: expect.objectContaining(cOverride),
        attachTo: { id: 'root', input: 'default' },
        source: plugin,
        disabled: false,
      },
    ]);
  });

  it('should use order from configuration when rather than modules', () => {
    const result = resolveAppNodeSpecs({
      features: [
        createFrontendPlugin({
          id: 'test',
          extensions: [
            makeExtDef('a', 'disabled'),
            makeExtDef('b', 'disabled'),
            makeExtDef('c', 'disabled'),
          ],
        }),
        createFrontendModule({
          pluginId: 'test',
          extensions: [
            makeExtDef('c', 'disabled'),
            makeExtDef('b', 'disabled'),
            makeExtDef('a', 'disabled'),
          ],
        }),
      ],
      builtinExtensions: [],
      parameters: ['test/b', 'test/c', 'test/a'].map(id => ({
        id,
        disabled: false,
      })),
    });

    expect(result.map(r => r.extension.id)).toEqual([
      'test/b',
      'test/c',
      'test/a',
    ]);
  });

  it('throws an error when a forbidden extension is overridden by a plugin', () => {
    expect(() =>
      resolveAppNodeSpecs({
        features: [
          createFrontendPlugin({
            id: 'test',
            extensions: [makeExtDef('forbidden')],
          }),
        ],
        builtinExtensions: [],
        parameters: [],
        forbidden: new Set(['test/forbidden']),
      }),
    ).toThrow(
      "It is forbidden to override the following extension(s): 'test/forbidden', which is done by the following plugin(s): 'test'",
    );
  });

  it('throws an error when a forbidden extension is overridden by module', () => {
    expect(() =>
      resolveAppNodeSpecs({
        features: [
          createFrontendPlugin({
            id: 'forbidden',
            extensions: [],
          }),
          createFrontendModule({
            pluginId: 'forbidden',
            extensions: [makeExtDef()],
          }),
        ],
        builtinExtensions: [],
        parameters: [],
        forbidden: new Set(['forbidden']),
      }),
    ).toThrow(
      "It is forbidden to override the following extension(s): 'forbidden', which is done by a module for the following plugin(s): 'forbidden'",
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
