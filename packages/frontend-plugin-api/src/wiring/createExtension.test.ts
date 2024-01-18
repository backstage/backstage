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
    const baseConfig = {
      namespace: 'test',
      attachTo: { id: 'root', input: 'default' },
      output: {
        foo: stringData,
      },
    };
    const extension = createExtension({
      ...baseConfig,
      factory() {
        return {
          foo: 'bar',
        };
      },
    });
    expect(extension.namespace).toBe('test');

    // When declared as an error function without a block the TypeScript errors
    // are a more specific and will point at the property that is problematic.
    createExtension({
      ...baseConfig,
      factory: () => ({
        // @ts-expect-error
        foo: 3,
      }),
    });
    createExtension({
      ...baseConfig,
      factory: () =>
        // @ts-expect-error
        ({
          bar: 'bar',
        }),
    });
    createExtension({
      ...baseConfig,
      factory: () =>
        // @ts-expect-error
        ({}),
    });
    createExtension({
      ...baseConfig,
      factory: () =>
        // @ts-expect-error
        undefined,
    });
    createExtension({
      ...baseConfig,
      factory: () =>
        // @ts-expect-error
        'bar',
    });

    // When declared as a function with a block the TypeScript error will instead
    // be tied to the factory function declaration itself, but the error messages
    // is still helpful and points to part of the return type that is problematic.
    createExtension({
      ...baseConfig,
      // @ts-expect-error
      factory() {
        return {
          foo: 3,
        };
      },
    });
    createExtension({
      ...baseConfig,
      // @ts-expect-error
      factory() {
        return {
          bar: 'bar',
        };
      },
    });
    createExtension({
      ...baseConfig,
      // @ts-expect-error
      factory() {
        return {};
      },
    });
    createExtension({
      ...baseConfig,
      // @ts-expect-error
      factory() {
        return {};
      },
    });
    createExtension({
      ...baseConfig,
      // @ts-expect-error
      factory() {
        return 'bar';
      },
    });

    createExtension({
      ...baseConfig,
      // @ts-expect-error
      factory: () => {
        return {
          foo: 3,
        };
      },
    });
    createExtension({
      ...baseConfig,
      // @ts-expect-error
      factory: () => {
        return {
          bar: 'bar',
        };
      },
    });
    createExtension({
      ...baseConfig,
      // @ts-expect-error
      factory: () => {
        return {};
      },
    });
    createExtension({
      ...baseConfig,
      // @ts-expect-error
      factory: () => {
        return {};
      },
    });
    createExtension({
      ...baseConfig,
      // @ts-expect-error
      factory: () => {
        return 'bar';
      },
    });
  });

  it('should create an extension with a some optional output', () => {
    const baseConfig = {
      namespace: 'test',
      attachTo: { id: 'root', input: 'default' },
      output: {
        foo: stringData,
        bar: stringData.optional(),
      },
    };
    const extension = createExtension({
      ...baseConfig,
      factory: () => ({
        foo: 'bar',
      }),
    });
    expect(extension.namespace).toBe('test');

    createExtension({
      ...baseConfig,
      factory: () => ({
        foo: 'bar',
        bar: 'baz',
      }),
    });
    createExtension({
      ...baseConfig,
      factory: () => ({
        // @ts-expect-error
        foo: 3,
      }),
    });
    createExtension({
      ...baseConfig,
      factory: () => ({
        foo: 'bar',
        // @ts-expect-error
        bar: 3,
      }),
    });
    createExtension({
      ...baseConfig,
      factory: () =>
        // @ts-expect-error
        ({ bar: 'bar' }),
    });
    createExtension({
      ...baseConfig,
      factory: () =>
        // @ts-expect-error
        ({}),
    });
    createExtension({
      ...baseConfig,
      factory: () =>
        // @ts-expect-error
        undefined,
    });
    createExtension({
      ...baseConfig,
      // @ts-expect-error
      factory: () => {},
    });
    createExtension({
      ...baseConfig,
      factory: () =>
        // @ts-expect-error
        'bar',
    });
  });

  it('should create an extension with input', () => {
    const extension = createExtension({
      namespace: 'test',
      attachTo: { id: 'root', input: 'default' },
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
      factory({ inputs }) {
        const a1: string = inputs.mixed?.[0].output.required;
        // @ts-expect-error
        const a2: number = inputs.mixed?.[0].output.required;
        // @ts-expect-error
        const a3: any = inputs.mixed?.[0].output.nonExistent;
        unused(a1, a2, a3);

        const b1: string | undefined = inputs.mixed?.[0].output.optional;
        // @ts-expect-error
        const b2: string = inputs.mixed?.[0].output.optional;
        // @ts-expect-error
        const b3: number = inputs.mixed?.[0].output.optional;
        // @ts-expect-error
        const b4: number | undefined = inputs.mixed?.[0].output.optional;
        unused(b1, b2, b3, b4);

        const c1: string = inputs.onlyRequired?.[0].output.required;
        // @ts-expect-error
        const c2: number = inputs.onlyRequired?.[0].output.required;
        unused(c1, c2);

        const d1: string | undefined = inputs.onlyOptional?.[0].output.optional;
        // @ts-expect-error
        const d2: string = inputs.onlyOptional?.[0].output.optional;
        // @ts-expect-error
        const d3: number = inputs.onlyOptional?.[0].output.optional;
        // @ts-expect-error
        const d4: number | undefined = inputs.onlyOptional?.[0].output.optional;
        unused(d1, d2, d3, d4);

        return {
          foo: 'bar',
        };
      },
    });
    expect(extension.namespace).toBe('test');
    expect(String(extension)).toBe(
      'ExtensionDefinition{namespace=test,attachTo=root@default}',
    );
  });
});
