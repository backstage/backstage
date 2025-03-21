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
  AnyExtensionDataRef,
  AppNode,
  Extension,
  ExtensionInput,
  PortableSchema,
  ResolvedExtensionInput,
  createExtension,
  createExtensionDataRef,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import {
  createAppNodeInstance,
  instantiateAppNodeTree,
} from './instantiateAppNodeTree';
import { AppNodeSpec } from '@backstage/frontend-plugin-api';
import { resolveAppTree } from './resolveAppTree';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  InternalExtension,
  resolveExtensionDefinition,
} from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createSchemaFromZod } from '../../../frontend-plugin-api/src/schema/createSchemaFromZod';
import { TestApiRegistry, withLogCollector } from '@backstage/test-utils';

const testApis = TestApiRegistry.from();
const testDataRef = createExtensionDataRef<string>().with({ id: 'test' });
const otherDataRef = createExtensionDataRef<number>().with({ id: 'other' });
const inputMirrorDataRef = createExtensionDataRef<unknown>().with({
  id: 'mirror',
});

function makeSpec<TConfig, TConfigInput>(
  extension: Extension<TConfig, TConfigInput>,
  spec?: Partial<AppNodeSpec>,
): AppNodeSpec {
  return {
    id: extension.id,
    attachTo: extension.attachTo,
    disabled: extension.disabled,
    extension: extension as Extension<unknown, unknown>,
    source: undefined,
    ...spec,
  };
}

function makeNode<TConfig, TConfigInput>(
  extension: Extension<TConfig, TConfigInput>,
  spec?: Partial<AppNodeSpec>,
): AppNode {
  return {
    spec: makeSpec(extension, spec),
    edges: {
      attachments: new Map(),
    },
  };
}

function makeInstanceWithId<TConfig, TConfigInput>(
  extension: Extension<TConfig, TConfigInput>,
  config?: TConfigInput,
): AppNode {
  const node = makeNode(extension, { config });
  return {
    ...node,
    instance: createAppNodeInstance({
      node,
      attachments: new Map(),
      apis: testApis,
    }),
  };
}

function createV1ExtensionInput(
  extensionData: Record<string, AnyExtensionDataRef>,
  options: { singleton?: boolean; optional?: boolean } = {},
) {
  return {
    $$type: '@backstage/ExtensionInput' as const,
    extensionData,
    config: {
      singleton: options.singleton ?? false,
      optional: options.optional ?? false,
    },
  };
}

function createV1Extension(opts: {
  namespace: string;
  name?: string;
  attachTo?: { id: string; input: string };
  inputs?: Record<string, ReturnType<typeof createV1ExtensionInput>>;
  output: Record<string, AnyExtensionDataRef>;
  configSchema?: PortableSchema<any, any>;
  factory: (ctx: { inputs: any; config: any }) => any;
}): Extension<any, any> {
  const ext: InternalExtension<any, any> = {
    $$type: '@backstage/Extension',
    version: 'v1',
    id: opts.name ? `${opts.namespace}/${opts.name}` : opts.namespace,
    disabled: false,
    attachTo: opts.attachTo ?? { id: 'ignored', input: 'ignored' },
    inputs: opts.inputs ?? {},
    output: opts.output,
    configSchema: opts.configSchema,
    factory: opts.factory,
  };
  return ext;
}

describe('instantiateAppNodeTree', () => {
  describe('v1', () => {
    const simpleExtension = createV1Extension({
      namespace: 'app',
      name: 'test',
      attachTo: { id: 'ignored', input: 'ignored' },
      output: {
        test: testDataRef,
        other: otherDataRef.optional(),
      },
      configSchema: createSchemaFromZod(z =>
        z.object({
          output: z.string().default('test'),
          other: z.number().optional(),
        }),
      ),
      factory({ config }) {
        return { test: config.output, other: config.other };
      },
    });

    it('should instantiate a single node', () => {
      const tree = resolveAppTree('root-node', [
        makeSpec(simpleExtension, { id: 'root-node' }),
      ]);
      expect(tree.root.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).toBeDefined();
      expect(tree.root.instance?.getData(testDataRef)).toBe('test');

      // Multiple calls should have no effect
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).toBeDefined();
    });

    it('should not instantiate disabled nodes', () => {
      const tree = resolveAppTree('root-node', [
        makeSpec(simpleExtension, { id: 'root-node', disabled: true }),
      ]);
      expect(tree.root.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).not.toBeDefined();
    });

    it('should instantiate a node with attachments', () => {
      const tree = resolveAppTree('root-node', [
        makeSpec(
          createV1Extension({
            namespace: 'root-node',
            attachTo: { id: 'ignored', input: 'ignored' },
            inputs: {
              test: createV1ExtensionInput({ test: testDataRef }),
            },
            output: {
              inputMirror: inputMirrorDataRef,
            },
            factory({ inputs }) {
              return { inputMirror: inputs };
            },
          }),
        ),
        makeSpec(simpleExtension, {
          id: 'child-node',
          attachTo: { id: 'root-node', input: 'test' },
        }),
      ]);

      const childNode = tree.nodes.get('child-node');
      expect(childNode).toBeDefined();

      expect(tree.root.instance).not.toBeDefined();
      expect(childNode?.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).toBeDefined();
      expect(childNode?.instance).toBeDefined();
      expect(tree.root.instance?.getData(inputMirrorDataRef)).toMatchObject({
        test: [
          { node: { spec: { id: 'child-node' } }, output: { test: 'test' } },
        ],
      });

      // Multiple calls should have no effect
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).toBeDefined();
      expect(childNode?.instance).toBeDefined();
    });

    it('should not instantiate disabled attachments', () => {
      const tree = resolveAppTree('root-node', [
        {
          ...makeSpec(
            createV1Extension({
              namespace: 'root-node',
              attachTo: { id: 'ignored', input: 'ignored' },
              inputs: {
                test: createV1ExtensionInput({ test: testDataRef }),
              },
              output: {
                inputMirror: inputMirrorDataRef,
              },
              factory({ inputs }) {
                return { inputMirror: inputs };
              },
            }),
          ),
        },
        {
          ...makeSpec(simpleExtension),
          id: 'child-node',
          // Using an invalid input should not be an error when disabled
          attachTo: { id: 'root-node', input: 'invalid' },
          disabled: true,
        },
      ]);

      const childNode = tree.nodes.get('child-node');
      expect(childNode).toBeDefined();

      expect(tree.root.instance).not.toBeDefined();
      expect(childNode?.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).toBeDefined();
      expect(childNode?.instance).not.toBeDefined();
      expect(tree.root.instance?.getData(inputMirrorDataRef)).toEqual({
        test: [],
      });
    });

    describe('createAppNodeInstance', () => {
      it('should create a simple extension instance', () => {
        const attachments = new Map();
        const instance = createAppNodeInstance({
          node: makeNode(simpleExtension),
          attachments,
          apis: testApis,
        });

        expect(Array.from(instance.getDataRefs())).toEqual([
          testDataRef,
          otherDataRef.optional(),
        ]);
        expect(instance.getData(testDataRef)).toEqual('test');
      });

      it('should create an extension with different kind of inputs', () => {
        const attachments = new Map([
          [
            'optionalSingletonPresent',
            [
              makeInstanceWithId(simpleExtension, {
                output: 'optionalSingletonPresent',
              }),
            ],
          ],
          [
            'singleton',
            [
              makeInstanceWithId(simpleExtension, {
                output: 'singleton',
                other: 2,
              }),
            ],
          ],
          [
            'many',
            [
              makeInstanceWithId(simpleExtension, { output: 'many1' }),
              makeInstanceWithId(simpleExtension, {
                output: 'many2',
                other: 3,
              }),
            ],
          ],
        ]);
        const instance = createAppNodeInstance({
          apis: testApis,
          attachments,
          node: makeNode(
            createV1Extension({
              namespace: 'app',
              name: 'test',
              attachTo: { id: 'ignored', input: 'ignored' },
              inputs: {
                optionalSingletonPresent: createV1ExtensionInput(
                  {
                    test: testDataRef,
                    other: otherDataRef.optional(),
                  },
                  { singleton: true, optional: true },
                ),
                optionalSingletonMissing: createV1ExtensionInput(
                  {
                    test: testDataRef,
                    other: otherDataRef.optional(),
                  },
                  { singleton: true, optional: true },
                ),
                singleton: createV1ExtensionInput(
                  {
                    test: testDataRef,
                    other: otherDataRef.optional(),
                  },
                  { singleton: true },
                ),
                many: createV1ExtensionInput({
                  test: testDataRef,
                  other: otherDataRef.optional(),
                }),
              },
              output: {
                inputMirror: inputMirrorDataRef,
              },
              factory({ inputs }) {
                return { inputMirror: inputs };
              },
            }),
          ),
        });

        expect(Array.from(instance.getDataRefs())).toEqual([
          inputMirrorDataRef,
        ]);
        expect(instance.getData(inputMirrorDataRef)).toMatchObject({
          optionalSingletonPresent: {
            node: { spec: { id: 'app/test' } },
            output: { test: 'optionalSingletonPresent' },
          },
          singleton: {
            node: { spec: { id: 'app/test' } },
            output: { test: 'singleton', other: 2 },
          },
          many: [
            { node: { spec: { id: 'app/test' } }, output: { test: 'many1' } },
            {
              node: { spec: { id: 'app/test' } },
              output: { test: 'many2', other: 3 },
            },
          ],
        });
      });

      it('should refuse to create an extension with invalid config', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            node: makeNode(simpleExtension, {
              config: { other: 'not-a-number' },
            }),
            attachments: new Map(),
          }),
        ).toThrow(
          "Invalid configuration for extension 'app/test'; caused by Error: Expected number, received string at 'other'",
        );
      });

      it('should forward extension factory errors', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            node: makeNode(
              createV1Extension({
                namespace: 'app',
                name: 'test',
                attachTo: { id: 'ignored', input: 'ignored' },
                output: {},
                factory() {
                  const error = new Error('NOPE');
                  error.name = 'NopeError';
                  throw error;
                },
              }),
            ),
            attachments: new Map(),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test'; caused by NopeError: NOPE",
        );
      });

      it('should refuse to create an instance with duplicate output', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            node: makeNode(
              createV1Extension({
                namespace: 'app',
                name: 'test',
                attachTo: { id: 'ignored', input: 'ignored' },
                output: {
                  test1: testDataRef,
                  test2: testDataRef,
                },
                factory({}) {
                  return { test1: 'test', test2: 'test2' };
                },
              }),
            ),
            attachments: new Map(),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test', duplicate extension data 'test' received via output 'test2'",
        );
      });

      it('should refuse to create an instance with disconnected output data', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            node: makeNode(
              createV1Extension({
                namespace: 'app',
                name: 'test',
                attachTo: { id: 'ignored', input: 'ignored' },
                output: {
                  test: testDataRef,
                },
                factory({}) {
                  return { nonexistent: 'test' } as any;
                },
              }),
            ),
            attachments: new Map(),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test', unknown output provided via 'nonexistent'",
        );
      });

      it('should refuse to create an instance with missing required input', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            node: makeNode(
              createV1Extension({
                namespace: 'app',
                name: 'test',
                attachTo: { id: 'ignored', input: 'ignored' },
                inputs: {
                  singleton: createV1ExtensionInput(
                    {
                      test: testDataRef,
                    },
                    { singleton: true },
                  ),
                },
                output: {},
                factory: () => ({}),
              }),
            ),
            attachments: new Map(),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test', input 'singleton' is required but was not received",
        );
      });

      it('should warn when creating an instance with undeclared inputs', () => {
        const { warn } = withLogCollector(['warn'], () =>
          createAppNodeInstance({
            apis: testApis,
            attachments: new Map([
              [
                'declared',
                [
                  makeInstanceWithId(simpleExtension, {
                    output: 'many1',
                  }),
                ],
              ],
              [
                'undeclared',
                [
                  makeInstanceWithId(simpleExtension, {
                    output: 'many1',
                  }),
                ],
              ],
            ]),
            node: makeNode(
              createV1Extension({
                namespace: 'app',
                name: 'parent',
                attachTo: { id: 'ignored', input: 'ignored' },
                inputs: {
                  declared: createV1ExtensionInput({
                    test: testDataRef,
                  }),
                },
                output: {},
                factory: () => ({}),
              }),
            ),
          }),
        );

        expect(warn).toEqual([
          "The extension 'app/test' is attached to the input 'undeclared' of the extension 'app/parent', but it has no such input (candidates are 'declared')",
        ]);
      });

      it('should refuse to create an instance with multiple undeclared inputs', () => {
        const { warn } = withLogCollector(['warn'], () =>
          createAppNodeInstance({
            apis: testApis,
            attachments: new Map([
              [
                'undeclared1',
                [makeInstanceWithId(simpleExtension, { output: 'many1' })],
              ],
              [
                'undeclared2',
                [
                  makeInstanceWithId(simpleExtension, { output: 'many1' }),
                  makeInstanceWithId(simpleExtension, { output: 'many1' }),
                ],
              ],
            ]),
            node: makeNode(
              createV1Extension({
                namespace: 'app',
                name: 'parent',
                attachTo: { id: 'ignored', input: 'ignored' },
                output: {},
                factory: () => ({}),
              }),
            ),
          }),
        );

        expect(warn).toEqual([
          "The extension 'app/test' is attached to the input 'undeclared1' of the extension 'app/parent', but it has no inputs",
          "The extensions 'app/test', 'app/test' are attached to the input 'undeclared2' of the extension 'app/parent', but it has no inputs",
        ]);
      });

      it('should refuse to create an instance with multiple inputs for required singleton', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            attachments: new Map([
              [
                'singleton',
                [
                  makeInstanceWithId(simpleExtension, { output: 'many1' }),
                  makeInstanceWithId(simpleExtension, { output: 'many2' }),
                ],
              ],
            ]),
            node: makeNode(
              createV1Extension({
                namespace: 'app',
                name: 'test',
                attachTo: { id: 'ignored', input: 'ignored' },
                inputs: {
                  singleton: createV1ExtensionInput(
                    {
                      test: testDataRef,
                    },
                    { singleton: true },
                  ),
                },
                output: {},
                factory: () => ({}),
              }),
            ),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test', expected exactly one 'singleton' input but received multiple: 'app/test', 'app/test'",
        );
      });

      it('should refuse to create an instance with multiple inputs for optional singleton', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            attachments: new Map([
              [
                'singleton',
                [
                  makeInstanceWithId(simpleExtension, { output: 'many1' }),
                  makeInstanceWithId(simpleExtension, { output: 'many2' }),
                ],
              ],
            ]),
            node: makeNode(
              createV1Extension({
                namespace: 'app',
                name: 'test',
                attachTo: { id: 'ignored', input: 'ignored' },
                inputs: {
                  singleton: createV1ExtensionInput(
                    {
                      test: testDataRef,
                    },
                    { singleton: true, optional: true },
                  ),
                },
                output: {},
                factory: () => ({}),
              }),
            ),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test', expected at most one 'singleton' input but received multiple: 'app/test', 'app/test'",
        );
      });

      it('should refuse to create an instance with multiple inputs that did not provide required data', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            attachments: new Map([
              ['singleton', [makeInstanceWithId(simpleExtension, undefined)]],
            ]),
            node: makeNode(
              createV1Extension({
                namespace: 'app',
                name: 'test',
                attachTo: { id: 'ignored', input: 'ignored' },
                inputs: {
                  singleton: createV1ExtensionInput(
                    {
                      other: otherDataRef,
                    },
                    { singleton: true },
                  ),
                },
                output: {},
                factory: () => ({}),
              }),
            ),
          }),
        ).toThrowErrorMatchingInlineSnapshot(
          `"Failed to instantiate extension 'app/test', extension 'app/test' could not be attached because its output data ('test', 'other') does not match what the input 'singleton' requires ('other')"`,
        );
      });
    });
  });

  describe('v2', () => {
    const simpleExtension = resolveExtensionDefinition(
      createExtension({
        name: 'test',
        attachTo: { id: 'ignored', input: 'ignored' },
        output: [testDataRef, otherDataRef.optional()],
        config: {
          schema: {
            output: z => z.string().default('test'),
            other: z => z.number().optional(),
          },
        },
        factory({ config }) {
          return [
            testDataRef(config.output),
            ...(config.other ? [otherDataRef(config.other)] : []),
          ];
        },
      }),
      { namespace: 'app' },
    );

    function mirrorInputs(ctx: {
      inputs: {
        [name in string]:
          | undefined
          | ResolvedExtensionInput<
              ExtensionInput<any, { singleton: boolean; optional: boolean }>
            >
          | Array<
              ResolvedExtensionInput<
                ExtensionInput<any, { singleton: boolean; optional: boolean }>
              >
            >;
      };
    }) {
      return [
        inputMirrorDataRef(
          Object.fromEntries(
            Object.entries(ctx.inputs).map(([k, v]) => [
              k,
              Array.isArray(v)
                ? v.map(vi => ({
                    node: vi.node,
                    test: vi.get(testDataRef),
                    other: vi.get(otherDataRef),
                  }))
                : {
                    node: v?.node,
                    test: v?.get(testDataRef),
                    other: v?.get(otherDataRef),
                  },
            ]),
          ),
        ),
      ];
    }

    it('should instantiate a single node', () => {
      const tree = resolveAppTree('root-node', [
        makeSpec(simpleExtension, { id: 'root-node' }),
      ]);
      expect(tree.root.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).toBeDefined();
      expect(tree.root.instance?.getData(testDataRef)).toBe('test');

      // Multiple calls should have no effect
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).toBeDefined();
    });

    it('should not instantiate disabled nodes', () => {
      const tree = resolveAppTree('root-node', [
        makeSpec(simpleExtension, { id: 'root-node', disabled: true }),
      ]);
      expect(tree.root.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).not.toBeDefined();
    });

    it('should instantiate a node with attachments', () => {
      const tree = resolveAppTree('root-node', [
        makeSpec(
          resolveExtensionDefinition(
            createExtension({
              attachTo: { id: 'ignored', input: 'ignored' },
              inputs: {
                test: createExtensionInput([testDataRef]),
              },
              output: [inputMirrorDataRef],
              factory: mirrorInputs,
            }),
            { namespace: 'root-node' },
          ),
        ),
        makeSpec(simpleExtension, {
          id: 'child-node',
          attachTo: { id: 'root-node', input: 'test' },
        }),
      ]);

      const childNode = tree.nodes.get('child-node');
      expect(childNode).toBeDefined();

      expect(tree.root.instance).not.toBeDefined();
      expect(childNode?.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).toBeDefined();
      expect(childNode?.instance).toBeDefined();
      expect(tree.root.instance?.getData(inputMirrorDataRef)).toMatchObject({
        test: [{ node: { spec: { id: 'child-node' } }, test: 'test' }],
      });

      // Multiple calls should have no effect
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).toBeDefined();
      expect(childNode?.instance).toBeDefined();
    });

    it('should not instantiate disabled attachments', () => {
      const tree = resolveAppTree('root-node', [
        {
          ...makeSpec(
            resolveExtensionDefinition(
              createExtension({
                attachTo: { id: 'ignored', input: 'ignored' },
                inputs: {
                  test: createExtensionInput([testDataRef]),
                },
                output: [inputMirrorDataRef],
                factory: mirrorInputs,
              }),
              { namespace: 'root-node' },
            ),
          ),
        },
        {
          ...makeSpec(simpleExtension),
          id: 'child-node',
          // Using an invalid input should not be an error when disabled
          attachTo: { id: 'root-node', input: 'invalid' },
          disabled: true,
        },
      ]);

      const childNode = tree.nodes.get('child-node');
      expect(childNode).toBeDefined();

      expect(tree.root.instance).not.toBeDefined();
      expect(childNode?.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis);
      expect(tree.root.instance).toBeDefined();
      expect(childNode?.instance).not.toBeDefined();
      expect(tree.root.instance?.getData(inputMirrorDataRef)).toEqual({
        test: [],
      });
    });

    describe('createAppNodeInstance', () => {
      it('should create a simple extension instance', () => {
        const attachments = new Map();
        const instance = createAppNodeInstance({
          node: makeNode(simpleExtension),
          attachments,
          apis: testApis,
        });

        expect(Array.from(instance.getDataRefs())).toEqual([testDataRef]);
        expect(instance.getData(testDataRef)).toEqual('test');
      });

      it('should create an extension with different kind of inputs', () => {
        const attachments = new Map([
          [
            'optionalSingletonPresent',
            [
              makeInstanceWithId(simpleExtension, {
                output: 'optionalSingletonPresent',
              }),
            ],
          ],
          [
            'singleton',
            [
              makeInstanceWithId(simpleExtension, {
                output: 'singleton',
                other: 2,
              }),
            ],
          ],
          [
            'many',
            [
              makeInstanceWithId(simpleExtension, { output: 'many1' }),
              makeInstanceWithId(simpleExtension, {
                output: 'many2',
                other: 3,
              }),
            ],
          ],
        ]);

        const instance = createAppNodeInstance({
          attachments,
          apis: testApis,
          node: makeNode(
            resolveExtensionDefinition(
              createExtension({
                name: 'test',
                attachTo: { id: 'ignored', input: 'ignored' },
                inputs: {
                  optionalSingletonPresent: createExtensionInput(
                    [testDataRef, otherDataRef.optional()],
                    { singleton: true, optional: true },
                  ),
                  optionalSingletonMissing: createExtensionInput(
                    [testDataRef, otherDataRef.optional()],
                    { singleton: true, optional: true },
                  ),
                  singleton: createExtensionInput(
                    [testDataRef, otherDataRef.optional()],
                    { singleton: true },
                  ),
                  many: createExtensionInput([
                    testDataRef,
                    otherDataRef.optional(),
                  ]),
                },
                output: [inputMirrorDataRef],
                factory: mirrorInputs,
              }),
              { namespace: 'app' },
            ),
          ),
        });

        expect(Array.from(instance.getDataRefs())).toEqual([
          inputMirrorDataRef,
        ]);
        expect(instance.getData(inputMirrorDataRef)).toMatchObject({
          optionalSingletonPresent: {
            node: { spec: { id: 'app/test' } },
            test: 'optionalSingletonPresent',
          },
          singleton: {
            node: { spec: { id: 'app/test' } },
            test: 'singleton',
            other: 2,
          },
          many: [
            { node: { spec: { id: 'app/test' } }, test: 'many1' },
            {
              node: { spec: { id: 'app/test' } },
              test: 'many2',
              other: 3,
            },
          ],
        });
      });

      it('should create an extension passed through an extension factory middleware', () => {
        const attachments = new Map();
        const instance = createAppNodeInstance({
          node: makeNode(simpleExtension),
          attachments,
          apis: testApis,
          *extensionFactoryMiddleware(originalFactory) {
            const output = originalFactory({
              config: { output: 'modified' },
            });
            yield* output;
          },
        });

        expect(Array.from(instance.getDataRefs())).toEqual([testDataRef]);
        expect(instance.getData(testDataRef)).toEqual('modified');
      });

      it('should refuse to create an extension with invalid config', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            node: makeNode(simpleExtension, {
              config: { other: 'not-a-number' },
            }),
            attachments: new Map(),
          }),
        ).toThrow(
          "Invalid configuration for extension 'app/test'; caused by Error: Expected number, received string at 'other'",
        );
      });

      it('should forward extension factory errors', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            node: makeNode(
              resolveExtensionDefinition(
                createExtension({
                  name: 'test',
                  attachTo: { id: 'ignored', input: 'ignored' },
                  output: [testDataRef],
                  factory() {
                    const error = new Error('NOPE');
                    error.name = 'NopeError';
                    throw error;
                  },
                }),
                { namespace: 'app' },
              ),
            ),
            attachments: new Map(),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test'; caused by NopeError: NOPE",
        );
      });

      it('should refuse to create an instance with duplicate output', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            node: makeNode(
              resolveExtensionDefinition(
                createExtension({
                  name: 'test',
                  attachTo: { id: 'ignored', input: 'ignored' },
                  output: [testDataRef, testDataRef],
                  factory({}) {
                    return [testDataRef('test'), testDataRef('test2')];
                  },
                }),
                { namespace: 'app' },
              ),
            ),
            attachments: new Map(),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test', duplicate extension data output 'test'",
        );
      });

      it('should refuse to create an instance without required', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            node: makeNode(
              resolveExtensionDefinition(
                createExtension({
                  name: 'test',
                  attachTo: { id: 'ignored', input: 'ignored' },
                  output: [testDataRef],
                  factory({}) {
                    return [] as any;
                  },
                }),
                { namespace: 'app' },
              ),
            ),
            attachments: new Map(),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test', missing required extension data output 'test'",
        );
      });

      it('should refuse to create an instance with unknown output data', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            node: makeNode(
              resolveExtensionDefinition(
                // @ts-expect-error
                createExtension({
                  name: 'test',
                  attachTo: { id: 'ignored', input: 'ignored' },
                  output: [], // Output not declared
                  factory({}) {
                    return [testDataRef('test')] as any;
                  },
                }),
                { namespace: 'app' },
              ),
            ),
            attachments: new Map(),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test', unexpected output 'test'",
        );
      });

      it('should refuse to create an instance with missing required input', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            node: makeNode(
              resolveExtensionDefinition(
                createExtension({
                  name: 'test',
                  attachTo: { id: 'ignored', input: 'ignored' },
                  inputs: {
                    singleton: createExtensionInput([testDataRef], {
                      singleton: true,
                    }),
                  },
                  output: [],
                  factory: () => [],
                }),
                { namespace: 'app' },
              ),
            ),
            attachments: new Map(),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test', input 'singleton' is required but was not received",
        );
      });

      it('should warn when creating an instance with undeclared inputs', () => {
        const { warn } = withLogCollector(['warn'], () =>
          createAppNodeInstance({
            apis: testApis,
            attachments: new Map([
              [
                'declared',
                [
                  makeInstanceWithId(simpleExtension, {
                    output: 'many1',
                  }),
                ],
              ],
              [
                'undeclared',
                [
                  makeInstanceWithId(simpleExtension, {
                    output: 'many1',
                  }),
                ],
              ],
            ]),
            node: makeNode(
              resolveExtensionDefinition(
                createExtension({
                  name: 'parent',
                  attachTo: { id: 'ignored', input: 'ignored' },
                  inputs: {
                    declared: createExtensionInput([testDataRef]),
                  },
                  output: [],
                  factory: () => [],
                }),
                { namespace: 'app' },
              ),
            ),
          }),
        );

        expect(warn).toEqual([
          "The extension 'app/test' is attached to the input 'undeclared' of the extension 'app/parent', but it has no such input (candidates are 'declared')",
        ]);
      });

      it('should refuse to create an instance with multiple undeclared inputs', () => {
        const { warn } = withLogCollector(['warn'], () =>
          createAppNodeInstance({
            apis: testApis,
            attachments: new Map([
              [
                'undeclared1',
                [makeInstanceWithId(simpleExtension, { output: 'many1' })],
              ],
              [
                'undeclared2',
                [
                  makeInstanceWithId(simpleExtension, { output: 'many1' }),
                  makeInstanceWithId(simpleExtension, { output: 'many1' }),
                ],
              ],
            ]),
            node: makeNode(
              resolveExtensionDefinition(
                createExtension({
                  name: 'parent',
                  attachTo: { id: 'ignored', input: 'ignored' },
                  output: [],
                  factory: () => [],
                }),
                { namespace: 'app' },
              ),
            ),
          }),
        );

        expect(warn).toEqual([
          "The extension 'app/test' is attached to the input 'undeclared1' of the extension 'app/parent', but it has no inputs",
          "The extensions 'app/test', 'app/test' are attached to the input 'undeclared2' of the extension 'app/parent', but it has no inputs",
        ]);
      });

      it('should refuse to create an instance with multiple inputs for required singleton', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            attachments: new Map([
              [
                'singleton',
                [
                  makeInstanceWithId(simpleExtension, { output: 'many1' }),
                  makeInstanceWithId(simpleExtension, { output: 'many2' }),
                ],
              ],
            ]),
            node: makeNode(
              resolveExtensionDefinition(
                createExtension({
                  name: 'test',
                  attachTo: { id: 'ignored', input: 'ignored' },
                  inputs: {
                    singleton: createExtensionInput([testDataRef], {
                      singleton: true,
                    }),
                  },
                  output: [],
                  factory: () => [],
                }),
                { namespace: 'app' },
              ),
            ),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test', expected exactly one 'singleton' input but received multiple: 'app/test', 'app/test'",
        );
      });

      it('should refuse to create an instance with multiple inputs for optional singleton', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            attachments: new Map([
              [
                'singleton',
                [
                  makeInstanceWithId(simpleExtension, { output: 'many1' }),
                  makeInstanceWithId(simpleExtension, { output: 'many2' }),
                ],
              ],
            ]),
            node: makeNode(
              resolveExtensionDefinition(
                createExtension({
                  name: 'test',
                  attachTo: { id: 'ignored', input: 'ignored' },
                  inputs: {
                    singleton: createExtensionInput([testDataRef], {
                      singleton: true,
                      optional: true,
                    }),
                  },
                  output: [],
                  factory: () => [],
                }),
                { namespace: 'app' },
              ),
            ),
          }),
        ).toThrow(
          "Failed to instantiate extension 'app/test', expected at most one 'singleton' input but received multiple: 'app/test', 'app/test'",
        );
      });

      it('should refuse to create an instance with multiple inputs that did not provide required data', () => {
        expect(() =>
          createAppNodeInstance({
            apis: testApis,
            attachments: new Map([
              ['singleton', [makeInstanceWithId(simpleExtension, undefined)]],
            ]),
            node: makeNode(
              resolveExtensionDefinition(
                createExtension({
                  name: 'test',
                  attachTo: { id: 'ignored', input: 'ignored' },
                  inputs: {
                    singleton: createExtensionInput([otherDataRef], {
                      singleton: true,
                    }),
                  },
                  output: [],
                  factory: () => [],
                }),
                { namespace: 'app' },
              ),
            ),
          }),
        ).toThrowErrorMatchingInlineSnapshot(
          `"Failed to instantiate extension 'app/test', extension 'app/test' could not be attached because its output data ('test') does not match what the input 'singleton' requires ('other')"`,
        );
      });
    });
  });
});
