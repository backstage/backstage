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

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

function resolveInputData(
  dataMap: AnyExtensionDataMap,
  attachment: { id: string; instance: AppNodeInstance },
  inputName: string,
) {
  return mapValues(dataMap, ref => {
    const value = attachment.instance.getData(ref);
    if (value === undefined && !ref.config.optional) {
      throw new Error(
        `input '${inputName}' did not receive required extension data '${ref.id}' from extension '${attachment.id}'`,
      );
    }
    return value;
  });
}

function resolveInputs(
  inputMap: AnyExtensionInputMap,
  attachments: ReadonlyMap<string, { id: string; instance: AppNodeInstance }[]>,
): ResolvedExtensionInputs<AnyExtensionInputMap> {
  const undeclaredAttachments = Array.from(attachments.entries()).filter(
    ([inputName]) => inputMap[inputName] === undefined,
  );
  // TODO: Make this a warning rather than an error
  if (undeclaredAttachments.length > 0) {
    throw new Error(
      `received undeclared input${
        undeclaredAttachments.length > 1 ? 's' : ''
      } ${undeclaredAttachments
        .map(
          ([k, exts]) =>
            `'${k}' from extension${exts.length > 1 ? 's' : ''} '${exts
              .map(e => e.id)
              .join("', '")}'`,
        )
        .join(' and ')}`,
    );
  }

  return mapValues(inputMap, (input, inputName) => {
    const attachedNodes = attachments.get(inputName) ?? [];

    if (input.config.singleton) {
      if (attachedNodes.length > 1) {
        const attachedNodeIds = attachedNodes.map(e => e.id);
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
        extensionId: attachedNodes[0].id,
        output: resolveInputData(
          input.extensionData,
          attachedNodes[0],
          inputName,
        ),
      };
    }

    return attachedNodes.map(attachment => ({
      extensionId: attachment.id,
      output: resolveInputData(input.extensionData, attachment, inputName),
    }));
  }) as ResolvedExtensionInputs<AnyExtensionInputMap>;
}

/** @internal */
export function createAppNodeInstance(options: {
  node: AppNode;
  attachments: ReadonlyMap<string, { id: string; instance: AppNodeInstance }[]>;
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
    const namedOutputs = extension.factory({
      node,
      config: parsedConfig,
      inputs: resolveInputs(extension.inputs, attachments),
    });

    for (const [name, output] of Object.entries(namedOutputs)) {
      const ref = extension.output[name];
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

    const instantiatedAttachments = new Map<
      string,
      { id: string; instance: AppNodeInstance }[]
    >();

    for (const [input, children] of node.edges.attachments) {
      const instantiatedChildren = children.flatMap(child => {
        const childInstance = createInstance(child);
        if (!childInstance) {
          return [];
        }
        return [{ id: child.spec.id, instance: childInstance }];
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
