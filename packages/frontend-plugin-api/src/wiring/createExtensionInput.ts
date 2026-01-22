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
  ExtensionInputContext,
  OpaqueExtensionInput,
} from '@internal/frontend';
import { ExtensionDataRef } from './createExtensionDataRef';

/** @public */
export interface ExtensionInput<
  UExtensionData extends ExtensionDataRef<
    unknown,
    string,
    { optional?: true }
  > = ExtensionDataRef,
  TConfig extends {
    singleton: boolean;
    optional: boolean;
    internal?: boolean;
  } = {
    singleton: boolean;
    optional: boolean;
    internal?: boolean;
  },
> {
  readonly $$type: '@backstage/ExtensionInput';
  readonly extensionData: Array<UExtensionData>;
  readonly config: TConfig;
  readonly replaces?: Array<{ id: string; input: string }>;
}

/**
 * Creates a new extension input to be passed to the input map of an extension.
 *
 * @remarks
 *
 * Extension inputs created with this function can be passed to any `inputs` map
 * as part of creating or overriding an extension.
 *
 * The array of extension data references defines the data this input expects.
 * If the required data is not provided by the attached extension, the
 * attachment will fail.
 *
 * The `config` object can be used to restrict the behavior and shape of the
 * input. By default an input will accept zero or more extensions from any
 * plugin. The following options are available:
 *
 * - `singleton`: If set to `true`, only one extension can be attached to the
 *   input at a time. Additional extension will trigger an app error and be
 *   ignored.
 * - `optional`: If set to `true`, the input is optional and can be omitted,
 *   this only has an effect if the `singleton` is set to `true`.
 * - `internal`: If set to `true`, only extensions from the same plugins will be
 *   allowed to attach to this input. Other extensions will trigger an app error
 *   and be ignored.
 *
 * @param extensionData - The array of extension data references that this input
 * expects.
 * @param config - The configuration object for the input.
 * @returns An extension input declaration.
 * @example
 * ```ts
 * const extension = createExtension({
 *   attachTo: { id: 'example-parent', input: 'example-input' },
 *   inputs: {
 *     content: createExtensionInput([coreExtensionData.reactElement], {
 *       singleton: true,
 *     }),
 *   },
 *   output: [coreExtensionData.reactElement],
 *   *factory({ inputs }) {
 *     const content = inputs.content?.get(coreExtensionData.reactElement);
 *     yield coreExtensionData.reactElement(<ContentWrapper>{content}</ContentWrapper>);
 *   },
 * });
 * ```
 * @public
 */
export function createExtensionInput<
  UExtensionData extends ExtensionDataRef<unknown, string, { optional?: true }>,
  TConfig extends {
    singleton?: boolean;
    optional?: boolean;
    internal?: boolean;
  },
>(
  extensionData: Array<UExtensionData>,
  config?: TConfig & { replaces?: Array<{ id: string; input: string }> },
): ExtensionInput<
  UExtensionData,
  {
    singleton: TConfig['singleton'] extends true ? true : false;
    optional: TConfig['optional'] extends true ? true : false;
    internal: TConfig['internal'] extends true ? true : false;
  }
> {
  if (process.env.NODE_ENV !== 'production') {
    if (Array.isArray(extensionData)) {
      const seen = new Set();
      const duplicates = [];
      for (const dataRef of extensionData) {
        if (seen.has(dataRef.id)) {
          duplicates.push(dataRef.id);
        } else {
          seen.add(dataRef.id);
        }
      }
      if (duplicates.length > 0) {
        throw new Error(
          `ExtensionInput may not have duplicate data refs: '${duplicates.join(
            "', '",
          )}'`,
        );
      }
    }
  }
  const baseOptions = {
    extensionData,
    config: {
      singleton: Boolean(config?.singleton) as TConfig['singleton'] extends true
        ? true
        : false,
      optional: Boolean(config?.optional) as TConfig['optional'] extends true
        ? true
        : false,
      internal: Boolean(config?.internal) as TConfig['internal'] extends true
        ? true
        : false,
    },
    replaces: config?.replaces,
  };

  function createInstance(parent?: ExtensionInputContext): ExtensionInput<
    UExtensionData,
    {
      singleton: TConfig['singleton'] extends true ? true : false;
      optional: TConfig['optional'] extends true ? true : false;
      internal: TConfig['internal'] extends true ? true : false;
    }
  > {
    return OpaqueExtensionInput.createInstance(undefined, {
      ...baseOptions,
      context: parent,
      withContext: createInstance,
    });
  }

  return createInstance();
}
