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
import { createExtensionInput } from './createExtensionInput';

const stringData = createExtensionDataRef<string>('string');

function unused(..._any: any[]) {}

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

  it('should create an extension with input', () => {
    const extension = createExtension({
      id: 'test',
      at: 'root',
      inputs: {
        mixed: createExtensionInput({
          required: stringData,
          optional: stringData.optional(),
        }),
        onlyRequired: createExtensionInput({
          required: stringData,
        }),
        onlyOptional: createExtensionInput({
          optional: stringData.optional(),
        }),
      },
      output: {
        foo: stringData,
      },
      factory({ bind, inputs }) {
        const a1: string = inputs.mixed?.[0].required;
        // @ts-expect-error
        const a2: number = inputs.mixed?.[0].required;
        // @ts-expect-error
        const a3: any = inputs.mixed?.[0].nonExistent;
        unused(a1, a2, a3);

        const b1: string | undefined = inputs.mixed?.[0].optional;
        // @ts-expect-error
        const b2: string = inputs.mixed?.[0].optional;
        // @ts-expect-error
        const b3: number = inputs.mixed?.[0].optional;
        // @ts-expect-error
        const b4: number | undefined = inputs.mixed?.[0].optional;
        unused(b1, b2, b3, b4);

        const c1: string = inputs.onlyRequired?.[0].required;
        // @ts-expect-error
        const c2: number = inputs.onlyRequired?.[0].required;
        unused(c1, c2);

        const d1: string | undefined = inputs.onlyOptional?.[0].optional;
        // @ts-expect-error
        const d2: string = inputs.onlyOptional?.[0].optional;
        // @ts-expect-error
        const d3: number = inputs.onlyOptional?.[0].optional;
        // @ts-expect-error
        const d4: number | undefined = inputs.onlyOptional?.[0].optional;
        unused(d1, d2, d3, d4);

        bind({
          foo: 'bar',
        });
      },
    });
    expect(extension.id).toBe('test');
  });
});
