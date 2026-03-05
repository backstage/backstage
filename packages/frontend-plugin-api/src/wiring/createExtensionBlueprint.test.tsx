/*
 * Copyright 2024 The Backstage Authors
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

import { coreExtensionData } from './coreExtensionData';
import {
  createExtensionBlueprint,
  createExtensionBlueprintParams,
  ExtensionBlueprintParams,
} from './createExtensionBlueprint';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import {
  ExtensionDataValue,
  createExtensionDataRef,
} from './createExtensionDataRef';
import { createExtensionInput } from './createExtensionInput';
import { RouteRef } from '../routing';
import { createExtension, ExtensionDefinition } from './createExtension';
import {
  createExtensionDataContainer,
  OpaqueExtensionDefinition,
} from '@internal/frontend';

function unused(..._any: any[]) {}

function factoryOutput(ext: ExtensionDefinition, inputs: unknown = undefined) {
  const int = OpaqueExtensionDefinition.toInternal(ext);
  if (int.version !== 'v2') {
    throw new Error('Expected v2 extension');
  }
  return Array.from(int.factory({ inputs } as any));
}

describe('createExtensionBlueprint', () => {
  it('should allow creation of extension blueprints', () => {
    const TestExtensionBlueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [coreExtensionData.reactElement],
      factory(params: { text: string }) {
        return [coreExtensionData.reactElement(<h1>{params.text}</h1>)];
      },
    });

    const extension = TestExtensionBlueprint.make({
      name: 'my-extension',
      params: {
        text: 'Hello, world!',
      },
    });

    expect(extension).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      attachTo: {
        id: 'test',
        input: 'default',
      },
      configSchema: undefined,
      disabled: false,
      inputs: {},
      kind: 'test-extension',
      name: 'my-extension',
      namespace: undefined,
      output: [coreExtensionData.reactElement],
      factory: expect.any(Function),
      toString: expect.any(Function),
      override: expect.any(Function),
      version: 'v2',
    });

    const { container } = renderInTestApp(
      createExtensionTester(extension).reactElement(),
    );
    expect(container.querySelector('h1')).toHaveTextContent('Hello, world!');
  });

  it('should allow creation of extension blueprints with a generator', () => {
    const TestExtensionBlueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test-1', input: 'default' },
      output: [coreExtensionData.reactElement],
      *factory(params: { text: string }) {
        yield coreExtensionData.reactElement(<h1>{params.text}</h1>);
      },
    });

    const extension = TestExtensionBlueprint.make({
      name: 'my-extension',
      params: {
        text: 'Hello, world!',
      },
    });

    expect(extension).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      attachTo: { id: 'test-1', input: 'default' },
      configSchema: undefined,
      disabled: false,
      inputs: {},
      kind: 'test-extension',
      name: 'my-extension',
      namespace: undefined,
      output: [coreExtensionData.reactElement],
      factory: expect.any(Function),
      toString: expect.any(Function),
      override: expect.any(Function),
      version: 'v2',
    });

    const { container } = renderInTestApp(
      createExtensionTester(extension).reactElement(),
    );
    expect(container.querySelector('h1')).toHaveTextContent('Hello, world!');
  });

  it('should allow overriding of the default factory', () => {
    const TestExtensionBlueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [coreExtensionData.reactElement],
      factory(params: { text: string }) {
        return [coreExtensionData.reactElement(<h1>{params.text}</h1>)];
      },
    });

    const extension = TestExtensionBlueprint.makeWithOverrides({
      name: 'my-extension',
      factory(origFactory) {
        return origFactory({
          text: 'Hello, world!',
        });
      },
    });

    expect(extension).toBeDefined();

    const { container } = renderInTestApp(
      createExtensionTester(extension).reactElement(),
    );
    expect(container.querySelector('h1')).toHaveTextContent('Hello, world!');
  });

  it('should allow exporting the dataRefs from the extension blueprint', () => {
    const dataRef = createExtensionDataRef<string>().with({ id: 'test.data' });

    const TestExtensionBlueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [coreExtensionData.reactElement],
      dataRefs: {
        data: dataRef,
      },
      factory(params: { text: string }) {
        return [coreExtensionData.reactElement(<h1>{params.text}</h1>)];
      },
    });

    expect(TestExtensionBlueprint.dataRefs).toEqual({
      data: dataRef,
    });
  });

  it('should allow defining a config schema with additional properties in the instance', () => {
    const TestExtensionBlueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [coreExtensionData.reactElement],
      config: {
        schema: {
          text: z => z.string(),
        },
      },
      factory(_, { config }) {
        // @ts-expect-error
        const b = config.something;

        const a: string = config.text;
        unused(a);

        expect(config.text).toBe('Hello, world!');

        return [coreExtensionData.reactElement(<h1>{config.text}</h1>)];
      },
    });

    const extension = TestExtensionBlueprint.makeWithOverrides({
      name: 'my-extension',
      config: {
        schema: {
          something: z => z.string(),
          defaulted: z => z.string().optional().default('default'),
        },
      },
      factory(origFactory, { config }) {
        const b: string = config.something;
        const c: string = config.text;
        const d: string = config.defaulted;

        unused(b, c, d);

        expect(config.text).toBe('Hello, world!');
        expect(config.something).toBe('something new!');
        expect(config.defaulted).toBe('lolz');
        return origFactory({});
      },
    });

    expect.assertions(4);

    renderInTestApp(
      createExtensionTester(extension, {
        config: {
          something: 'something new!',
          text: 'Hello, world!',
          defaulted: 'lolz',
        },
      }).reactElement(),
    );
  });

  it('should not allow overlapping config keys', () => {
    const TestExtensionBlueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [coreExtensionData.reactElement],
      config: {
        schema: {
          text: z => z.string(),
        },
      },
      factory(params: { text: string }) {
        return [coreExtensionData.reactElement(<div>{params.text}</div>)];
      },
    });

    TestExtensionBlueprint.makeWithOverrides({
      name: 'my-extension',
      params: {
        text: 'Hello, world!',
      },
      config: {
        schema: {
          // @ts-expect-error
          text: z => z.number(),
          something: z => z.string(),
        },
      },
    });

    expect('test').toBe('test');
  });

  it('should allow setting config when one was not already defined in the blueprint', () => {
    const TestExtensionBlueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [coreExtensionData.reactElement],
      factory(_, { config }) {
        // @ts-expect-error
        const b = config.something;

        return [coreExtensionData.reactElement(<div />)];
      },
    });

    const extension = TestExtensionBlueprint.makeWithOverrides({
      name: 'my-extension',
      config: {
        schema: {
          something: z => z.string(),
          defaulted: z => z.string().optional().default('default'),
        },
      },
      factory(origFactory, { config }) {
        const b: string = config.something;

        unused(b);

        expect(config.something).toBe('something new!');
        expect(config.defaulted).toBe('lolz');
        return origFactory({});
      },
    });

    expect.assertions(2);

    renderInTestApp(
      createExtensionTester(extension, {
        config: {
          something: 'something new!',
          defaulted: 'lolz',
        },
      }).reactElement(),
    );
  });

  it('should allow getting inputs properly', () => {
    createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      inputs: {
        test: createExtensionInput(
          [
            coreExtensionData.routeRef,
            coreExtensionData.reactElement.optional(),
          ],
          { singleton: true },
        ),
      },
      output: [
        coreExtensionData.reactElement,
        coreExtensionData.routeRef.optional(),
      ],
      factory(_, { inputs }) {
        const route = inputs.test.get(coreExtensionData.routeRef);
        const optional = inputs.test.get(coreExtensionData.reactElement);

        // @ts-expect-error
        const optional2: JSX.Element = optional;
        const optional3: JSX.Element | undefined = optional;

        const route2: RouteRef = route;

        unused(optional2, optional3, route2);

        if (!route) {
          return [coreExtensionData.reactElement(<div />)];
        }

        return [
          coreExtensionData.reactElement(<div />),
          coreExtensionData.routeRef(route),
        ];
      },
    });

    expect(true).toBe(true);
  });

  it('should be able to override inputs when calling original factory', () => {
    const outputRef = createExtensionDataRef<unknown>().with({ id: 'output' });
    const testDataRef1 = createExtensionDataRef<string>().with({ id: 'test1' });
    const testDataRef2 = createExtensionDataRef<string>().with({ id: 'test2' });

    const Blueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      inputs: {
        opt: createExtensionInput([testDataRef1.optional()], {
          singleton: true,
          optional: true,
        }),
        single: createExtensionInput([testDataRef1, testDataRef2.optional()], {
          singleton: true,
        }),
        multi: createExtensionInput([testDataRef1]),
      },
      output: [outputRef],
      factory(_, { inputs }) {
        return [
          outputRef({
            opt: inputs.opt?.get(testDataRef1) ?? 'none',
            single: inputs.single.get(testDataRef1),
            singleOpt: inputs.single.get(testDataRef2) ?? 'none',
            multi: inputs.multi.map(i => i.get(testDataRef1)).join(','),
          }),
        ];
      },
    });

    const mockInput = (node: string, ...data: ExtensionDataValue<any, any>[]) =>
      Object.assign(createExtensionDataContainer(data, 'mock'), {
        node,
      });
    const mockParentInputs = {
      opt: mockInput('node-opt', testDataRef1('orig-opt')),
      single: mockInput('node-single', testDataRef1('orig-single')),
      multi: [
        mockInput('node-multi1', testDataRef1('orig-multi1')),
        mockInput('node-multi2', testDataRef1('orig-multi2')),
      ],
    };

    // All values provided
    expect(
      factoryOutput(
        Blueprint.makeWithOverrides({
          factory(origFactory) {
            return origFactory(
              {},
              {
                inputs: {
                  opt: [testDataRef1('opt')],
                  single: [testDataRef1('single'), testDataRef2('singleOpt')],
                  multi: [[testDataRef1('multi1')], [testDataRef1('multi2')]],
                },
              },
            );
          },
        }),
        mockParentInputs,
      ),
    ).toEqual([
      outputRef({
        opt: 'opt',
        single: 'single',
        singleOpt: 'singleOpt',
        multi: 'multi1,multi2',
      }),
    ]);

    // Minimal values provided
    expect(
      factoryOutput(
        Blueprint.makeWithOverrides({
          factory(origFactory) {
            return origFactory(
              {},
              {
                inputs: {
                  single: [testDataRef1('single')],
                  multi: [],
                },
              },
            );
          },
        }),
        mockParentInputs,
      ),
    ).toEqual([
      outputRef({
        opt: 'none',
        single: 'single',
        singleOpt: 'none',
        multi: '',
      }),
    ]);

    // Mismatched input override length
    expect(() =>
      factoryOutput(
        Blueprint.makeWithOverrides({
          factory(origFactory, { inputs }) {
            return origFactory(
              {},
              {
                inputs: {
                  ...inputs,
                  multi: [[testDataRef1('multi1')]],
                },
              },
            );
          },
        }),
        mockParentInputs,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"override data provided for input 'multi' must match the length of the original inputs"`,
    );

    // Required input not provided
    expect(() =>
      factoryOutput(
        Blueprint.makeWithOverrides({
          factory(origFactory, { inputs }) {
            return origFactory(
              {},
              {
                inputs: {
                  ...inputs,
                  single: [testDataRef2('singleOpt')],
                },
              },
            );
          },
        }),
        mockParentInputs,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"missing required extension data value(s) 'test1'"`,
    );

    // Wrong value provided
    expect(() =>
      factoryOutput(
        Blueprint.makeWithOverrides({
          factory(origFactory) {
            return origFactory(
              {},
              {
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
              },
            );
          },
        }),
        mockParentInputs,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"extension data 'test2' was provided but not declared"`,
    );

    // Forwarding entire inputs object
    expect(
      factoryOutput(
        Blueprint.makeWithOverrides({
          factory(origFactory, { inputs }) {
            return origFactory({}, { inputs });
          },
        }),
        mockParentInputs,
      ),
    ).toEqual([
      outputRef({
        opt: 'orig-opt',
        single: 'orig-single',
        singleOpt: 'none',
        multi: 'orig-multi1,orig-multi2',
      }),
    ]);

    // Forwarding individual outputs
    expect(
      factoryOutput(
        Blueprint.makeWithOverrides({
          factory(origFactory, { inputs }) {
            return origFactory(
              {},
              {
                inputs: {
                  opt: inputs.opt,
                  single: inputs.single,
                  multi: inputs.multi,
                },
              },
            );
          },
        }),
        mockParentInputs,
      ),
    ).toEqual([
      outputRef({
        opt: 'orig-opt',
        single: 'orig-single',
        singleOpt: 'none',
        multi: 'orig-multi1,orig-multi2',
      }),
    ]);

    // Overriding based on original input
    expect(
      factoryOutput(
        Blueprint.makeWithOverrides({
          factory(origFactory, { inputs }) {
            return origFactory(
              {},
              {
                inputs: {
                  single: [
                    testDataRef1(`override-${inputs.single.get(testDataRef1)}`),
                    testDataRef2('new-singleOpt'),
                  ],
                  multi: inputs.multi.map(i => [
                    testDataRef1(`override-${i.get(testDataRef1)}`),
                  ]),
                },
              },
            );
          },
        }),
        mockParentInputs,
      ),
    ).toEqual([
      outputRef({
        opt: 'none',
        single: 'override-orig-single',
        singleOpt: 'new-singleOpt',
        multi: 'override-orig-multi1,override-orig-multi2',
      }),
    ]);
  });

  it('should allow merging of inputs', () => {
    const blueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      inputs: {
        test: createExtensionInput([coreExtensionData.routeRef], {
          singleton: true,
        }),
      },
      output: [coreExtensionData.reactElement.optional()],
      factory(_params: { x?: string }, { inputs }) {
        const ref: RouteRef = inputs.test.get(coreExtensionData.routeRef);

        unused(ref);
        return [];
      },
    });

    blueprint.makeWithOverrides({
      inputs: {
        test2: createExtensionInput([coreExtensionData.reactElement], {
          singleton: true,
        }),
      },
      factory(origFactory, { inputs }) {
        const ref: RouteRef = inputs.test.get(coreExtensionData.routeRef);

        const el: JSX.Element = inputs.test2.get(
          coreExtensionData.reactElement,
        );

        unused(ref, el);

        return origFactory({});
      },
    });

    expect(true).toBe(true);
  });

  it('should not allow overriding inputs', () => {
    const blueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      inputs: {
        test: createExtensionInput([coreExtensionData.routeRef]),
      },
      output: [coreExtensionData.reactElement.optional()],
      factory() {
        return [];
      },
    });

    blueprint.makeWithOverrides({
      inputs: {
        // @ts-expect-error
        test: createExtensionInput([]), // Overrides are not allowed
      },
      factory(origFactory) {
        return origFactory({});
      },
    });

    expect(true).toBe(true);
  });

  it('should replace the outputs when provided through make', () => {
    const testDataRef1 = createExtensionDataRef<string>().with({ id: 'test1' });
    const testDataRef2 = createExtensionDataRef<string>().with({ id: 'test2' });

    const blueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [testDataRef1],
      factory() {
        return [testDataRef1('foo')];
      },
    });

    const ext = OpaqueExtensionDefinition.toInternal(
      blueprint.makeWithOverrides({
        output: [testDataRef2],
        factory(origFactory) {
          const parent = origFactory({});
          return [testDataRef2(`${parent.get(testDataRef1)}bar`)];
        },
      }),
    );

    expect(ext.output).toEqual([testDataRef2]);

    expect(factoryOutput(ext)).toEqual([testDataRef2('foobar')]);
  });

  it('should reject invalid output from original factory', () => {
    const testDataRef1 = createExtensionDataRef<string>().with({ id: 'test1' });
    const testDataRef2 = createExtensionDataRef<string>().with({ id: 'test2' });

    expect(() =>
      factoryOutput(
        // @ts-expect-error
        createExtensionBlueprint({
          kind: 'test-extension',
          attachTo: { id: 'test', input: 'default' },
          output: [testDataRef1],
          factory() {
            return [testDataRef2('foo')];
          },
        }).makeWithOverrides({ factory: orig => orig({}) }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"extension data 'test2' was provided but not declared"`,
    );

    expect(() =>
      factoryOutput(
        // @ts-expect-error
        createExtensionBlueprint({
          kind: 'test-extension',
          attachTo: { id: 'test', input: 'default' },
          output: [testDataRef1],
          factory() {
            return [];
          },
        }).makeWithOverrides({ factory: orig => orig({}) }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"missing required extension data value(s) 'test1'"`,
    );
  });

  it('should allow returning of the parent data container', () => {
    const testDataRef1 = createExtensionDataRef<string>().with({ id: 'test1' });
    const testDataRef2 = createExtensionDataRef<string>().with({ id: 'test2' });

    const blueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [testDataRef1],
      factory() {
        return [testDataRef1('foo')];
      },
    });

    expect(
      factoryOutput(
        blueprint.makeWithOverrides({
          output: [testDataRef1, testDataRef2],
          *factory(origFactory) {
            yield* origFactory({});
            yield testDataRef2('bar');
          },
        }),
      ),
    ).toEqual([testDataRef1('foo'), testDataRef2('bar')]);

    expect(
      factoryOutput(
        blueprint.makeWithOverrides({
          output: [testDataRef1, testDataRef2],
          factory(origFactory) {
            return [...origFactory({}), testDataRef2('bar')];
          },
        }),
      ),
    ).toEqual([testDataRef1('foo'), testDataRef2('bar')]);
  });

  it('should not allow returning parent output if outputs are overridden', () => {
    const testDataRef1 = createExtensionDataRef<string>().with({ id: 'test1' });
    const testDataRef2 = createExtensionDataRef<string>().with({ id: 'test2' });

    const blueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [testDataRef1.optional()],
      factory() {
        return [testDataRef1('foo')];
      },
    });

    blueprint.makeWithOverrides({
      output: [testDataRef2.optional()],
      // @ts-expect-error
      *factory() {
        yield testDataRef1('foo');
        yield testDataRef2('bar');
      },
    });

    expect(
      factoryOutput(
        blueprint.makeWithOverrides({
          output: [testDataRef2.optional()],
          *factory() {
            yield testDataRef2('bar');
          },
        }),
      ),
    ).toEqual([testDataRef2('bar')]);
  });

  it('should not rely on optional outputs when forwarding from parent', () => {
    const testDataRef1 = createExtensionDataRef<string>().with({ id: 'test1' });
    const testDataRef2 = createExtensionDataRef<string>().with({ id: 'test2' });

    const blueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [testDataRef1, testDataRef2.optional()],
      factory() {
        return [testDataRef1('foo')];
      },
    });

    blueprint.makeWithOverrides({
      output: [testDataRef1, testDataRef2],
      // @ts-expect-error
      *factory(origFactory) {
        yield* origFactory({});
      },
    });

    expect(
      factoryOutput(
        blueprint.makeWithOverrides({
          output: [testDataRef1, testDataRef2],
          *factory(origFactory) {
            yield* origFactory({});
            yield testDataRef2('bar');
          },
        }),
      ),
    ).toEqual([testDataRef1('foo'), testDataRef2('bar')]);
  });

  it('should be possible to override extensions resulting from .make', () => {
    const testDataRef1 = createExtensionDataRef<string>().with({ id: 'test1' });
    const testDataRef2 = createExtensionDataRef<string>().with({ id: 'test2' });

    function getOutputs(ext: ExtensionDefinition) {
      const tester = createExtensionTester(ext);
      return {
        test1: tester.get(testDataRef1),
        test2: tester.get(testDataRef2),
      };
    }

    const blueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [testDataRef1, testDataRef2],
      *factory(params: { test1: string; test2: string }) {
        yield testDataRef1(params.test1);
        yield testDataRef2(params.test2);
      },
    });

    const extension = blueprint.make({
      params: {
        test1: 'orig-1',
        test2: 'orig-2',
      },
    });

    expect(getOutputs(extension)).toEqual({
      test1: 'orig-1',
      test2: 'orig-2',
    });

    const extensionDef = blueprint.make({
      // Using defineParams is optional in this case
      params: defineParams =>
        defineParams({
          test1: 'orig-1',
          test2: 'orig-2',
        }),
    });

    expect(getOutputs(extensionDef)).toEqual({
      test1: 'orig-1',
      test2: 'orig-2',
    });

    // Plain override
    expect(
      getOutputs(
        extension.override({
          params: {
            test1: 'override-1',
            test2: 'override-2',
          },
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    // Partial override
    expect(
      getOutputs(
        extension.override({
          params: {
            test2: 'override-2',
            // @ts-expect-error
            test3: 'nonexistent',
          },
        }),
      ),
    ).toEqual({
      test1: 'orig-1',
      test2: 'override-2',
    });

    // Partial override with original defineParams
    expect(
      getOutputs(
        extensionDef.override({
          params: {
            test2: 'override-2',
            // @ts-expect-error
            test3: 'nonexistent',
          },
        }),
      ),
    ).toEqual({
      test1: 'orig-1',
      test2: 'override-2',
    });

    // Override with defineParams
    expect(
      getOutputs(
        extension.override({
          params: defineParams =>
            defineParams({
              test1: 'override-1',
              test2: 'override-2',
              // @ts-expect-error
              test3: 'nonexistent',
            }),
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    // Override with defineParams with original defineParams
    expect(
      getOutputs(
        extensionDef.override({
          params: defineParams =>
            defineParams({
              test1: 'override-1',
              test2: 'override-2',
              // @ts-expect-error
              test3: 'nonexistent',
            }),
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    expect(
      getOutputs(
        extension.override({
          factory(origFactory) {
            return origFactory({
              params: {
                test1: 'override-1',
                test2: 'override-2',
              },
            });
          },
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    // Partial override via factory
    expect(
      getOutputs(
        extension.override({
          factory(origFactory) {
            return origFactory({
              params: {
                test2: 'override-2',
                // @ts-expect-error
                test3: 'nonexistent',
              },
            });
          },
        }),
      ),
    ).toEqual({
      test1: 'orig-1',
      test2: 'override-2',
    });

    // Partial override via factory with original defineParams
    expect(
      getOutputs(
        extensionDef.override({
          factory(origFactory) {
            return origFactory({
              params: {
                test2: 'override-2',
                // @ts-expect-error
                test3: 'nonexistent',
              },
            });
          },
        }),
      ),
    ).toEqual({
      test1: 'orig-1',
      test2: 'override-2',
    });

    // Override via factory with defineParams
    expect(
      getOutputs(
        extension.override({
          factory(origFactory) {
            return origFactory({
              params: defineParams =>
                defineParams({
                  test1: 'override-1',
                  test2: 'override-2',
                  // @ts-expect-error
                  test3: 'nonexistent',
                }),
            });
          },
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    // Override via factory with defineParams with original defineParams
    expect(
      getOutputs(
        extensionDef.override({
          factory(origFactory) {
            return origFactory({
              params: defineParams =>
                defineParams({
                  test1: 'override-1',
                  test2: 'override-2',
                  // @ts-expect-error
                  test3: 'nonexistent',
                }),
            });
          },
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    expect(() =>
      getOutputs(
        extension.override({
          params: {
            test1: 'override-1',
            test2: 'override-2',
          },
          factory(origFactory) {
            return origFactory();
          },
        }),
      ),
    ).toThrow('Refused to override params and factory at the same time');
  });

  it('should be possible to override extensions resulting from .makeWithOverrides', () => {
    const testDataRef1 = createExtensionDataRef<string>().with({ id: 'test1' });
    const testDataRef2 = createExtensionDataRef<string>().with({ id: 'test2' });

    function getOutputs(ext: ExtensionDefinition) {
      const tester = createExtensionTester(ext);
      return {
        test1: tester.get(testDataRef1),
        test2: tester.get(testDataRef2),
      };
    }

    const blueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [testDataRef1, testDataRef2],
      *factory(params: { test1: string; test2: string }) {
        yield testDataRef1(params.test1);
        yield testDataRef2(params.test2);
      },
    });

    const extension = blueprint.makeWithOverrides({
      factory(origFactory) {
        return origFactory({
          test1: 'orig-1',
          test2: 'orig-2',
        });
      },
    });

    expect(getOutputs(extension)).toEqual({
      test1: 'orig-1',
      test2: 'orig-2',
    });

    const extensionDef = blueprint.make({
      // Using defineParams is optional in this case
      params: defineParams =>
        defineParams({
          test1: 'orig-1',
          test2: 'orig-2',
        }),
    });

    expect(getOutputs(extensionDef)).toEqual({
      test1: 'orig-1',
      test2: 'orig-2',
    });

    // Plain override
    expect(
      getOutputs(
        extension.override({
          params: {
            test1: 'override-1',
            test2: 'override-2',
          },
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    // Partial override
    expect(
      getOutputs(
        extension.override({
          params: {
            test2: 'override-2',
            // @ts-expect-error
            test3: 'nonexistent',
          },
        }),
      ),
    ).toEqual({
      test1: 'orig-1',
      test2: 'override-2',
    });

    // Partial override with original defineParams
    expect(
      getOutputs(
        extensionDef.override({
          params: {
            test2: 'override-2',
            // @ts-expect-error
            test3: 'nonexistent',
          },
        }),
      ),
    ).toEqual({
      test1: 'orig-1',
      test2: 'override-2',
    });

    // Override with defineParams
    expect(
      getOutputs(
        extension.override({
          params: defineParams =>
            defineParams({
              test1: 'override-1',
              test2: 'override-2',
              // @ts-expect-error
              test3: 'nonexistent',
            }),
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    // Override with defineParams with original defineParams
    expect(
      getOutputs(
        extensionDef.override({
          params: defineParams =>
            defineParams({
              test1: 'override-1',
              test2: 'override-2',
              // @ts-expect-error
              test3: 'nonexistent',
            }),
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    // Override via factory
    expect(
      getOutputs(
        extension.override({
          factory(origFactory) {
            return origFactory({
              params: {
                test1: 'override-1',
                test2: 'override-2',
              },
            });
          },
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    // Partial override via factory
    expect(
      getOutputs(
        extension.override({
          factory(origFactory) {
            return origFactory({
              params: {
                test2: 'override-2',
                // @ts-expect-error
                test3: 'nonexistent',
              },
            });
          },
        }),
      ),
    ).toEqual({
      test1: 'orig-1',
      test2: 'override-2',
    });

    // Partial override via factory with original defineParams
    expect(
      getOutputs(
        extensionDef.override({
          factory(origFactory) {
            return origFactory({
              params: {
                test2: 'override-2',
                // @ts-expect-error
                test3: 'nonexistent',
              },
            });
          },
        }),
      ),
    ).toEqual({
      test1: 'orig-1',
      test2: 'override-2',
    });

    // Override via factory with defineParams
    expect(
      getOutputs(
        extension.override({
          factory(origFactory) {
            return origFactory({
              params: defineParams =>
                defineParams({
                  test1: 'override-1',
                  test2: 'override-2',
                  // @ts-expect-error
                  test3: 'nonexistent',
                }),
            });
          },
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    // Override via factory with defineParams with original defineParams
    expect(
      getOutputs(
        extensionDef.override({
          factory(origFactory) {
            return origFactory({
              params: defineParams =>
                defineParams({
                  test1: 'override-1',
                  test2: 'override-2',
                  // @ts-expect-error
                  test3: 'nonexistent',
                }),
            });
          },
        }),
      ),
    ).toEqual({
      test1: 'override-1',
      test2: 'override-2',
    });

    expect(() =>
      getOutputs(
        extension.override({
          params: {
            test1: 'override-1',
            test2: 'override-2',
          },
          factory(origFactory) {
            return origFactory();
          },
        }),
      ),
    ).toThrow('Refused to override params and factory at the same time');
  });

  // Tests for backward compatibility - runtime still supports multiple attachment points
  // but the TypeScript types no longer allow them
  describe('with relative attachment points (backward compat)', () => {
    const dataRef = createExtensionDataRef<string>().with({ id: 'test.data' });

    it('should create an extension with relative attachment points', () => {
      const blueprint = createExtensionBlueprint({
        kind: 'test',
        attachTo: [
          { relative: {}, input: 'tabs' },
          { relative: { kind: 'page' }, input: 'tabs' },
          { relative: { name: 'index' }, input: 'tabs' },
          { relative: { kind: 'page', name: 'index' }, input: 'tabs' },
        ] as any,
        output: [dataRef],
        factory: () => [dataRef('bar')],
      });

      expect(String(blueprint.make({ params: {} }))).toBe(
        'ExtensionDefinition{kind=test,attachTo=<plugin>@tabs+page:<plugin>@tabs+<plugin>/index@tabs+page:<plugin>/index@tabs}',
      );
      expect(
        String(
          blueprint.make({
            attachTo: [
              { relative: { kind: 'page' }, input: 'tabs' },
              { relative: { name: 'index' }, input: 'tabs' },
              { relative: { kind: 'page', name: 'index' }, input: 'tabs' },
            ] as any,
            params: {},
          }),
        ),
      ).toBe(
        'ExtensionDefinition{kind=test,attachTo=page:<plugin>@tabs+<plugin>/index@tabs+page:<plugin>/index@tabs}',
      );
      expect(
        String(
          blueprint.makeWithOverrides({
            attachTo: {
              relative: { kind: 'page', name: 'index' },
              input: 'tabs',
            },
            factory: orig => orig({}),
          }),
        ),
      ).toBe(
        'ExtensionDefinition{kind=test,attachTo=page:<plugin>/index@tabs}',
      );
    });

    it('should create an extension with relative attachment points by reference', () => {
      const baseOpts = {
        attachTo: { id: 'root', input: 'children' },
        inputs: {
          tabs: createExtensionInput([dataRef]),
        },
        output: [],
        factory: () => [],
      };
      const parent1 = createExtension({
        ...baseOpts,
      });
      const parent2 = createExtension({
        ...baseOpts,
        kind: 'page',
      });
      const parent3 = createExtension({
        ...baseOpts,
        name: 'index',
      });
      const parent4 = createExtension({
        ...baseOpts,
        inputs: {},
        kind: 'page',
        name: 'index',
      }).override({
        inputs: {
          otherTabs: createExtensionInput([dataRef]),
        },
        factory: () => [],
      });
      const blueprint = createExtensionBlueprint({
        kind: 'test',
        attachTo: [
          parent1.inputs.tabs,
          parent2.inputs.tabs,
          parent3.inputs.tabs,
          parent4.inputs.otherTabs,
        ] as any,
        output: [dataRef],
        factory: () => [dataRef('bar')],
      });
      expect(String(blueprint.make({ params: {} }))).toBe(
        'ExtensionDefinition{kind=test,attachTo=<plugin>@tabs+page:<plugin>@tabs+<plugin>/index@tabs+page:<plugin>/index@otherTabs}',
      );
      expect(
        String(
          blueprint.make({
            attachTo: [
              parent2.inputs.tabs,
              parent3.inputs.tabs,
              parent4.inputs.otherTabs,
            ] as any,
            params: {},
          }),
        ),
      ).toBe(
        'ExtensionDefinition{kind=test,attachTo=page:<plugin>@tabs+<plugin>/index@tabs+page:<plugin>/index@otherTabs}',
      );
      expect(
        String(
          blueprint.makeWithOverrides({
            attachTo: parent4.inputs.otherTabs,
            factory: orig => orig({}),
          }),
        ),
      ).toBe(
        'ExtensionDefinition{kind=test,attachTo=page:<plugin>/index@otherTabs}',
      );
    });

    it('should provide type safe attachments by reference', () => {
      const stringDataRef = createExtensionDataRef<string>().with({
        id: 'test.string',
      });
      const numberDataRef = createExtensionDataRef<number>().with({
        id: 'test.number',
      });

      const parent = createExtensionBlueprint({
        kind: 'test-parent',
        attachTo: { id: 'root', input: 'children' },
        inputs: {
          string: createExtensionInput([stringDataRef]),
          stringOpt: createExtensionInput([stringDataRef.optional()]),
          number: createExtensionInput([numberDataRef]),
          numberOpt: createExtensionInput([numberDataRef.optional()]),
          both: createExtensionInput([stringDataRef, numberDataRef]),
          bothOptString: createExtensionInput([
            stringDataRef.optional(),
            numberDataRef,
          ]),
          bothOptNumber: createExtensionInput([
            stringDataRef,
            numberDataRef.optional(),
          ]),
          bothOpt: createExtensionInput([
            stringDataRef.optional(),
            numberDataRef.optional(),
          ]),
        },
        output: [],
        factory: () => [],
      }).make({ params: {} });
      const strOutExt = createExtensionBlueprint({
        kind: 'test',
        attachTo: parent.inputs.string,
        output: [stringDataRef],
        factory: () => [stringDataRef('str')],
      });
      strOutExt.make({
        attachTo: parent.inputs.string,
        params: {},
      });
      strOutExt.makeWithOverrides({
        attachTo: parent.inputs.stringOpt,
        factory: orig => orig({}),
      });
      strOutExt.make({
        // @ts-expect-error
        attachTo: parent.inputs.number,
        params: {},
      });
      strOutExt.makeWithOverrides({
        attachTo: parent.inputs.numberOpt,
        factory: orig => orig({}),
      });
      strOutExt.make({
        // @ts-expect-error
        attachTo: parent.inputs.both,
        params: {},
      });
      strOutExt.make({
        attachTo: parent.inputs.bothOptNumber,
        params: {},
      });
      strOutExt.make({
        // @ts-expect-error
        attachTo: parent.inputs.bothOptString,
        params: {},
      });
      strOutExt.make({
        attachTo: parent.inputs.bothOpt,
        params: {},
      });
      const numberOutExt = createExtensionBlueprint({
        kind: 'test',
        // @ts-expect-error
        attachTo: parent.inputs.string,
        output: [numberDataRef],
        factory: () => [numberDataRef(1)],
      });
      numberOutExt.make({
        // @ts-expect-error
        attachTo: parent.inputs.string,
        params: {},
      });
      numberOutExt.makeWithOverrides({
        attachTo: parent.inputs.number,
        factory: orig => orig({}),
      });
      const bothOutExt = createExtensionBlueprint({
        kind: 'test',
        attachTo: parent.inputs.both,
        output: [numberDataRef, stringDataRef],
        factory: () => [numberDataRef(1), stringDataRef('str')],
      });
      bothOutExt.makeWithOverrides({
        output: [numberDataRef.optional(), stringDataRef],
        factory: orig => orig({}),
      });
      bothOutExt.makeWithOverrides({
        // @ts-expect-error
        attachTo: parent.inputs.both,
        output: [numberDataRef.optional(), stringDataRef],
        factory: orig => orig({}),
      });
      expect('types').not.toBe('broken');
    });
  });

  describe('with advanced parameter types', () => {
    const testDataRef = createExtensionDataRef<string>().with({ id: 'test' });

    const TestExtensionBlueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: [testDataRef],
      defineParams<const A extends string, const B extends A>(params: {
        a: A;
        b: B;
      }) {
        return createExtensionBlueprintParams(params);
      },
      factory(params) {
        return [testDataRef(`${params.a} ${params.b}`)];
      },
    });

    it('should allow creation of extension blueprints', () => {
      TestExtensionBlueprint.make({
        // @ts-expect-error not using define func
        params: {
          a: 'x',
          b: 'y',
        },
      });

      TestExtensionBlueprint.make({
        params: defineParams =>
          defineParams({
            a: 'x',
            // @ts-expect-error b doesn't match a
            b: 'y',
          }),
      });

      TestExtensionBlueprint.make({
        params: defineParams =>
          defineParams({
            a: 'x',
            b: 'x',
            // @ts-expect-error extra param
            c: 'y',
          }),
      });

      const extension = TestExtensionBlueprint.make({
        params: defineParams =>
          defineParams({
            a: 'x',
            b: 'x',
          }),
      });

      expect(extension).toEqual({
        $$type: '@backstage/ExtensionDefinition',
        T: undefined,
        attachTo: {
          id: 'test',
          input: 'default',
        },
        configSchema: undefined,
        disabled: false,
        inputs: {},
        kind: 'test-extension',
        name: undefined,
        namespace: undefined,
        output: [testDataRef],
        factory: expect.any(Function),
        toString: expect.any(Function),
        override: expect.any(Function),
        version: 'v2',
      });

      expect(createExtensionTester(extension).get(testDataRef)).toBe('x x');

      extension.override({
        // @ts-expect-error not using define func
        params: {
          a: 'z',
          b: 'w',
        },
      });

      extension.override({
        params: defineParams =>
          defineParams({
            a: 'z',
            // @ts-expect-error b doesn't match a
            b: 'w',
          }),
      });

      extension.override({
        params: defineParams =>
          defineParams({
            a: 'z',
            b: 'z',
            // @ts-expect-error extra param
            c: 'w',
          }),
      });

      const override = extension.override({
        params: defineParams =>
          defineParams({
            a: 'z',
            b: 'z',
          }),
      });

      expect(createExtensionTester(override).get(testDataRef)).toBe('z z');
    });

    it('should allow overriding of the default factory', () => {
      TestExtensionBlueprint.makeWithOverrides({
        factory(originalFactory) {
          // @ts-expect-error not using define func
          return originalFactory({
            a: 'x',
            b: 'y',
          });
        },
      });

      TestExtensionBlueprint.makeWithOverrides({
        factory(originalFactory) {
          return originalFactory(defineParams =>
            defineParams({
              a: 'x',
              // @ts-expect-error b doesn't match a
              b: 'y',
            }),
          );
        },
      });

      const extension = TestExtensionBlueprint.makeWithOverrides({
        factory(originalFactory) {
          return originalFactory(defineParams =>
            defineParams({
              a: 'x',
              b: 'x',
            }),
          );
        },
      });

      expect(extension).toEqual({
        $$type: '@backstage/ExtensionDefinition',
        T: undefined,
        attachTo: {
          id: 'test',
          input: 'default',
        },
        configSchema: undefined,
        disabled: false,
        inputs: {},
        kind: 'test-extension',
        name: undefined,
        namespace: undefined,
        output: [testDataRef],
        factory: expect.any(Function),
        toString: expect.any(Function),
        override: expect.any(Function),
        version: 'v2',
      });

      expect(createExtensionTester(extension).get(testDataRef)).toBe('x x');

      extension.override({
        // @ts-expect-error not using define func
        params: {
          a: 'z',
          b: 'w',
        },
      });

      extension.override({
        params: defineParams =>
          defineParams({
            a: 'z',
            // @ts-expect-error b doesn't match a
            b: 'w',
          }),
      });

      const override = extension.override({
        params: defineParams =>
          defineParams({
            a: 'z',
            b: 'z',
          }),
      });

      expect(createExtensionTester(override).get(testDataRef)).toBe('z z');
    });

    it('should allow the params definer to transform the params', () => {
      const TestTransformExtensionBlueprint = createExtensionBlueprint({
        kind: 'test-extension',
        attachTo: { id: 'test', input: 'default' },
        output: [testDataRef],
        defineParams(params: { a: number; b: number }) {
          return createExtensionBlueprintParams({
            x: params.a + 1,
            y: params.b + 1,
          });
        },
        factory(params) {
          return [testDataRef(`${params.x} ${params.y}`)];
        },
      });

      const extension = TestTransformExtensionBlueprint.make({
        params: defineParams =>
          defineParams({
            a: 0,
            b: 10,
          }),
      });

      expect(createExtensionTester(extension).get(testDataRef)).toBe(`1 11`);

      expect(
        createExtensionTester(
          extension.override({
            params: defineParams =>
              defineParams({
                a: 20,
                b: 30,
              }),
          }),
        ).get(testDataRef),
      ).toBe(`21 31`);
    });

    it('should support overloads', () => {
      const TestTransformExtensionBlueprint = createExtensionBlueprint({
        kind: 'test-extension',
        attachTo: { id: 'test', input: 'default' },
        output: [testDataRef],
        defineParams: (params => createExtensionBlueprintParams(params)) as {
          (params: { x: 1 }): ExtensionBlueprintParams<{ x: number }>;
          (params: { x: 2 }): ExtensionBlueprintParams<{ x: number }>;
        },
        factory(params) {
          return [testDataRef(`x: ${params.x}`)];
        },
      });

      const extension = TestTransformExtensionBlueprint.make({
        params: defineParams => defineParams({ x: 1 }),
      });

      expect(createExtensionTester(extension).get(testDataRef)).toBe(`x: 1`);

      TestTransformExtensionBlueprint.make({
        params: defineParams => defineParams({ x: 2 }),
      });

      TestTransformExtensionBlueprint.make({
        // @ts-expect-error doesn't match any overload
        params: defineParams => defineParams({ x: 3 }),
      });
    });
  });
});
