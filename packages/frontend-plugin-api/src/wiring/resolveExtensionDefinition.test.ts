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
import { resolveExtensionDefinition } from './resolveExtensionDefinition';

const baseDef = {
  $$type: '@backstage/ExtensionDefinition',
  version: 'v1',
  attachTo: { id: '', input: '' },
  disabled: false,
};

describe('resolveExtensionDefinition', () => {
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
    } as ExtensionDefinition<unknown>);
    expect(resolved.id).toBe(expected);
    expect(String(resolved)).toBe(`Extension{id=${expected}}`);
  });

  it('should fail to resolve extension ID without namespace', () => {
    expect(() =>
      resolveExtensionDefinition({
        ...baseDef,
        kind: 'k',
      } as ExtensionDefinition<unknown>),
    ).toThrow(
      'Extension must declare an explicit namespace or name as it could not be resolved from context, kind=k namespace=undefined name=undefined',
    );
    expect(() =>
      resolveExtensionDefinition(baseDef as ExtensionDefinition<unknown>),
    ).toThrow(
      'Extension must declare an explicit namespace or name as it could not be resolved from context, kind=undefined namespace=undefined name=undefined',
    );
  });
});
