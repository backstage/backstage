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
  AppNode,
  Extension,
  ExtensionDataRef,
  ExtensionDefinition,
  ExtensionFactoryMiddleware,
  ExtensionInput,
  PortableSchema,
  ResolvedExtensionInput,
  createExtension,
  createExtensionBlueprint,
  createExtensionDataRef,
  createExtensionInput,
  createFrontendPlugin,
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
import { createErrorCollector } from '../wiring/createErrorCollector';

const testApis = TestApiRegistry.from();
const testDataRef = createExtensionDataRef<string>().with({ id: 'test' });
const otherDataRef = createExtensionDataRef<number>().with({ id: 'other' });
const inputMirrorDataRef = createExtensionDataRef<unknown>().with({
  id: 'mirror',
});

const collector = createErrorCollector();

afterEach(() => {
  const errors = collector.collectErrors();
  if (errors) {
    throw new Error(
      `Unexpected errors: ${errors.map(e => e.message).join(', ')}`,
    );
  }
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
    plugin: createFrontendPlugin({ pluginId: 'app' }),
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
      collector,
    }),
  };
}

function createV1ExtensionInput(
  extensionData: Record<string, ExtensionDataRef>,
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
  output: Record<string, ExtensionDataRef>;
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

function mirrorInputs(ctx: {
  inputs: {
    [name in string]:
      | undefined
      | ResolvedExtensionInput<ExtensionInput>
      | Array<ResolvedExtensionInput<ExtensionInput>>;
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
      const tree = resolveAppTree(
        'root-node',
        [makeSpec(simpleExtension, { id: 'root-node' })],
        collector,
      );
      expect(tree.root.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis, collector);
      expect(tree.root.instance).toBeDefined();
      expect(tree.root.instance?.getData(testDataRef)).toBe('test');

      // Multiple calls should have no effect
      instantiateAppNodeTree(tree.root, testApis, collector);
      expect(tree.root.instance).toBeDefined();
    });

    it('should not instantiate disabled nodes', () => {
      const tree = resolveAppTree(
        'root-node',
        [makeSpec(simpleExtension, { id: 'root-node', disabled: true })],
        collector,
      );
      expect(tree.root.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis, collector);
      expect(tree.root.instance).not.toBeDefined();
    });

    it('should instantiate a node with attachments', () => {
      const tree = resolveAppTree(
        'root-node',
        [
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
        ],
        collector,
      );

      const childNode = tree.nodes.get('child-node');
      expect(childNode).toBeDefined();

      expect(tree.root.instance).not.toBeDefined();
      expect(childNode?.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis, collector);
      expect(tree.root.instance).toBeDefined();
      expect(childNode?.instance).toBeDefined();
      expect(tree.root.instance?.getData(inputMirrorDataRef)).toMatchObject({
        test: [
          { node: { spec: { id: 'child-node' } }, output: { test: 'test' } },
        ],
      });

      // Multiple calls should have no effect
      instantiateAppNodeTree(tree.root, testApis, collector);
      expect(tree.root.instance).toBeDefined();
      expect(childNode?.instance).toBeDefined();
    });

    it('should ignore non-matching plugin attachments for internal inputs', () => {
      const otherPlugin = createFrontendPlugin({ pluginId: 'other' });
      const tree = resolveAppTree(
        'root-node',
        [
          makeSpec(
            resolveExtensionDefinition(
              createExtension({
                attachTo: { id: 'ignored', input: 'ignored' },
                inputs: {
                  test: createExtensionInput([testDataRef], {
                    singleton: true,
                    internal: true,
                  }),
                },
                output: [inputMirrorDataRef],
                factory: mirrorInputs,
              }),
              { namespace: 'root-node' },
            ),
          ),
          makeSpec(simpleExtension, {
            id: 'child-node-app',
            attachTo: { id: 'root-node', input: 'test' },
          }),
          makeSpec(simpleExtension, {
            id: 'child-node-other',
            attachTo: { id: 'root-node', input: 'test' },
            plugin: otherPlugin,
          }),
        ],
        collector,
      );

      instantiateAppNodeTree(tree.root, testApis, collector);

      expect(tree.root.instance?.getData(inputMirrorDataRef)).toMatchObject({
        test: { node: { spec: { id: 'child-node-app' } }, test: 'test' },
      });
      expect(collector.collectErrors()).toEqual([
        {
          code: 'EXTENSION_INPUT_INTERNAL_IGNORED',
          message:
            "extension 'child-node-other' from plugin 'other' attached to input 'test' on 'root-node' was ignored, the input is marked as internal and attached extensions must therefore be provided via an override or a module for the 'app' plugin, not the 'other' plugin",
          context: {
            node: tree.root,
            inputName: 'test',
            extensionId: 'child-node-other',
            plugin: otherPlugin,
          },
        },
      ]);
    });

    it('should not instantiate disabled attachments', () => {
      const tree = resolveAppTree(
        'root-node',
        [
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
        ],
        collector,
      );

      const childNode = tree.nodes.get('child-node');
      expect(childNode).toBeDefined();

      expect(tree.root.instance).not.toBeDefined();
      expect(childNode?.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis, collector);
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
          collector,
        });

        expect(Array.from(instance?.getDataRefs() ?? [])).toEqual([
          testDataRef,
          otherDataRef.optional(),
        ]);
        expect(instance?.getData(testDataRef)).toEqual('test');
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
          collector,
        });

        expect(Array.from(instance?.getDataRefs() ?? [])).toEqual([
          inputMirrorDataRef,
        ]);
        expect(instance?.getData(inputMirrorDataRef)).toMatchObject({
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
        const node = makeNode(simpleExtension, {
          config: { other: 'not-a-number' },
        });
        expect(
          createAppNodeInstance({
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_CONFIGURATION_INVALID',
            message:
              "Invalid configuration for extension 'app/test'; caused by Error: Expected number, received string at 'other'",
            context: { node },
          },
        ]);
      });

      it('should forward extension factory errors', () => {
        const node = makeNode(
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
        );
        expect(
          createAppNodeInstance({
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'app/test'; caused by NopeError: NOPE",
            context: { node },
          },
        ]);
      });

      it('should refuse to create an instance with duplicate output', () => {
        const node = makeNode(
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
        );
        expect(
          createAppNodeInstance({
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'app/test', duplicate extension data 'test' received via output 'test2'",
            context: { node },
          },
        ]);
      });

      it('should refuse to create an instance with disconnected output data', () => {
        const node = makeNode(
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
        );
        expect(
          createAppNodeInstance({
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'app/test', unknown output provided via 'nonexistent'",
            context: { node },
          },
        ]);
      });

      it('should refuse to create an instance with missing required input', () => {
        const node = makeNode(
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
        );
        expect(
          createAppNodeInstance({
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'app/test', input 'singleton' is required but was not received",
            context: { node },
          },
        ]);
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
            collector,
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
            collector,
          }),
        );

        expect(warn).toEqual([
          "The extension 'app/test' is attached to the input 'undeclared1' of the extension 'app/parent', but it has no inputs",
          "The extensions 'app/test', 'app/test' are attached to the input 'undeclared2' of the extension 'app/parent', but it has no inputs",
        ]);
      });

      it('should refuse to create an instance with multiple inputs for required singleton', () => {
        const node = makeNode(
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
        );
        expect(
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
            node,
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'app/test', expected exactly one 'singleton' input but received multiple: 'app/test', 'app/test'",
            context: { node },
          },
        ]);
      });

      it('should refuse to create an instance with multiple inputs for optional singleton', () => {
        const node = makeNode(
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
        );
        expect(
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
            node,
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'app/test', expected at most one 'singleton' input but received multiple: 'app/test', 'app/test'",
            context: { node },
          },
        ]);
      });

      it('should refuse to create an instance with multiple inputs that did not provide required data', () => {
        const node = makeNode(
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
        );
        expect(
          createAppNodeInstance({
            apis: testApis,
            attachments: new Map([
              ['singleton', [makeInstanceWithId(simpleExtension, undefined)]],
            ]),
            node,
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'app/test', extension 'app/test' could not be attached because its output data ('test', 'other') does not match what the input 'singleton' requires ('other')",
            context: { node },
          },
        ]);
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

    it('should instantiate a single node', () => {
      const tree = resolveAppTree(
        'root-node',
        [makeSpec(simpleExtension, { id: 'root-node' })],
        collector,
      );
      expect(tree.root.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis, collector);
      expect(tree.root.instance).toBeDefined();
      expect(tree.root.instance?.getData(testDataRef)).toBe('test');

      // Multiple calls should have no effect
      instantiateAppNodeTree(tree.root, testApis, collector);
      expect(tree.root.instance).toBeDefined();
    });

    it('should not instantiate disabled nodes', () => {
      const tree = resolveAppTree(
        'root-node',
        [makeSpec(simpleExtension, { id: 'root-node', disabled: true })],
        collector,
      );
      expect(tree.root.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis, collector);
      expect(tree.root.instance).not.toBeDefined();
    });

    it('should instantiate a node with attachments', () => {
      const tree = resolveAppTree(
        'root-node',
        [
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
        ],
        collector,
      );

      const childNode = tree.nodes.get('child-node');
      expect(childNode).toBeDefined();

      expect(tree.root.instance).not.toBeDefined();
      expect(childNode?.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis, collector);
      expect(tree.root.instance).toBeDefined();
      expect(childNode?.instance).toBeDefined();
      expect(tree.root.instance?.getData(inputMirrorDataRef)).toMatchObject({
        test: [{ node: { spec: { id: 'child-node' } }, test: 'test' }],
      });

      // Multiple calls should have no effect
      instantiateAppNodeTree(tree.root, testApis, collector);
      expect(tree.root.instance).toBeDefined();
      expect(childNode?.instance).toBeDefined();
    });

    it('should not instantiate disabled attachments', () => {
      const tree = resolveAppTree(
        'root-node',
        [
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
        ],
        collector,
      );

      const childNode = tree.nodes.get('child-node');
      expect(childNode).toBeDefined();

      expect(tree.root.instance).not.toBeDefined();
      expect(childNode?.instance).not.toBeDefined();
      instantiateAppNodeTree(tree.root, testApis, collector);
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
          collector,
        });

        expect(Array.from(instance?.getDataRefs() ?? [])).toEqual([
          testDataRef,
        ]);
        expect(instance?.getData(testDataRef)).toEqual('test');
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
          collector,
        });

        expect(Array.from(instance?.getDataRefs() ?? [])).toEqual([
          inputMirrorDataRef,
        ]);
        expect(instance?.getData(inputMirrorDataRef)).toMatchObject({
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
          collector,
        });

        expect(Array.from(instance?.getDataRefs() ?? [])).toEqual([
          testDataRef,
        ]);
        expect(instance?.getData(testDataRef)).toEqual('modified');
      });

      it('should refuse to create an extension with invalid config', () => {
        const node = makeNode(simpleExtension, {
          config: { other: 'not-a-number' },
        });
        expect(
          createAppNodeInstance({
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_CONFIGURATION_INVALID',
            message:
              "Invalid configuration for extension 'app/test'; caused by Error: Expected number, received string at 'other'",
            context: { node },
          },
        ]);
      });

      it('should throw if extension factories do not provide an iterable object', () => {
        function createInstance(
          extension: ExtensionDefinition,
          middleware?: ExtensionFactoryMiddleware,
        ) {
          const node = makeNode(
            resolveExtensionDefinition(extension, { namespace: 'test' }),
          );
          createAppNodeInstance({
            extensionFactoryMiddleware: middleware,
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          });
          const errors = collector.collectErrors();
          for (const error of errors ?? []) {
            expect('node' in error.context && error.context.node).toBe(node);
          }
          return errors;
        }

        const baseOpts = {
          attachTo: { id: 'ignored', input: 'ignored' },
          output: [testDataRef],
        };

        const badFactory = () => 'not-iterable' as any;
        const goodFactory = () => [testDataRef('test')];

        expect(
          createInstance(
            createExtension({
              attachTo: { id: 'ignored', input: 'ignored' },
              output: [testDataRef],
              factory: badFactory,
            }),
          ),
        ).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'test', extension factory did not provide an iterable object",
            context: { node: expect.anything() },
          },
        ]);

        expect(
          createInstance(
            createExtension({
              ...baseOpts,
              factory: goodFactory,
            }).override({
              factory: badFactory,
            }),
          ),
        ).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'test', extension factory override did not provide an iterable object",
            context: { node: expect.anything() },
          },
        ]);

        // Bad middleware
        expect(
          createInstance(
            createExtension({
              ...baseOpts,
              factory: goodFactory,
            }),
            () => 'not-iterable' as any,
          ),
        ).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'test', extension factory middleware did not provide an iterable object",
            context: { node: expect.anything() },
          },
        ]);

        expect(
          createInstance(
            createExtensionBlueprint({
              kind: 'test',
              ...baseOpts,
              factory: badFactory,
            }).make({ params: {} }),
          ),
        ).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'test:test', extension factory did not provide an iterable object",
            context: { node: expect.anything() },
          },
        ]);

        // Using makeWithOverrides
        expect(
          createInstance(
            createExtensionBlueprint({
              kind: 'test',
              ...baseOpts,
              factory: goodFactory,
            }).makeWithOverrides({
              factory: badFactory,
            }),
          ),
        ).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'test:test', extension factory did not provide an iterable object",
            context: { node: expect.anything() },
          },
        ]);

        // Using makeWithOverrides and factory middleware
        expect(
          createInstance(
            createExtensionBlueprint({
              kind: 'test',
              ...baseOpts,
              factory: goodFactory,
            }).makeWithOverrides({
              factory: badFactory,
            }),
            orig => orig(),
          ),
        ).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'test:test', extension factory did not provide an iterable object",
            context: { node: expect.anything() },
          },
        ]);

        // Using makeWithOverrides and factory middleware
        expect(
          createInstance(
            createExtensionBlueprint({
              kind: 'test',
              ...baseOpts,
              factory: badFactory,
            }).makeWithOverrides({
              factory: orig => orig({ params: {} }),
            }),
            orig => orig(),
          ),
        ).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'test:test', original blueprint factory did not provide an iterable object",
            context: { node: expect.anything() },
          },
        ]);
      });

      it('should forward extension factory errors', () => {
        const node = makeNode(
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
        );
        expect(
          createAppNodeInstance({
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_FACTORY_ERROR',
            message:
              "Failed to instantiate extension 'app/test'; caused by NopeError: NOPE",
            context: { node },
          },
        ]);
      });

      it('should refuse to create an instance with duplicate output', () => {
        const node = makeNode(
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
        );
        expect(
          createAppNodeInstance({
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_OUTPUT_CONFLICT',
            message: "extension factory output duplicate data 'test'",
            context: { dataRefId: 'test', node },
          },
        ]);
      });

      it('should refuse to create an instance without required', () => {
        const node = makeNode(
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
        );

        expect(
          createAppNodeInstance({
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_OUTPUT_MISSING',
            message: "missing required extension data output 'test'",
            context: {
              dataRefId: 'test',
              node,
            },
          },
        ]);
      });

      it('should refuse to create an instance with unknown output data', () => {
        const node = makeNode(
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
        );
        expect(
          createAppNodeInstance({
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          }),
        ).toBeDefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_OUTPUT_IGNORED',
            message: "unexpected output 'test'",
            context: { dataRefId: 'test', node },
          },
        ]);
      });

      it('should refuse to create an instance with missing required input', () => {
        const node = makeNode(
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
        );
        expect(
          createAppNodeInstance({
            apis: testApis,
            node,
            attachments: new Map(),
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_ATTACHMENT_MISSING',
            message: "input 'singleton' is required but was not received",
            context: { inputName: 'singleton', node },
          },
        ]);
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
            collector,
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
            collector,
          }),
        );

        expect(warn).toEqual([
          "The extension 'app/test' is attached to the input 'undeclared1' of the extension 'app/parent', but it has no inputs",
          "The extensions 'app/test', 'app/test' are attached to the input 'undeclared2' of the extension 'app/parent', but it has no inputs",
        ]);
      });

      it('should refuse to create an instance with multiple inputs for required singleton', () => {
        const node = makeNode(
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
        );
        expect(
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
            node,
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_ATTACHMENT_CONFLICT',
            message:
              "expected exactly one 'singleton' input but received multiple: 'app/test', 'app/test'",
            context: { inputName: 'singleton', node },
          },
        ]);
      });

      it('should refuse to create an instance with multiple inputs for optional singleton', () => {
        const node = makeNode(
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
        );
        expect(
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
            node,
            collector,
          }),
        ).toBeUndefined();
        expect(collector.collectErrors()).toEqual([
          {
            code: 'EXTENSION_ATTACHMENT_CONFLICT',
            message:
              "expected at most one 'singleton' input but received multiple: 'app/test', 'app/test'",
            context: { inputName: 'singleton', node },
          },
        ]);
      });

      describe('with attachment failures', () => {
        const inputCountRef = createExtensionDataRef<number>().with({
          id: 'input-count',
        });

        const attachmentWithoutRequiredData = makeInstanceWithId(
          simpleExtension,
          undefined,
        );

        it('should proceed if input is optional', () => {
          const node = makeNode(
            resolveExtensionDefinition(
              createExtension({
                name: 'test',
                attachTo: { id: 'ignored', input: 'ignored' },
                inputs: {
                  singleton: createExtensionInput([otherDataRef], {
                    singleton: true,
                    optional: true,
                  }),
                },
                output: [inputCountRef],
                factory: ({ inputs }) => [
                  inputCountRef(inputs.singleton ? 1 : 0),
                ],
              }),
              { namespace: 'app' },
            ),
          );
          expect(
            createAppNodeInstance({
              apis: testApis,
              attachments: new Map([
                ['singleton', [attachmentWithoutRequiredData]],
              ]),
              node,
              collector,
            })?.getData(inputCountRef),
          ).toBe(0);

          expect(collector.collectErrors()).toEqual([
            {
              code: 'EXTENSION_INPUT_DATA_MISSING',
              message:
                "extension 'app/test' could not be attached because its output data ('test') does not match what the input 'singleton' requires ('other')",
              context: {
                node: attachmentWithoutRequiredData,
                inputName: 'singleton',
              },
            },
          ]);
        });

        it('should fail if input is required', () => {
          const node = makeNode(
            resolveExtensionDefinition(
              createExtension({
                name: 'test',
                attachTo: { id: 'ignored', input: 'ignored' },
                inputs: {
                  singleton: createExtensionInput([otherDataRef], {
                    singleton: true,
                  }),
                },
                output: [inputCountRef],
                factory: ({ inputs }) => [
                  inputCountRef(inputs.singleton ? 1 : 0),
                ],
              }),
              { namespace: 'app' },
            ),
          );

          expect(
            createAppNodeInstance({
              apis: testApis,
              attachments: new Map([
                ['singleton', [attachmentWithoutRequiredData]],
              ]),
              node,
              collector,
            })?.getData(inputCountRef),
          ).toBeUndefined();

          expect(collector.collectErrors()).toEqual([
            {
              code: 'EXTENSION_ATTACHMENT_MISSING',
              message:
                "input 'singleton' is required but it failed to be instantiated",
              context: { inputName: 'singleton', node },
            },
            {
              code: 'EXTENSION_INPUT_DATA_MISSING',
              message:
                "extension 'app/test' could not be attached because its output data ('test') does not match what the input 'singleton' requires ('other')",
              context: {
                node: attachmentWithoutRequiredData,
                inputName: 'singleton',
              },
            },
          ]);
        });

        it('should filter out failed attachments for non-singleton inputs', () => {
          const node = makeNode(
            resolveExtensionDefinition(
              createExtension({
                name: 'test',
                attachTo: { id: 'ignored', input: 'ignored' },
                inputs: {
                  children: createExtensionInput([otherDataRef]),
                },
                output: [inputCountRef],
                factory: ({ inputs }) => [
                  inputCountRef(inputs.children.length),
                ],
              }),
              { namespace: 'app' },
            ),
          );
          expect(
            createAppNodeInstance({
              apis: testApis,
              attachments: new Map([
                [
                  'children',
                  [
                    attachmentWithoutRequiredData,
                    makeInstanceWithId(simpleExtension, {
                      other: 42,
                    }),
                  ],
                ],
              ]),
              node,
              collector,
            })?.getData(inputCountRef),
          ).toBe(1);

          expect(collector.collectErrors()).toEqual([
            {
              code: 'EXTENSION_INPUT_DATA_MISSING',
              message:
                "extension 'app/test' could not be attached because its output data ('test') does not match what the input 'children' requires ('other')",
              context: {
                node: attachmentWithoutRequiredData,
                inputName: 'children',
              },
            },
          ]);
        });
      });
    });
  });
});
