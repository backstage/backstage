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

import { ExtensionDefinition } from './createExtension';
import {
  ResolveExtensionId,
  resolveExtensionDefinition,
} from './resolveExtensionDefinition';

describe('resolveExtensionDefinition', () => {
  const baseDef = {
    $$type: '@backstage/ExtensionDefinition',
    T: null as any,
    version: 'v2',
    attachTo: { id: '', input: '' },
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

describe('old resolveExtensionDefinition', () => {
  const baseDef = {
    $$type: '@backstage/ExtensionDefinition',
    T: null as any,
    version: 'v1',
    attachTo: { id: '', input: '' },
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
      TNamespace extends string | undefined,
      TName extends string | undefined,
    > = ExtensionDefinition<{
      kind: TKind;
      namespace: TNamespace;
      name: TName;
      output: any;
    }>;

    const id1: 'k:ns' = {} as ResolveExtensionId<
      NamedExtension<'k', 'ns', undefined>,
      undefined
    >;
    const id2: 'k:n' = {} as ResolveExtensionId<
      NamedExtension<'k', undefined, 'n'>,
      undefined
    >;
    const id3: 'ns/n' = {} as ResolveExtensionId<
      NamedExtension<undefined, 'ns', 'n'>,
      undefined
    >;
    const id4: never = {} as ResolveExtensionId<
      NamedExtension<'k', undefined, undefined>,
      undefined
    >;
    const id5: 'ns' = {} as ResolveExtensionId<
      NamedExtension<undefined, 'ns', undefined>,
      undefined
    >;
    const id6: 'n' = {} as ResolveExtensionId<
      NamedExtension<undefined, undefined, 'n'>,
      undefined
    >;
    const id7: 'k:ns/n' = {} as ResolveExtensionId<
      NamedExtension<'k', 'ns', 'n'>,
      undefined
    >;
    const id8: 'k:ns2' = {} as ResolveExtensionId<
      NamedExtension<'k', 'ns', undefined>,
      'ns2'
    >;
    const id9: 'k:ns2/n' = {} as ResolveExtensionId<
      NamedExtension<'k', undefined, 'n'>,
      'ns2'
    >;
    const ida: 'ns2/n' = {} as ResolveExtensionId<
      NamedExtension<undefined, 'ns', 'n'>,
      'ns2'
    >;
    const idb: 'k:ns2' = {} as ResolveExtensionId<
      NamedExtension<'k', undefined, undefined>,
      'ns2'
    >;
    const idc: 'ns2' = {} as ResolveExtensionId<
      NamedExtension<undefined, 'ns', undefined>,
      'ns2'
    >;
    const idd: 'ns2/n' = {} as ResolveExtensionId<
      NamedExtension<undefined, undefined, 'n'>,
      'ns2'
    >;
    const ide: 'k:ns2/n' = {} as ResolveExtensionId<
      NamedExtension<'k', 'ns', 'n'>,
      'ns2'
    >;

    const invalid1: never = {} as ResolveExtensionId<
      NamedExtension<string | undefined, 'ns', 'n'>,
      undefined
    >;
    const invalid2: never = {} as ResolveExtensionId<
      NamedExtension<'k', string | undefined, 'n'>,
      undefined
    >;
    const invalid3: never = {} as ResolveExtensionId<
      NamedExtension<'k', 'ns', string | undefined>,
      undefined
    >;

    expect([
      id1,
      id2,
      id3,
      id4,
      id5,
      id6,
      id7,
      id8,
      id9,
      ida,
      idb,
      idc,
      idd,
      ide,
      invalid1,
      invalid2,
      invalid3,
    ]).toBeDefined();
  });
});
