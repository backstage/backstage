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

import { createExtensionTester } from '@backstage/frontend-test-utils';
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
      output: [stringDataRef],
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

        return [stringDataRef('bar')];
      },
    });
    expect(extension).toMatchObject({ version: 'v2', namespace: 'test' });
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
      // @ts-expect-error
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef],
        factory() {
          return [stringDataRef('hello'), numberDataRef(4)];
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

  it('should support new form of outputs with a generator', () => {
    expect(
      // @ts-expect-error
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef, numberDataRef],
        *factory() {
          // Missing all outputs
        },
      }),
    ).toMatchObject({ version: 'v2' });

    expect(
      // @ts-expect-error
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef, numberDataRef],
        *factory() {
          yield stringDataRef('hello'); // Missing number output
        },
      }),
    ).toMatchObject({ version: 'v2' });

    // Duplicate output, we won't attempt to handle this a compile time and instead error out at runtime
    expect(
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef],
        *factory() {
          yield stringDataRef('hello');
          yield stringDataRef('hello');
        },
      }),
    ).toMatchObject({ version: 'v2' });

    expect(
      // @ts-expect-error
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef],
        *factory() {
          yield stringDataRef('hello');
          yield numberDataRef(4); // No declared output
        },
      }),
    ).toMatchObject({ version: 'v2' });

    expect(
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef, numberDataRef],
        *factory() {
          yield stringDataRef('hello');
          yield numberDataRef(4);
        },
      }),
    ).toMatchObject({ version: 'v2' });

    expect(
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef, numberDataRef.optional()],
        *factory() {
          yield stringDataRef('hello');
          yield numberDataRef(4);
        },
      }),
    ).toMatchObject({ version: 'v2' });

    expect(
      createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef, numberDataRef.optional()],
        *factory() {
          yield stringDataRef('hello'); // Missing number output, but it's optional so that's allowed
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

  describe('overrides', () => {
    it('should allow overriding of config and merging', () => {
      const testExtension = createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'blob' },
        output: [stringDataRef],
        config: {
          schema: {
            foo: z => z.string().optional(),
          },
        },
        factory() {
          return [stringDataRef('default')];
        },
      });

      testExtension.override({
        config: {
          schema: {
            bar: z => z.string().optional(),
          },
        },
        factory(_, { config }) {
          return [stringDataRef(config.foo ?? config.bar ?? 'default')];
        },
      });

      expect(true).toBe(true);
    });

    it('should allow overriding of outputs', () => {
      const testExtension = createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'blob' },
        output: [stringDataRef],
        inputs: {
          test: createExtensionInput([stringDataRef], {
            singleton: true,
          }),
        },
        config: {
          schema: {
            foo: z => z.string().optional(),
          },
        },
        factory({ inputs }) {
          return [stringDataRef(inputs.test.get(stringDataRef))];
        },
      });

      const override1 = testExtension.override({
        output: [numberDataRef],
        factory(_, { inputs }) {
          return [numberDataRef(inputs.test.get(stringDataRef).length)];
        },
      });

      // @ts-expect-error - this should fail because string output should be merged?
      const override2 = testExtension.override({
        output: [numberDataRef],
        factory(_, { inputs }) {
          return [stringDataRef(inputs.test.get(stringDataRef))];
        },
      });

      unused(override1, override2);

      expect(true).toBe(true);
    });

    it('should allow overriding the factory function and calling the original factory', () => {
      const testExtension = createExtension({
        namespace: 'test',
        attachTo: { id: 'root', input: 'blob' },
        output: [stringDataRef],
        config: {
          schema: {
            foo: z => z.string().optional(),
          },
        },
        factory() {
          return [stringDataRef('default')];
        },
      });

      testExtension.override({
        factory(originalFactory) {
          const response = originalFactory();

          const foo: string = response.get(stringDataRef);

          // @ts-expect-error - fails because original factory does not return number
          const number: boolean = response.get(numberDataRef);

          return [stringDataRef(`foo-${foo}-override`)];
        },
      });

      expect(true).toBe(true);
    });

    it('should allow overriding the returned values from the parent factory', () => {
      const testExtension = createExtension({
        kind: 'thing',
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef, numberDataRef],
        config: {
          schema: {
            foo: z => z.string().default('boom'),
          },
        },
        factory({ config }) {
          return [stringDataRef(config.foo), numberDataRef(42)];
        },
      });

      const overridden = testExtension.override({
        output: [numberDataRef, stringDataRef],
        *factory(originalFactory) {
          const output = originalFactory();
          yield* output;

          yield numberDataRef(output.get(numberDataRef) + 1);
        },
      });

      const tester = createExtensionTester(overridden);

      expect(tester.get(numberDataRef)).toBe(43);
    });

    it('should work functionally with overrides', () => {
      const testExtension = createExtension({
        kind: 'thing',
        namespace: 'test',
        attachTo: { id: 'root', input: 'default' },
        output: [stringDataRef],
        config: {
          schema: {
            foo: z => z.string().default('boom'),
          },
        },
        factory({ config }) {
          return [stringDataRef(config.foo)];
        },
      });

      const overriden = testExtension.override({
        config: {
          schema: {
            bar: z => z.string().default('hello'),
          },
        },
        factory(originalFactory, { config }) {
          const response = originalFactory();

          const foo: string = response.get(stringDataRef);

          return [stringDataRef(`foo-${foo}-override-${config.bar}`)];
        },
      });

      expect(createExtensionTester(overriden).get(stringDataRef)).toBe(
        'foo-boom-override-hello',
      );

      expect(
        createExtensionTester(overriden, {
          config: { foo: 'hello', bar: 'world' },
        }).get(stringDataRef),
      ).toBe('foo-hello-override-world');
    });

    it('should be able to override input values', () => {
      const outputRef = createExtensionDataRef<unknown>().with({
        id: 'output',
      });
      const testDataRef1 = createExtensionDataRef<string>().with({
        id: 'test1',
      });
      const testDataRef2 = createExtensionDataRef<string>().with({
        id: 'test2',
      });

      const subject = createExtension({
        name: 'subject',
        attachTo: { id: 'ignored', input: 'ignored' },
        inputs: {
          opt: createExtensionInput([testDataRef1.optional()], {
            singleton: true,
            optional: true,
          }),
          single: createExtensionInput(
            [testDataRef1, testDataRef2.optional()],
            {
              singleton: true,
            },
          ),
          multi: createExtensionInput([testDataRef1]),
        },
        output: [outputRef],
        factory({ inputs }) {
          return [
            outputRef({
              opt: inputs.opt?.get(testDataRef1) ?? 'none',
              single: inputs.single.get(testDataRef1),
              singleOpt: inputs.single.get(testDataRef2) ?? 'none',
              multi: inputs.multi
                .map(i => `${i.node.spec.id}=${i.get(testDataRef1)}`)
                .join(','),
            }),
          ];
        },
      });

      const optExt = createExtension({
        name: 'o',
        attachTo: { id: 'subject', input: 'opt' },
        output: [testDataRef1],
        factory: () => [testDataRef1('orig-opt')],
      });

      const singleExt = createExtension({
        name: 's',
        attachTo: { id: 'subject', input: 'single' },
        output: [testDataRef1, testDataRef2.optional()],
        factory: () => [testDataRef1('orig-single')],
      });

      const multi1Ext = createExtension({
        name: 'm1',
        attachTo: { id: 'subject', input: 'multi' },
        output: [testDataRef1],
        factory: () => [testDataRef1('orig-multi1')],
      });

      const multi2Ext = createExtension({
        name: 'm2',
        attachTo: { id: 'subject', input: 'multi' },
        output: [testDataRef1],
        factory: () => [testDataRef1('orig-multi2')],
      });

      expect(
        createExtensionTester(subject)
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toEqual({
        opt: 'orig-opt',
        single: 'orig-single',
        singleOpt: 'none',
        multi: 'm1=orig-multi1,m2=orig-multi2',
      });

      // All values provided
      expect(
        createExtensionTester(
          subject.override({
            factory(originalFactory) {
              return originalFactory({
                inputs: {
                  opt: [testDataRef1('opt')],
                  single: [testDataRef1('single'), testDataRef2('singleOpt')],
                  multi: [[testDataRef1('multi1')], [testDataRef1('multi2')]],
                },
              });
            },
          }),
        )
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toEqual({
        opt: 'opt',
        single: 'single',
        singleOpt: 'singleOpt',
        multi: 'm1=multi1,m2=multi2',
      });

      // Minimal values provided
      expect(
        createExtensionTester(
          subject.override({
            factory(originalFactory) {
              return originalFactory({
                inputs: {
                  single: [testDataRef1('single')],
                  multi: [],
                },
              });
            },
          }),
        )
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toEqual({
        opt: 'none',
        single: 'single',
        singleOpt: 'none',
        multi: '',
      });

      // Forward inputs directly
      expect(
        createExtensionTester(
          subject.override({
            factory(originalFactory, { inputs }) {
              return originalFactory({
                inputs,
              });
            },
          }),
        )
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toEqual({
        opt: 'orig-opt',
        single: 'orig-single',
        singleOpt: 'none',
        multi: 'm1=orig-multi1,m2=orig-multi2',
      });

      // Forward inputs separately
      expect(
        createExtensionTester(
          subject.override({
            factory(originalFactory, { inputs }) {
              return originalFactory({
                inputs: {
                  opt: inputs.opt,
                  single: inputs.single,
                  multi: inputs.multi,
                },
              });
            },
          }),
        )
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toEqual({
        opt: 'orig-opt',
        single: 'orig-single',
        singleOpt: 'none',
        multi: 'm1=orig-multi1,m2=orig-multi2',
      });

      // Reordering inputs
      expect(
        createExtensionTester(
          subject.override({
            factory(originalFactory, { inputs }) {
              return originalFactory({
                inputs: {
                  opt: inputs.opt,
                  single: inputs.single,
                  multi: [inputs.multi[1], inputs.multi[0]],
                },
              });
            },
          }),
        )
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toEqual({
        opt: 'orig-opt',
        single: 'orig-single',
        singleOpt: 'none',
        multi: 'm2=orig-multi2,m1=orig-multi1',
      });

      // Filter out inputs
      expect(
        createExtensionTester(
          subject.override({
            factory(originalFactory, { inputs }) {
              return originalFactory({
                inputs: {
                  opt: inputs.opt,
                  single: inputs.single,
                  multi: inputs.multi.filter(i => i.node.spec.id.endsWith('2')),
                },
              });
            },
          }),
        )
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toEqual({
        opt: 'orig-opt',
        single: 'orig-single',
        singleOpt: 'none',
        multi: 'm2=orig-multi2',
      });

      // Overriding based on original input
      expect(
        createExtensionTester(
          subject.override({
            factory(originalFactory, { inputs }) {
              return originalFactory({
                inputs: {
                  single: [
                    testDataRef1(`override-${inputs.single.get(testDataRef1)}`),
                    testDataRef2('new-singleOpt'),
                  ],
                  multi: inputs.multi.map(i => [
                    testDataRef1(`override-${i.get(testDataRef1)}`),
                  ]),
                },
              });
            },
          }),
        )
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toEqual({
        opt: 'none',
        single: 'override-orig-single',
        singleOpt: 'new-singleOpt',
        multi: 'm1=override-orig-multi1,m2=override-orig-multi2',
      });

      // Mismatched input override length
      expect(() =>
        createExtensionTester(
          subject.override({
            factory(originalFactory, { inputs }) {
              return originalFactory({
                inputs: {
                  ...inputs,
                  multi: [[testDataRef1('multi1')]],
                },
              });
            },
          }),
        )
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Failed to instantiate extension 'subject', override data provided for input 'multi' must match the length of the original inputs"`,
      );

      // Mix forward and data override
      expect(() =>
        createExtensionTester(
          subject.override({
            factory(originalFactory, { inputs }) {
              return originalFactory({
                inputs: {
                  ...inputs,
                  multi: [inputs.multi[0], [testDataRef1('multi2')]],
                },
              });
            },
          }),
        )
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Failed to instantiate extension 'subject', override data for input 'multi' may not mix forwarded inputs with data overrides"`,
      );

      // Required input not provided
      expect(() =>
        createExtensionTester(
          subject.override({
            factory(originalFactory, { inputs }) {
              return originalFactory({
                inputs: {
                  ...inputs,
                  single: [testDataRef2('singleOpt')],
                },
              });
            },
          }),
        )
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Failed to instantiate extension 'subject', missing required extension data value(s) 'test1'"`,
      );

      // Wrong value provided
      expect(() =>
        createExtensionTester(
          subject.override({
            factory(originalFactory) {
              return originalFactory({
                inputs: {
                  // @ts-expect-error
                  opt: [testDataRef2('opt')],
                  // @ts-expect-error
                  single: [testDataRef1('single'), outputRef({})],
                  multi: [
                    // @ts-expect-error
                    [testDataRef2('multi1')],
                  ],
                },
              });
            },
          }),
        )
          .add(optExt)
          .add(singleExt)
          .add(multi1Ext)
          .add(multi2Ext)
          .get(outputRef),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Failed to instantiate extension 'subject', extension data 'test2' was provided but not declared"`,
      );
    });
  });
});
