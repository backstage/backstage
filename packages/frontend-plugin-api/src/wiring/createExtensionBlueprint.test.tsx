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

import React from 'react';
import { coreExtensionData } from './coreExtensionData';
import { createExtensionBlueprint } from './createExtensionBlueprint';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { createExtensionDataRef } from './createExtensionDataRef';
import { createExtensionInput } from './createExtensionInput';
import { RouteRef } from '../routing';
import {
  ExtensionDefinition,
  toInternalExtensionDefinition,
} from './createExtension';

function unused(..._any: any[]) {}

function factoryOutput(ext: ExtensionDefinition<any, any>) {
  const int = toInternalExtensionDefinition(ext);
  if (int.version !== 'v2') {
    throw new Error('Expected v2 extension');
  }
  return Array.from(int.factory({} as any));
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

    const { container } = createExtensionTester(extension).render();
    expect(container.querySelector('h1')).toHaveTextContent('Hello, world!');
  });

  it('should allow creation of extension blueprints with a generator', () => {
    const TestExtensionBlueprint = createExtensionBlueprint({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
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

    const { container } = createExtensionTester(extension).render();
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

    const { container } = createExtensionTester(extension).render();
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

    createExtensionTester(extension, {
      config: {
        something: 'something new!',
        text: 'Hello, world!',
        defaulted: 'lolz',
      },
    }).render();
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

    createExtensionTester(extension, {
      config: {
        something: 'something new!',
        defaulted: 'lolz',
      },
    }).render();
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

    const ext = toInternalExtensionDefinition(
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
});
