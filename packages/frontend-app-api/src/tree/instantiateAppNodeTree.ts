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
  ApiHolder,
  ExtensionDataContainer,
  ExtensionDataRef,
  ExtensionInput,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ResolvedExtensionInputs } from '../../../frontend-plugin-api/src/wiring/createExtension';
import { ExtensionFactoryMiddleware } from '../wiring/types';
import mapValues from 'lodash/mapValues';
import { AppNode, AppNodeInstance } from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtension } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
import { createExtensionDataContainer } from '@internal/frontend';
import { ErrorCollector } from '../wiring/createErrorCollector';
import { evaluateFilterPredicate } from '@backstage/filter-predicates';

const INSTANTIATION_FAILED = new Error('Instantiation failed');

/**
 * Like `array.map`, but if `INSTANTIATION_FAILED` is thrown, the iteration will continue but afterwards re-throw `INSTANTIATION_FAILED`
 * @returns
 */
function mapWithFailures<T, U>(
  iterable: Iterable<T>,
  callback: (item: T) => U,
  options?: { ignoreFailures?: boolean },
): U[] {
  let failed = false;
  const results = [];
  for (const item of iterable) {
    try {
      results.push(callback(item));
    } catch (error) {
      if (error === INSTANTIATION_FAILED) {
        failed = true;
      } else {
        throw error;
      }
    }
  }
  if (failed && !options?.ignoreFailures) {
    throw INSTANTIATION_FAILED;
  }
  return results;
}

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type InstantiateAppNodeSubtreeOptions = {
  rootNode: AppNode;
  apis: ApiHolder;
  collector: ErrorCollector;
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware;
  stopAtAttachment?(ctx: { node: AppNode; input: string }): boolean;
  skipChild?(ctx: { node: AppNode; input: string; child: AppNode }): boolean;
  onMissingApi?(ctx: { node: AppNode; apiRefId: string }): void;
  predicateContext?: Record<string, unknown>;
  reuseExistingInstances?: boolean;
  writeNodeInstances?: boolean;
};

function resolveV1InputDataMap(
  dataMap: {
    [name in string]: ExtensionDataRef;
  },
  attachment: AppNode,
  inputName: string,
) {
  return Object.fromEntries(
    mapWithFailures(Object.entries(dataMap), ([key, ref]) => {
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
      return [key, value];
    }),
  );
}

function resolveInputDataContainer(
  extensionData: Array<ExtensionDataRef>,
  attachment: AppNode,
  inputName: string,
  collector: ErrorCollector<{ node: AppNode; inputName: string }>,
): { node: AppNode } & ExtensionDataContainer<ExtensionDataRef> {
  const dataMap = new Map<string, unknown>();

  mapWithFailures(extensionData, ref => {
    if (dataMap.has(ref.id)) {
      collector.report({
        code: 'EXTENSION_INPUT_DATA_IGNORED',
        message: `Unexpected duplicate input data '${ref.id}'`,
      });
      return;
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

      collector.child({ node: attachment }).report({
        code: 'EXTENSION_INPUT_DATA_MISSING',
        message: `extension '${attachment.spec.id}' could not be attached because its output data (${provided}) does not match what the input '${inputName}' requires (${expected})`,
      });
      throw INSTANTIATION_FAILED;
    }

    dataMap.set(ref.id, value);
  });

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
  } as { node: AppNode } & ExtensionDataContainer<ExtensionDataRef>;
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
        [name in string]: ExtensionDataRef;
      };
      config: { optional: boolean; singleton: boolean };
    };
  },
  attachments: ReadonlyMap<string, AppNode[]>,
) {
  return Object.fromEntries(
    mapWithFailures(Object.entries(inputMap), ([inputName, input]) => {
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
            return [inputName, undefined];
          }
          throw Error(`input '${inputName}' is required but was not received`);
        }
        return [
          inputName,
          {
            node: attachedNodes[0],
            output: resolveV1InputDataMap(
              input.extensionData,
              attachedNodes[0],
              inputName,
            ),
          },
        ];
      }

      return [
        inputName,
        attachedNodes.map(attachment => ({
          node: attachment,
          output: resolveV1InputDataMap(
            input.extensionData,
            attachment,
            inputName,
          ),
        })),
      ];
    }),
  ) as {
    [inputName in string]: {
      node: AppNode;
      output: {
        [name in string]: unknown;
      };
    };
  };
}

function resolveV2Inputs(
  inputMap: { [inputName in string]: ExtensionInput },
  attachments: ReadonlyMap<string, AppNode[]>,
  parentCollector: ErrorCollector<{ node: AppNode }>,
  node: AppNode,
): ResolvedExtensionInputs<{ [inputName in string]: ExtensionInput }> {
  return mapValues(inputMap, (input, inputName) => {
    const allAttachedNodes = attachments.get(inputName) ?? [];
    const collector = parentCollector.child({ inputName });
    const inputPluginId = node.spec.plugin.pluginId;

    const attachedNodes = input.config.internal
      ? allAttachedNodes.filter(attachment => {
          const attachmentPluginId = attachment.spec.plugin.pluginId;
          if (attachmentPluginId !== inputPluginId) {
            collector.report({
              code: 'EXTENSION_INPUT_INTERNAL_IGNORED',
              message:
                `extension '${attachment.spec.id}' from plugin '${attachmentPluginId}' attached to input '${inputName}' on '${node.spec.id}' was ignored, ` +
                `the input is marked as internal and attached extensions must therefore be provided via an override or a module for the '${inputPluginId}' plugin, not the '${attachmentPluginId}' plugin`,
              context: {
                extensionId: attachment.spec.id,
                plugin: attachment.spec.plugin,
              },
            });
            return false;
          }
          return true;
        })
      : allAttachedNodes;

    if (input.config.singleton) {
      if (attachedNodes.length > 1) {
        const attachedNodeIds = attachedNodes.map(e => e.spec.id).join("', '");
        collector.report({
          code: 'EXTENSION_ATTACHMENT_CONFLICT',
          message: `expected ${
            input.config.optional ? 'at most' : 'exactly'
          } one '${inputName}' input but received multiple: '${attachedNodeIds}'`,
        });
        throw INSTANTIATION_FAILED;
      } else if (attachedNodes.length === 0) {
        if (!input.config.optional) {
          collector.report({
            code: 'EXTENSION_ATTACHMENT_MISSING',
            message: `input '${inputName}' is required but was not received`,
          });
          throw INSTANTIATION_FAILED;
        }
        return undefined;
      }
      try {
        return resolveInputDataContainer(
          input.extensionData,
          attachedNodes[0],
          inputName,
          collector,
        );
      } catch (error) {
        if (error === INSTANTIATION_FAILED) {
          if (input.config.optional) {
            return undefined;
          }
          collector.report({
            code: 'EXTENSION_ATTACHMENT_MISSING',
            message: `input '${inputName}' is required but it failed to be instantiated`,
          });
        }
        throw error;
      }
    }

    return mapWithFailures(
      attachedNodes,
      attachment =>
        resolveInputDataContainer(
          input.extensionData,
          attachment,
          inputName,
          collector,
        ),
      { ignoreFailures: true },
    );
  }) as ResolvedExtensionInputs<{ [inputName in string]: ExtensionInput }>;
}

/** @internal */
export function createAppNodeInstance(options: {
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware;
  node: AppNode;
  apis: ApiHolder;
  attachments: ReadonlyMap<string, AppNode[]>;
  collector: ErrorCollector;
  onMissingApi?(ctx: { node: AppNode; apiRefId: string }): void;
}): AppNodeInstance | undefined {
  const { node, apis, attachments } = options;
  const collector = options.collector.child({ node });
  const { id, extension, config } = node.spec;
  const extensionData = new Map<string, unknown>();
  const extensionDataRefs = new Set<ExtensionDataRef<unknown>>();
  const scopedApis: ApiHolder =
    options.onMissingApi === undefined
      ? apis
      : {
          get(apiRef) {
            const api = apis.get(apiRef);
            if (api === undefined) {
              options.onMissingApi?.({
                node,
                apiRefId: apiRef.id,
              });
            }
            return api;
          },
        };

  let parsedConfig: { [x: string]: any };
  try {
    parsedConfig = extension.configSchema?.parse(config ?? {}) as {
      [x: string]: any;
    };
  } catch (e) {
    collector.report({
      code: 'EXTENSION_CONFIGURATION_INVALID',
      message: `Invalid configuration for extension '${id}'; caused by ${e}`,
    });
    return undefined;
  }

  try {
    const internalExtension = toInternalExtension(extension);

    if (process.env.NODE_ENV !== 'production') {
      reportUndeclaredAttachments(id, internalExtension.inputs, attachments);
    }

    if (internalExtension.version === 'v1') {
      const namedOutputs = internalExtension.factory({
        node,
        apis: scopedApis,
        config: parsedConfig,
        inputs: resolveV1Inputs(internalExtension.inputs, attachments),
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
    } else if (internalExtension.version === 'v2') {
      const context = {
        node,
        apis: scopedApis,
        config: parsedConfig,
        inputs: resolveV2Inputs(
          internalExtension.inputs,
          attachments,
          collector,
          node,
        ),
      };
      const outputDataValues = options.extensionFactoryMiddleware
        ? createExtensionDataContainer(
            options.extensionFactoryMiddleware(overrideContext => {
              return createExtensionDataContainer(
                internalExtension.factory({
                  node: context.node,
                  apis: context.apis,
                  inputs: context.inputs,
                  config: overrideContext?.config ?? context.config,
                }),
                'extension factory',
              );
            }, context),
            'extension factory middleware',
          )
        : internalExtension.factory(context);

      if (
        typeof outputDataValues !== 'object' ||
        !outputDataValues?.[Symbol.iterator]
      ) {
        throw new Error('extension factory did not provide an iterable object');
      }

      const outputDataMap = new Map<string, unknown>();
      mapWithFailures(outputDataValues, value => {
        if (outputDataMap.has(value.id)) {
          collector.report({
            code: 'EXTENSION_OUTPUT_CONFLICT',
            message: `extension factory output duplicate data '${value.id}'`,
            context: {
              dataRefId: value.id,
            },
          });
          throw INSTANTIATION_FAILED;
        } else {
          outputDataMap.set(value.id, value.value);
        }
      });

      for (const ref of internalExtension.output) {
        const value = outputDataMap.get(ref.id);
        outputDataMap.delete(ref.id);
        if (value === undefined) {
          if (!ref.config.optional) {
            collector.report({
              code: 'EXTENSION_OUTPUT_MISSING',
              message: `missing required extension data output '${ref.id}'`,
              context: {
                dataRefId: ref.id,
              },
            });
            throw INSTANTIATION_FAILED;
          }
        } else {
          extensionData.set(ref.id, value);
          extensionDataRefs.add(ref);
        }
      }

      if (outputDataMap.size > 0) {
        for (const dataRefId of outputDataMap.keys()) {
          // TODO: Make this a warning
          collector.report({
            code: 'EXTENSION_OUTPUT_IGNORED',
            message: `unexpected output '${dataRefId}'`,
            context: {
              dataRefId: dataRefId,
            },
          });
        }
      }
    } else {
      collector.report({
        code: 'EXTENSION_INVALID',
        message: `unexpected extension version '${
          (internalExtension as any).version
        }'`,
      });
      throw INSTANTIATION_FAILED;
    }
  } catch (e) {
    if (e !== INSTANTIATION_FAILED) {
      collector.report({
        code: 'EXTENSION_FACTORY_ERROR',
        message: `Failed to instantiate extension '${id}'${
          e.name === 'Error' ? `, ${e.message}` : `; caused by ${e}`
        }`,
      });
    }
    return undefined;
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
 * Starting at the provided node, instantiate a subtree without necessarily
 * mutating the original app tree.
 *
 * @internal
 */
export function instantiateAppNodeSubtree(
  options: InstantiateAppNodeSubtreeOptions,
): AppNode | undefined {
  const instantiatedNodes = new WeakMap<AppNode, AppNode | null>();

  function createInstance(node: AppNode): AppNode | undefined {
    if (instantiatedNodes.has(node)) {
      return instantiatedNodes.get(node) ?? undefined;
    }
    if (options.reuseExistingInstances !== false && node.instance) {
      instantiatedNodes.set(node, node);
      return node;
    }
    if (node.spec.disabled) {
      instantiatedNodes.set(node, null);
      return undefined;
    }
    if (
      options.predicateContext !== undefined &&
      node.spec.if !== undefined &&
      !evaluateFilterPredicate(node.spec.if, options.predicateContext)
    ) {
      instantiatedNodes.set(node, null);
      return undefined;
    }

    const instantiatedAttachments = new Map<string, AppNode[]>();

    for (const [input, children] of node.edges.attachments) {
      if (options.stopAtAttachment?.({ node, input })) {
        continue;
      }
      const instantiatedChildren = children.flatMap(child => {
        if (options.skipChild?.({ node, input, child })) {
          return [];
        }
        const childNode = createInstance(child);
        return childNode ? [childNode] : [];
      });
      if (instantiatedChildren.length > 0) {
        instantiatedAttachments.set(input, instantiatedChildren);
      }
    }

    const instance = createAppNodeInstance({
      extensionFactoryMiddleware: options.extensionFactoryMiddleware,
      node,
      apis: options.apis,
      attachments: instantiatedAttachments,
      collector: options.collector,
      onMissingApi: options.onMissingApi,
    });
    if (!instance) {
      instantiatedNodes.set(node, null);
      return undefined;
    }

    if (options.writeNodeInstances === false) {
      const detachedNode: AppNode = {
        spec: node.spec,
        edges: node.edges,
        instance,
      };
      instantiatedNodes.set(node, detachedNode);
      return detachedNode;
    }

    (node as Mutable<AppNode>).instance = instance;
    instantiatedNodes.set(node, node);
    return node;
  }

  return createInstance(options.rootNode);
}

/**
 * Starting at the provided node, instantiate all reachable nodes in the tree that have not been disabled.
 * @internal
 */
export function instantiateAppNodeTree(
  rootNode: AppNode,
  apis: ApiHolder,
  collector: ErrorCollector,
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware,
  optionsOrPredicateContext?:
    | {
        stopAtAttachment?(ctx: { node: AppNode; input: string }): boolean;
        skipChild?(ctx: {
          node: AppNode;
          input: string;
          child: AppNode;
        }): boolean;
        onMissingApi?(ctx: { node: AppNode; apiRefId: string }): void;
        predicateContext?: Record<string, unknown>;
      }
    | Record<string, unknown>,
): boolean {
  const options: {
    stopAtAttachment?(ctx: { node: AppNode; input: string }): boolean;
    skipChild?(ctx: { node: AppNode; input: string; child: AppNode }): boolean;
    onMissingApi?(ctx: { node: AppNode; apiRefId: string }): void;
    predicateContext?: Record<string, unknown>;
  } =
    optionsOrPredicateContext &&
    ('stopAtAttachment' in optionsOrPredicateContext ||
      'skipChild' in optionsOrPredicateContext ||
      'onMissingApi' in optionsOrPredicateContext ||
      'predicateContext' in optionsOrPredicateContext)
      ? optionsOrPredicateContext
      : {
          predicateContext: optionsOrPredicateContext,
        };

  return (
    instantiateAppNodeSubtree({
      rootNode,
      apis,
      collector,
      extensionFactoryMiddleware,
      stopAtAttachment: options.stopAtAttachment,
      skipChild: options.skipChild,
      onMissingApi: options.onMissingApi,
      predicateContext: options.predicateContext,
    }) !== undefined
  );
}
