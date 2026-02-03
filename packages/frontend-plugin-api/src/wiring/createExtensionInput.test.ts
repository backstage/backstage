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

import { OpaqueExtensionInput } from '@internal/frontend';
import { createExtensionDataRef } from './createExtensionDataRef';
import { ExtensionInput, createExtensionInput } from './createExtensionInput';

const stringDataRef = createExtensionDataRef<string>().with({ id: 'str' });
const numberDataRef = createExtensionDataRef<number>().with({ id: 'num' });

function unused(..._any: any[]) {}

describe('createExtensionInput', () => {
  it('should create a regular input', () => {
    const input = createExtensionInput([stringDataRef, numberDataRef]);
    expect(input).toEqual({
      $$type: '@backstage/ExtensionInput',
      extensionData: [stringDataRef, numberDataRef],
      config: { singleton: false, optional: false, internal: false },
      withContext: expect.any(Function),
    });

    const x1: ExtensionInput<
      typeof stringDataRef | typeof numberDataRef,
      { singleton: false; optional: false; internal: false }
    > = input;
    // @ts-expect-error
    const x2: ExtensionInput<
      typeof stringDataRef,
      { singleton: false; optional: false; internal: false }
    > = input;
    // @ts-expect-error
    const x3: ExtensionInput<
      typeof stringDataRef | typeof numberDataRef,
      { singleton: true; optional: false; internal: false }
    > = input;
    // @ts-expect-error
    const x4: ExtensionInput<
      typeof stringDataRef | typeof numberDataRef,
      { singleton: false; optional: true; internal: false }
    > = input;

    unused(x1, x2, x3, x4);
  });

  it('should attach a context to the input', () => {
    const input = createExtensionInput([stringDataRef, numberDataRef]);
    const context = { input: 'test1', kind: 'test2', name: 'test3' };
    const inputWithContext =
      OpaqueExtensionInput.toInternal(input).withContext?.(context);
    expect(inputWithContext).toEqual({
      $$type: '@backstage/ExtensionInput',
      extensionData: [stringDataRef, numberDataRef],
      config: { singleton: false, optional: false, internal: false },
      withContext: expect.any(Function),
      context,
    });
  });

  it('should create a singleton input', () => {
    const input = createExtensionInput([stringDataRef, numberDataRef], {
      singleton: true,
    });
    expect(input).toEqual({
      $$type: '@backstage/ExtensionInput',
      extensionData: [stringDataRef, numberDataRef],
      config: { singleton: true, optional: false, internal: false },
      withContext: expect.any(Function),
    });

    const x1: ExtensionInput<
      typeof stringDataRef | typeof numberDataRef,
      { singleton: true; optional: false; internal: false }
    > = input;
    // @ts-expect-error
    const x2: ExtensionInput<
      typeof stringDataRef,
      { singleton: true; optional: false; internal: false }
    > = input;
    // @ts-expect-error
    const x3: ExtensionInput<
      typeof stringDataRef | typeof numberDataRef,
      { singleton: false; optional: false; internal: false }
    > = input;
    // @ts-expect-error
    const x4: ExtensionInput<
      typeof stringDataRef | typeof numberDataRef,
      { singleton: false; optional: true; internal: false }
    > = input;

    unused(x1, x2, x3, x4);
  });

  it('should create an optional singleton input', () => {
    const input = createExtensionInput([stringDataRef, numberDataRef], {
      singleton: true,
      optional: true,
    });
    expect(input).toEqual({
      $$type: '@backstage/ExtensionInput',
      extensionData: [stringDataRef, numberDataRef],
      config: { singleton: true, optional: true, internal: false },
      withContext: expect.any(Function),
    });

    const x1: ExtensionInput<
      typeof stringDataRef | typeof numberDataRef,
      { singleton: true; optional: true; internal: false }
    > = input;
    // @ts-expect-error
    const x2: ExtensionInput<
      typeof stringDataRef,
      { singleton: true; optional: true; internal: false }
    > = input;
    // @ts-expect-error
    const x3: ExtensionInput<
      typeof stringDataRef | typeof numberDataRef,
      { singleton: false; optional: false; internal: false }
    > = input;
    // @ts-expect-error
    const x4: ExtensionInput<
      typeof stringDataRef | typeof numberDataRef,
      { singleton: false; optional: true; internal: false }
    > = input;

    unused(x1, x2, x3, x4);
  });

  it('should not allow duplicate data refs', () => {
    expect(() =>
      createExtensionInput([stringDataRef, stringDataRef], { singleton: true }),
    ).toThrow("ExtensionInput may not have duplicate data refs: 'str'");
  });

  it('should create an internal input', () => {
    const input = createExtensionInput([stringDataRef], { internal: true });
    expect(input).toEqual({
      $$type: '@backstage/ExtensionInput',
      extensionData: [stringDataRef],
      config: { singleton: false, optional: false, internal: true },
      withContext: expect.any(Function),
    });
  });
});
