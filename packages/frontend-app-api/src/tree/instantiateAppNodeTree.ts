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
  ExtensionDataRef,
  ResolvedExtensionInputs,
} from '@backstage/frontend-plugin-api';
import mapValues from 'lodash/mapValues';
import { AppNode, AppNodeInstance } from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtension } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

function resolveInputData(
  dataMap: AnyExtensionDataMap,
  attachment: AppNode,
  inputName: string,
) {
  return mapValues(dataMap, ref => {
    const value = attachment.instance?.getData(ref);
    if (value === undefined && !ref.config.optional) {
      const expected = Object.values(dataMap)
        .filter(r => !r.config.optional)
        .map(r => `'${r.id}'`)
        .join(', ');

      const provided = [...(attachment.instance?.getDataRefs() ?? [])]
        .map(r => `'${r.id}'`)
        .join(', ');

      throw new Error(
        `extension '${attachment.spec.id}' could not be attached because its output data (${provided}) does not match what the input '${inputName}' requires (${expected})`,
      );
    }
    return value;
  });
}

function resolveInputs(
  id: string,
  inputMap: AnyExtensionInputMap,
  attachments: ReadonlyMap<string, AppNode[]>,
): ResolvedExtensionInputs<AnyExtensionInputMap> {
  const undeclaredAttachments = Array.from(attachments.entries()).filter(
    ([inputName]) => inputMap[inputName] === undefined,
  );

  if (process.env.NODE_ENV !== 'production') {
    const inputNames = Object.keys(inputMap);

    for (const [name, nodes] of undeclaredAttachments) {
      const pl = nodes.length > 1;
      // eslint-disable-next-line no-console
      console.warn(
        [
          `The extension${pl ? 's' : ''} '${nodes
            .map(n => n.spec.id)
            .join("', '")}' ${pl ? 'are' : 'is'}`,
          `attached to the input '${name}' of the extension '${id}', but it`,
          inputNames.length === 0
            ? 'has no inputs'
            : `has no such input (candidates are '${inputNames.join("', '")}')`,
        ].join(' '),
      );
    }
  }

  return mapValues(inputMap, (input, inputName) => {
    const attachedNodes = attachments.get(inputName) ?? [];

    if (input.config.singleton) {
      if (attachedNodes.length > 1) {
        const attachedNodeIds = attachedNodes.map(e => e.spec.id);
        throw Error(
          `expected ${
            input.config.optional ? 'at most' : 'exactly'
          } one '${inputName}' input but received multiple: '${attachedNodeIds.join(
            "', '",
          )}'`,
        );
      } else if (attachedNodes.length === 0) {
        if (input.config.optional) {
          return undefined;
        }
        throw Error(`input '${inputName}' is required but was not received`);
      }
      return {
        node: attachedNodes[0],
        output: resolveInputData(
          input.extensionData,
          attachedNodes[0],
          inputName,
        ),
      };
    }

    return attachedNodes.map(attachment => ({
      node: attachment,
      output: resolveInputData(input.extensionData, attachment, inputName),
    }));
  }) as ResolvedExtensionInputs<AnyExtensionInputMap>;
}

/** @internal */
export function createAppNodeInstance(options: {
  node: AppNode;
  attachments: ReadonlyMap<string, AppNode[]>;
}): AppNodeInstance {
  const { node, attachments } = options;
  const { id, extension, config } = node.spec;
  const extensionData = new Map<string, unknown>();
  const extensionDataRefs = new Set<ExtensionDataRef<unknown>>();

  let parsedConfig: unknown;
  try {
    parsedConfig = extension.configSchema?.parse(config ?? {});
  } catch (e) {
    throw new Error(
      `Invalid configuration for extension '${id}'; caused by ${e}`,
    );
  }

  try {
    const internalExtension = toInternalExtension(extension);

    const namedOutputs = internalExtension.factory({
      node,
      config: parsedConfig,
      inputs: resolveInputs(id, internalExtension.inputs, attachments),
    });

    for (const [name, output] of Object.entries(namedOutputs)) {
      const ref = internalExtension.output[name];
      if (!ref) {
        throw new Error(`unknown output provided via '${name}'`);
      }
      if (extensionData.has(ref.id)) {
        throw new Error(
          `duplicate extension data '${ref.id}' received via output '${name}'`,
        );
      }
      extensionData.set(ref.id, output);
      extensionDataRefs.add(ref);
    }
  } catch (e) {
    throw new Error(
      `Failed to instantiate extension '${id}'${
        e.name === 'Error' ? `, ${e.message}` : `; caused by ${e.stack}`
      }`,
    );
  }

  return {
    getDataRefs() {
      return extensionDataRefs.values();
    },
    getData<T>(ref: ExtensionDataRef<T>): T | undefined {
      return extensionData.get(ref.id) as T | undefined;
    },
  };
}

/**
 * Starting at the provided node, instantiate all reachable nodes in the tree that have not been disabled.
 * @internal
 */
export function instantiateAppNodeTree(rootNode: AppNode): void {
  function createInstance(node: AppNode): AppNodeInstance | undefined {
    if (node.instance) {
      return node.instance;
    }
    if (node.spec.disabled) {
      return undefined;
    }

    const instantiatedAttachments = new Map<string, AppNode[]>();

    for (const [input, children] of node.edges.attachments) {
      const instantiatedChildren = children.flatMap(child => {
        const childInstance = createInstance(child);
        if (!childInstance) {
          return [];
        }
        return [child];
      });
      if (instantiatedChildren.length > 0) {
        instantiatedAttachments.set(input, instantiatedChildren);
      }
    }

    (node as Mutable<AppNode>).instance = createAppNodeInstance({
      node,
      attachments: instantiatedAttachments,
    });

    return node.instance;
  }

  createInstance(rootNode);
}
