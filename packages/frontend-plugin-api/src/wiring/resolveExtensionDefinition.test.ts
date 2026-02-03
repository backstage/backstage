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
  createExtensionDataRef,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import { ExtensionDefinition } from './createExtension';
import {
  ResolveExtensionId,
  resolveExtensionDefinition,
} from './resolveExtensionDefinition';
import {
  OpaqueExtensionDefinition,
  OpaqueExtensionInput,
} from '@internal/frontend';

const testDataRef = createExtensionDataRef<string>().with({ id: 'test' });

describe('resolveExtensionDefinition', () => {
  const baseDef = {
    $$type: '@backstage/ExtensionDefinition',
    T: undefined as any,
    version: 'v2',
    attachTo: { id: '', input: '' },
    inputs: {},
    disabled: false,
    override: () => ({} as ExtensionDefinition),
  };

  it.each([
    [{ namespace: 'ns' }, 'ns'],
    [{ namespace: 'n' }, 'n'],
    [{ namespace: 'ns', name: 'n' }, 'ns/n'],
    [{ kind: 'k', namespace: 'ns' }, 'k:ns'],
    [{ kind: 'k', namespace: 'ns', name: 'n' }, 'k:ns/n'],
  ])(`should resolve extension IDs %s`, (definition, expected) => {
    const resolved = resolveExtensionDefinition({
      ...baseDef,
      ...definition,
    } as ExtensionDefinition);
    expect(resolved.id).toBe(expected);
    expect(String(resolved)).toBe(`Extension{id=${expected}}`);
  });

  it('should fail to resolve extension ID without namespace', () => {
    expect(() =>
      resolveExtensionDefinition({
        ...baseDef,
        kind: 'k',
      } as ExtensionDefinition),
    ).toThrow(
      'Extension must declare an explicit namespace or name as it could not be resolved from context, kind=k namespace=undefined name=undefined',
    );
    expect(() =>
      resolveExtensionDefinition(baseDef as ExtensionDefinition),
    ).toThrow(
      'Extension must declare an explicit namespace or name as it could not be resolved from context, kind=undefined namespace=undefined name=undefined',
    );
  });

  it('should resolve extension input references', () => {
    const baseInpuf = OpaqueExtensionInput.toInternal(
      createExtensionInput([testDataRef]),
    );
    expect(
      resolveExtensionDefinition(
        OpaqueExtensionDefinition.toInternal({
          ...baseDef,
          attachTo: baseInpuf.withContext?.({
            kind: 'parent',
            name: 'example',
            input: 'children',
          }),
        }),
        { namespace: 'test' },
      ).attachTo,
    ).toEqual({
      id: 'parent:test/example',
      input: 'children',
    });

    expect(
      resolveExtensionDefinition(
        OpaqueExtensionDefinition.toInternal({
          ...baseDef,
          attachTo: baseInpuf.withContext?.({
            name: 'example',
            input: 'children',
          }),
        }),
        { namespace: 'test' },
      ).attachTo,
    ).toEqual({
      id: 'test/example',
      input: 'children',
    });

    expect(
      resolveExtensionDefinition(
        OpaqueExtensionDefinition.toInternal({
          ...baseDef,
          attachTo: baseInpuf.withContext?.({
            kind: 'parent',
            input: 'children',
          }),
        }),
        { namespace: 'test' },
      ).attachTo,
    ).toEqual({
      id: 'parent:test',
      input: 'children',
    });

    expect(
      resolveExtensionDefinition(
        OpaqueExtensionDefinition.toInternal({
          ...baseDef,
          attachTo: baseInpuf.withContext?.({
            input: 'children',
          }),
        }),
        { namespace: 'test' },
      ).attachTo,
    ).toEqual({
      id: 'test',
      input: 'children',
    });

    // Test for backward compatibility - runtime still supports multiple attachment points
    expect(
      resolveExtensionDefinition(
        OpaqueExtensionDefinition.toInternal({
          ...baseDef,
          attachTo: [
            baseInpuf.withContext?.({
              kind: 'k1',
              input: 'children',
            }),
            baseInpuf.withContext?.({
              kind: 'k2',
              input: 'children',
            }),
            baseInpuf.withContext?.({
              kind: 'k3',
              input: 'children',
            }),
          ] as any,
        }),
        { namespace: 'test' },
      ).attachTo,
    ).toEqual([
      {
        id: 'k1:test',
        input: 'children',
      },
      {
        id: 'k2:test',
        input: 'children',
      },
      {
        id: 'k3:test',
        input: 'children',
      },
    ]);
  });
});

describe('old resolveExtensionDefinition', () => {
  const baseDef = {
    $$type: '@backstage/ExtensionDefinition',
    T: undefined as any,
    version: 'v1',
    attachTo: { id: '', input: '' },
    inputs: {},
    disabled: false,
    override: () => ({} as ExtensionDefinition),
  };

  it.each([
    [{ namespace: 'ns' }, 'ns'],
    [{ namespace: 'n' }, 'n'],
    [{ namespace: 'ns', name: 'n' }, 'ns/n'],
    [{ kind: 'k', namespace: 'ns' }, 'k:ns'],
    [{ kind: 'k', namespace: 'ns', name: 'n' }, 'k:ns/n'],
  ])(`should resolve extension IDs %s`, (definition, expected) => {
    const resolved = resolveExtensionDefinition({
      ...baseDef,
      ...definition,
    } as ExtensionDefinition);
    expect(resolved.id).toBe(expected);
    expect(String(resolved)).toBe(`Extension{id=${expected}}`);
  });

  it('should fail to resolve extension ID without namespace', () => {
    expect(() =>
      resolveExtensionDefinition({
        ...baseDef,
        kind: 'k',
      } as ExtensionDefinition),
    ).toThrow(
      'Extension must declare an explicit namespace or name as it could not be resolved from context, kind=k namespace=undefined name=undefined',
    );
    expect(() =>
      resolveExtensionDefinition(baseDef as ExtensionDefinition),
    ).toThrow(
      'Extension must declare an explicit namespace or name as it could not be resolved from context, kind=undefined namespace=undefined name=undefined',
    );
  });
});

describe('ResolveExtensionId', () => {
  it('should resolve extension IDs correctly', () => {
    type NamedExtension<
      TKind extends string | undefined,
      TName extends string | undefined,
    > = ExtensionDefinition<{
      kind: TKind;
      name: TName;
      output: any;
      params: never;
    }>;
    const id1: 'k:ns' = {} as ResolveExtensionId<
      NamedExtension<'k', undefined>,
      'ns'
    >;

    const id2: 'ns/n' = {} as ResolveExtensionId<
      NamedExtension<undefined, 'n'>,
      'ns'
    >;

    const id3: 'ns' = {} as ResolveExtensionId<
      NamedExtension<undefined, undefined>,
      'ns'
    >;

    const id4: 'k:ns/n' = {} as ResolveExtensionId<
      NamedExtension<'k', 'n'>,
      'ns'
    >;

    const invalid1: never = {} as ResolveExtensionId<
      NamedExtension<'k', string | undefined>,
      'ns'
    >;

    const invalid2: never = {} as ResolveExtensionId<
      NamedExtension<'k', string>,
      'ns'
    >;

    expect([id1, id2, id3, id4, invalid1, invalid2]).toBeDefined();
  });
});
