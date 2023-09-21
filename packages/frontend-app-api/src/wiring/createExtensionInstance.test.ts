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
  createExtension,
  createExtensionDataRef,
  createExtensionInput,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
import { createExtensionInstance } from './createExtensionInstance';

const testDataRef = createExtensionDataRef<string>('test');
const otherDataRef = createExtensionDataRef<number>('other');
const inputMirrorDataRef = createExtensionDataRef<unknown>('mirror');

const simpleExtension = createExtension({
  id: 'core.test',
  at: 'ignored',
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
  factory({ bind, config }) {
    bind({ test: config.output, other: config.other });
  },
});

describe('createExtensionInstance', () => {
  it('should create a simple extension instance', () => {
    const attachments = new Map();
    const instance = createExtensionInstance({
      attachments,
      config: undefined,
      extension: simpleExtension,
    });

    expect(instance.id).toBe('core.test');
    expect(instance.attachments).toBe(attachments);
    expect(instance.getData(testDataRef)).toEqual('test');
  });

  it('should create an extension with different kind of inputs', () => {
    const attachments = new Map([
      [
        'optionalSingletonPresent',
        [
          createExtensionInstance({
            attachments: new Map(),
            config: { output: 'optionalSingletonPresent' },
            extension: simpleExtension,
          }),
        ],
      ],
      [
        'singleton',
        [
          createExtensionInstance({
            attachments: new Map(),
            config: { output: 'singleton', other: 2 },
            extension: simpleExtension,
          }),
        ],
      ],
      [
        'many',
        [
          createExtensionInstance({
            attachments: new Map(),
            config: { output: 'many1' },
            extension: simpleExtension,
          }),
          createExtensionInstance({
            attachments: new Map(),
            config: { output: 'many2', other: 3 },
            extension: simpleExtension,
          }),
        ],
      ],
    ]);
    const instance = createExtensionInstance({
      attachments,
      config: undefined,
      extension: createExtension({
        id: 'core.test',
        at: 'ignored',
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
        factory({ bind, inputs }) {
          bind({ inputMirror: inputs });
        },
      }),
    });

    expect(instance.id).toBe('core.test');
    expect(instance.attachments).toBe(attachments);
    expect(instance.getData(inputMirrorDataRef)).toEqual({
      optionalSingletonPresent: { test: 'optionalSingletonPresent' },
      singleton: { test: 'singleton', other: 2 },
      many: [{ test: 'many1' }, { test: 'many2', other: 3 }],
    });
  });

  it('should refuse to create an extension with invalid config', () => {
    expect(() =>
      createExtensionInstance({
        attachments: new Map(),
        config: { other: 'not-a-number' },
        extension: simpleExtension,
      }),
    ).toThrow(
      "Invalid configuration for extension 'core.test'; caused by Error: Expected number, received string at 'other'",
    );
  });

  it('should forward extension factory errors', () => {
    expect(() =>
      createExtensionInstance({
        attachments: new Map(),
        config: { other: 'not-a-number' },
        extension: createExtension({
          id: 'core.test',
          at: 'ignored',
          output: {},
          factory() {
            const error = new Error('NOPE');
            error.name = 'NopeError';
            throw error;
          },
        }),
      }),
    ).toThrow(
      "Failed to instantiate extension 'core.test'; caused by NopeError: NOPE",
    );
  });

  it('should refuse to create an instance with duplicate output', () => {
    const attachments = new Map();
    expect(() =>
      createExtensionInstance({
        attachments,
        config: undefined,
        extension: createExtension({
          id: 'core.test',
          at: 'ignored',
          output: {
            test1: testDataRef,
            test2: testDataRef,
          },
          factory({ bind }) {
            bind({ test1: 'test', test2: 'test2' });
          },
        }),
      }),
    ).toThrow(
      "Failed to instantiate extension 'core.test', duplicate extension data 'test' received via output 'test2'",
    );
  });

  it('should refuse to create an instance with disconnected output data', () => {
    const attachments = new Map();
    expect(() =>
      createExtensionInstance({
        attachments,
        config: undefined,
        extension: createExtension({
          id: 'core.test',
          at: 'ignored',
          output: {
            test: testDataRef,
          },
          factory({ bind }) {
            bind({ nonexistent: 'test' } as any);
          },
        }),
      }),
    ).toThrow(
      "Failed to instantiate extension 'core.test', unknown output provided via 'nonexistent'",
    );
  });

  it('should refuse to create an instance with missing required input', () => {
    expect(() =>
      createExtensionInstance({
        attachments: new Map(),
        config: undefined,
        extension: createExtension({
          id: 'core.test',
          at: 'ignored',
          inputs: {
            singleton: createExtensionInput(
              {
                test: testDataRef,
              },
              { singleton: true },
            ),
          },
          output: {},
          factory() {},
        }),
      }),
    ).toThrow(
      "Failed to instantiate extension 'core.test', input 'singleton' is required but was not received",
    );
  });

  it('should refuse to create an instance with multiple inputs for required singleton', () => {
    expect(() =>
      createExtensionInstance({
        attachments: new Map([
          [
            'singleton',
            [
              createExtensionInstance({
                attachments: new Map(),
                config: { output: 'many1' },
                extension: simpleExtension,
              }),
              createExtensionInstance({
                attachments: new Map(),
                config: { output: 'many2' },
                extension: simpleExtension,
              }),
            ],
          ],
        ]),
        config: undefined,
        extension: createExtension({
          id: 'core.test',
          at: 'ignored',
          inputs: {
            singleton: createExtensionInput(
              {
                test: testDataRef,
              },
              { singleton: true },
            ),
          },
          output: {},
          factory() {},
        }),
      }),
    ).toThrow(
      "Failed to instantiate extension 'core.test', expected exactly one 'singleton' input but received multiple: 'core.test', 'core.test'",
    );
  });

  it('should refuse to create an instance with multiple inputs for optional singleton', () => {
    expect(() =>
      createExtensionInstance({
        attachments: new Map([
          [
            'singleton',
            [
              createExtensionInstance({
                attachments: new Map(),
                config: { output: 'many1' },
                extension: simpleExtension,
              }),
              createExtensionInstance({
                attachments: new Map(),
                config: { output: 'many2' },
                extension: simpleExtension,
              }),
            ],
          ],
        ]),
        config: undefined,
        extension: createExtension({
          id: 'core.test',
          at: 'ignored',
          inputs: {
            singleton: createExtensionInput(
              {
                test: testDataRef,
              },
              { singleton: true, optional: true },
            ),
          },
          output: {},
          factory() {},
        }),
      }),
    ).toThrow(
      "Failed to instantiate extension 'core.test', expected at most one 'singleton' input but received multiple: 'core.test', 'core.test'",
    );
  });

  it('should refuse to create an instance with multiple inputs that did not provide required data', () => {
    expect(() =>
      createExtensionInstance({
        attachments: new Map([
          [
            'singleton',
            [
              createExtensionInstance({
                attachments: new Map(),
                config: undefined,
                extension: simpleExtension,
              }),
            ],
          ],
        ]),
        config: undefined,
        extension: createExtension({
          id: 'core.test',
          at: 'ignored',
          inputs: {
            singleton: createExtensionInput(
              {
                other: otherDataRef,
              },
              { singleton: true },
            ),
          },
          output: {},
          factory() {},
        }),
      }),
    ).toThrow(
      "Failed to instantiate extension 'core.test', input 'singleton' did not receive required extension data 'other' from extension 'core.test'",
    );
  });
});
