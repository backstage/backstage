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

const stringDataRef = createExtensionDataRef<string>().with({ id: 'string' });
const numberDataRef = createExtensionDataRef<number>().with({ id: 'number' });

function unused(..._any: any[]) {}

describe('createExtension', () => {
  it('should create an extension with a simple output', () => {
    const baseConfig = {
      namespace: 'test',
      attachTo: { id: 'root', input: 'default' },
      output: {
        foo: stringDataRef,
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
    expect(extension).toMatchObject({ version: 'v1', namespace: 'test' });

    // When declared as an error function without a block the TypeScript errors
    // are a more specific and will often point at the property that is problematic.
    // @ts-expect-error
    createExtension({
      ...baseConfig,
      factory: () => ({
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
        foo: stringDataRef,
        bar: stringDataRef.optional(),
      },
    };
    const extension = createExtension({
      ...baseConfig,
      factory: () => ({
        foo: 'bar',
      }),
    });
    expect(extension).toMatchObject({ version: 'v1', namespace: 'test' });

    createExtension({
      ...baseConfig,
      factory: () => ({
        foo: 'bar',
        bar: 'baz',
      }),
    });
    // @ts-expect-error
    createExtension({
      ...baseConfig,
      factory: () => ({
        foo: 3,
      }),
    });
    // @ts-expect-error
    createExtension({
      ...baseConfig,
      factory: () => ({
        foo: 'bar',
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
          required: stringDataRef,
          optional: stringDataRef.optional(),
        }),
        onlyRequired: createExtensionInput({
          required: stringDataRef,
        }),
        onlyOptional: createExtensionInput({
          optional: stringDataRef.optional(),
        }),
      },
      output: {
        foo: stringDataRef,
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
    expect(extension).toMatchObject({ version: 'v1', namespace: 'test' });
    expect(String(extension)).toBe(
      'ExtensionDefinition{namespace=test,attachTo=root@default}',
    );
  });

  it('should create an extension with config', () => {
    const extension = createExtension({
      namespace: 'test',
      attachTo: { id: 'root', input: 'default' },
      config: {
        schema: {
          foo: z => z.string(),
          bar: z => z.string().default('bar'),
          baz: z => z.string().optional(),
        },
      },
      output: {
        foo: stringDataRef,
      },
      factory({ config }) {
        const a1: string = config.foo;
        const a2: string = config.bar;
        // @ts-expect-error
        const a3: string = config.baz;
        // @ts-expect-error
        const c1: number = config.foo;
        // @ts-expect-error
        const c2: number = config.bar;
        // @ts-expect-error
        const c3: number = config.baz;
        unused(a1, a2, a3, c1, c2, c3);

        return {
          foo: 'bar',
        };
      },
    });
    expect(extension).toMatchObject({ version: 'v1', namespace: 'test' });
    expect(String(extension)).toBe(
      'ExtensionDefinition{namespace=test,attachTo=root@default}',
    );

    expect(
      extension.configSchema?.parse({
        foo: 'x',
        bar: 'y',
        baz: 'z',
        // @ts-expect-error
        qux: 'w',
      }),
    ).toEqual({
      foo: 'x',
      bar: 'y',
      baz: 'z',
    });
    expect(
      extension.configSchema?.parse({
        foo: 'x',
      }),
    ).toEqual({
      foo: 'x',
      bar: 'bar',
    });
    expect(() => {
      // @ts-expect-error
      return extension.configSchema?.parse({});
    }).toThrow("Missing required value at 'foo'");
  });

  it('should support new form of outputs', () => {
    expect(
      // @ts-expect-error
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef, numberDataRef],
        factory() {
          return []; // Missing all outputs
        },
      }),
    ).toMatchObject({ version: 'v2' });

    expect(
      // @ts-expect-error
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef, numberDataRef],
        factory() {
          return [stringDataRef('hello')]; // Missing number output
        },
      }),
    ).toMatchObject({ version: 'v2' });

    // Duplicate output, we won't attempt to handle this a compile time and instead error out at runtime
    expect(
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef],
        factory() {
          return [stringDataRef('hello'), stringDataRef('hello')];
        },
      }),
    ).toMatchObject({ version: 'v2' });

    expect(
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef, numberDataRef],
        factory() {
          return [stringDataRef('hello'), numberDataRef(4)];
        },
      }),
    ).toMatchObject({ version: 'v2' });

    expect(
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef, numberDataRef.optional()],
        factory() {
          return [stringDataRef('hello'), numberDataRef(4)];
        },
      }),
    ).toMatchObject({ version: 'v2' });

    expect(
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef, numberDataRef.optional()],
        factory() {
          return [stringDataRef('hello')]; // Missing number output, but it's optional so that's allowed
        },
      }),
    ).toMatchObject({ version: 'v2' });
  });

  it('should support new form of inputs', () => {
    expect(
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        inputs: {
          header: createExtensionInput([stringDataRef.optional()], {
            optional: true,
            singleton: true,
          }),
          content: createExtensionInput([stringDataRef, numberDataRef], {
            optional: false,
            singleton: true,
          }),
        },
        output: [stringDataRef],
        factory({ inputs }) {
          const headerStr = inputs.header?.get(stringDataRef);
          const contentStr = inputs.content.get(stringDataRef);
          const contentNum = inputs.content.get(numberDataRef);

          // @ts-expect-error
          inputs.header?.get(numberDataRef);

          // @ts-expect-error
          const x1: string = headerStr; // string | undefined

          unused(x1);

          return [stringDataRef(contentStr.repeat(contentNum))];
        },
      }),
    ).toMatchObject({ version: 'v2' });
  });
});
