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
  ExtensionDataValue,
  createExtensionDataRef,
} from './createExtensionDataRef';

describe('createExtensionDataRef', () => {
  it('can be created and read', () => {
    const ref = createExtensionDataRef().with({ id: 'foo' });
    expect(ref.id).toBe('foo');
    expect(String(ref)).toBe('ExtensionDataRef{id=foo,optional=false}');
    const refOptional = ref.optional();
    expect(refOptional.id).toBe('foo');
    expect(String(refOptional)).toBe('ExtensionDataRef{id=foo,optional=true}');
  });

  it('can be used to encapsulate a value', () => {
    const ref = createExtensionDataRef<string>().with({ id: 'foo' });
    const val: ExtensionDataValue<string, 'foo'> = ref('hello');
    expect(val).toEqual({
      $$type: '@backstage/ExtensionDataValue',
      id: 'foo',
      value: 'hello',
    });
    // @ts-expect-error
    ref(3);
    // @ts-expect-error
    ref();
  });
});
