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
  Extension,
  createExtension,
  createExtensionDataRef,
  createExtensionInput,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
import {
  createAppNodeInstance,
  instantiateAppNodeTree,
} from './instantiateAppNodeTree';
import { AppNodeInstance, AppNodeSpec } from '@backstage/frontend-plugin-api';
import { resolveAppTree } from './resolveAppTree';

const testDataRef = createExtensionDataRef<string>('test');
const otherDataRef = createExtensionDataRef<number>('other');
const inputMirrorDataRef = createExtensionDataRef<unknown>('mirror');

const simpleExtension = createExtension({
  id: 'core.test',
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

function makeSpec<TConfig>(
  extension: Extension<TConfig>,
  config?: TConfig,
): AppNodeSpec {
  return {
    id: extension.id,
    attachTo: extension.attachTo,
    disabled: extension.disabled,
    extension,
    config,
    source: undefined,
  };
}

function makeInstanceWithId<TConfig>(
  extension: Extension<TConfig>,
  config?: TConfig,
): { id: string; instance: AppNodeInstance } {
  return {
    id: extension.id,
    instance: createAppNodeInstance({
      spec: makeSpec(extension, config),
      attachments: new Map(),
    }),
  };
}

describe('instantiateAppNodeTree', () => {
  it('should instantiate a single node', () => {
    const tree = resolveAppTree('root-node', [
      { ...makeSpec(simpleExtension), id: 'root-node' },
    ]);
    expect(tree.root.instance).not.toBeDefined();
    instantiateAppNodeTree(tree.root);
    expect(tree.root.instance).toBeDefined();
    expect(tree.root.instance?.getData(testDataRef)).toBe('test');

    // Multiple calls should have no effect
    instantiateAppNodeTree(tree.root);
    expect(tree.root.instance).toBeDefined();
  });

  it('should not instantiate disabled nodes', () => {
    const tree = resolveAppTree('root-node', [
      { ...makeSpec(simpleExtension), id: 'root-node', disabled: true },
    ]);
    expect(tree.root.instance).not.toBeDefined();
    instantiateAppNodeTree(tree.root);
    expect(tree.root.instance).not.toBeDefined();
  });

  it('should instantiate a node with attachments', () => {
    const tree = resolveAppTree('root-node', [
      {
        ...makeSpec(
          createExtension({
            id: 'root-node',
            attachTo: { id: 'ignored', input: 'ignored' },
            inputs: {
              test: createExtensionInput({ test: testDataRef }),
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
        attachTo: { id: 'root-node', input: 'test' },
      },
    ]);

    const childNode = tree.nodes.get('child-node');
    expect(childNode).toBeDefined();

    expect(tree.root.instance).not.toBeDefined();
    expect(childNode?.instance).not.toBeDefined();
    instantiateAppNodeTree(tree.root);
    expect(tree.root.instance).toBeDefined();
    expect(childNode?.instance).toBeDefined();
    expect(tree.root.instance?.getData(inputMirrorDataRef)).toEqual({
      test: [{ test: 'test' }],
    });

    // Multiple calls should have no effect
    instantiateAppNodeTree(tree.root);
    expect(tree.root.instance).toBeDefined();
    expect(childNode?.instance).toBeDefined();
  });

  it('should not instantiate disabled attachments', () => {
    const tree = resolveAppTree('root-node', [
      {
        ...makeSpec(
          createExtension({
            id: 'root-node',
            attachTo: { id: 'ignored', input: 'ignored' },
            inputs: {
              test: createExtensionInput({ test: testDataRef }),
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
    instantiateAppNodeTree(tree.root);
    expect(tree.root.instance).toBeDefined();
    expect(childNode?.instance).not.toBeDefined();
    expect(tree.root.instance?.getData(inputMirrorDataRef)).toEqual({
      test: [],
    });
  });
});

describe('createAppNodeInstance', () => {
  it('should create a simple extension instance', () => {
    const attachments = new Map();
    const instance = createAppNodeInstance({
      spec: makeSpec(simpleExtension),
      attachments,
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
          makeInstanceWithId(simpleExtension, { output: 'many2', other: 3 }),
        ],
      ],
    ]);
    const instance = createAppNodeInstance({
      attachments,
      spec: makeSpec(
        createExtension({
          id: 'core.test',
          attachTo: { id: 'ignored', input: 'ignored' },
          inputs: {
            optionalSingletonPresent: createExtensionInput(
              {
                test: testDataRef,
                other: otherDataRef.optional(),
              },
              { singleton: true, optional: true },
            ),
            optionalSingletonMissing: createExtensionInput(
              {
                test: testDataRef,
                other: otherDataRef.optional(),
              },
              { singleton: true, optional: true },
            ),
            singleton: createExtensionInput(
              {
                test: testDataRef,
                other: otherDataRef.optional(),
              },
              { singleton: true },
            ),
            many: createExtensionInput({
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

    expect(Array.from(instance.getDataRefs())).toEqual([inputMirrorDataRef]);
    expect(instance.getData(inputMirrorDataRef)).toEqual({
      optionalSingletonPresent: { test: 'optionalSingletonPresent' },
      singleton: { test: 'singleton', other: 2 },
      many: [{ test: 'many1' }, { test: 'many2', other: 3 }],
    });
  });

  it('should refuse to create an extension with invalid config', () => {
    expect(() =>
      createAppNodeInstance({
        spec: {
          ...makeSpec(simpleExtension),
          config: { other: 'not-a-number' },
        },
        attachments: new Map(),
      }),
    ).toThrow(
      "Invalid configuration for extension 'core.test'; caused by Error: Expected number, received string at 'other'",
    );
  });

  it('should forward extension factory errors', () => {
    expect(() =>
      createAppNodeInstance({
        spec: makeSpec(
          createExtension({
            id: 'core.test',
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
      "Failed to instantiate extension 'core.test'; caused by NopeError: NOPE",
    );
  });

  it('should refuse to create an instance with duplicate output', () => {
    expect(() =>
      createAppNodeInstance({
        spec: makeSpec(
          createExtension({
            id: 'core.test',
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
      "Failed to instantiate extension 'core.test', duplicate extension data 'test' received via output 'test2'",
    );
  });

  it('should refuse to create an instance with disconnected output data', () => {
    expect(() =>
      createAppNodeInstance({
        spec: makeSpec(
          createExtension({
            id: 'core.test',
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
      "Failed to instantiate extension 'core.test', unknown output provided via 'nonexistent'",
    );
  });

  it('should refuse to create an instance with missing required input', () => {
    expect(() =>
      createAppNodeInstance({
        spec: makeSpec(
          createExtension({
            id: 'core.test',
            attachTo: { id: 'ignored', input: 'ignored' },
            inputs: {
              singleton: createExtensionInput(
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
      "Failed to instantiate extension 'core.test', input 'singleton' is required but was not received",
    );
  });

  it('should refuse to create an instance with undeclared inputs', () => {
    expect(() =>
      createAppNodeInstance({
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
        spec: makeSpec(
          createExtension({
            id: 'core.test',
            attachTo: { id: 'ignored', input: 'ignored' },
            inputs: {
              declared: createExtensionInput({
                test: testDataRef,
              }),
            },
            output: {},
            factory: () => ({}),
          }),
        ),
      }),
    ).toThrow(
      "Failed to instantiate extension 'core.test', received undeclared input 'undeclared' from extension 'core.test'",
    );
  });

  it('should refuse to create an instance with multiple undeclared inputs', () => {
    expect(() =>
      createAppNodeInstance({
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
        spec: makeSpec(
          createExtension({
            id: 'core.test',
            attachTo: { id: 'ignored', input: 'ignored' },
            output: {},
            factory: () => ({}),
          }),
        ),
      }),
    ).toThrow(
      "Failed to instantiate extension 'core.test', received undeclared inputs 'undeclared1' from extension 'core.test' and 'undeclared2' from extensions 'core.test', 'core.test'",
    );
  });

  it('should refuse to create an instance with multiple inputs for required singleton', () => {
    expect(() =>
      createAppNodeInstance({
        attachments: new Map([
          [
            'singleton',
            [
              makeInstanceWithId(simpleExtension, { output: 'many1' }),
              makeInstanceWithId(simpleExtension, { output: 'many2' }),
            ],
          ],
        ]),
        spec: makeSpec(
          createExtension({
            id: 'core.test',
            attachTo: { id: 'ignored', input: 'ignored' },
            inputs: {
              singleton: createExtensionInput(
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
      "Failed to instantiate extension 'core.test', expected exactly one 'singleton' input but received multiple: 'core.test', 'core.test'",
    );
  });

  it('should refuse to create an instance with multiple inputs for optional singleton', () => {
    expect(() =>
      createAppNodeInstance({
        attachments: new Map([
          [
            'singleton',
            [
              makeInstanceWithId(simpleExtension, { output: 'many1' }),
              makeInstanceWithId(simpleExtension, { output: 'many2' }),
            ],
          ],
        ]),
        spec: makeSpec(
          createExtension({
            id: 'core.test',
            attachTo: { id: 'ignored', input: 'ignored' },
            inputs: {
              singleton: createExtensionInput(
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
      "Failed to instantiate extension 'core.test', expected at most one 'singleton' input but received multiple: 'core.test', 'core.test'",
    );
  });

  it('should refuse to create an instance with multiple inputs that did not provide required data', () => {
    expect(() =>
      createAppNodeInstance({
        attachments: new Map([
          ['singleton', [makeInstanceWithId(simpleExtension, undefined)]],
        ]),
        spec: makeSpec(
          createExtension({
            id: 'core.test',
            attachTo: { id: 'ignored', input: 'ignored' },
            inputs: {
              singleton: createExtensionInput(
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
    ).toThrow(
      "Failed to instantiate extension 'core.test', input 'singleton' did not receive required extension data 'other' from extension 'core.test'",
    );
  });
});
