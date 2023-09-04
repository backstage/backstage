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
        foo: stringData,
      },
      factory({ bind }) {
        bind({
          foo: 'bar',
        });
        bind({
          // @ts-expect-error
          foo: 3,
        });
        bind({
          // @ts-expect-error
          bar: 'bar',
        });
        // @ts-expect-error
        bind({});
        // @ts-expect-error
        bind();
        // @ts-expect-error
        bind('bar');
      },
    });
    expect(extension.id).toBe('test');
  });

  it('should create an extension with a some optional output', () => {
    const extension = createExtension({
      id: 'test',
      at: 'root',
      output: {
        foo: stringData,
        bar: stringData.optional(),
      },
      factory({ bind }) {
        bind({
          foo: 'bar',
        });
        bind({
          foo: 'bar',
          bar: 'baz',
        });
        bind({
          // @ts-expect-error
          foo: 3,
        });
        bind({
          foo: 'bar',
          // @ts-expect-error
          bar: 3,
        });
        // @ts-expect-error
        bind({ bar: 'bar' });
        // @ts-expect-error
        bind({});
        // @ts-expect-error
        bind();
        // @ts-expect-error
        bind('bar');
      },
    });
    expect(extension.id).toBe('test');
  });
});
