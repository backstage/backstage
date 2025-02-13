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
  ApiHolder,
  ExtensionDataContainer,
  ExtensionDataRef,
  ExtensionDataValue,
  ExtensionDefinition,
  ExtensionInput,
  ResolvedExtensionInputs,
} from '@backstage/frontend-plugin-api';
import mapValues from 'lodash/mapValues';
import { AppNode, AppNodeInstance } from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtension } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

function resolveV1InputDataMap(
  dataMap: {
    [name in string]: AnyExtensionDataRef;
  },
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

function resolveInputDataContainer(
  extensionData: Array<AnyExtensionDataRef>,
  attachment: AppNode,
  inputName: string,
): { node: AppNode } & ExtensionDataContainer<AnyExtensionDataRef> {
  const dataMap = new Map<string, unknown>();

  for (const ref of extensionData) {
    if (dataMap.has(ref.id)) {
      throw new Error(`Unexpected duplicate input data '${ref.id}'`);
    }
    const value = attachment.instance?.getData(ref);
    if (value === undefined && !ref.config.optional) {
      const expected = extensionData
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

    dataMap.set(ref.id, value);
  }

  return {
    node: attachment,
    get(ref) {
      return dataMap.get(ref.id);
    },
    *[Symbol.iterator]() {
      for (const [id, value] of dataMap) {
        // TODO: Would be better to be able to create a new instance using the ref here instead
        yield {
          $$type: '@backstage/ExtensionDataValue',
          id,
          value,
        };
      }
    },
  } as { node: AppNode } & ExtensionDataContainer<AnyExtensionDataRef>;
}

function reportUndeclaredAttachments(
  id: string,
  inputMap: { [name in string]: unknown },
  attachments: ReadonlyMap<string, AppNode[]>,
) {
  const undeclaredAttachments = Array.from(attachments.entries()).filter(
    ([inputName]) => inputMap[inputName] === undefined,
  );

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

function resolveV1Inputs(
  inputMap: {
    [inputName in string]: {
      $$type: '@backstage/ExtensionInput';
      extensionData: {
        [name in string]: AnyExtensionDataRef;
      };
      config: { optional: boolean; singleton: boolean };
    };
  },
  attachments: ReadonlyMap<string, AppNode[]>,
) {
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
        output: resolveV1InputDataMap(
          input.extensionData,
          attachedNodes[0],
          inputName,
        ),
      };
    }

    return attachedNodes.map(attachment => ({
      node: attachment,
      output: resolveV1InputDataMap(input.extensionData, attachment, inputName),
    }));
  }) as {
    [inputName in string]: {
      node: AppNode;
      output: {
        [name in string]: unknown;
      };
    };
  };
}

function resolveV2Inputs(
  inputMap: {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  attachments: ReadonlyMap<string, AppNode[]>,
): ResolvedExtensionInputs<{
  [inputName in string]: ExtensionInput<
    AnyExtensionDataRef,
    { optional: boolean; singleton: boolean }
  >;
}> {
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
      return resolveInputDataContainer(
        input.extensionData,
        attachedNodes[0],
        inputName,
      );
    }

    return attachedNodes.map(attachment =>
      resolveInputDataContainer(input.extensionData, attachment, inputName),
    );
  }) as ResolvedExtensionInputs<{
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  }>;
}

/** @internal */
export function createAppNodeInstance(options: {
  node: AppNode;
  apis: ApiHolder;
  attachments: ReadonlyMap<string, AppNode[]>;
  extensionFactoryMiddleware?: Parameters<
    ExtensionDefinition['override']
  >[0]['factory'];
}): AppNodeInstance {
  const { node, apis, attachments } = options;
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

    if (process.env.NODE_ENV !== 'production') {
      reportUndeclaredAttachments(id, internalExtension.inputs, attachments);
    }

    if (internalExtension.version === 'v1') {
      const context = {
        node,
        apis,
        config: parsedConfig,
        inputs: resolveV1Inputs(internalExtension.inputs, attachments),
      };

      const namedOutputs = options.extensionFactoryMiddleware
        ? options.extensionFactoryMiddleware(
            // @ts-ignore
            () => internalExtension.factory(context),
            context,
          )
        : internalExtension.factory(context);

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
    } else if (internalExtension.version === 'v2') {
      const context = {
        node,
        apis,
        config: parsedConfig,
        inputs: resolveV2Inputs(internalExtension.inputs, attachments),
      };
      const outputDataValues = options.extensionFactoryMiddleware
        ? createExtensionDataContainer(
            options.extensionFactoryMiddleware(
              () =>
                createExtensionDataContainer(
                  internalExtension.factory(context),
                ),
              // @ts-ignore
              context,
            ),
          )
        : internalExtension.factory(context);

      const outputDataMap = new Map<string, unknown>();
      for (const value of outputDataValues) {
        if (outputDataMap.has(value.id)) {
          throw new Error(`duplicate extension data output '${value.id}'`);
        }
        outputDataMap.set(value.id, value.value);
      }

      for (const ref of internalExtension.output) {
        const value = outputDataMap.get(ref.id);
        outputDataMap.delete(ref.id);
        if (value === undefined) {
          if (!ref.config.optional) {
            throw new Error(
              `missing required extension data output '${ref.id}'`,
            );
          }
        } else {
          extensionData.set(ref.id, value);
          extensionDataRefs.add(ref);
        }
      }

      if (outputDataMap.size > 0) {
        throw new Error(
          `unexpected output '${Array.from(outputDataMap.keys()).join(
            "', '",
          )}'`,
        );
      }
    } else {
      throw new Error(
        `unexpected extension version '${(internalExtension as any).version}'`,
      );
    }
  } catch (e) {
    throw new Error(
      `Failed to instantiate extension '${id}'${
        e.name === 'Error' ? `, ${e.message}` : `; caused by ${e.stack}`
      }`,
    );
  }

  return {
    extensionData,
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
export function instantiateAppNodeTree(
  rootNode: AppNode,
  apis: ApiHolder,
  extensionFactoryMiddleware?: Parameters<
    ExtensionDefinition['override']
  >[0]['factory'],
): void {
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
      apis,
      attachments: instantiatedAttachments,
      extensionFactoryMiddleware,
    });

    return node.instance;
  }

  createInstance(rootNode);
}

/** @internal */
export function createExtensionDataContainer<UData extends AnyExtensionDataRef>(
  values: Iterable<
    UData extends ExtensionDataRef<infer IData, infer IId>
      ? ExtensionDataValue<IData, IId>
      : never
  >,
  declaredRefs?: ExtensionDataRef<any, any, any>[],
): ExtensionDataContainer<UData> {
  const container = new Map<string, ExtensionDataValue<any, any>>();
  const verifyRefs =
    declaredRefs && new Map(declaredRefs.map(ref => [ref.id, ref]));

  for (const output of values) {
    if (verifyRefs) {
      if (!verifyRefs.delete(output.id)) {
        throw new Error(
          `extension data '${output.id}' was provided but not declared`,
        );
      }
    }
    container.set(output.id, output);
  }

  const remainingRefs =
    verifyRefs &&
    Array.from(verifyRefs.values()).filter(ref => !ref.config.optional);
  if (remainingRefs && remainingRefs.length > 0) {
    throw new Error(
      `missing required extension data value(s) '${remainingRefs
        .map(ref => ref.id)
        .join(', ')}'`,
    );
  }

  return {
    get(ref) {
      return container.get(ref.id)?.value;
    },
    [Symbol.iterator]() {
      return container.values();
    },
  } as ExtensionDataContainer<UData>;
}
