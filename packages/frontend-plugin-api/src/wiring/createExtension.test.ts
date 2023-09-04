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

import { createExtension } from './createExtension';
import { createExtensionDataRef } from './createExtensionDataRef';

const stringData = createExtensionDataRef<string>('string');

describe('createExtension', () => {
  it('should create an extension with a simple output', () => {
    const extension = createExtension({
      id: 'test',
      at: 'root',
      output: {
        foo: coreExtensionData.title,
        foo2: stringData,
      },
      factory({ bind }) {
        // Make it work well with required and optional output
        // HOH - High Order Helper
        bind({
          foo: 'bar',
        });
        // @ts-expect-error
        bind.foo(3);
        // @ts-expect-error
        bind.foo();
        // @ts-expect-error
        bind.bar('bar');
      },
    });
    expect(extension.id).toBe('test');
  });
});
