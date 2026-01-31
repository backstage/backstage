/*
 * Copyright 2025 The Backstage Authors
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
  ExtensionDataContainer,
  ExtensionDataRef,
  ExtensionDefinition,
  ExtensionDefinitionParameters,
} from '@backstage/frontend-plugin-api';
import { AnyApiRef } from '@backstage/core-plugin-api';
import { JsonValue } from '@backstage/types';
import { TestApiRegistry } from '@backstage/test-utils';
import { OpaqueExtensionDefinition } from '@internal/frontend';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtension } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';

/**
 * Options for {@link shallowExtensionInstance}.
 * @public
 */
export interface ShallowExtensionInstanceOptions<T extends ExtensionDefinitionParameters> {
  /** Configuration for the extension. */
  config?: T['configInput'];
  /**
   * Mock input data, keyed by extension data ref ID.
   * This allows testing extensions without wiring real extensions as inputs.
   *
   * @example
   * ```ts
   * const instance = shallowExtensionInstance(MyPageExtension, {
   *   inputs: {
   *     [coreExtensionData.routePath.id]: '/parent',
   *   },
   * });
   * ```
   */
  inputs?: { [dataRefId: string]: unknown };
  /**
   * API implementations to use during testing.
   */
  apis?: Array<readonly [AnyApiRef<unknown>, Partial<unknown>]>;
}

/**
 * Executes an extension factory in isolation without creating a full app.
 * This is faster than `createExtensionTester` for unit testing extension outputs.
 *
 * @remarks
 * Use this when you want to test that an extension produces the correct outputs
 * given inputs/config, without needing to render or integrate with other extensions.
 * For integration testing, use `createExtensionTester` instead.
 *
 * Only v2 extensions (created with `createExtension`) are supported.
 *
 * @example
 * ```ts
 * import { shallowExtensionInstance } from '@backstage/frontend-test-utils';
 *
 * const instance = shallowExtensionInstance(MyPageExtension, {
 *   config: {
 *     path: '/custom-path',
 *   },
 * });
 *
 * // Access outputs
 * expect(instance.get(coreExtensionData.routePath)).toBe('/custom-path');
 * expect(instance.get(PageBlueprint.dataRefs.routeRef)).toBeDefined();
 * ```
 *
 * @public
 */
export function shallowExtensionInstance<T extends ExtensionDefinitionParameters>(
  subject: ExtensionDefinition<T>,
  options?: ShallowExtensionInstanceOptions<T>,
): ExtensionDataContainer<NonNullable<T['output']>> {
  const { name, namespace, version } = OpaqueExtensionDefinition.toInternal(subject);

  if (version !== 'v2') {
    throw new Error(
      'shallowExtensionInstance only supports v2 extensions created with createExtension',
    );
  }

  const definition = {
    ...subject,
    name: !namespace && !name ? 'test' : name,
  };

  const internalExtension = toInternalExtension(
    OpaqueExtensionDefinition.toInternal(definition).extension,
  );

  // Parse config if schema is provided
  let parsedConfig: { [x: string]: any } = {};
  if (options?.config !== undefined) {
    if (internalExtension.configSchema) {
      parsedConfig = internalExtension.configSchema.parse(
        options.config as JsonValue,
      ) as { [x: string]: any };
    } else {
      parsedConfig = options.config as { [x: string]: any };
    }
  }

  // Create API registry
  const apiRegistry = options?.apis?.length
    ? TestApiRegistry.from(
        ...(options.apis as [AnyApiRef<unknown>, Partial<unknown>][]),
      )
    : TestApiRegistry.from();

  // Create mock node for the factory context
  const mockNode = {
    spec: {
      id: `test/${name || 'extension'}`,
      attachTo: { id: 'test', input: 'default' },
      disabled: false,
      extension: internalExtension,
      source: undefined,
    },
    edges: {
      attachments: new Map(),
    },
  } as any;

  // Create mock inputs from provided data
  const mockInputs: { [inputName: string]: any } = {};
  const inputData = options?.inputs ?? {};

  for (const [inputName, inputDef] of Object.entries(internalExtension.inputs)) {
    if (inputDef.config.singleton) {
      // For singleton inputs, check if any of the expected data refs have values
      const hasValue = inputDef.extensionData.some(
        ref => inputData[ref.id] !== undefined,
      );
      if (hasValue) {
        mockInputs[inputName] = {
          node: mockNode,
          get(ref: ExtensionDataRef) {
            return inputData[ref.id];
          },
          *[Symbol.iterator]() {
            for (const ref of inputDef.extensionData) {
              if (inputData[ref.id] !== undefined) {
                yield {
                  $$type: '@backstage/ExtensionDataValue',
                  id: ref.id,
                  value: inputData[ref.id],
                };
              }
            }
          },
        };
      } else if (!inputDef.config.optional) {
        throw new Error(`Required singleton input '${inputName}' was not provided`);
      } else {
        mockInputs[inputName] = undefined;
      }
    } else {
      // For array inputs, provide an empty array if no data
      mockInputs[inputName] = [];
    }
  }

  // Execute the factory
  const outputDataMap = new Map<string, unknown>();

  const outputDataValues = internalExtension.factory({
    node: mockNode,
    apis: apiRegistry,
    config: parsedConfig,
    inputs: mockInputs,
  });

  if (typeof outputDataValues !== 'object' || !outputDataValues?.[Symbol.iterator]) {
    throw new Error('Extension factory did not return an iterable');
  }

  for (const value of outputDataValues) {
    outputDataMap.set(value.id, value.value);
  }

  return {
    get(ref: ExtensionDataRef<any, any, any>) {
      return outputDataMap.get(ref.id) as any;
    },
    *[Symbol.iterator]() {
      for (const [id, value] of outputDataMap) {
        yield {
          $$type: '@backstage/ExtensionDataValue',
          id,
          value,
        } as any;
      }
    },
  };
}
