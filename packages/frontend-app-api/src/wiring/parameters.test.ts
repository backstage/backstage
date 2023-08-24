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
import {
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
      `Invalid extension configuration at app.extensions[0][core.router/routes], must not specify 'at' when using attachment shorthand form`,
    );
  });
});
