/*
 * Copyright 2026 The Backstage Authors
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

import { z } from 'zod/v4';
import { createExtension } from './createExtension';
import { createExtensionDataRef } from './createExtensionDataRef';
import { MakeSortedExtensionsMap } from './MakeSortedExtensionsMap';

const nameExtensionDataRef = createExtensionDataRef<string>().with({
  id: 'name',
});

function createTestExtension<TName extends string>(name: TName) {
  return createExtension({
    name,
    attachTo: { id: 'test/output', input: 'names' },
    output: [nameExtensionDataRef],
    configSchema: {
      name: z.string().default(name),
    },
    factory({ config }) {
      return [nameExtensionDataRef(config.name)];
    },
  });
}

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;

type Tens = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// 80 extensions, which is more than any plugin in this repository has, and
// enough for the old types to fail with TypeScript 5.7
type TestExtensions =
  `extension-${Tens}${Digit}` extends infer IName extends string
    ? IName extends string
      ? ReturnType<typeof createTestExtension<IName>>
      : never
    : never;

describe('MakeSortedExtensionsMap', () => {
  it('should map a large number of extensions by ID', () => {
    type ExtensionMap = MakeSortedExtensionsMap<TestExtensions, 'test'>;

    const hasAllIds: Equal<
      keyof ExtensionMap,
      `test/extension-${Tens}${Digit}`
    > = true;
    const firstId: keyof ExtensionMap = 'test/extension-00';
    const lastId: keyof ExtensionMap = 'test/extension-79';
    // @ts-expect-error
    const missingId: keyof ExtensionMap = 'test/extension-80';

    const extension: ExtensionMap['test/extension-42'] =
      createTestExtension('extension-42');
    // @ts-expect-error
    const otherExtension: ExtensionMap['test/extension-42'] =
      createTestExtension('extension-43');

    expect(hasAllIds).toBe(true);
    expect([firstId, lastId, missingId]).toEqual([
      'test/extension-00',
      'test/extension-79',
      'test/extension-80',
    ]);
    expect(String(extension)).toContain('name=extension-42');
    expect(String(otherExtension)).toContain('name=extension-43');
  });

  it('should map extensions for a plugin ID that is not a literal', () => {
    type TwoExtensions =
      | ReturnType<typeof createTestExtension<'a'>>
      | ReturnType<typeof createTestExtension<'b'>>;

    type ExtensionMap = MakeSortedExtensionsMap<TwoExtensions, string>;
    const hasOneKeyPerExtension: Equal<
      keyof ExtensionMap,
      `${string}/a` | `${string}/b`
    > = true;

    expect(hasOneKeyPerExtension).toBe(true);
  });

  it('should map an extension with a union of names by all of its IDs without hiding other extensions', () => {
    type UnionNameExtension = ReturnType<typeof createTestExtension<'a' | 'b'>>;
    type SingleNameExtension = ReturnType<typeof createTestExtension<'a'>>;
    type ExtensionMap = MakeSortedExtensionsMap<
      UnionNameExtension | SingleNameExtension,
      'test'
    >;

    const hasAllIds: Equal<keyof ExtensionMap, 'test/a' | 'test/b'> = true;
    const hasBothExtensions: Equal<
      ExtensionMap['test/a'],
      UnionNameExtension & SingleNameExtension
    > = true;
    const hasOnlyUnionNameExtension: Equal<
      ExtensionMap['test/b'],
      UnionNameExtension
    > = true;

    expect([hasAllIds, hasBothExtensions, hasOnlyUnionNameExtension]).toEqual([
      true,
      true,
      true,
    ]);
  });
});
