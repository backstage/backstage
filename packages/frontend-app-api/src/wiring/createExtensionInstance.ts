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
  AnyExtensionDataMap,
  AnyExtensionInputMap,
  BackstagePlugin,
  Extension,
  ExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import mapValues from 'lodash/mapValues';

/** @internal */
export interface ExtensionInstance {
  readonly $$type: '@backstage/ExtensionInstance';

  readonly id: string;
  /**
   * Get concrete value for the given extension data reference. Returns undefined if no value is available.
   */
  getData<T>(ref: ExtensionDataRef<T>): T | undefined;
  /**
   * Maps input names to the actual instances given to them.
   */
  readonly attachments: Map<string, ExtensionInstance[]>;
}

function resolveInputData(
  dataMap: AnyExtensionDataMap,
  attachment: ExtensionInstance,
) {
  return mapValues(dataMap, ref => {
    const value = attachment.getData(ref);
    // TODO: validate input data presence
    return value;
  });
}

function resolveInputs(
  inputMap: AnyExtensionInputMap,
  attachments: Map<string, ExtensionInstance[]>,
) {
  return mapValues(inputMap, (input, inputName) => {
    const attachedInstances = attachments.get(inputName) ?? [];
    if (input.config.singleton) {
      if (attachedInstances.length > 1) {
        throw Error(
          `expected ${
            input.config.optional ? 'at most' : 'exactly'
          } one '${inputName}' input but received ${attachedInstances
            .map(e => e.id)
            .join(', ')}`,
        );
      } else if (attachedInstances.length === 0) {
        if (input.config.optional) {
          return undefined;
        }
        throw Error(`input '${inputName}' is required but was not received`);
      }
      return resolveInputData(input.extensionData, attachedInstances[0]);
    }

    return attachedInstances.map(attachment =>
      resolveInputData(input.extensionData, attachment),
    );
  });
}

/** @internal */
export function createExtensionInstance(options: {
  extension: Extension<unknown>;
  config: unknown;
  source?: BackstagePlugin;
  attachments: Map<string, ExtensionInstance[]>;
}): ExtensionInstance {
  const { extension, config, source, attachments } = options;
  const extensionData = new Map<string, unknown>();

  let parsedConfig: unknown;
  try {
    parsedConfig = extension.configSchema?.parse(config ?? {});
  } catch (e) {
    throw new Error(
      `Invalid configuration for extension instance '${extension.id}', ${e}`,
    );
  }

  try {
    extension.factory({
      source,
      config: parsedConfig,
      bind: namedOutputs => {
        for (const [name, output] of Object.entries(namedOutputs)) {
          const ref = extension.output[name];
          if (!ref) {
            throw new Error(
              `Extension instance '${extension.id}' tried to bind unknown output '${name}'`,
            );
          }
          extensionData.set(ref.id, output);
        }
      },
      inputs: resolveInputs(extension.inputs, attachments),
    });
  } catch (e) {
    throw new Error(
      `Failed to instantiate extension instance '${extension.id}', ${
        e.name === 'Error' ? e.message : e
      }`,
    );
  }

  return {
    $$type: '@backstage/ExtensionInstance',
    id: options.extension.id,
    getData<T>(ref: ExtensionDataRef<T>): T | undefined {
      return extensionData.get(ref.id) as T | undefined;
    },

    attachments,
  };
}
